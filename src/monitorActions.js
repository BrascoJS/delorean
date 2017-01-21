import mobx from 'mobx';
import { stringify, parse } from 'jsan';
import getParams from 'get-params';
import { silently, setValue } from './utils';

function getMethods(obj) {
  if (typeof obj !== 'object') return undefined;
  let functions;
  let m;
  if (obj.__proto__) m = obj.__proto__.__proto__;
  if (!m) m = obj;

  Object.getOwnPropertyNames(m).forEach(key => {
    const prop = m[key];
    if (typeof prop === 'function' && key !== 'constructor') {
      if (!functions) functions = [];
      functions.push({
        name: key || prop.name || 'anonymous',
        args: getParams(prop),
      });
    }
  });
  return functions;
}

/* eslint-disable no-new-func */
const interpretArg = (arg) => (new Function('return ' + arg))();

function evalArgs(inArgs, restArgs) {
  const args = inArgs.map(interpretArg);
  if (!restArgs) return args;
  const rest = interpretArg(restArgs);
  if (Array.isArray(rest)) return args.concat(...rest);
  throw new Error('rest must be an array');
}

function evalMethod(action, obj) {
  if (typeof action === 'string') {
    return (new Function('return ' + action)).call(obj);
  }

  const args = evalArgs(action.args, action.rest);
  return (new Function('args', `return this.${action.name}(args)`)).apply(obj, args);
}
/* eslint-enable */

export const isMonitorAction = (store) => store.__isRemotedevAction === true;

function dispatch(store, { type, arguments: args }) {
  if (typeof store[type] === 'function') {
    silently(() => { store[type](...args); }, store);
  }
}

function dispatchRemotely(store, payload) {
  try {
    evalMethod(payload, store);
  } catch (e) {
    emitter.error(e.message);
  }
}

function toggleAction(store, id, strState) {
  const liftedState = parse(strState);
  const idx = liftedState.skippedActionIds.indexOf(id);
  const skipped = idx !== -1;
  const start = liftedState.stagedActionIds.indexOf(id);
  if (start === -1) return liftedState;

  setValue(store, liftedState.computedStates[start - 1].state);
  for (let i = (skipped ? start : start + 1); i < liftedState.stagedActionIds.length; i++) {
    if (
      i !== start && liftedState.skippedActionIds.indexOf(liftedState.stagedActionIds[i]) !== -1
    ) continue; // it's already skipped
    dispatch(store, liftedState.actionsById[liftedState.stagedActionIds[i]].action);
    liftedState.computedStates[i].state = mobx.toJS(store);
  }

  if (skipped) {
    liftedState.skippedActionIds.splice(idx, 1);
  } else {
    liftedState.skippedActionIds.push(id);
  }
  return liftedState;
}

function transformAction(action) {
  if (action.action) return action;
  const liftedAction = { timestamp: Date.now() };
  if (typeof action === 'object') {
    liftedAction.action = action;
    if (!action.type) liftedAction.action.type = action.id || action.actionType || 'update';
  } else if (typeof action === 'undefined') {
    liftedAction.action = 'update';
  } else {
    liftedAction.action = { type: action };
  }
  return liftedAction;
}

function send(action, state, options, type, instanceId) {
  setTimeout(() => {
    const message = {
      payload: state ? stringify(state) : '',
      action: type === 'ACTION' ? stringify(transformAction(action)) : action,
      type: type || 'ACTION',
      // id: socket.id,
      instanceId,
      name: options.name // store name (from mobx.extras.getDebugName)
    };
    // socket.emit(socket.id ? 'log' : 'log-noid', message);
    console.log(message); // STORE IN ARRAY AND LOCAL STORAGE
  }, 0);
}

const listeners = {};

export function emitter(options = {}) {
  const id = Math.random().toString(36).substr(2);
  // start(options);
  return {
    init: (state, action) => {
      send(action || {}, state, options, 'INIT', id);
    },
    subscribe: (listener) => {
      if (!listener) return undefined;
      if (!listeners[id]) listeners[id] = [];
      listeners[id].push(listener);

      return function unsubscribe() {
        const index = listeners[id].indexOf(listener);
        listeners[id].splice(index, 1);
      };
    },
    unsubscribe: () => {
      delete listeners[id];
    },
    send: (action, payload) => {
      if (action) {
        send(action, payload, options, 'ACTION', id);
      } else {
        send(undefined, payload, options, 'STATE', id);
      }
    },
    error: (payload) => {
      console.log(payload);
    }
  };
}

export function dispatchMonitorAction(store, onlyActions) {
  console.log('dispatched monitor action');
  const initValue = mobx.toJS(store);
  // emitter.init(initValue, getMethods(store));

  return (message) => {
    if (message.type === 'DISPATCH') {
      switch (message.payload.type) {
        case 'RESET':
          emitter.init(setValue(store, initValue));
          return;
        case 'COMMIT':
          emitter.init(mobx.toJS(store));
          return;
        case 'ROLLBACK':
          emitter.init(setValue(store, parse(message.state)));
          return;
        case 'JUMP_TO_STATE':
        case 'JUMP_TO_ACTION':
          setValue(store, parse(message.state));
          return;
        case 'TOGGLE_ACTION':
          if (!onlyActions) {
            console.warn(
              '`onlyActions` parameter should be `true` to skip actions: ' +
              'https://github.com/zalmoxisus/mobx-remotedev#remotedevstore-config'
            );
            return;
          }
          emitter.send(null, toggleAction(store, message.payload.id, message.state));
          return;
        case 'IMPORT_STATE': {
          const { nextLiftedState } = message.payload;
          const { computedStates } = nextLiftedState;
          setValue(store, computedStates[computedStates.length - 1].state);
          emitter.send(null, nextLiftedState);
          return;
        }
      }
    } else if (message.type === 'ACTION') {
      dispatchRemotely(store, message.payload);
    }
  };
}

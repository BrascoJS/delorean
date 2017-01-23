import mobx from 'mobx';
import { stringify, parse } from 'jsan';
import getParams from 'get-params';
import { silently, setValue, getMethods, interpretArgs, evalArgs, evalMethod } from './utils';
import { emitter } from './emitter';


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

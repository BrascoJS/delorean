import { stringify, parse } from 'jsan';

const listeners = {};

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
      instanceId,
      name: options.name
    };
    console.log(message); // STORE IN ARRAY AND LOCAL STORAGE
  }, 0);
}

export function emitter(options = {}) {
  const id = Math.random().toString(36).substr(2);
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
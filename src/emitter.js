import { stringify, parse } from 'jsan';

const listeners = {};
const history = [];

export function handleMessages(message) {
  console.log('listeners', listeners);
  if (!message.payload) message.payload = message.action;
  Object.keys(listeners).forEach(id => {
    if (message.instanceId && id !== message.instanceId) return;
    if (typeof listeners[id] === 'function') console.log('handling: ', listeners[id](message));
    else {
      listeners[id].forEach(fn => {
        console.log('handling: ', fn(message));
      });
    }
  });
}

function formatAction(action) {
  if (action.action) return action;
  const formattedAction = { timestamp: Date.now() };
  if (typeof action === 'object') {
    formattedAction.action = action;
    if (!action.type) formattedAction.action.type = action.id || action.actionType || 'update';
  } else if (typeof action === 'undefined') {
    formattedAction.action = 'update';
  } else {
    formattedAction.action = { type: action };
  }
  return formattedAction;
}

function send(action, state, options, type, instanceId) {
  setTimeout(() => {
    const message = {
      payload: state ? stringify(state) : '',
      action: type === 'ACTION' ? stringify(formatAction(action)) : action,
      type: type || 'ACTION',
      instanceId,
      name: options.name
    };
    history.push(message);
    localStorage.setItem('appHistory', history);
    handleMessages(message);
  }, 0);
}

export function dispatcher() {
  listeners[123][0]({
    type: 'DISPATCH',
    payload: {
      type: 'RESET'
    }
  });
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
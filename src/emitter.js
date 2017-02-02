import { stringify, parse } from 'jsan';
import { schedule } from './spy.js';
import { dispatchMonitorAction, dispatchRemotely } from './monitorActions.js';
import { setValue } from './utils.js';
import getDecorator from './getDecorator.js';
import dev from './dev.js';

let savedFuncs = {};
const history = [];

export function handleMessages(message, listeners, item = null) {
  if (!message.payload) message.payload = message.action;
  Object.keys(listeners).forEach(id => {
    // if (message.instanceId && id !== message.instanceId) return;
    if (typeof listeners[id] === 'function') listeners[id](message);
    else {
      if (item) {
        console.log('listeners: ', listeners);
        let key = Object.keys(listeners)[0];
        let thisFunc = savedFuncs[key];
        console.log('savedFuncs: ', savedFuncs);
        // console.log('thisFunc: ', thisFunc);
        thisFunc(message);
      } else {
        listeners[id].forEach(fn => { fn(message); });
      }
    }
  });
}

function formatAction(action) {
  if (action.action) return action;
  const formattedAction = { timestamp: Date.now() };
  if (typeof action === 'object') formattedAction.action = action;
  if (!action.type) formattedAction.action.type = action.id || action.actionType || 'update';
  else if (typeof action === 'undefined') formattedAction.action = 'update';
  else formattedAction.action = { type: action };
  return formattedAction;
}


function send(action, state, options, type, instanceId, listeners) {
  setTimeout(() => {

    const message = {
      payload: state ? stringify(state) : '',
      action: type === 'ACTION' ? stringify(formatAction(action, options)) : action,
      type: type || 'ACTION',
      instanceId,
      name: options.name,
      location: window.location.hash
    };
    // if (message.type === 'ACTION') {
    history.push(message);
    localStorage.setItem('appHistory', stringify(history));
    // }
    let key = Object.keys(listeners)[0];
    savedFuncs[key] = listeners[key][0];
    handleMessages(message, listeners);
  }, 0);
}

export function emitter(options = {}) {
  const listeners = {};
  const id = Math.random().toString(36).substr(2);
  return {
    init: (state, action = {}) => {
      send(action || {}, state, options, 'INIT', id, listeners);
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
        send(action, payload, options, 'ACTION', id, listeners);
      } else {
        send(undefined, payload, options, 'STATE', id, listeners);
      }
    },
    error: (error) => {
      console.log('Error: ', error);
    }
  };
}

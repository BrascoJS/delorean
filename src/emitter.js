import { stringify, parse } from 'jsan';
import { schedule } from './spy.js';
import { dispatchMonitorAction, dispatchRemotely } from './monitorActions.js';
import { setValue } from './utils.js';
import getDecorator from './getDecorator.js';
import dev from './dev.js';
let theFunction;

export function handleMessages(message, listeners, item = null) {
  console.log('message: ', message);
  console.log('listeners: ', listeners);
  if (!message) return;
  if (!message.payload) message.payload = message.action;
  Object.keys(listeners).forEach(id => {
    if (message.instanceId && id !== message.instanceId) return;
    if (typeof listeners[id] === 'function') console.log('handling: ', listeners[id](message));
    else {
      let pmessage = JSON.parse(JSON.stringify(message));
      console.log('pmessage: ', pmessage);
      pmessage.payload = JSON.parse(pmessage.payload);
      pmessage.payload.type = 'JUMP_TO_STATE';
      if (item !== null) {
        pmessage.type = 'DISPATCH';
        console.log('the function: ', theFunction);
        theFunction(pmessage);
      } else listeners[id][0](pmessage);
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


// function send(action, state, options, type, instanceId) {
//   setTimeout(() => {
//     const message = {
//       payload: state ? stringify(state) : '',
//       action: type === 'ACTION' ? stringify(formatAction(action)) : action,
//       type: type || 'ACTION',
//       instanceId,
//       name: options.name
//     };
//     history.push(message);
//     localStorage.setItem('appHistory', history);
//     handleMessages(message);
//   }, 0);
// }


export function emitter(options = {}) {
  const listeners = {};
  const history = [];
  const id = Math.random().toString(36).substr(2);
  localStorage.setItem('id', id);
  return {
    init: (state, action = {}) => {
      setTimeout(() => {
        const message = {
          payload: state ? stringify(state) : '',
          action,
          type: 'INIT',
          id,
          name: options.name
        };
        //history.push(message);
        //localStorage.setItem('appHistory', history);
        console.log(history);
        handleMessages(message, listeners);
      }, 0);
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
    send: (action, state) => {
      let type = 'STATE';
      if (action) {
        type = 'ACTION';
      }
      setTimeout(() => {
        const message = {
          payload: state ? stringify(state) : '',
          action: type === 'ACTION' ? stringify(formatAction(action)) : action,
          type: type || 'ACTION',
          id,
          name: options.name
        };
        if (message.type === 'ACTION') {
          history.push(message);
          localStorage.setItem('appHistory', JSON.stringify(history));
        }
        let key = Object.keys(listeners);
        let theKey = key[0];
        theFunction = listeners[theKey][0];
        handleMessages(message, listeners);
      }, 0);
    },
    error: (payload) => {
      console.log(payload);
    }
  };
}
import mobx from 'mobx';
import getParams from 'get-params';

const getPayload = (change) => {
  const { added, addedCount, index, removed, removedCount } = change;
  return {
    index,
    added: added && mobx.toJS(added),
    addedCount,
    removed: removed && mobx.toJS(removed),
    removedCount
  };
};

export function createAction(name, change) {
  if (!change) return { type: name }; // is action
  let action;
  if (typeof change.newValue !== 'undefined') {
    action = { [change.name]: mobx.toJS(change.newValue) };
  } else action = getPayload(change);
  action.type = `${name}`;
  return action;
}

export function getName(obj) {
  if (!obj || !mobx.isObservable(obj)) return '';
  let r = mobx.extras.getDebugName(obj);
  let end = r.indexOf('.');
  if (end === -1) end = undefined;
  return r.substr(0, end);
}

/* eslint-disable no-param-reassign */
export const silently = (fn, store) => {
  store.__isRemotedevAction = true;
  fn();
  delete store.__isRemotedevAction;
};

function setValueAction(store, state) {

  silently(() => {

    if (store.importState) store.importState(state);
    else {
      
      Object.keys(state).forEach((key) => {
        if(store[key] !== state[key])
        store[key] = state[key];
      });
      
    }
  }, store);
  console.log(state)
  return state;
}
setValueAction.__isRemotedevAction = true;
export const setValue = mobx.action('@@remotedev', setValueAction);
/* eslint-enable */

export function getMethods(obj) {
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
export const interpretArg = (arg) => (new Function('return ' + arg))();

export function evalArgs(inArgs, restArgs) {

  const args = inArgs.map(interpretArg);
  if (!restArgs) return args;
  const rest = interpretArg(restArgs);
  if (Array.isArray(rest)) return args.concat(...rest);
  throw new Error('rest must be an array');
}

export function evalMethod(action, obj) {
  action = JSON.stringify(action)

  if (typeof action === 'string') {
    return (new Function('return ' + action)).call(obj);
  }

  const args = evalArgs(action.args, action.rest);
  return (new Function('args', `return this.${action.name}(args)`)).apply(obj, args);
}
/* eslint-enable */

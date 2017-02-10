import mobx from 'mobx';
import { parse } from 'jsan';
import { silently, setValue, getMethods, evalMethod } from './utils';

export const isMonitorAction = (store) => store.__isDeloreanAction === true;

function dispatch(store, { type, arguments: args }) {
  if (typeof store[type] === 'function') {
    silently(() => { store[type](...args); }, store);
  }
}

function dispatchRemotely(emitTool, store, payload) {
  try {
    evalMethod(payload, store);
  } catch (e) {
    emitTool.error(e.message);
  }
}

function toggleAction(store, id, strState) {
  const formattedState = parse(strState);
  const idx = formattedState.skippedActionIds.indexOf(id);
  const skipped = idx !== -1;
  const start = formattedState.stagedActionIds.indexOf(id);
  if (start === -1) return formattedState;

  setValue(store, formattedState.computedStates[start - 1].state);
  for (let i = (skipped ? start : start + 1); i < formattedState.stagedActionIds.length; i++) {
    if (
      i !== start &&
      formattedState.skippedActionIds.indexOf(formattedState.stagedActionIds[i]) !== -1
    ) continue; // it's already skipped
    dispatch(store, formattedState.actionsById[formattedState.stagedActionIds[i]].action);
    formattedState.computedStates[i].state = mobx.toJS(store);
  }

  if (skipped) formattedState.skippedActionIds.splice(idx, 1);
  else formattedState.skippedActionIds.push(id);
  return formattedState;
}

export function dispatchMonitorAction(store, emitTool, onlyActions) {
  const initValue = mobx.toJS(store);
  emitTool.init(initValue, getMethods(store));

  return (message) => {
    if (message.type === 'DISPATCH') {
      switch (message.dispatch) {
        case 'RESET':
          emitTool.init(setValue(store, initValue));
          return;
        case 'JUMP_TO_STATE':
          setValue(store, parse(message.payload));
          return;
        case 'TOGGLE_ACTION':
          if (!onlyActions) {
            console.warn('`onlyActions` parameter should be `true` to skip actions');
            return;
          }
          emitTool.send(null, toggleAction(store, message.payload.id, message.state));
          return;
        case 'IMPORT_STATE': {
          const { nextFormattedState } = message.payload;
          const { computedStates } = nextFormattedState;
          setValue(store, computedStates[computedStates.length - 1].state);
          emitTool.send(null, nextFormattedState);
          return;
        }
      }
    } else if (message.type === 'ACTION') {
      dispatchRemotely(emitTool, store, message.payload);
    }
  };
}

// doesn't look like we're using this file anywhere
// and it has repeat functions, etc. Can we delete this file?

import { history } from './../../emitter';

function updateDataPoints() {
  let datas = [];
  let extras = [];

  function makeExtras(anId) {
    this.data = {
      id: 'e' + anId.toString(),
      group: 'edge',
      source: anId - 1,
      target: anId
    };
  }

  function makeNode(anId, aX, aY) {
    this.group = 'nodes';
    this.data = { id: anId.toString() };
    this.scratch = { foo: 'bar' };
    this.position = { x: aX, y: aY };
    this.selected = false;
    this.selectable = true;
    this.locked = true;
    this.grabbable = false;
    this.classes = 'foo bar';
  }

  for (let i = 0; i < history.length; i++) {
    if (Array.isArray(history[i])) {
      for (let k = 0; k < history[i].length; k++) {
        datas.push(new makeNode((i.toString() + k.toString()), (100 + (100 * i)), (100 + (100 * k))));
        if (k > 0) extras.push(new makeExtras(i));
      }
    }
    datas.push(new makeNode(i, (100 + (100 * i)), 100));
    if (i > 0) extras.push(new makeExtras(i));
  }

  return datas.concat(extras);
}

export const A = () => updateDataPoints();

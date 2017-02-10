import { history } from './../../emitter';
import { ID } from './cy';
const baseX = 100;
const baseY = 100;
let X;
let Y = 0;
let interval = 75;
let datas = [];
let extras = [];

function updateDataPoints() {
  datas = [];
  extras = [];
  drawTree (assignID(history));

  return datas.concat(extras);
}

export const A = () => updateDataPoints();


function makeExtras(oldId, anId){
	this.data = {
		id: 'e' + anId.toString(),
		group: 'edge',
		source: oldId,
		target: anId
	}
}

function makeNode(anId, aX, aY, selected){
	
	this.group = 'nodes';
	this.data = {id: anId.toString()};
	this.scratch = {foo: 'bar'};
	this.position = {x: aX, y: aY};
	this.selected = selected;
	this.selectable = true;
	this.locked = false;
	this.grabbable = false;
	this.classes = 'foo bar';

}


function drawTree(idArray){ 
	if(!idArray || idArray.length === 0) return;
	let maxY = baseY;
	let tempIndex;
	let isSelected = false;
	let last;
	for(let i = idArray.length-1; i >= 0; i--){
		X = baseX;
		Y = baseY;
		if(idArray[i].match(/[∑]/gi) !== null)  {isSelected = true;};
		tempIndex = idArray[i].split('.');
		for(let k = 1; k < tempIndex.length+1; k++){
			if(k%2 === 1){
				X += (interval*Number(tempIndex[k-1]));


			}else if(k%2 === 0){
				Y += ((interval*(Number(tempIndex[k-1]))));// + (maxY)));
			}
		}
		
		//if(Y > maxY) maxY+=75;
		
		
		if(isSelected) {
			datas.push(new makeNode(idArray[i], X, Y, isSelected));
			if(last && last.length === idArray[i].length) extras.push(new makeExtras(last, idArray[i])); 
			last = idArray[i];
		}else{
		 datas.push(new makeNode(idArray[i], X, Y, isSelected));
		 if(last && last.split('.').length === idArray[i].split('.').length) extras.push(new makeExtras(last, idArray[i])); 
		 last = idArray[i];
		}
		isSelected = false;

	}
}


function assignID(history, local, idArray = [], id = ''){
  let testId = id;
	for (let i = 0; i < history.length; i++){
	  testId = id + i.toString();
		if (Array.isArray(history[i])) {
			testId += '.';
			assignID(history[i], local, idArray, testId)
		} else {
			if (history[i].match(/ΩΩΩΩ/i) !== null) {
				history[i] = history[i].replace('ΩΩΩΩ', '');
				testId = '∑' + testId;
				idArray.push(testId);
			} else if (local == testId) {
				testId = '∑' + testId;
				idArray.push(testId);
			} else {
				idArray.push(testId);
			}
		}
	}
	return idArray;
}

let lastLocal;
export function addNode(currLocal, newState, history) {

	let hold;
	if (!currLocal && !lastLocal) {
    history.push("ΩΩΩΩ" + newState); hold = assignID(history, currLocal); return hold.reduce((acc, index, value) => {
		if (value.toString().match(/[∑]/gi) !== null) acc = value;
	});
} 
	if (!currLocal) currLocal = lastLocal;
	lastLocal = currLocal;
	let path = currLocal.toString().replace(/[∑]/gi, '').split('.');
	let workArr = history;
	let depth = 2;
	if (history.length === 0) {
	  history.push("ΩΩΩΩ" + newState);
	  hold = assignID(history, currLocal);
	  return hold.reduce((acc, index, value) => {
		  if (value.toString().match(/[∑]/gi) !== null) acc = value;
	});
	}
	while(path.length > 1){
		workArr = workArr[path[0]]
		path.splice(0,1);
		depth++;
	}
	if(path[0] == (workArr.length-1) && depth%2 === 0){
		workArr.push("ΩΩΩΩ" + newState);
		hold = assignID(history, currLocal);
	} else {
	  if(path[0] == '0' && currLocal.length > 1){
	    workArr.push("ΩΩΩΩ" + newState);
	  } else {
	    if(!Array.isArray(workArr[path[0]])){
	    	hold = workArr[path[0]];
	    	workArr[path[0]] = [hold, newState];
	    } else {
	      workArr[path[0]].push("ΩΩΩΩ" + newState);

	    }
	  }
		hold = assignID(history, currLocal);
	}
	hold = assignID(history, currLocal);
	return hold.reduce((acc, index, value) => {
		if (value.toString().match(/[∑]/gi) !== null) acc = value;
	});
	
}

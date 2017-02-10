import React, { Component } from 'react';
import Toolbar from './components/toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';
import { handleMessages, history } from './../emitter';
import Cytoscape from './components/cy';
import {ID} from './components/cy';
import { parse } from 'jsan';

export default class Delorean extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      currentIndex: null,
      currentAction: null,
      selected: null,
      curIndex: 0
      // currentIndex: history.length - 1,
    };
   
    this.getData = this.getData.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.getCurAction = this.getCurAction.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  componentDidMount() {
    //this.refs.graph.getCy().on()
    this.getData();
  }

  getData() {
    this.setState({ history });
  }
  
  getCurAction() {
   // if(this.state.history[this.state.currentIndex]){
   //   if(!Array.isArray(this.state.history[this.state.currentIndex])){
   // const curStateObject = parse(this.state.history[this.state.currentIndex]) || '';
    const stateObj = this.state.history[this.state.currentIndex];
    let curStateObject;
    if (stateObj) curStateObject = parse(stateObj);
    else curStateObject = '';
    let curAction = curStateObject;
    if (curStateObject !== '') curAction = curStateObject.action;
    if (Array.isArray(curAction)) curAction = false;
    if (curAction) curAction = parse(curAction).action.type;
    const actions = this.actionReducer(curAction);
    let currentAction = `  action: ${actions.type} `;
    Object.keys(actions).forEach((key, i) => {
      if (key !== 'type') {
        currentAction += `| ${key}: ${actions[key]} `;
      }
    });
    this.setState({ currentAction });
  } 
}
}

navigate(event){
  let key = event.keyCode || event.charCode;
  if(key === 39){
    let old = this.state.selected;
    old++;
    this.setState({selected: old});
    this.sendUpdate(old, 'JUMP_TO_STATE');
  }
  
  actionReducer(object) {
    return Object.keys(object).reduce((acc, cur) => {
      if (object[cur] !== null && object[cur] != false) acc[cur] = object[cur];
      if (Array.isArray(object[cur]) && object[cur].length) {
        if (typeof object[cur][0] !== 'string') acc[cur] = object[cur][0].title;
        else acc[cur] = object[cur][0];
      }
      return acc;
    }, {});
  }

  sendUpdate(index, action) {
    if(index[0] === 'e') return;
    this.setState({selected: index});
    this.getData();
    if(index){
      let curr = this.state.history;
      let id = index.toString().split('.');
      let ind;
      while(id.length > 1){
        ind = Number(id[0]);
        curr = curr[ind];
        id.splice(0,1);
      }
      ind = Number(id[0]);
      const message = parse(curr[ind]);
      message.type = 'DISPATCH';
      message.dispatch = action;
      handleMessages(message, { [message.instanceId]: true }, index, 1);
    }
  }

  render() {

    return (
      <MuiThemeProvider>
        <div>
          <Toolbar
            getData={this.getData}
            sendUpdate={this.sendUpdate}
            history={this.state.history}
            curIndex={this.state.currentIndex}
            getCurAction={this.getCurAction}
            curAction={this.state.currentAction}
            navigate={this.navigate}
            selected={this.state.selected}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}


import React, { Component } from 'react';
import Toolbar from './components/toolbar';
import SliderExampleStep from './components/slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';
import { handleMessages, history } from './../emitter';
import { stringify, parse } from 'jsan';
import Cytoscape from './components/cy';
import {ID} from './components/cy';

export default class Delorean extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      currentIndex: null,
      currentAction: null,
      selected: null,
      curIndex: 0
    };
   

    this.getSelected = this.getSelected.bind(this);
    this.getData = this.getData.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.getCurAction = this.getCurAction.bind(this);
    this.handleKey = this.handleKey.bind(this);
   
  }

  componentDidMount() {
    //this.refs.graph.getCy().on()
    this.getData();
  }

  getData() {

    this.setState({ history });
  }
  

  getCurAction() {
    if(this.state.history[this.state.currentIndex]){
      if(!Array.isArray(this.state.history[this.state.currentIndex])){
    const curStateObject = parse(this.state.history[this.state.currentIndex]) || '';
    let curAction = curStateObject;
    if (curStateObject !== '') curAction = curStateObject.action;
    if (Array.isArray(curAction)) curAction = false;
    if (curAction) curAction = parse(curAction).action.type;
    const actions = Object.keys(curAction).reduce((acc, cur) => {
      if (curAction[cur] !== null && curAction[cur] != false) acc[cur] = curAction[cur];
      if (Array.isArray(curAction[cur]) && curAction[cur].length) {
        if (typeof curAction[cur][0] !== 'string') acc[cur] = curAction[cur][0].title;
        else acc[cur] = curAction[cur][0];
      }
      return acc;
    }, {});
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
  //   actionReducer(object) {
  //   Object.keys(object).reduce((acc, cur) => {
  //     if (object[cur] !== null && object[cur] != false) acc[cur] = object[cur];
  //     if (Array.isArray(object[cur]) && object[cur].length) {
  //       if (typeof object[cur][0] !== 'string') acc[cur] = object[cur][0].title;
  //       else acc[cur] = object[cur][0];
  //     }
  //     return acc;
  //   }, {});
  // }
handleKey(e){

  console.log('dfs');
}


  getSelected(){
    //console.log(ID);
    //this.setState({selected: id});
  }

  sendUpdate(index, action) {
    console.log(ID)
    if(index[0] === 'e')return;
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
    // this.getData();
    // this.setState({ currentIndex: index });
    // if(this.state.history[index]){
    //   if(!Array.isArray(this.state.history[index])){
    //   const message = parse(this.state.history[index]);
    //   message.type = 'DISPATCH';
    //   message.dispatch = action;
    //   handleMessages(message, { [message.instanceId]: true }, index, 1);
    // } else {
    //   const message = parse(this.state.history[index][0]);
    //   message.type = 'DISPATCH';
    //   message.dispatch = action;
    //   handleMessages(message, { [message.instanceId]: true }, index, 1);
    // }

    // }
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
            getSelected={this.getSelected}

          />
          
        </div>
      </MuiThemeProvider>
    );
  }
}


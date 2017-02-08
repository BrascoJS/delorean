import React, { Component } from 'react';
import Toolbar from './components/toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';
import { handleMessages, history } from './../emitter';
import { parse } from 'jsan';

export default class Delorean extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      currentIndex: history.length - 1,
      currentAction: null
    };

    this.getData = this.getData.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.getCurAction = this.getCurAction.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({ history });
  }

  getCurAction() {
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
    this.getData();
    this.setState({ currentIndex: index });
    if (this.state.history[index]) {
      const message = parse(this.state.history[index]);
      message.type = 'DISPATCH';
      message.dispatch = action;
      handleMessages(message, { [message.instanceId]: true }, 1);
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
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

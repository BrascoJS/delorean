import React, { Component } from 'react';
import Toolbar from './components/toolbar';
import SliderExampleStep from './components/slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';
import { handleMessages } from './../emitter';
import { stringify, parse } from 'jsan';

export default class Delorean extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      currentIndex: null,
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
    let history = parse(localStorage.getItem('appHistory'));
    this.setState({ history });
  }

  actionReducer(object) {
    Object.keys(object).reduce((acc, cur) => {
      if (object[cur] !== null && object[cur] != false) acc[cur] = object[cur];
      if (Array.isArray(object[cur]) && object[cur].length) {
        if (typeof object[cur][0] !== 'string') acc[cur] = object[cur][0].title;
        else acc[cur] = object[cur][0];
      }
      return acc;
    }, {});
  }

  getCurAction() {
    const curStateObject = this.state.history[this.state.currentIndex] || '';
    let curAction = curStateObject;
    if (curStateObject !== '') curAction = curStateObject.action;
    if (Array.isArray(curAction)) curAction = false;
    if (curAction) curAction = parse(curAction).action.type;
    const currentAction = Object.keys(curAction).reduce((acc, cur) => {
      // console.log('reducing: ', curAction[cur]);
      if (curAction[cur] !== null && curAction[cur] != false) acc[cur] = curAction[cur];
      if (Array.isArray(curAction[cur]) && curAction[cur].length) {
        if (typeof curAction[cur][0] !== 'string') acc[cur] = curAction[cur][0].title;
        else acc[cur] = curAction[cur][0];
      }
      return acc;
    }, {});
    this.setState({ currentAction });
  }

  sendUpdate(index, action) {
    this.getData();
    this.setState({ currentIndex: index });
    const message = this.state.history[index];
    message.type = 'DISPATCH';
    message.dispatch = action;
    handleMessages(message, { [message.instanceId]: true }, true);
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
            curAction={this.getCurAction}
            action={this.state.currentAction}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

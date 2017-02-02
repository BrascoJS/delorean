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
      currentIndex: null
    };

    this.getData = this.getData.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    let history = parse(localStorage.getItem('appHistory'));
    this.setState({ history });
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
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

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

      history: []

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
    const message = this.state.history[index];
    message.type = 'DISPATCH';
    message.dispatch = action;
    handleMessages(message, { [message.instanceId]: true }, 1);

  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Toolbar
            getData={this.getData}
            sendUpdate={this.sendUpdate}
            history={this.state.history}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

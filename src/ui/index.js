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
      id: null,
      offset: 0
    };

    this.getData = this.getData.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    let a = parse(localStorage.getItem('appHistory'));
    let b = localStorage.getItem('id');
    this.setState({ history: a, id: b });
  }

  sendUpdate(pos) {
    let offset = this.state.offset;
    const message = this.state.history[this.state.history.length - offset - 1];
    message.type = 'DISPATCH';
    message.dispatch = 'JUMP_TO_STATE';
    console.log('dispatched message: ', message);
    if (pos) {
      handleMessages(message, { [this.state.id]: true }, 1);
      offset++;
      this.setState({ offset });
    } else {
      handleMessages(message, { [this.state.id]: true }, 1);
      offset--;
      this.setState({ offset });
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
            id={this.state.id}
            offset={this.state.offset}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

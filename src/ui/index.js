import React, { Component } from 'react';
import Toolbar from './components/toolbar';
import SliderExampleStep from './components/slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';
import {handleMessages} from './../emitter';

// import wrapper from './../dev';

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

  getData(){
    let a = JSON.parse(localStorage.getItem('appHistory', history));
    
    let b = localStorage.getItem('id');
   
    this.setState({history: a, id: b});
    
  }

  sendUpdate(pos){
    console.log(pos);
    if(pos){
      let offset = this.state.offset;
      handleMessages(this.state.history[this.state.history.length-offset-1], this.state.id, 1);
      offset++;
      this.setState({offset: offset});
    }else {
      let offset = this.state.offset;
      handleMessages(this.state.history[this.state.history.length-offset-1], this.state.id, 1);
      offset--;
      this.setState({offset: offset});
    }
   // console.log(pos);
  }



  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Toolbar getData={this.getData} sendUpdate={this.sendUpdate} history={this.state.history} id={this.state.id} offset={this.state.offset}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Toolbar from './components/toolbar';
import SliderExampleStep from './components/slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';

class App extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  render(){
    return(
      <MuiThemeProvider>
      <div>
        <Toolbar />
      </div>
      </MuiThemeProvider>
    )
  }
}


ReactDOM.render(<App />, document.querySelector('.container'))

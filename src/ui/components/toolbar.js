import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import StateChangeStepper from './stateChangeStepper';
import SliderBar from './slider';
import Cytoscape from './cy';
import {Component} from 'react';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  text: {
    marginLeft: 5
  }
};

class Toolbar extends Component{
  constructor(props){
    super(props);
  }
  //const { getData, sendUpdate, history, curIndex, getCurAction, curAction, getSelected } = props;


  render(){
  return (
    
    <Tabs>
      <Tab label="Time Travel" >
        <div >
          <div style={styles.text}> {this.props.curAction} </div>
          <SliderBar
            getData={this.props.getData}
            sendUpdate={this.props.sendUpdate}
            getCurAction={this.props.getCurAction}
            history={this.props.history}
          />
        </div>
      </Tab>
      <Tab label="Undo/Redo" >
        <div>
          <StateChangeStepper
            getData={this.props.getData}
            sendUpdate={this.props.sendUpdate}
            history={this.props.history}
            curIndex={this.props.curIndex}
            curAction={this.props.curAction}
            getCurAction={this.props.getCurAction}
          />
        </div>
      </Tab>
      <Tab label="Dependency Tree">
        <div>
        <Cytoscape ref="graph" getSelected={this.props.getSelected} currentLocal={this.props.curIndex} getData={this.props.getData} sendUpdate={this.props.sendUpdate}/>
        </div>
      </Tab>
    </Tabs>
   
  );
};

// Toolbar.propTypes = {
//   getData: React.PropTypes.func,
//   sendUpdate: React.PropTypes.func,
//   getCurAction: React.PropTypes.func,
//   history: React.PropTypes.array,
//   curIndex: React.PropTypes.number,
//   curAction: React.PropTypes.string
// };
}

export default Toolbar;

import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import StateChangeStepper from './stateChangeStepper';
import SliderBar from './slider';
import Cytoscape from './cy';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  text: {
    marginLeft: 5,
    paddingTop: 10
  },
  tool: {
    // position: 'fixed',
    // top: 0,
    backgroundColor: 'white',
    boxShadow: '0 3px 5px 0 rgba(0, 0, 0, 0.2)',
    minWidth: 550,
  }
};

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }
  // does this need to be stateful? there's no use of state in this component

  // const { getData, sendUpdate, history, curIndex, getCurAction, curAction, getSelected } = props;

  render() {
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
        <Tab label="Dependency Tree" onKeyDown={e => this.props.navigate(e)}>
          <div >
            <Cytoscape
              ref="graph"
              getSelected={this.props.getSelected}
              currentLocal={this.props.curIndex}
              getData={this.props.getData}
              sendUpdate={this.props.sendUpdate}
              selected={this.props.selected}
            />
          </div>
        </Tab>
      </Tabs>

    );
  }
}

Toolbar.PropTypes = {
  getData: React.PropTypes.func,
  sendUpdate: React.PropTypes.func,
  getCurAction: React.PropTypes.func,
  history: React.PropTypes.array,
  curIndex: React.PropTypes.number,
  curAction: React.PropTypes.string
};

export default Toolbar;

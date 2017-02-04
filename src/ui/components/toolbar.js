import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import StateChangeStepper from './stateChangeStepper';
import SliderBar from './slider';

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

const Toolbar = (props) => {
  const { getData, sendUpdate, history, curIndex, curAction, action } = props;
  let type;
  let other = [];
  if (action) {
    type = action.type;
    Object.keys(action).forEach((key, i) => {
      if (key !== 'type') {
        other.push(<div key={i}> {key}: {action[key]} </div>);
      }
    });
  }
  let actions = '';
  if (action) {
    actions = `  action: ${action.type} `;
    Object.keys(action).forEach((key, i) => {
      if (key !== 'type') {
        actions += `| ${key}: ${action[key]} `;
      }
    });
  }

  return (
    <Tabs>
      <Tab label="Time Travel" >
        <div >
          <div style={styles.text}> {actions} </div>
          <SliderBar
            getData={getData}
            sendUpdate={sendUpdate}
            curAction={curAction}
            history={history}
          />
        </div>
      </Tab>
      <Tab label="Undo/Redo" >
        <div>
          <StateChangeStepper
            getData={getData}
            sendUpdate={sendUpdate}
            history={history}
            curIndex={curIndex}
          />
        </div>
      </Tab>
      <Tab label="Dependency Tree">
        <div>
          <h2 style={styles.headline}>Plant Tree Here</h2>
          <p>
            And watch it grow!
          </p>
        </div>
      </Tab>
    </Tabs>
  );
};

Toolbar.propTypes = {
  getData: React.PropTypes.func,
  sendUpdate: React.PropTypes.func,
  curAction: React.PropTypes.func,
  history: React.PropTypes.array,
  curIndex: React.PropTypes.number,
  action: React.PropTypes.object
};

export default Toolbar;

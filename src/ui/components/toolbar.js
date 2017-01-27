import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import StateChangeStepper from './stateChangeStepper';
import SliderExampleStep from './slider';
const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

// function handleActive(tab) {
//   alert(`A component tree will grow when this is clicked!`);
// }

const Toolbar = (props) => (
  <Tabs>
    <Tab label="Time Travel" >
      <div>
        <SliderExampleStep getData={props.getData} sendUpdate={props.sendUpdate} history={props.history} id={props.id} offset={props.offset} />
      </div>
    </Tab>
    <Tab label="Undo/Redo" >
      <div>
        <StateChangeStepper />
      </div>
    </Tab>
    <Tab
      label="Dependency Tree"
    >
      <div>
        <h2 style={styles.headline}>Plant Tree Here</h2>
        <p>
          And watch it grow!
        </p>
      </div>
    </Tab>
  </Tabs>
);

export default Toolbar;

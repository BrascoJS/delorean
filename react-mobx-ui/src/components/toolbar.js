// import React from 'react';
// import RaisedButton from 'material-ui/RaisedButton';
// import {fullWhite} from 'material-ui/styles/colors';
// import ActionAndroid from 'material-ui/svg-icons/action/android';
// import FontIcon from 'material-ui/FontIcon';
//
// const style = {
//   margin: 12,
// };
//
// const Toolbar = () => (
//   <div>
//     <RaisedButton
//       label='Transition Slider'
//       style={style}
//     />
//     <RaisedButton
//       backgroundColor="#a4c639"
//       label='View Component Tree'
//       style={style}
//     />
//     <RaisedButton
//       target="_blank"
//       secondary={true}
//       label='State Timeline'
//       style={style}
//     />
//   </div>
// );
//
// export default Toolbar;


import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
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

function handleActive(tab) {
  alert(`A component tree will grow when this is clicked!`);
}

const Toolbar = () => (
  <Tabs>
    <Tab label="View Transitions" >
      <div>
        <h2 style={styles.headline}>Tab One</h2>
        <SliderExampleStep />
      </div>
    </Tab>
    <Tab label="View Changes in State" >
      <div>
        <StateChangeStepper />
      </div>
    </Tab>
    <Tab
      label="View Your Component Tree"
      onActive={handleActive}
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

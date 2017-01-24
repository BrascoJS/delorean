import React from 'react';
import Slider from 'material-ui/Slider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const testArray = [1,2,3,4,5,6]
const stepVal = 1 / testArray.length
const SliderExampleStep = () => (
  <div>
    <Slider />
  </div>

);

export default SliderExampleStep;

import React from 'react';
import Slider from 'material-ui/Slider';

/**
 * By default, the slider is continuous.
 * The `step` property causes the slider to move in discrete increments.
 */
const array = [1,2,3,4,5,3,4,3,2,4,5,4,3,4]
const stepNum = 1 / array.length

const SliderExampleStep = () => (
  <Slider step={stepNum} value={0} />
);

export default SliderExampleStep;

import React from 'react';
import Slider from 'material-ui/Slider';

/**
 * By default, the slider is continuous.
 * The `step` property causes the slider to move in discrete increments.
 */

const SliderExampleStep = (props) => {

	const {getData, sendUpdate, history, id} = props;
	let stepNum = 20;
	const array = history;
	if(!history){
		 stepNum = 1 / 20;
	}else{
		 stepNum = 1 / array.length;
	}

	let value1 = 0;


	return(
  <Slider step={stepNum} onChange={(value)=>{sendUpdate(value.screenX < value1); value1 = value.screenX;}} />
)
};

export default SliderExampleStep;

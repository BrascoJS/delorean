import React from 'react';
import Slider from 'material-ui/Slider';
let value1 = Infinity;
/**
 * By default, the slider is continuous.
 * The `step` property causes the slider to move in discrete increments.
 */

const SliderExampleStep = (props) => {

	const {getData, sendUpdate, history, id, offset=0} = props;
	let stepNum = 1;
	const array = history;
	if(!history){
		 stepNum = 1 / 1;
	}else{
		 stepNum = 1 / array.length;
	}
	let position
	if(array.length > 0){
	 position = ((array.length - offset)/array.length);
	} else {
		position = 1;
	}
	
	setTimeout(getData, 10000);

	return(
  <Slider step={stepNum} value={position} onChange={(e)=>{sendUpdate(e.screenX < value1); value1 = e.screenX;}} />
)
};

export default SliderExampleStep;

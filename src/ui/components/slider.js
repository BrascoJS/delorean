import React from 'react';
import Slider from 'material-ui/Slider';
let prevVal = Infinity;
let stepNum;

const SliderBar = (props) => {
  const { getData, sendUpdate, history } = props;
  let position = 1;

  if (history.length < 2) stepNum = 0;
  else stepNum = 1 / (history.length - 1);

  function updater(newPos) {
    getData();
    const index = Math.round(newPos / stepNum);
    sendUpdate(index);
  }

  return (
    <Slider
      step={stepNum}
      value={position}
      onChange={(e, newPos) => { updater(newPos); }}
    />
  );
};

SliderBar.propTypes = {
  getData: React.PropTypes.func,
  sendUpdate: React.PropTypes.func,
  history: React.PropTypes.array,
  id: React.PropTypes.string,
  offset: React.PropTypes.number
};

export default SliderBar;

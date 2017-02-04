import React from 'react';
import Slider from 'material-ui/Slider';

const SliderBar = (props) => {
  const { getData, sendUpdate, history, curAction } = props;
  let position = 1;
  let prevVal = Infinity;
  let stepNum;
  let actions;
  let type;
  let other;

  if (history.length < 2) stepNum = 0;
  else stepNum = 1 / (history.length - 1);

  function updater(newPos) {
    getData();
    const index = Math.round(newPos / stepNum);
    sendUpdate(index, 'JUMP_TO_STATE');
    curAction();
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
  curAction: React.PropTypes.func,
  history: React.PropTypes.array
};

export default SliderBar;

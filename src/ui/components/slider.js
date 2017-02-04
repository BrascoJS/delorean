import React from 'react';
import Slider from 'material-ui/Slider';

const SliderBar = (props) => {
  const { getData, sendUpdate, history, getCurAction } = props;
  let stepNum;

  if (history.length < 2) stepNum = 0;
  else stepNum = 1 / (history.length - 1);

  function updater(newPos) {
    getData();
    const index = Math.round(newPos / stepNum);
    sendUpdate(index, 'JUMP_TO_STATE');
    getCurAction();
  }

  return (
    <Slider
      step={stepNum}
      value={1}
      onChange={(e, newPos) => { updater(newPos); }}
    />
  );
};

SliderBar.propTypes = {
  getData: React.PropTypes.func,
  sendUpdate: React.PropTypes.func,
  getCurAction: React.PropTypes.func,
  history: React.PropTypes.array
};

export default SliderBar;

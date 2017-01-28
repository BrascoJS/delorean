import React from 'react';
import Slider from 'material-ui/Slider';
let value1 = Infinity;

const SliderBar = (props) => {
  const { getData, sendUpdate, history, id, offset = 0 } = props;
  const array = history;
  let stepNum = 1;
  let position;

  if (!history) stepNum = 1 / 1;
  else stepNum = 1 / array.length;

  if (array.length > 0) position = ((array.length - offset) / array.length);
  else position = 1;

  function updater(xVal) {
    getData();
    sendUpdate(xVal < value1);
    value1 = xVal;
  }

  return (
    <Slider
      step={stepNum}
      value={position}
      onChange={(e) => { updater(e.screenX); }}
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

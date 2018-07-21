import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'material-ui/Slider';

const styles = {
  slider: {
    width: '95%',
    margin: '0 auto'
  }
};

const SliderBar = (props) => {
  const { getData, sendUpdate, history, getCurAction } = props;

  function updater(newPos) {
    getData();
    const index = Math.round(newPos / (1 / (history.length - 1)));
    sendUpdate(index, 'JUMP_TO_STATE');
    getCurAction();
  }

  return (
    <Slider
      style={styles.slider}
      value={1}
      onChange={(e, newPos) => { updater(newPos); }}
    />
  );
};

SliderBar.propTypes = {
  getData: PropTypes.func,
  sendUpdate: PropTypes.func,
  getCurAction: PropTypes.func,
  history: PropTypes.array
};

export default SliderBar;

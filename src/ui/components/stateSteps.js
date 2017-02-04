import React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

const Steps = (props) => {
  const { stepIndex } = props;
  return (
    <Step>
      <StepLabel>{stepIndex}</StepLabel>
    </Step>
  );
};

Steps.propTypes = {
  stepIndex: React.PropTypes.number
};

export default Steps;

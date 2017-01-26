import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';


const Steps = (props) => {

  return (
    <Step>
      <StepLabel>{props.stepIndex}</StepLabel>
    </Step>
  )
}

export default Steps;

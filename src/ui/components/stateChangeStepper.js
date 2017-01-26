import React, { Component } from 'react';
import { Step,
Stepper,
StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import Steps from './stateSteps';
import {handleMessages} from './../../emitter';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/**
 * A contrived example using a transition between steps
 */
class StateChangeStepper extends Component {

  constructor(props){

    super(props)

  this.state = {
    loading: false,
    finished: false,
    steps: []
  };
}

  dummyAsync = (cb) => {
    this.setState({ loading: true }, () => {
      this.asyncTimer = setTimeout(cb, 10);
    });
  };

  handleNext = () => {
    let a = JSON.parse(localStorage.getItem('appHistory', history));
    let b = localStorage.getItem('id');
    handleMessages(a[0], b, 1);
    const { stepIndex } = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }));
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  };


/* May have to change this function from switch statement to something else
in order to account for varying array lengths */
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <p>
            This is a state change!
          </p>
        );
      case 1:
        return (
          <div>

            <p>
              This is another state change!
            </p>
            <p>Something something whatever cool</p>
          </div>
        );
      case 2:
        return (
          <p>
            This is ANOTHER state change!!!
          </p>
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const { finished, stepIndex } = this.state;
    const contentStyle = { margin: '0 16px', overflow: 'hidden' };

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({ stepIndex: 0, finished: false });
              }}
            >
              Click here
            </a> to reset to initial state.
          </p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{ marginRight: 12 }}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    );
  }

  render() {
    const { loading, stepIndex } = this.state;

    // const stateSteps = this.state.steps.map((step, index) => {
    //   return <Steps key={index} />
    // })


    return (
      <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Initial State</StepLabel>
          </Step>
          <Step>
            <StepLabel>State Change 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>State Change 2</StepLabel>
          </Step>

        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }
}

export default StateChangeStepper;

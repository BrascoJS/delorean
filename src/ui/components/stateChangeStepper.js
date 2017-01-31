import React, { Component } from 'react';
import { Step,
Stepper,
StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import Steps from './stateSteps';

class StateChangeStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      finished: false,
      steps: [],
      stepIndex: 0
    };
  }

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

  dummyAsync = (cb) => {
    this.setState({ loading: true }, () => {
      this.asyncTimer = setTimeout(cb, 10);
    });
  };

  handleNext = () => {
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

  renderContent() {
    const { finished, stepIndex } = this.state;
    const { sendUpdate } = this.props;
    const contentStyle = { margin: '0 16px', overflow: 'hidden' };

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                sendUpdate(0, 'RESET');
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
            onClick={this.handlePrev}
            style={{ marginRight: 12 }}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary
            onClick={this.handleNext}
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
        <ExpandTransition loading={loading} open>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }
}

StateChangeStepper.propTypes = {
  sendUpdate: React.PropTypes.func
};

export default StateChangeStepper;

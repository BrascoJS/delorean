import React, { Component } from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
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
    const { history, curIndex, curAction } = this.props;

    switch (stepIndex) {
      case 0:
        return (
          <div>
            {curAction}
          </div>
        );
      case 1:
        return (
          <div>
            {curAction}
          </div>
        );
      case 2:
        return (
          <div>
            {curAction}
          </div>
        );
      default:
        return 'Click the buttons to undo/redo consecutive actions';
    }
  }

  dummyAsync = (cb) => {
    this.setState({ loading: true }, () => {
      this.asyncTimer = setTimeout(cb, 10);
    });
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    const { sendUpdate, curIndex, history, getData, getCurAction } = this.props;
    let newIndex = curIndex + 1;
    getData();
    if (newIndex > history.length - 1) newIndex = history.length - 1;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }));
      sendUpdate(newIndex, 'JUMP_TO_STATE');
      getCurAction();
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    const { sendUpdate, curIndex, getData, getCurAction } = this.props;
    let newIndex = curIndex - 1;
    getData();
    if (newIndex < 0) newIndex = 0;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1
      }));
      sendUpdate(newIndex, 'JUMP_TO_STATE');
      getCurAction();
    }
  };

  renderContent() {
    const { finished, stepIndex } = this.state;
    const { sendUpdate, getCurAction } = this.props;
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
                getCurAction();
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
            label="Undo"
            disabled={stepIndex === 0}
            onClick={this.handlePrev}
            style={{ marginRight: 12 }}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Redo'}
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
  sendUpdate: React.PropTypes.func,
  getData: React.PropTypes.func,
  getCurAction: React.PropTypes.func,
  curIndex: React.PropTypes.number,
  history: React.PropTypes.array,
  curAction: React.PropTypes.string
};

export default StateChangeStepper;

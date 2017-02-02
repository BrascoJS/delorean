import React, { Component } from 'react';
import mobx from 'mobx';
import mobxReact from 'mobx-react';
import Toolbar from './components/toolbar';
import SliderExampleStep from './components/slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StateChangeStepper from './components/stateChangeStepper';
import { handleMessages } from './../emitter';
import { stringify, parse } from 'jsan';

export default class Delorean extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };

    this.getData = this.getData.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
  }

  componentDidMount() {
    this.getData();
    mobxReact.trackComponents();
    document.body.addEventListener('click', this.treeClick, true);
  }

  getData() {
    let history = parse(localStorage.getItem('appHistory'));
    this.setState({ history });
  }

  sendUpdate(index, action) {
    const message = this.state.history[index];
    message.type = 'DISPATCH';
    message.dispatch = action;
    handleMessages(message, { [message.instanceId]: true }, 1);
  }

  findComponentAndNode = target => {
    let node = target;
    console.log('node: ', node);
    let component;
    while (node) {
      console.log('registry: ', mobxReact.componentByNodeRegistery);
      component = mobxReact.componentByNodeRegistery.get(node);
      if (component) return { component, node };
      node = node.parentNode;
    }
    return { component: undefined, node: undefined };
  }

  treeClick = e => {
    // if (state.graphEnabled) {
    if (e) {
      const target = e.target;
      const component = this.findComponentAndNode(target).component;
      if (component) {
        e.stopPropagation();
        e.preventDefault();
        const dependencyTree = mobx.extras.getDependencyTree(component.render.$mobx);
        // deduplicateDependencies(dependencyTree);
        // setGlobalState({
        //   dependencyTree,
        //   hoverBoxes: [],
        //   graphEnabled: false,
        // });
        console.log(dependencyTree);
      }
    }
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Toolbar
            getData={this.getData}
            sendUpdate={this.sendUpdate}
            history={this.state.history}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

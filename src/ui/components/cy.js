import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import { A } from './Tree'; // can we call this something more insightful

export let ID = null;
// does this need to be exported?
// it's passed in as a parameter where it's used in componentDidMount below

let cyStyle = {
  height: '400px',
  display: 'block'
};

class Cytoscape extends Component {
  constructor(props) {
    super(props);
    this.cy = null;
  }

  componentDidMount() {
    let cy = cytoscape({
      container: this.refs.cyelement,
      elements: A()
    });
    this.cy = cy;
    this.cy.resize();
    this.cy.json({ elements: A.elements });
    this.cy.on('select', (ID) => {
      ID = Object.keys(this.cy.elements(':selected')['_private']['indexes'])[0];
      this.props.sendUpdate(ID, 'JUMP_TO_STATE');
    });
  }

  componentWillReceiveProps(nextProps) {
    this.cy.resize();
    this.cy.json({ elements: A() });
    ID = Object.keys(this.cy.elements(':selected')['_private']['indexes'])[0];
    if (this.props.selected) {
      this.cy.$('#' + this.props.selected.toString()).json({ selected: false });
      this.cy.$('#' + (this.props.selected + 1).toString()).json({ selected: true });
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  getCy() {
    return this.cy;
  }

  render() {
    return <div style={cyStyle} ref="cyelement" />;
  }
}

Cytoscape.PropTypes = {
  sendUpdate: PropTypes.func,
  selected: PropTypes.number
};

export default Cytoscape;
import React, {Component} from 'react';
import cytoscape from 'cytoscape';
import {A} from './Tree';

export let ID = null;

let cyStyle = {
  height: '400px',
  display: 'block'
};


class Cytoscape extends Component{
	constructor(props){
		super(props);
		this.cy = null;
		
  		

	}

  
  componentDidMount(){
    let cy = cytoscape({container: this.refs.cyelement,
    	elements: A()
	});
    this.cy = cy;
    this.cy.json({elements: A.elements});
    this.cy.on("select", (ID) => {
    	ID = Object.keys(this.cy.elements(':selected')['_private']['indexes'])[0];
    	this.props.sendUpdate(ID, 'JUMP_TO_STATE');
		});
  }

  shouldComponentUpdate(){
    return false;
  }



  componentWillReceiveProps(nextProps){
  	
  	ID = Object.keys(this.cy.elements(':selected')['_private']['indexes'])[0];	
  	
  	this.props.getSelected();
    this.cy.json({elements: A()});
  }

  componentWillUnmount(){
    this.cy.destroy();
  }

  getCy(){
    return this.cy;
  }

  render(){
  	
    return <div style={cyStyle} ref="cyelement" />
  }
}

export default Cytoscape;
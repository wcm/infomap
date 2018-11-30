import React, { Component } from "react";
import { render } from "react-dom";
import Draggable from 'react-draggable';

class Selector extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			width: 0,
			height: 600,
			dragging: false,
		}
	}

	componentDidMount() {
	  this.updateWindowDimensions();
	  window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
	  window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
	  this.setState({ width: window.innerWidth*0.833333 });
	}
	
	updateXY = (handlerID, position) => {
		if (handlerID === '1') {
			this.props.setXY({x: position.x-92, y: position.y-132});
		}else if (handlerID === '2') {
			this.props.setXY({x: this.state.width-position.x+92, y: position.y-132});						
		}else if (handlerID === '3') {
			this.props.setXY({x: position.x-92, y: this.state.height-position.y+132});						
		}else if (handlerID === '4') {
			this.props.setXY({x: this.state.width-position.x+92, y: this.state.height-position.y+132});						
		}
	}

	handleStart = (handlerID, position) => {
		this.props.setDragging(true);
		this.updateXY(handlerID, position);
	}

	handleStop = (handlerID, position) => {
		this.props.setDragging(false);
		this.updateXY(handlerID, position);
	}

	handleDrag = (handlerID, position) => {
		this.updateXY(handlerID, position);
	}

	render() {
		const divWidth = this.state.width;
		const divHeight = this.state.height;
		return (
			<div className='selector'>
				<div className='shader'
					style={{
						position: 'absolute',
						left:0,
						top:0,
						height: `${ divHeight }px`,
						width: `${ this.props.x }px`
					}}					
				/>
				<div className='shader'
					style={{
						position: 'absolute',
						left:`${ divWidth-this.props.x }px`,
						top:0,
						height: `${ divHeight }px`,
						width: `${ this.props.x }px`
					}}					
				/>
				<div className='shader'
					style={{
						position: 'absolute',
						left:`${ this.props.x }px`,
						top:0,
						height: `${ this.props.y }px`,
						width: `${ divWidth-this.props.x*2 }px`
					}}					
				/>
				<div className='shader'
					style={{
						position: 'absolute',
						left:`${ this.props.x }px`,
						top:`${ divHeight-this.props.y }px`,
						height: `${ this.props.y }px`,
						width: `${ divWidth-this.props.x*2 }px`
					}}					
				/>
		      <Draggable
		      	//bounds={{top: this.props.y-20, left: this.props.x-20, right: divWidth/2-this.props.x-20, bottom: divHeight/2-this.props.y-20}}
		      	bounds='parent'
		        position={{x: this.props.x-6, y: this.props.y-6}}
		        onStart={this.handleStart.bind(this, '1')}
		        onDrag={this.handleDrag.bind(this, '1')}
		        onStop={this.handleStop.bind(this, '1')}>
		        <div className="handler"/>
		      </Draggable>
		      <Draggable
		        position={{x: divWidth-this.props.x-6, y: this.props.y-6}}
		        onStart={this.handleStart.bind(this, '2')}
		        onDrag={this.handleDrag.bind(this, '2')}
		        onStop={this.handleStop.bind(this, '2')}>
		        <div className="handler"/>
		      </Draggable>
		      <Draggable
		        position={{x: this.props.x-6, y: divHeight-this.props.y-6}}
		        onStart={this.handleStart.bind(this, '3')}
		        onDrag={this.handleDrag.bind(this, '3')}
		        onStop={this.handleStop.bind(this, '3')}>
		        <div className="handler"/>
		      </Draggable>
		      <Draggable
		        position={{x: divWidth-this.props.x-6, y: divHeight-this.props.y-6}}
		        onStart={this.handleStart.bind(this, '4')}
		        onDrag={this.handleDrag.bind(this, '4')}
		        onStop={this.handleStop.bind(this, '4')}>
		        <div className="handler"/>
		      </Draggable>
			</div>
		)
	}
};

export default Selector;
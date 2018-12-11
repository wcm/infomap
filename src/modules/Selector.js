import React, { Component } from "react";
import { render } from "react-dom";
import Draggable, { DraggableCore }from 'react-draggable';

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
	  this.setState({ width: window.innerWidth*0.9 });
	}
	
	updateXY = (handlerID, e, { deltaX, deltaY }) => {
		if (handlerID === '1') {
			if (this.props.x+deltaX >= 40 && this.props.x+deltaX <= this.state.width/2-40 && this.props.y+deltaY >= 60 && this.props.y+deltaY <= this.state.height/2-40){
				this.props.setXY({x: this.props.x+deltaX, y: this.props.y+deltaY});
			}
		}else if (handlerID === '2') {
			if (this.props.x-deltaX >= 40 && this.props.x-deltaX <= this.state.width/2-40 && this.props.y+deltaY >= 60 && this.props.y+deltaY <= this.state.height/2-40){
				this.props.setXY({x: this.props.x-deltaX, y: this.props.y+deltaY});
			}
		}else if (handlerID === '3') {
			if (this.props.x+deltaX >= 40 && this.props.x+deltaX <= this.state.width/2-40 && this.props.y-deltaY >= 60 && this.props.y-deltaY <= this.state.height/2-40){
				this.props.setXY({x: this.props.x+deltaX, y: this.props.y-deltaY});
			}
		}else if (handlerID === '4') {
			if (this.props.x-deltaX >= 40 && this.props.x-deltaX <= this.state.width/2-40 && this.props.y-deltaY >= 60 && this.props.y-deltaY <= this.state.height/2-40){
				this.props.setXY({x: this.props.x-deltaX, y: this.props.y-deltaY});
			}
		}
	}

	handleStart = (handlerID, e, { deltaX, deltaY }) => {
		this.props.setDragging(true);
		this.updateXY(handlerID, e, { deltaX, deltaY });
	}

	handleStop = (handlerID, e, { deltaX, deltaY }) => {
		this.props.setDragging(false);
		this.updateXY(handlerID, e, { deltaX, deltaY });
	}

	handleDrag = (handlerID, e, { deltaX, deltaY }) => {
		this.updateXY(handlerID, e, { deltaX, deltaY });
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
		      <DraggableCore
		        onStart={this.handleStart.bind(this, '1')}
		        onDrag={this.handleDrag.bind(this, '1')}
		        onStop={this.handleStop.bind(this, '1')}>
		        <div className="handler" style={{top:this.props.y-6, left:this.props.x-6}}/>
		      </DraggableCore>
		      <DraggableCore
		        onStart={this.handleStart.bind(this, '2')}
		        onDrag={this.handleDrag.bind(this, '2')}
		        onStop={this.handleStop.bind(this, '2')}>
		        <div className="handler" style={{top:this.props.y-6, left:divWidth-this.props.x-6}}/>
		      </DraggableCore>
		      <DraggableCore
		        onStart={this.handleStart.bind(this, '3')}
		        onDrag={this.handleDrag.bind(this, '3')}
		        onStop={this.handleStop.bind(this, '3')}>
		        <div className="handler" style={{top:divHeight-this.props.y-6, left:this.props.x-6}}/>
		      </DraggableCore>
		      <DraggableCore
		        onStart={this.handleStart.bind(this, '4')}
		        onDrag={this.handleDrag.bind(this, '4')}
		        onStop={this.handleStop.bind(this, '4')}>
		        <div className="handler" style={{top:divHeight-this.props.y-6, left:divWidth-this.props.x-6}}/>
		      </DraggableCore>
			</div>
		)
	}
};

export default Selector;
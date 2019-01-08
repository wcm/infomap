import React, { Component } from "react";
import { DraggableCore }from 'react-draggable';

class Selector extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			dragging: false,
			mouseX: this.props.x,
			mouseY: this.props.y
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
	  this.setState({ 
	  	width: this.container.offsetWidth,
	  	height: this.container.offsetHeight
	  });
	}
	
	updateXY = (handlerID, e, { deltaX, deltaY }) => {
		var newX = this.state.mouseX;
		var newY = this.state.mouseY;

		if (handlerID === '1') {
			newX += deltaX;
			newY += deltaY;
		}else if (handlerID === '2') {
			newX -= deltaX;
			newY += deltaY;
		}else if (handlerID === '3') {
			newX += deltaX;
			newY -= deltaY;
		}else if (handlerID === '4') {
			newX -= deltaX;
			newY -= deltaY;
		}
		if (newX >= 40 && newX <= this.state.width/2-40 && newY >= 60 && newY <= this.state.height/2-40){
			this.props.setXY({x: newX, y: newY});
		}

		this.setState({
			mouseX: newX,
			mouseY: newY
		})
	}

	handleStart = (handlerID, e, { deltaX, deltaY }) => {
		this.props.setDragging(true);
		this.updateXY(handlerID, e, { deltaX, deltaY });
	}

	handleStop = (handlerID, e, { deltaX, deltaY }) => {
		this.props.setDragging(false);
		this.updateXY(handlerID, e, { deltaX, deltaY });
		this.setState({
			mouseX: this.props.x,
			mouseY: this.props.y
		})
	}

	handleDrag = (handlerID, e, { deltaX, deltaY }) => {
		this.updateXY(handlerID, e, { deltaX, deltaY });
	}

	render() {
		const divWidth = this.state.width;
		const divHeight = this.state.height;
		return (
			<div className='selector' ref={el => (this.container = el)}>
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
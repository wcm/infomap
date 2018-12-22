import React from "react";
import ReactDOM from 'react-dom';
import { DraggableCore }from 'react-draggable';

var svgIntersections = require('svg-intersections');
var intersect = svgIntersections.intersect;
var svgShape = svgIntersections.shape;

class VisibilityMap extends React.Component {
	constructor(props: Props) {
		super(props);
		this.ratio = this.props.ratio;
	    this.gridSize = 5;

		var buildings = "";
		var blocks = [];
		var {nodes, ways, relations} = this.props;

	    for (var id in relations) {

	    	if (relations[id].tag.building || relations[id].tag["buidling:part"]){
	    		var shapes = '';
	    		
	    		relations[id].members.forEach((element)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			shapes += `M ${pts}`;
		    			blocks.push(pts);
		    		}
	    		})

			    buildings += shapes;
		    }
	    };


	    for (id in ways) {

	    	if (ways[id].tag.building){

	    		var pts = ways[id].points.map(e => e.join(',')).join(' ');
			    buildings += `M ${pts}`;
		    	blocks.push(pts);
			}
	    };

	    this.buildings = buildings;
	    this.blocks = blocks;
		this.state = {
			x:300,
			y:300,
			filled: this.resetGrid(),
		};

		;

	}


    componentDidMount() {
        this.interval = setInterval(() => this.updateGrid(), 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

	resetGrid = () => {
		var {width, height} = this.props;
	    var grid = [];
	    var filled = [];

	    for (var i = 0; i < width/this.gridSize; i++){
	    	filled.push([]);
	    	for (var j = 0; j < height/this.gridSize; j++){
	    		filled[i].push("grey");
		    	grid.splice(Math.floor((Math.random() * (grid.length + 1))), 0, {x:i, y:j});
	    	}
	    }

	    this.grid = grid;
	    return filled;

	}

	updateGrid = () => {
		if (this.grid.length !== 0){
			var updatefilled = this.state.filled;
			for (var i = 0; i < 200; i++){
				var newfill = this.grid.pop();
				if (newfill){
					var intersected = false;
					for (var key in this.blocks){
					    var intersections = intersect(  
							svgShape("line", { x1: this.gridSize*newfill.x+this.gridSize/2, y1: this.gridSize*newfill.y+this.gridSize/2, x2: this.state.x/this.ratio, y2: this.state.y/this.ratio }),
							svgShape("polygon", {points:this.blocks[key]})  
						);
						if (intersections.points.length !== 0){
							intersected = true;
							break;
						}
					}
			    	if (intersected){
			    		updatefilled[newfill.x][newfill.y] = "white";
			    	}else{
			    		updatefilled[newfill.x][newfill.y] = "black";
			    	};
			    }
		    }
			this.setState({filled: updatefilled});
		}
	}

	handleStart = (e, { deltaX, deltaY }) => {
		this.setState({x:this.state.x+deltaX, y:this.state.y+deltaY});
	}

	handleStop = (e, { deltaX, deltaY }) => {
		this.setState({x:this.state.x+deltaX, y:this.state.y+deltaY});
		this.resetGrid();
	}

	handleDrag = (e, { deltaX, deltaY }) => {
		this.setState({x:this.state.x+deltaX, y:this.state.y+deltaY});
	}

	render() {

		var analysis = [];

	    for (var i = 0; i < this.props.width/this.gridSize; i++){
	    	for (var j = 0; j < this.props.height/this.gridSize; j++){
	    		analysis.push(
	   		 		<rect x={this.gridSize*i} y={this.gridSize*j} width={this.gridSize} height={this.gridSize} fill={this.state.filled[i][j]} key={`${i},${j}`}/>
	    		);
	    	}
	    }

		return(
			<div className="nollimap">
				<svg version="1.1" viewBox={`0 0 ${this.props.width} ${this.props.height}`} style = {{width: this.state.width}} ref={el => (this.container = el)}>
					{analysis}
					<path d={this.buildings} fill="none" stroke="rgba(60, 60, 60)" strokeWidth=".5"/>
					<circle cx={this.state.x/this.ratio} cy={this.state.y/this.ratio} r="5" fill = "green"/>
				</svg>
				<DraggableCore
			        onStart={this.handleStart.bind(this)}
			        onDrag={this.handleDrag.bind(this)}
			        onStop={this.handleStop.bind(this)}>
		        	<div className="human" style={{top:this.state.y-10, left:this.state.x-10}}>
		        		<span className="dot"/>
		        	</div>
		      	</DraggableCore>

			</div>
		)
	}

};

export default VisibilityMap;
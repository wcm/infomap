import React from "react";
import { DraggableCore }from 'react-draggable';
import {toRad, distSq, getArea} from "./helpers";

var svgIntersections = require('svg-intersections');
var intersect = svgIntersections.intersect;
var svgShape = svgIntersections.shape;

class VisibilityMap extends React.Component {
	constructor(props: Props) {
		super(props);
	    this.angle = 2;

		var buildings = "";
		var {ways, relations} = this.props;

	    for (var id in relations) {

	    	if (relations[id].tag.building || relations[id].tag["buidling:part"]){
	    		var shapes = '';
	    		
	    		relations[id].members.forEach((element)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			shapes += `M ${pts}`;
		    		}
	    		})

			    buildings += shapes;
		    }
	    };


	    for (id in ways) {

	    	if (ways[id].tag.building){

	    		var pts = ways[id].points.map(e => e.join(',')).join(' ');
			    buildings += `M ${pts}`;
			}
	    };

	    buildings += `M 0,0 0,${this.props.height} ${this.props.width},${this.props.height} ${this.props.width},0 Z`

	    this.buildings = buildings;
	    for (var key in this.props.regions){
	    	if(this.props.regions[key] === ""){this.props.setRegion(key, `M${this.props.humans[key][0]/this.props.ratio},${this.props.humans[key][1]/this.props.ratio} `)};
	    }
	    this.state = {
			tooltip: 0,
			shaded: "",
			info: "",
			left: true,
		}

	}

    componentDidMount() {
        this.interval = setInterval(() => this.updateRegions(), 5);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps) {
    	if (prevProps.ratio !== this.props.ratio){
    		for (var key in this.props.humans){
    			this.props.setPos(key, [this.props.humans[key][0]*this.props.ratio/prevProps.ratio, this.props.humans[key][1]*this.props.ratio/prevProps.ratio])
    		}
    	}
    }

    updatePos = (key, e, { deltaX, deltaY }) => {
		var newX = (this.props.humans[key][0] + deltaX)/this.props.ratio;
		var newY = (this.props.humans[key][1] + deltaY)/this.props.ratio;
		if (newX > 5 && newX < (this.props.width-5) && newY > 5 && newY < (this.props.height-5)){
			this.props.setPos(key, [this.props.humans[key][0] + deltaX, this.props.humans[key][1] + deltaY]);
		}

    }

	handleStart = (key, e, { deltaX, deltaY }) => {
		this.updatePos(key, e, { deltaX, deltaY });
	    this.props.setRegion(key, '');
	    this.props.setArc(key, -1)
	}

	handleDrag = (key, e, { deltaX, deltaY }) => {
		this.updatePos(key, e, { deltaX, deltaY })
	}

	handleStop = (key, e, { deltaX, deltaY }) => {
		this.updatePos(key, e, { deltaX, deltaY })	    
		this.props.setRegion(key, `M${this.props.humans[key][0]/this.props.ratio},${this.props.humans[key][1]/this.props.ratio} `);
	    this.props.setArc(key, 0)
	}

	showTooltip = (region, index, e) =>{
		var bbox = e.target.getBBox();
		if ((bbox.x + bbox.width/2) >= (this.props.width/2)){
			this.setState({left: true})
		} else {
			this.setState({left: false})
		}
		if (this.props.arcs[index]>=360){
			var str = region.substring(1, region.length-2).split(" ");
			var pts = [];
			var num = [];
			str.forEach((substr) => {
				num = substr.split(",");
				pts.push([parseFloat(num[0]), parseFloat(num[1])]);
			});
			var area = getArea(pts) / this.props.lengthratio / this.props.lengthratio;
			this.setState({
				tooltip: true,
				info: `Visible Area: ${area.toFixed(2)} ` + decodeURI("m%C2%B2"),
				shaded: region,
			})
		}else{			this.setState({
				tooltip: true,
				info: "Calculating area...",
			})
		}


	}

	hideTooltip = () =>{

		this.setState({
			tooltip: false,
			info: "",
			shaded: "",
		})

	}



	updateRegions = () => {
		var regions = this.props.regions;
		var arcs = this.props.arcs;
		var changed = false;
		for (var key in arcs){
			if (arcs[key]<360 && arcs[key] !== -1){
				changed = true;
				var arc = arcs[key];
				var region = regions[key];
				if (region === ""){region = `M${this.props.humans[key][0]/this.props.ratio},${this.props.humans[key][1]/this.props.ratio} `}
				if (arc + this.angle >=360){
					var parts = region.split(" ");
					parts.shift();
					region = "M" + parts.join(" ") + "Z";
				}else{
					var width = this.props.width;
					var height = this.props.height;
					var radius = Math.max(width, height);
					var x = this.props.humans[key][0]/this.props.ratio;
					var y = this.props.humans[key][1]/this.props.ratio;
					var intersections = intersect(  
						svgShape("line", { x1: x + radius * Math.sin(toRad(arc)), y1: y + radius * Math.cos(toRad(arc)), x2: x, y2: y }),
						svgShape("path", {d:this.buildings})  
					);

					//var closePt = {x: x + radius * Math.sin(toRad(arc)), y: y + radius * Math.cos(toRad(arc))};
					var closePt = intersections.points[0];
					var close = distSq(0, 0, width, height);
					if (closePt){close = distSq(x, y, closePt.x, closePt.y)}

					intersections.points.forEach((point) => {
						if (distSq(x, y, point.x, point.y) < close){
							close = distSq(x, y, point.x, point.y);
							closePt = point;
						}
					})
					region = region + `${closePt.x},${closePt.y} `
				}
				regions[key] = region;
				arcs[key] = arc + this.angle;
			}
		}
		if(changed){
			this.props.setRegions(regions);
			this.props.setArcs(arcs);
		}
	}

	render() {
		var colors = ["rgba(0, 255, 255, .4)", "rgba(255, 139, 0, .4)", "rgba(0, 139, 255, .2)", "rgba(139, 255, 0, .2)", "rgba(255, 0, 139, .2)", "rgba(0, 255, 139, .2"]
		var regions = this.props.regions.map((region, index) => <path d={region} fill={colors[0]} stroke="red" strokeWidth="1" key={index} onMouseEnter={this.showTooltip.bind(this, region, index)} onMouseLeave={this.hideTooltip.bind(this)}/>);
		var humans = this.props.humans.map((human, index) => <circle cx={human[0]/this.props.ratio} cy={human[1]/this.props.ratio} r="3" fill = "red" key={index}/>)
		var handles = this.props.humans.map((human, index) => 				
			<DraggableCore
			    onStart={this.handleStart.bind(this, index)}
			    onDrag={this.handleDrag.bind(this, index)}
			    onStop={this.handleStop.bind(this, index)}
			    key={index}>
		    	<div className="human" style={{top:human[1]-15, left:human[0]-15}}>
		    	</div>
		    </DraggableCore>
		)

		var tooltipstyle = {};

		if (this.state.left){
			tooltipstyle = {
				top: "0",
				left: "0"
			}
		}else{
			tooltipstyle = {
				top: "0",
				right: "0"
			}
		}

		return(
			<div className="visibilitymap">
				<svg version="1.1" viewBox={`0 0 ${this.props.width} ${this.props.height}`} ref={el => (this.container = el)}>
					<path d={this.state.shaded} fill="#7693D3" stroke="none"/>
					<path d={this.buildings} fillRule="evenodd" fill="rgba(0, 0, 0, .05)" stroke="rgba(60, 60, 60)" strokeWidth=".5"/>
					<g>
					{regions}
					</g>
					{humans}
				</svg>
				{handles}
				<div className={this.state.tooltip? "tooltip":"hide"} style={tooltipstyle}>
					<div className="tooltip-title">{this.state.info}</div>
				</div>
			</div>
		)
	}

};

export default VisibilityMap;
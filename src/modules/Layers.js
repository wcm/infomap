import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import '../scss/analysis.scss';

class NolliMap extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
		}
	}

	render() {
		let content = [];
		var {width, height, nodes, ways, relations} = this.props;
		console.log("nolli");

	    for (var id in relations) {
	    	if (relations[id].building || relations[id]["buidling:part"]){
	    		var shapes = '';
	    		relations[id].array.forEach((element)=>{
	    			if (element.type == 'way' && element.value) {
		    			var pts = this.props.getWayPoints(element.value.array);
		    			shapes += `M${pts}Z `;
		    		}
	    		})
	    		content.push(
	    			<path d={shapes} fillRule="evenodd" fill="black" stroke="white" strokeWidth=".5" key={id} className="noly-building">
	    				<title>{id}</title>
	    			</path>
	    		)
			}
	    };

	    for (var id in ways) {
	    	var pts = this.props.getWayPoints(ways[id].array);

	    	if (ways[id].building){
	    		content.push(
	    			<polygon points={pts} fill="black" stroke="white" strokeWidth=".5" key={id} className="noly-building"/>
	    		)
	    	}else{
				content.push(
					<polyline points={pts} fill="none" stroke="blue" strokeWidth="1" key={id}/>
				)
			}
	    };

	    for (var id in nodes) {
	    	if (nodes[id].tag){
				content.push(
					<circle cx={nodes[id].x} cy={nodes[id].y} r="2" fill="red" key={id}/>
				)
			}
	    };

		return(
				<svg version="1.1" viewBox={`0 0 ${width} ${height}`} style = {{width: this.state.width}}>
					{content}
				</svg>
		)
	}

}

class Layers extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			width: 1000,
			height: 0,
			nodes: {},
			ways: {},
			relations: {},
		}
	}

	getDistance = (lat1, lon1, lat2, lon2) => {
	  	var R = 6371e3; // metres
		var φ1 = lat1* Math.PI / 180;
		var φ2 = lat2* Math.PI / 180;
		var Δφ = (lat2-lat1)* Math.PI / 180;
		var Δλ = (lon2-lon1)* Math.PI / 180;

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		        Math.cos(φ1) * Math.cos(φ2) *
		        Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		return R * c;
	}

	getDirDistance = (lat1, lon1, lat2, lon2) => {
		if (lat2 <= lat1 && lon2 >= lon1) {
			return this.getDistance(lat1, lon1, lat2, lon2);
		}else{
			return -this.getDistance(lat1, lon1, lat2, lon2);
		}
	}
	
	getBoundArea = (lat1, lat2, lon1, lon2) => {
		return this.getDistance(lat1, lon1, lat1, lon2) * this.getDistance(lat1, lon1, lat2, lon1)
	}

	checkSingle = (data) => {
		if (Array.isArray(data)){
			return data;
		}else if(data){
			return [data];
		}else{
			return [];
		}
	}

	getWayPoints = (data) => {
		var pts = '';
		data.forEach((node) =>{
			pts += `${node.x},${node.y} `
	    })
	    return pts;
	}


	componentDidUpdate(prevProps) {
		if(this.props.rawdata !== prevProps.rawdata){
			const {nlat, slat, wlng, elng, rawdata} = this.props;
			const ratio = this.state.width/this.getDistance(nlat, wlng, nlat, elng);
			const height = this.getDistance(nlat, wlng, slat, wlng)*ratio;
			var nodes = {};
			var ways = {};
			var relations = {};

			if (this.props.rawdata){
				var convert = require('xml-js');
				var result = convert.xml2js(this.props.rawdata, {compact: true, spaces: 4});
				console.log(result);

				var osmNode = this.checkSingle(result.osm.node);
				var osmWay = this.checkSingle(result.osm.way);
				var osmRelation = this.checkSingle(result.osm.relation);
				
				osmNode.forEach((element) => {
					var id = element._attributes.id;
					var nodeTag = this.checkSingle(element.tag);

					nodes[id] = element;
					nodes[id].x = this.getDirDistance(nlat, wlng, nlat, element._attributes.lon)*ratio;
					nodes[id].y = this.getDirDistance(nlat, wlng, element._attributes.lat, wlng)*ratio;
					nodeTag.forEach((tag) => {
						nodes[id][tag._attributes.k] = tag._attributes.v
					});
				});

				osmWay.forEach((element) => {
					var id = element._attributes.id;
					var wayNd = this.checkSingle(element.nd);
					var wayTag = this.checkSingle(element.tag);

					ways[id] = element;
					ways[id].array = [];
					wayNd.forEach((nd) => {
						ways[id].array.push(nodes[nd._attributes.ref])
					});
					wayTag.forEach((tag) => {
						ways[id][tag._attributes.k] = tag._attributes.v
					});
				});
				osmRelation.forEach((element) => {
					var id = element._attributes.id;
					var relationMember = this.checkSingle(element.member);
					var relationTag = this.checkSingle(element.tag);

					relations[id] = element;
					relations[id].array = [];
					relationMember.forEach((member) => {
						if (member._attributes.type == 'way'){
							relations[id].array.push({type: 'way', value: ways[member._attributes.ref], role: member._attributes.role});
						}else if (member._attributes.type == 'node'){
							relations[id].array.push({type: 'node', value: nodes[member._attributes.ref], role: member._attributes.role});
						}else if (member._attributes.type == 'relation'){
							relations[id].array.push({type:'relation', value: relations[member._attributes.ref], role: member._attributes.role});
						}
					});
					relationTag.forEach((tag) => {
						relations[id][tag._attributes.k] = tag._attributes.v
					});
				})
			}

			this.setState({
				height: height,
				nodes: nodes,
				ways: ways,
				relations: relations,
			});
		}
	}

	render() {
		return(
			<NolliMap
				{...this.state}
				getWayPoints = {this.getWayPoints}
			/>
		)
	}

}

export default Layers;
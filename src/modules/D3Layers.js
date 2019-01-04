import React from "react";
import { Link } from "react-router-dom";
import '../scss/analysis.scss';
import NolliMap from "./NolliMap";
import TrafficMap from "./TrafficMap";
import VisibilityMap from "./VisibilityMap2";
import POIMap from "./POIMap";
import NaturalElements from "./NaturalElements";
import {distSq} from "./helpers";

class D3Layers extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			loading: 0,
			width: 1000,
			height: 0,
			nodes: {},
			ways: {},
			relations: {},
			humans: [[500,250]],
			arcs:[0],
			regions:[""],
			options : {
			"POI Map": "Short Links",
			"Nolli Map": "None",
			"Visibility": "Both",
			"Traffic": "Both",
			"Natural Elements": "",
			},
		}
	}
	
	componentDidMount() {
		this.updateStates();
	}
	componentDidUpdate(prevProps) {
		if(this.props.rawdata !== prevProps.rawdata){
			this.resetLoading();
			this.updateStates();
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

	mapPix = (x, a, b, c, d) => {
		return c + (x-a) * (d-c) / (b-a)
	}

	getArea(array) {
	    var x = array;
	    var a = 0;
	    if (x.length < 3) return 0;
	    for (var i = 0; i < (x.length-1); i += 1) {
	        a += x[i][0] * x[i+1][1] - x[i+1][0] * x[i][1];
	    }
	    return Math.abs(a * 1.0 / 2);
	}

	addLoading = (value) => {
		this.setState({
			loading: this.state.loading + value
		})
	}

	resetLoading = () => {
		this.setState({
			loading: 0
		})
	}

	updateStates = () => {
			const {nlat, slat, wlng, elng, rawdata} = this.props;
			const width = this.state.width
			const ratio = width/this.getDistance(nlat, wlng, nlat, elng);
			const height = this.getDistance(nlat, wlng, slat, wlng)*ratio;
			var nodes = {};
			var ways = {};
			var relations = {};

			if (rawdata){
				var convert = require('xml-js');
				var result = convert.xml2js(rawdata, {compact: true, spaces: 4});

				var osmNode = this.checkSingle(result.osm.node);
				var osmWay = this.checkSingle(result.osm.way);
				var osmRelation = this.checkSingle(result.osm.relation);
				
				osmNode.forEach((element) => {
					var id = element._attributes.id;
					var nodeTag = this.checkSingle(element.tag);

					nodes[id] = {element: element};
					nodes[id].x = this.mapPix(element._attributes.lon, wlng, elng, 0, width);
					nodes[id].y = this.mapPix(element._attributes.lat, nlat, slat, 0, height);
					nodes[id].tag = {};
					nodeTag.forEach((tag) => {
						nodes[id].tag[tag._attributes.k] = tag._attributes.v
					});
				});

				osmWay.forEach((element) => {
					var id = element._attributes.id;
					var wayNd = this.checkSingle(element.nd);
					var wayTag = this.checkSingle(element.tag);

					ways[id] = {element: element};
					ways[id].children = [];
					ways[id].points = []
					ways[id].tag = {};
					wayNd.forEach((nd) => {
						ways[id].children.push(nodes[nd._attributes.ref]);
						ways[id].points.push([nodes[nd._attributes.ref].x, nodes[nd._attributes.ref].y]);
					});
					wayTag.forEach((tag) => {
						ways[id].tag[tag._attributes.k] = tag._attributes.v;
					});

					if (ways[id].tag.building){
						var area = 	this.getArea(ways[id].points) / ratio / ratio;
						ways[id].footprint = area;
						ways[id].tag.footprint = area.toFixed(2)
					}
				});
				osmRelation.forEach((element) => {
					var id = element._attributes.id;
					var relationMember = this.checkSingle(element.member);
					var relationTag = this.checkSingle(element.tag);

					relations[id] = {element: element};
					relations[id].members = []
					relations[id].tag = {};
					relationMember.forEach((member) => {
						if (member._attributes.type === 'way' && ways[member._attributes.ref]){
							relations[id].members.push({type: 'way', value: ways[member._attributes.ref].points, role: member._attributes.role});
						}else if (member._attributes.type === 'node' && nodes[member._attributes.ref]){
							relations[id].members.push({type: 'node', value: [nodes[member._attributes.ref].x, nodes[member._attributes.ref].y], role: member._attributes.role});
						}else if (member._attributes.type === 'relation' && relations[member._attributes.ref]){
							relations[id].members.push({type:'relation', value: relations[member._attributes.ref].members, role: member._attributes.role});
						}
					});
					relationTag.forEach((tag) => {
						relations[id].tag[tag._attributes.k] = tag._attributes.v;
					});
	    			if (relations[id].tag.building || relations[id].tag["buidling:part"]){
	    				var area = 0;
						relations[id].members.forEach((member) => {
							if (member.role === "outer"){
								area += this.getArea(member.value);
							}else if (member.role === "outer"){
								area -= this.getArea(member.value);
							}
						})
						area = area / ratio / ratio;
						relations[id].footprint = area;						
						relations[id].tag.footprint = area.toFixed(2);						
					}
				})
				this.addLoading(100);
			}

			var selected = [];
			var shortLinks = [];
			var longLinks = []
			var except = ["waste_basket", "waste_disposal", "waste_transfer_station", "recycling"]

	    	for (var id in nodes) {
	    		if (nodes[id].tag["amenity"] != null && except.indexOf(nodes[id].tag["amenity"]) === -1){
	    			nodes[id].longLink = 0;
	    			nodes[id].shortLink = 0;
					selected.push(nodes[id]);
				}
	    	};

	    	for (var i=0; i<selected.length; i++) {
	    		for (var j = i+1; j<selected.length; j++){
	    			var linkLengh = Math.sqrt(distSq(selected[i].x, selected[i].y, selected[j].x, selected[j].y))/ratio;
					if( linkLengh <= 150){
						selected[i].longLink ++;
						selected[j].longLink ++;
						longLinks.push({
							x1:selected[i].x, 
							y1:selected[i].y, 
							x2:selected[j].x, 
							y2:selected[j].y
						});

						if(linkLengh <= 100){
							selected[i].shortLink ++;
							selected[j].shortLink ++;
							shortLinks.push({
								x1:selected[i].x, 
								y1:selected[i].y, 
								x2:selected[j].x, 
								y2:selected[j].y
							})
						}
					}
	    		}
	    	}

	
			this.pixratio = this.container.offsetWidth/width;
			this.ratio = ratio;
			this.selected = selected;
			this.longLinks = longLinks;
			this.shortLinks = shortLinks;

			this.setState({
				height: height,
				nodes: nodes,
				ways: ways,
				relations: relations,
				humans: [[Math.random() * width * this.pixratio, Math.random() * height * this.pixratio]],
			});


			console.log(nodes);
			console.log(ways);
			console.log(relations);
			console.log(ratio);

	}

	getOptions = () => {
		var data = require("./map-options.json")[this.props.selected];
		var selectedOption = this.state.options[this.props.selected];
		var content = [];
		if (data) {
			content.push(
				<div className="options-title" key="title">
					{data.title}
				</div>
			)
			data.options.forEach((option) => {
				content.push(
					<div className={option === selectedOption? "options-item selected" : "options-item"} onClick={()=>{this.setOption(option)}} key={option}>
						{option}
					</div>
				)
			})
		}
		if (this.props.selected === "Visibility"){
			content.push(
				<div className="options-title" key="title">
					You can add up to 5 viewing points:
				</div>
			)
			content.push(
				<button className="options-button" onClick={this.addHuman} key="add" disabled={this.state.arcs.length >= 5}>
					Add a Point
				</button>
			)
			content.push(
				<button className="options-button" onClick={this.deleteHuman} key="delete" disabled={this.state.arcs.length <= 1}>
					Delete a Point
				</button>
			)
		}
		return content;
	}

	setOption = (option) => {
		var newoptions = this.state.options;
		newoptions[this.props.selected] = option;
		this.setState({options:newoptions});
	}

	setPos = (num, position) => {
		var newhumans = this.state.humans;
		newhumans[num] = position
		this.setState({humans: newhumans});
	}

	setArc = (num, value) => {
		var newarcs = this.state.arcs;
		newarcs[num] = value
		this.setState({arc: newarcs});
	}

	setRegion = (num, value) => {
		var newregions = this.state.regions
		newregions[num] = value
		this.setState({regions: newregions});
	}

	setArcs = (value) => {
		this.setState({arc: value});
	}

	setRegions = (value) => {
		this.setState({regions: value});
	}

	addHuman = () => {
		var newhumans = this.state.humans;
		var newarcs = this.state.arcs;
		var newregions = this.state.regions;
		newhumans.push([Math.random() * this.state.width * this.pixratio, Math.random() * this.state.height * this.pixratio]);
		newarcs.push(0);
		newregions.push("");
		this.setState({
			humans: newhumans,
			arcs: newarcs,
			regions: newregions,
		});
	}

	deleteHuman = () => {
		var newhumans = this.state.humans;
		var newarcs = this.state.arcs;
		var newregions = this.state.regions;
		newhumans.pop();
		newarcs.pop();
		newregions.pop();
		this.setState({
			humans: newhumans,
			arcs: newarcs,
			regions: newregions,
		});
	}

	render() {
		var optionbar = this.getOptions();
		var {ways, nodes, relations, width, height} = this.state;
		var maps = {};
		var ovl = [];

		maps["POI Map"] = 
			<POIMap
				nodes = {nodes}
				ways = {ways}
				relations = {relations}
				width = {width}
				height = {height}
				getWayPoints = {this.getWayPoints}
				addLoading = {this.addLoading}
				nlat = {this.props.nlat}
				slat = {this.props.slat}
				wlng = {this.props.wlng}
				elng = {this.props.elng}
				option = {this.state.options["POI Map"]}
				key = "POI Map"
				lengthratio = {this.ratio}
				selected = {this.selected}
				longLinks = {this.longLinks}
				shortLinks = {this.shortLinks}
			/>;

		maps["Nolli Map"] = 
			<NolliMap
				nodes = {nodes}
				ways = {ways}
				relations = {relations}
				width = {width}
				height = {height}
				getWayPoints = {this.getWayPoints}
				addLoading = {this.addLoading}
				nlat = {this.props.nlat}
				slat = {this.props.slat}
				wlng = {this.props.wlng}
				elng = {this.props.elng}
				option = {this.state.options["Nolli Map"]}
				key = "Nolli Map"
			/>;

		maps["Visibility"] = 
			<VisibilityMap
				nodes = {nodes}
				ways = {ways}
				relations = {relations}
				width = {width}
				height = {height}
				humans = {this.state.humans}
				arcs = {this.state.arcs}
				regions = {this.state.regions}
				setPos = {this.setPos}
				setArc = {this.setArc}
				setRegion = {this.setRegion}
				setArcs = {this.setArcs}
				setRegions = {this.setRegions}
				addLoading = {this.addLoading}
				nlat = {this.props.nlat}
				slat = {this.props.slat}
				wlng = {this.props.wlng}
				elng = {this.props.elng}
				key = "Visibility"
				option = {this.state.options["Traffic"]}
				ratio = {this.pixratio}
				lengthratio = {this.ratio}
			/>;

		maps["Traffic"] = 
			<TrafficMap
				nodes = {nodes}
				ways = {ways}
				relations = {relations}
				width = {width}
				height = {height}
				getWayPoints = {this.getWayPoints}
				addLoading = {this.addLoading}
				nlat = {this.props.nlat}
				slat = {this.props.slat}
				wlng = {this.props.wlng}
				elng = {this.props.elng}
				key = "Traffic"
				option = {this.state.options["Traffic"]}
				lengthratio = {this.ratio}
			/>;

		maps["Natural Elements"] = 
			<NaturalElements
				nodes = {nodes}
				ways = {ways}
				relations = {relations}
				width = {width}
				height = {height}
				getWayPoints = {this.getWayPoints}
				addLoading = {this.addLoading}
				nlat = {this.props.nlat}
				slat = {this.props.slat}
				wlng = {this.props.wlng}
				elng = {this.props.elng}
				option = {this.state.options["Natural Elements"]}
				key = "Natural Elements"
			/>;

		for (var key in this.props.added){
			if (this.props.added[key]){
				ovl.unshift(maps[key]);
			}
		}

		return(
			<div className="maps-wrapper" ref={el => (this.container = el)}>
				<div className="options">
					{optionbar}
				</div>
				<svg version="1.1" viewBox={`0 0 ${this.state.width} ${this.state.height}`} style = {{width: "100%"}}/>

				<div className={this.state.loading === 100?"hide":"loading"}>Loading... </div>
				
				{this.props.selected === "Overlay"?
					ovl
					:
					maps[this.props.selected]
				}
			</div>
		)
	}

}

export default D3Layers;
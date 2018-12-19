import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import D3Layers from "./D3Layers";
import Sidebar from "./Sidebar";
import '../scss/maps.scss';

class Maps extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			raw: null,
			layers:["Nolli Map", "Traffic"],
			added:{
				"Nolli Map": true,
				"Traffic": true,
			},
			selected:"Nolli Map",
		}
		this.bounds = this.props.match.params;
	}

	componentDidMount() { 
	    axios.get(`https://api.openstreetmap.org/api/0.6/map?bbox=${this.bounds.wlng},${this.bounds.slat},${this.bounds.elng},${this.bounds.nlat}`)
	      	.then(res => {
	        	if(res.data){
					this.setState({
						raw: res.data,
					})
	        	};
	      	});

	}

	changeMap = (key) => {
		this.setState({
			selected: key
		})
	}

	addOverlay = (title) => {
		const newlist = this.state.added;
		newlist[title] = true;
		this.setState({
		  added: newlist,
		})	
	}

	removeOverlay = (title) => {
		const newlist = this.state.added;
		newlist[title] = false;
		this.setState({
		  added: newlist,
		})	
	}	
	
	render() {	
		return (
			<div className="maps">
				<Sidebar
					layers = {this.state.layers}
					added = {this.state.added}
					selected = {this.state.selected}
					changeMap = {this.changeMap}
					addOverlay = {this.addOverlay}
					removeOverlay = {this.removeOverlay}
				/>
				<div className="map-display">
					<D3Layers
						layers = {this.state.layers}
						added = {this.state.added}
						selected = {this.state.selected}
						{...this.props.match.params}
						rawdata = {this.state.raw}
					/>
				</div>
				<div className="clearfix"/>
				<div className="raw">
					<div>{`n: ${this.bounds.nlat} s: ${this.bounds.slat} w: ${this.bounds.wlng} e: ${this.bounds.elng}`}</div>
					<div>API address: {`https://api.openstreetmap.org/api/0.6/map?bbox=${this.bounds.wlng},${this.bounds.slat},${this.bounds.elng},${this.bounds.nlat}`}</div>
				</div>
		    </div>
		);
	}
}

export default Maps;

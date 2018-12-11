import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Layers from "./Layers";
import Sidebar from "./Sidebar";
import '../scss/maps.scss';

class Maps extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			raw: null,
			layers:["Nolli Map", "Traffic"],
			added:["Nolli Map"],
			selected:0,
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
		newlist.push(title);
		this.setState({
		  added: newlist,
		})	
	}

	removeOverlay = (title) => {
		const index = this.state.added.indexOf(title);
		const newlist = this.state.added;
		newlist.splice(index, 1);
		console.log(newlist);
		this.setState({
		  added: newlist,
		})	
	}	
	
	render() {	
		return (
			<div className="maps">
				<div className="functions">
					<Link to={`${process.env.PUBLIC_URL}/demo`} className="back">
				        <svg version="1.1" viewBox="0 0 80 80" className="back-icon">
							<path id="XMLID_7_" d="M74,35H18.1l23.5-23.5c2-2,2-5.1,0-7.1c-2-2-5.1-2-7.1,0l-32,32c0,0,0,0,0,0C2.2,36.7,2,37,1.8,37.2
				c-0.1,0.1-0.1,0.3-0.2,0.4c-0.1,0.2-0.2,0.3-0.2,0.5c-0.1,0.2-0.1,0.3-0.2,0.5c0,0.1-0.1,0.3-0.1,0.4c-0.1,0.6-0.1,1.3,0,2
				c0,0.1,0.1,0.3,0.1,0.4c0.1,0.2,0.1,0.3,0.2,0.5c0.1,0.2,0.2,0.3,0.2,0.5c0.1,0.1,0.1,0.3,0.2,0.4C2,43,2.2,43.3,2.5,43.5l32,32
				c1,1,2.3,1.5,3.5,1.5s2.6-0.5,3.5-1.5c2-2,2-5.1,0-7.1L18.1,45H74c2.8,0,5-2.2,5-5S76.8,35,74,35z"/>
						</svg>
						<div className="title">Change Location</div>
					</Link>
					<div className="button export-button">Export</div>
				</div>
				<div className="clearfix"/>
				<Sidebar
					layers = {this.state.layers}
					added = {this.state.added}
					selected = {this.state.selected}
					changeMap = {this.changeMap}
					addOverlay = {this.addOverlay}
					removeOverlay = {this.removeOverlay}
				/>
				<div className="map-display">
					<Layers
						
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

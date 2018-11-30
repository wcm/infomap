import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import osmtogeojson from 'osmtogeojson';

class Maps extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			raw: null
		}
		this.bounds = this.props.match.params
	}

	componentDidMount() { 
	    axios.get(`https://api.openstreetmap.org/api/0.6/map?bbox=${this.bounds.wlng},${this.bounds.slat},${this.bounds.elng},${this.bounds.nlat}`)
	      	.then(res => {
	        	if(res.data){
	        		this.setState({ raw: res.data })
	        	};
	      	})
	}
	render() {
		return (
			<div>
				<div>{`n: ${this.bounds.nlat} s: ${this.bounds.slat} w: ${this.bounds.wlng} e: ${this.bounds.elng}`}</div>
				<div>API address: {`https://api.openstreetmap.org/api/0.6/map?bbox=${this.bounds.wlng},${this.bounds.slat},${this.bounds.elng},${this.bounds.nlat}`}</div>
				<div>{this.state.raw}</div>
		    </div>
		);
	}
}

export default Maps;

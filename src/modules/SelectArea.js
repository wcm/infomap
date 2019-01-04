import React from 'react';
import { Link } from 'react-router-dom';
import '../scss/selectarea.scss'
import MapSelection from './MapSelection'

class SelectArea extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			raw: null,
			layers:["POI Map", "Nolli Map", "Visibility", "Traffic", "Natural Elements"],
			added:{
				"POI Map": true,
				"Nolli Map": true,
				"Visibility": false,
				"Traffic": false,
				"Natural Elements":false
			},
			selected:"Nolli Map",
		}
		this.bounds = this.props.match.params;
	}
	render() {
		return (
			<div className = 'content-wrapper'>
				<div className = 'title'>Select an Area</div>
				<MapSelection
					latitude = {this.props.match.params.lat}
					longitude = {this.props.match.params.lng}
				/>
				{/*TODO*/}
			</div>
		);
	}
}

export default SelectArea;

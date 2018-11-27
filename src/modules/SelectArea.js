import React from 'react';
import { Link } from 'react-router-dom';
import '../scss/selectarea.scss'
import MapSelection from './MapSelection'

class SelectArea extends React.Component {
	render() {
		return (
			<div className = 'content-wrapper'>
				<div className = 'title'>Select an Area</div>
				<MapSelection/>
				{/*TODO*/}
			</div>
		);
	}
}

export default SelectArea;

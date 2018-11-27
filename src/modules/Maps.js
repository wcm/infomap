import React from "react";
import { Link } from "react-router-dom";

class Maps extends React.Component {
	render() {
		return (
			<div>
				<div>{this.props.match.params.long}</div>
				<div>{this.props.match.params.alt}</div>
				<div>{this.props.match.params.width}</div>
				<div>{this.props.match.params.height}</div>
				{/*TODO*/}
			</div>
		);
	}
}

export default Maps;

import React from "react";
import { Link } from "react-router-dom";

class Footer extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() { 
	}

	render() {
		return (
			<div className="footer">
				<div>Infomap v0.1.0 prototype &copy; 2018 Wu Chenmu</div>
		    </div>
		);
	}
}

export default Footer;
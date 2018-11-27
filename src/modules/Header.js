import React from "react";
import { Link } from "react-router-dom";
import "../scss/navbar.scss";

class Header extends React.Component {
	render() {
		return (
			<div className = 'navbar-wrapper'>
				<div className = 'navbar-logo'><Link to = '/'><img style={{height: 40}} src='/image/logo.svg' alt='Infomap Logo' /></Link></div>
				<div className = 'navbar-tabs'>
					<Link className = 'navbar-tabitem' to = '/about'>About</Link>
					<Link className = 'navbar-tabitem'to = '/help'>Help</Link>
				</div>
			</div>
		);
	}
}

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import "../scss/navbar.scss";

class Header extends React.Component {
	render() {
		return (
			<div className = 'navbar-wrapper'>
				<div className = 'navbar-logo'><Link to = {process.env.PUBLIC_URL + '/'}><img style={{height: 40}} src={process.env.PUBLIC_URL + '/image/logo.svg'} alt='Infomap Logo' /></Link></div>
				<div className = 'navbar-tabs'>
					<Link className = 'navbar-tabitem' to = {process.env.PUBLIC_URL + '/about'}>About</Link>
					<Link className = 'navbar-tabitem'to = {process.env.PUBLIC_URL + '/help'}>Help</Link>
				</div>
			</div>
		);
	}
}

export default Header;

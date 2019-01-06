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
			layers:["POI Map", "Nolli Map", "Visibility", "Traffic", "Natural Elements"],
			added:{
				"POI Map": true,
				"Nolli Map": true,
				"Visibility": false,
				"Traffic": false,
				"Natural Elements":false
			},
			selected:"Nolli Map",
			sidebar:false,
			width: window.innerWidth
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
    	window.addEventListener("resize", this.resize);
	}

  	componentWillUnmount() {
    	window.removeEventListener("resize", this.resize);
  	}

  	resize = () => {
  		this.setState({width:window.innerWidth});
		if (window.innerWidth>768){
			this.setState({sidebar:false});
		}
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

	expandSidebar = () => {
		this.setState({sidebar: true})
	}

	foldSidebar = () => {
		this.setState({sidebar: false})
	}

	
	render() {	
		var longitude = (parseFloat(this.bounds.wlng) + parseFloat(this.bounds.elng))/2;
		var latitude = (parseFloat(this.bounds.nlat) + parseFloat(this.bounds.slat))/2;
	    var sidebarStyle = {left: 0}
	    if (window.innerWidth<768 && !this.state.sidebar){sidebarStyle={left:-250}};
	    console.log(window.innerWidth);
	    console.log(this.state.sidebar);
	    console.log(sidebarStyle);
		return (
			<div className="maps">
				<Sidebar
					style={sidebarStyle}
					layers = {this.state.layers}
					added = {this.state.added}
					selected = {this.state.selected}
					changeMap = {this.changeMap}
					addOverlay = {this.addOverlay}
					removeOverlay = {this.removeOverlay}
					foldSidebar = {this.foldSidebar}
					longitude = {longitude}
					latitude = {latitude}
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
				<div className ='navbar'>
					<img className = "icon" src={process.env.PUBLIC_URL + '/image/icon/menu.svg'} onClick={this.expandSidebar}/>
					<img className = "logo" src={process.env.PUBLIC_URL + '/image/infomap-logo.svg'}/>
		    	</div>
		    	<div className={this.state.sidebar?'mask':'hide'} onClick={this.foldSidebar}/>

				<div className="raw hide">
					<div>{`n: ${this.bounds.nlat} s: ${this.bounds.slat} w: ${this.bounds.wlng} e: ${this.bounds.elng}`}</div>
					<div>API address: {`https://api.openstreetmap.org/api/0.6/map?bbox=${this.bounds.wlng},${this.bounds.slat},${this.bounds.elng},${this.bounds.nlat}`}</div>
				</div>
		    </div>
		);
	}
}

export default Maps;

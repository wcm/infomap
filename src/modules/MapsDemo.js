import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import '../scss/maps.scss'

class MapsDemo extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			sidebar:["Original", "Nolli Map", "Program", "Traffic", "POI Clustering", "Overlay"],
			overlay:[
				{
					name: "Nolli Map",
					opacity:100
				}
			],
			shuffled:[
				{
					name: "Nolli Map",
					opacity:100
				}
			],
			selected:1
		}
	}

	componentDidMount() { 
	}

	changeMap = (key) => {
		this.setState({
			selected: key
		})
	}

	addOverlay = (title) => {
		this.setState({
		  overlay: [{name:title, opacity:100},...this.state.overlay],
		})	
	}

	removeOverlay = (title) => {
		const index = this.state.overlay.indexOf(title);
		const newlayers = this.state.overlay;
		newlayers.splice(index, 1);
		this.setState({
		  overlay: newlayers,
		})	
	}

	setOverlay = (data) => {
		console.log(data);
		this.setState({
			overlay:data
		})
	}

	getShuffled = (data) => {
		console.log(data);
		this.setState({
			shuffled:data
		})
	}

	setOpacity = (record, value) => {
		const index = this.state.overlay.indexOf(record);
		console.log(index, value);
		const newopacity = this.state.overlay;
		newopacity[index] = {name: record.name, opacity:parseInt(value)};
		this.setState({
			overlay: newopacity
		})
	}
	
	renderLayers = () => {
		const layers = this.state.overlay;
		let content = [];
		for (let key in layers){
			content.push(
				<img key={layers[key].name} style={{position:"absolute", maxWidth: "100%", opacity:layers[key].opacity/100}} src={`${process.env.PUBLIC_URL}/image/demo/${layers[key].name}.png`} alt={`${layers[key].name}`} />
			);
		}
		console.log(content);
		return content.reverse();
	}

	render() {
		const selected = this.state.sidebar[this.state.selected];
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
					<div className="button export-button">Export This Mapping</div>
				</div>
				<div className="clearfix"/>
				<Sidebar
					{...this.state}
					changeMap = {this.changeMap}
					addOverlay = {this.addOverlay}
					removeOverlay = {this.removeOverlay}
					setOverlay = {this.setOverlay}
					setOpacity = {this.setOpacity}
					getShuffled = {this.getShuffled}
				/>
				<div className="map-display">
					{selected != "Overlay"?
						<img style={{position:"absolute", maxWidth: "100%"}}src={`${process.env.PUBLIC_URL}/image/demo/${selected}.png`} alt="selected" />
					:
						this.renderLayers()
					}
				</div>
				<div className="clearfix"/>
		    </div>
		);
	}
}

export default MapsDemo;

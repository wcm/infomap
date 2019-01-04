import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactMapGL, {NavigationControl} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import {withRouter} from "react-router";
import Selector from './Selector';

const MAPBOX_TOKEN ="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

class MapSelection extends Component {
  	constructor(props: Props) {
	    super(props);
	    var latitude = 48.13832;
	    var longitude = 11.57440;
	    if (this.props.latitude && this.props.longitude){
	    	latitude = parseFloat(this.props.latitude);
	    	longitude = parseFloat(this.props.longitude);
	    }
	    this.state = {
	    	viewport: {
		    	width: "100%",
		      	height: 600,
		      	longitude: longitude,
		      	latitude: latitude,
		      	zoom: 15,
				bearing: 0,
				pitch: 0,    	
			},
			input: {
				"longitude": longitude.toFixed(4),
				"latitude": latitude.toFixed(4)
			},
	    	selector:{
	    		x: window.innerWidth*0.9/4,
	    		y: 600/4
	    	},
	    	isdragging: false,
	    	selBounds:{
	    		n: 0,
	    		s: 0,
	    		w: 0,
	    		e: 0
	    	},
	    	width: 0
	  	};
	  	this.mapRef = React.createRef();
	};

  	

  	componentDidMount() {
    	window.addEventListener("resize", this.resize);
  		this.resize();
        this.interval = setInterval(() => this.initialLocation(), 1);
  	}

  	componentWillUnmount() {
    	window.removeEventListener("resize", this.resize);
  	}

  	resize = () => {
  		this.setState({width: window.innerWidth*0.9})
    	this.handleViewportChange(this.state.viewport);
  	}

  	initialLocation = () =>{
  		this.setLocation();
  		clearInterval(this.interval);
  	}
  	handleViewportChange = (viewport) => {
  		if (this.state.isdragging === false){
	    	this.setState({
	    		viewport: { ...this.state.viewport, ...viewport },
	    		input: {
					"longitude": viewport.longitude.toFixed(4),
					"latitude": viewport.latitude.toFixed(4)
				}
	    	});
	    	if (this.mapRef.current) {
	    		const myMap = this.mapRef.current.getMap();
		    	const bounds = myMap.getBounds();
		    	this.setState({selBounds:{
		    		n: bounds._ne.lat,
		    		s: bounds._sw.lat,
					w: bounds._sw.lng,
		    		e: bounds._ne.lng
		    	}})

	    	}
    	}
  	}

  	handleOnResult = (event) => {
    	console.log(event.result);
  	}

  	handleGeocoderViewportChange = (viewport) => {
    	const geocoderDefaultOverrides = { transitionDuration: 100 };
	    this.handleViewportChange({
	      	...viewport,
	      	...geocoderDefaultOverrides,
	    });

  	}

  	setDragging = (value) => {
  		this.setState({isdragging: value});
  	}

  	setXY = (value) => {
  		this.setState({selector: value});  		
  	}
	
	getDistance = (lat1, lon1, lat2, lon2) => {
	  	var R = 6371e3; // metres
		var φ1 = lat1* Math.PI / 180;
		var φ2 = lat2* Math.PI / 180;
		var Δφ = (lat2-lat1)* Math.PI / 180;
		var Δλ = (lon2-lon1)* Math.PI / 180;

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		        Math.cos(φ1) * Math.cos(φ2) *
		        Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		return R * c;
	}
	
	getBoundArea = (lat1, lat2, lon1, lon2) => {
		return this.getDistance(lat1, lon1, lat1, lon2) * this.getDistance(lat1, lon1, lat2, lon1)
	}

	setLocation = () =>{
		var newLng = parseFloat(document.getElementById("longitude").value);
		var newLat = parseFloat(document.getElementById("latitude").value);
    	this.handleViewportChange({
    		longitude:newLng,
    		latitude:newLat
    	});		
	}

	changeInputValue = (field, e) => {
		var newInput = this.state.input;
		newInput[field] = e.target.value;
		this.setState({
			input:newInput
		})
	}

  	render() {
    	const { viewport, selector, selBounds } = this.state;
	    const nlat = selBounds.n - selector.y/600*(selBounds.n-selBounds.s);
	    const slat = selBounds.s + selector.y/600*(selBounds.n-selBounds.s);
	    const wlng = selBounds.w + selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const elng = selBounds.e - selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const area = this.getBoundArea(nlat, slat, wlng, elng).toFixed(2);
	    return (
	    	<div>
				<ReactMapGL
					className='map'
				    ref={this.mapRef}
				    {...viewport}
				    onViewportChange={this.handleViewportChange}
				    mapboxApiAccessToken={MAPBOX_TOKEN}
				    mapStyle='mapbox://styles/mapbox/streets-v9'
				>
					<Geocoder
					    mapRef={this.mapRef}
					    onResult={this.handleOnResult}
				        onViewportChange={this.handleGeocoderViewportChange}
				        mapboxApiAccessToken={MAPBOX_TOKEN}
				        position="top-left"
				    />
			        <div className='control'>
			        <NavigationControl 
			        	showCompass={false}
			          	onViewportChange={this.handleViewportChange} 
			        />
			        </div>
					<Selector
				    	{...selector}
				    	setDragging = {this.setDragging}
				    	setXY = {this.setXY}
				    />

				</ReactMapGL>
				{area <= 4000000? 
					<div className='row'>
						<div className="area-indicator">
							<div className="area-indicator-fill" style={{width: area/4000000*200}}></div>
						</div>
						<div className="area-number">Area: {area} m &#178;</div>
					    <Link to={`${process.env.PUBLIC_URL}/selected/${wlng}/${slat}/${elng}/${nlat}`}> 
							<div className='button proceed-button'>Proceed to Analysis </div>
				    	</Link>
						<div className='proceed-alert green'> You can use this selected region. </div>
				    </div>
			    :
					<div className='row'>
						<div className="area-indicator">
							<div className="area-indicator-fill area-exceed" style={{width: 200}}></div>
						</div>
						<div className="area-number">Area: &#62;4 km &#178;</div>
						<div className='button button-disabled proceed-button'>Proceed to Analysis </div>
						<div className='proceed-alert red'> Area of the selected region is too big. </div>
					</div>
		    	}
			    <div className='clearfix'/>
			    <div>
				    longitude:
				    <input type="number" id="longitude" step="0.0001" min="-180" max="180" value={this.state.input["longitude"]} onChange={(e)=>this.changeInputValue("longitude", e)}/>
				    latitude:
				    <input type="number" id="latitude" step="0.0001" min="-90" max="90" value={this.state.input["latitude"]} onChange={(e)=>this.changeInputValue("latitude", e)}/>
				    <div className="button" onClick={this.setLocation}>Go</div>
			    </div>
				<div className='raw'>
				    <div>
				    	<p>Viewport Coordinates:</p>
				    	<p> {`n: ${selBounds.n} s: ${selBounds.s} w: ${selBounds.w} e: ${selBounds.e}`}</p>
				    </div>
			    	<div>
			    		<p>Selected Region Coordinates:</p>
			    		<p> {`n: ${nlat} s: ${slat} w: ${wlng} e: ${elng}`}</p>
			    	</div>
			    	<div>
			    		<p>Selected Region Area:</p>
			    		<p> {area}</p>
			    	</div>
		    	</div>
		    </div>
	    );
  	}
};

export default withRouter(MapSelection);
import React, { Component } from "react";
import { Link } from "react-router-dom";
import MapGL, {NavigationControl} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import {withRouter} from "react-router";
import Selector from './Selector';

const MAPBOX_TOKEN ="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

class MapSelection extends Component {
  	constructor(props: Props) {
	    super(props);
	    this.state = {
	    	viewport: {
		    	width: '100%',
		      	height: '600px',
		      	latitude: 48.1358,
		      	longitude: 11.5611,
		      	zoom: 15
	    	},	
	    	selector:{
	    		x: 0,
	    		y: 0
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
    	const myMap = this.mapRef.current.getMap();
    	const bounds = myMap.getBounds();
    	this.setState({
	    	selBounds:{
	    		n: bounds._ne.lat,
	    		s: bounds._sw.lat,
				w: bounds._sw.lng,
	    		e: bounds._ne.lng
	    	},
	    	selector:{
	    		x: window.innerWidth*0.9/4,
	    		y: 600/4
	    	}
	    })
  	}

  	componentWillUnmount() {
    	window.removeEventListener("resize", this.resize);
  	}

  	resize = () => {
  		this.setState({width: window.innerWidth*0.9})
    	this.handleViewportChange({
      	width: '100%',
    	});
  	}

  	handleViewportChange = (viewport) => {
  		if (this.state.isdragging === false){
	    	this.setState({
	    		viewport: { ...this.state.viewport, ...viewport },
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
		console.log(viewport);
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

  	render() {
    	const { viewport, selector, selBounds } = this.state;
	    const nlat = selBounds.n - selector.y/600*(selBounds.n-selBounds.s);
	    const slat = selBounds.s + selector.y/600*(selBounds.n-selBounds.s);
	    const wlng = selBounds.w + selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const elng = selBounds.e - selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const area = this.getBoundArea(nlat, slat, wlng, elng).toFixed(2);
	    const isDemo = (this.props.location.pathname === `${process.env.PUBLIC_URL}/demo`);
	    return (
	    	<div>
				<MapGL
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

				</MapGL>
				{area <= 5000000? 
					<div className='row'>
						<div className="area-indicator">
							<div className="area-indicator-fill" style={{width: area/5000000*200}}></div>
						</div>
						<div className="area-number">Area: {area} m &#178;</div>
					{isDemo ?
					    <Link to={`${process.env.PUBLIC_URL}/demo/selected`}> 
							<div className='button proceed-button'>Proceed to Analysis </div>
				    	</Link>
					:
					    <Link to={`${process.env.PUBLIC_URL}/selected/${wlng}/${slat}/${elng}/${nlat}`}> 
							<div className='button proceed-button'>Proceed to Analysis </div>
				    	</Link>
				    }
						<div className='proceed-alert green'> You can use this selected region. </div>
				    </div>
			    :
					<div className='row'>
						<div className="area-indicator">
							<div className="area-indicator-fill area-exceed" style={{width: 200}}></div>
						</div>
						<div className="area-number">Area: &#62;5 km &#178;</div>
						<div className='button button-disabled proceed-button'>Proceed to Analysis </div>
						<div className='proceed-alert red'> Area of the selected region is too big. </div>
					</div>
		    	}
			    <div className='clearfix'/>
			    {isDemo?
			    	<div/>
			    :
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
		    	}
		    </div>
	    );
  	}
};

export default withRouter(MapSelection);
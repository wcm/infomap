import React, { Component } from "react";
import { Link } from "react-router-dom";
import MapGL, {NavigationControl} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Selector from './Selector';

const MAPBOX_TOKEN ="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

class MapSelection extends Component {
  	constructor(props: Props) {
	    super(props);
	    this.state = {
	    	viewport: {
		    	width: '100%',
		      	height: '600px',
		      	latitude: 37.7577,
		      	longitude: -122.4376,
		      	zoom: 16
	    	},	
	    	searchResultLayer: null,
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
	    		x: window.innerWidth*0.833333/4,
	    		y: 600/4
	    	}
	    })
  	}

  	componentWillUnmount() {
    	window.removeEventListener("resize", this.resize);
  	}

  	resize = () => {
  		this.setState({width: window.innerWidth*0.833333})
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

  	render() {
    	const { viewport, searchResultLayer, selector, selBounds } = this.state;
	    const nlat = selBounds.n - selector.y/600*(selBounds.n-selBounds.s);
	    const slat = selBounds.s + selector.y/600*(selBounds.n-selBounds.s);
	    const wlng = selBounds.w + selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const elng = selBounds.e - selector.x/this.state.width*(selBounds.e-selBounds.w);
	    return (
	    	<div className='map'>
				<MapGL
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
			    <div>Viewport Coordinates: {`n: ${selBounds.n} s: ${selBounds.s} w: ${selBounds.w} e: ${selBounds.e}`}</div>
		    	<div>Selected Area Coordinates: {`n: ${nlat} s: ${slat} w: ${wlng} e: ${elng}`}</div>
		    	<Link to={`${process.env.PUBLIC_URL}/selected/${wlng}/${slat}/${elng}/${nlat}`}> Proceed to Analysis </Link>
		    </div>
	    );
  	}
}

export default MapSelection
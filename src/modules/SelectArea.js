import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactMapGL, {NavigationControl} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import {withRouter} from "react-router";
import Selector from './Selector';
import '../scss/selectarea.scss'

const MAPBOX_TOKEN ="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

class MapSelection extends Component {
  	constructor(props: Props) {
	    super(props);
	    var latitude = 48.13832;
	    var longitude = 11.57440;
	    if (this.props.match.params.lat && this.props.match.params.lng){
	    	longitude = parseFloat(this.props.match.params.lng);
	    	latitude = parseFloat(this.props.match.params.lat);
	    }
	    this.state = {
	    	viewport: {
		    	width: window.innerWidth-250,
		      	height: window.innerHeight,
		      	longitude: longitude,
		      	latitude: latitude,
		      	zoom: 15,
				bearing: 0,
				pitch: 0,    	
			},
			input: {
				"longitude": longitude.toFixed(4),
				"latitude": latitude.toFixed(4),
				"zoom": 15
			},
	    	selector:{
	    		x: (window.innerWidth-250)/4,
	    		y: window.innerHeight/4
	    	},
	    	isdragging: false,
	    	selBounds:{
	    		n: 0,
	    		s: 0,
	    		w: 0,
	    		e: 0
	    	},
	    	width: window.innerWidth-250,
	    	height: window.innerHeight,
	    	sidebar: false
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
		var newViewport = this.state.viewport;
		var newSelector = this.state.selector;
		if (window.innerWidth>768){
			if (this.state.sidebar){
				this.setState({sidebar:false});
			}
			newViewport.width = window.innerWidth-250;
			newViewport.height = window.innerHeight;
		}else{
			newViewport.width = window.innerWidth;
			newViewport.height = window.innerHeight-60;
		}
		newSelector.x = newViewport.width/4;
		newSelector.y = newViewport.height/4;
		this.setState({
			viewport:newViewport,
			selector:newSelector,
		  	width: newViewport.width,
		  	height: newViewport.height
		})
    	this.handleViewportChange(newViewport);
  	}

  	initialLocation = () =>{
  		this.setLocation();
  		clearInterval(this.interval);
  	}
  	handleViewportChange = (viewport) => {
  		if (this.state.isdragging === false){
	    	this.setState({
	    		viewport: { ...this.state.viewport, ...viewport, transitionDuration: 100 },
	    		input: {
					"longitude": viewport.longitude.toFixed(4),
					"latitude": viewport.latitude.toFixed(4),
					"zoom": viewport.zoom
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
//    	console.log(event.result);
  	}

  	handleGeocoderViewportChange = (viewport) => {
    	const geocoderDefaultOverrides = { transitionDuration: 500 };
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
		var newZoom = parseFloat(document.getElementById("zoom").value);
    	this.handleViewportChange({
    		longitude:newLng,
    		latitude:newLat,
    		zoom:newZoom
    	});		
	}

	changeInputValue = (field, e) => {
		var newInput = this.state.input;
		newInput[field] = e.target.value;
		this.setState({
			input:newInput
		})
	}

	expandSidebar = () => {
		this.setState({sidebar: true})
	}

	foldSidebar = () => {
		this.setState({sidebar: false})
	}

  	render() {
    	const { viewport, selector, selBounds } = this.state;
	    const nlat = selBounds.n - selector.y/viewport.height*(selBounds.n-selBounds.s);
	    const slat = selBounds.s + selector.y/viewport.height*(selBounds.n-selBounds.s);
	    const wlng = selBounds.w + selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const elng = selBounds.e - selector.x/this.state.width*(selBounds.e-selBounds.w);
	    const area = this.getBoundArea(nlat, slat, wlng, elng).toFixed(2);
	    var inner = 0;
	    if (area <= 4000000){inner = Math.sqrt(area/4000000)*210}else{inner = Math.sqrt(4000000/area)*210};
	    var sidebarStyle = {left: 0}
	    if (window.innerWidth<768 && !this.state.sidebar){sidebarStyle={left:-250}}
	    return (
	    	<div className = 'content'>

	    	<div className = 'select-wrapper' ref={el => (this.container = el)}>
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
				        position="top-right"
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
		    </div>
			<div className = "sidebar-main-wrapper" style={sidebarStyle}>
				<div className="footer-wrapper">
				<img className = "logo" src={process.env.PUBLIC_URL + '/image/infomap-logo.svg'} alt="infomap"/>
			    <div className = "coordinates">
			    	<div className = "parameter">
					    Longitude:
					    <input type="number" id="longitude" step="0.0001" min="-180" max="180" value={this.state.input["longitude"]} onChange={(e)=>this.changeInputValue("longitude", e)}/>
					</div>
					<div className = "parameter">
					    Latitude:
					    <input type="number" id="latitude" step="0.0001" min="-90" max="90" value={this.state.input["latitude"]} onChange={(e)=>this.changeInputValue("latitude", e)}/>
					</div>
					<div className = "parameter">
					    Zoom:
					    <input type="number" id="zoom" step="0.0001" min="-90" max="90" value={this.state.input["zoom"]} onChange={(e)=>this.changeInputValue("zoom", e)}/>
					</div>
				    <div className="button-secondary" onClick={this.setLocation}>Go to location</div>
			    </div>
		    	{area <= 4000000? 
					<div className='area'>
						<div className="area-indicator">
							<div className="area-indicator-fill" style={{width:inner, height:inner, top:(210-inner)/2, left:(210-inner)/2}}></div>
							<div className="limit">4 km&#178;</div>
						</div>
						<div className="area-number">Area: {area} m&#178;</div>
					    <Link to={`${process.env.PUBLIC_URL}/selected/${wlng}/${slat}/${elng}/${nlat}`}> 
							<div className='button proceed-button'>Proceed to Analysis </div>
				    	</Link>
				    </div>
			    :
					<div className='area'>
						<div className="area-indicator-exceed">
							<div className="area-indicator-fill-exceed" style={{width:inner, height:inner, top:(210-inner)/2, left:(210-inner)/2}}></div>
							<div className="limit-exceed"style={{top:(210-inner)/2+8, right:(210-inner)/2+8}}>4 km&#178;</div>
						</div>
						<div className="area-number">Area: &#62; 4 km&#178;</div>
						<div className='button button-disabled proceed-button'>Proceed to Analysis </div>
						<div className='proceed-alert'> Selected area must be smaller than 4 km&#178; </div>
					</div>
		    	}
				<div className='raw hide'>
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
		    	<div className="push"/>
		    	</div>
		    	<div className='sidebar-footer'>
					<div className='footer-tab'>About</div>
					<div className='footer-tab'>Help</div>
				</div>
		    </div>

	    	<div className ='navbar'>
				<img className = "icon" src={process.env.PUBLIC_URL + '/image/icon/menu.svg'} onClick={this.expandSidebar} alt='menu'/>
				<img className = "logo" src={process.env.PUBLIC_URL + '/image/infomap-logo.svg'} alt='infomap'/>
	    	</div>
	    	<div className={this.state.sidebar?'mask':'hide'} onClick={this.foldSidebar}/>

		    </div>
	    );
  	}
};

export default withRouter(MapSelection);
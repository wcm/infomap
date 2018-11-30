  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize = () => {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Geocoder from "react-map-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class MapSelection extends React.Component {

  	constructor(props: Props) {
	    super(props);
	    this.state = {
	      lng: 5,
	      lat: 34,
	      zoom: 1.5,
	      value: null
	    };
	    this.mapRef = React.createRef();
  	}

	componentDidMount() {
	    const { lng, lat, zoom } = this.state;

	    const map = new mapboxgl.Map({
		    container: this.mapContainer,
		    style: 'mapbox://styles/mapbox/streets-v9',
		    center: [lng, lat],
		    zoom
	    });

	    map.on('move', () => {
	      const { lng, lat } = map.getCenter();

	      this.setState({
	        lng: lng.toFixed(4),
	        lat: lat.toFixed(4),
	        zoom: map.getZoom().toFixed(2)
	      });
	    });
	}


  handleGeocoderViewportChange(viewport) {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    console.log(viewport)
  };

  	render() {
	    const { lng, lat, zoom } = this.state;

	    return (
	    	<div>
	        	<div ref={el => this.mapContainer = el} className="map" />
		        <Geocoder
		          mapRef={this.mapContainer}
		          onViewportChange={this.handleGeocoderViewportChange}
		          mapboxApiAccessToken={mapboxgl.accessToken}
		          position="top-left"
		        />
	        	<div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
	    	</div>
	    );
	}
}

export default MapSelection
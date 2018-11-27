import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1Ijoid2NuZGhyIiwiYSI6ImNqa2h6MHdpZDB6a3gzcG1sZjAzcWRqd2QifQ.QhiUrYs_tD0qN2SiN5bvUg';

class MapSelection extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: 11.5752,
      lat: 48.1370,
      zoom: 16
    };
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

  render() {
    const { lng, lat, zoom } = this.state;

    return (
    	<div>
        	<div ref={el => this.mapContainer = el} className="map" />
        	<div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
    	</div>
    );
  }
}

export default MapSelection
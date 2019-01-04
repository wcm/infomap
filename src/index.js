import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Header from './modules/Header';
import SelectArea from './modules/SelectArea';
import Help from './modules/Help';
import About from './modules/About';
import Maps from './modules/Maps';
import MapsDemo from './modules/MapsDemo';
import ScrollToTop from './modules/ScrollToTop';
import Footer from './modules/Footer';
import './scss/base.scss';
import 'mapbox-gl/dist/mapbox-gl.css'


ReactDOM.render((
<Router>
	<ScrollToTop>
		<div className = 'content'>
			<Header/>
			<Route exact path = {process.env.PUBLIC_URL + '/'} component = {SelectArea} />
			<Route exact path = {process.env.PUBLIC_URL + '/:lng/:lat'} component = {SelectArea} />
			<Route exact path = {process.env.PUBLIC_URL + '/help'} component = {Help} />
			<Route exact path = {process.env.PUBLIC_URL + '/about'} component = {About} />
			<Route exact path = {process.env.PUBLIC_URL + '/selected/:wlng/:slat/:elng/:nlat'} component = {Maps}/>
			<Footer/>
		</div>
	</ScrollToTop>
</Router>
), document.getElementById('root'));

serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Header from './modules/Header';
import SelectArea from './modules/SelectArea';
import Help from './modules/Help';
import About from './modules/About';
import Maps from './modules/Maps';
import './scss/base.scss';

ReactDOM.render((
<Router>
	<div className = 'content'>
		<Header/>
		<Route exact path = '/' component = {SelectArea} />
		<Route exact path = '/help' component = {Help} />
		<Route exact path = '/about' component = {About} />
		<Route exact path = '/selected/:long/:alt/:width/:height' component = {Maps}/>
	</div>
</Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from "react";
import {withRouter} from "react-router";
import { Link } from "react-router-dom";
import ReactDragList from 'react-drag-list';
import '../scss/sidebar.scss'

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	menu: this.props.layers,
    	added: this.props.added,
    	selected: this.props.selected,
    }
  };

  changeMap = (key) => {
  	this.props.changeMap(key);
  }

  addOverlay = (e, title) => {
  	e.stopPropagation();
  	this.props.addOverlay(title);
  }

  removeOverlay = (e, title) => {
  	e.stopPropagation();
  	this.props.removeOverlay(title);
  }

  handleUpdate = (evt, updated) => {
    console.log(evt); // tslint:disable-line
    console.log(updated);
  } // tslint:disable-line

  renderMenu = () => {
    const {layers, added, selected} = this.props;

    let content = [];
    layers.forEach((record, index) => {
      content.push(
		      <div className={record === selected?"menu-item selected":"menu-item"} key={`${record}`} onClick={() => this.changeMap(record)}>

		      	<div className = "menu-subtitle">
		        	{record}
		        </div>
		        {added[record]?
				    <svg version="1.1" viewBox="0 0 80 80" className={record === selected?"icon selected":"icon"} onClick={(e) => this.removeOverlay(e, record)}>
						<path id="XMLID_6_" d="M74,45H6c-2.8,0-5-2.2-5-5s2.2-5,5-5h68c2.8,0,5,2.2,5,5S76.8,45,74,45z"/>
					</svg>
				:
			        <svg version="1.1" viewBox="0 0 80 80" className={record === selected?"icon selected":"icon"} onClick={(e) => this.addOverlay(e, record)}>
						<path d="M74,35H45V6c0-2.8-2.2-5-5-5s-5,2.2-5,5v29H6c-2.8,0-5,2.2-5,5c0,2.8,2.2,5,5,5h29v29c0,2.8,2.2,5,5,5s5-2.2,5-5V45h29
							c2.8,0,5-2.2,5-5C79,37.2,76.8,35,74,35z"/>
					</svg>
				}
				<div className="clearfix"/>
		      </div>
      );
    });
    return content;
  }

  render() {
	var content = this.renderMenu();

    return (
      <div className="menu">
		<Link to={`${process.env.PUBLIC_URL}/`} className="back">
			<svg version="1.1" viewBox="0 0 80 80" className="back-icon">
				<path id="XMLID_7_" d="M74,35H18.1l23.5-23.5c2-2,2-5.1,0-7.1c-2-2-5.1-2-7.1,0l-32,32c0,0,0,0,0,0C2.2,36.7,2,37,1.8,37.2
				c-0.1,0.1-0.1,0.3-0.2,0.4c-0.1,0.2-0.2,0.3-0.2,0.5c-0.1,0.2-0.1,0.3-0.2,0.5c0,0.1-0.1,0.3-0.1,0.4c-0.1,0.6-0.1,1.3,0,2
				c0,0.1,0.1,0.3,0.1,0.4c0.1,0.2,0.1,0.3,0.2,0.5c0.1,0.2,0.2,0.3,0.2,0.5c0.1,0.1,0.1,0.3,0.2,0.4C2,43,2.2,43.3,2.5,43.5l32,32
				c1,1,2.3,1.5,3.5,1.5s2.6-0.5,3.5-1.5c2-2,2-5.1,0-7.1L18.1,45H74c2.8,0,5-2.2,5-5S76.8,35,74,35z"/>
			</svg>
			<div className = "title">Change Location</div>
		</Link>
		<div className="clearfix"/>
		{content}
        <div className={this.props.selected === "Overlay"?"menu-item selected":"menu-item"} onClick={() => this.changeMap("Overlay")}>
	      	<div className = "menu-title">
	        	Overlay
	        </div>
	    </div>

      </div>
    );
  }
}

export default withRouter(Sidebar);
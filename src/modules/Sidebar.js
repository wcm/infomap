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
    const {menu, added, selected} = this.props;

    let content = [];
    for (let key in menu) {
      content.push(
      <div className={key == selected?"menu-item selected":"menu-item"} key={`${menu[key]}`} onClick={() => this.changeMap(key)}>
      	<div className = "menu-title">
        	{menu[key]}
        </div>
        {added.indexOf(menu[key]) != -1 || menu[key] == "Overlay" ?
			<div/>
		:
	        <svg version="1.1" viewBox="0 0 80 80" className={key == selected?"icon selected":"icon"} onClick={(e) => this.addOverlay(e, menu[key])}>
				<path d="M74,35H45V6c0-2.8-2.2-5-5-5s-5,2.2-5,5v29H6c-2.8,0-5,2.2-5,5c0,2.8,2.2,5,5,5h29v29c0,2.8,2.2,5,5,5s5-2.2,5-5V45h29
					c2.8,0,5-2.2,5-5C79,37.2,76.8,35,74,35z"/>
			</svg>
		}
      </div>
      );
    }
    return content;
  }

  render() {
    var layers = this.props.layers;
    var added = this.props.added;
    var selected = this.props.selected;

    console.log(added);
    return (
      <div className="menu">
      	<ReactDragList
          dataSource={this.props.layers}
          row={(record, index) => (
		      <div className={index == selected?"menu-item selected":"menu-item"} key={`${record}`} onClick={() => this.changeMap(index)}>

		      	<div className = "menu-subtitle">
		        	{record}
		        </div>
		        {added.indexOf(record) != -1?
				    <svg version="1.1" viewBox="0 0 80 80" className={index == selected?"icon selected":"icon"} onClick={(e) => this.removeOverlay(e, record)}>
						<path id="XMLID_6_" d="M74,45H6c-2.8,0-5-2.2-5-5s2.2-5,5-5h68c2.8,0,5,2.2,5,5S76.8,45,74,45z"/>
					</svg>
				:
			        <svg version="1.1" viewBox="0 0 80 80" className={index == selected?"icon selected":"icon"} onClick={(e) => this.addOverlay(e, record)}>
						<path d="M74,35H45V6c0-2.8-2.2-5-5-5s-5,2.2-5,5v29H6c-2.8,0-5,2.2-5,5c0,2.8,2.2,5,5,5h29v29c0,2.8,2.2,5,5,5s5-2.2,5-5V45h29
							c2.8,0,5-2.2,5-5C79,37.2,76.8,35,74,35z"/>
					</svg>
				}
				<div className="clearfix"/>
		      </div>
          )}
          handles={false}
          onUpdate={this.handleUpdate}
        />
        <div className={selected == -1?"menu-item selected":"menu-item"} onClick={() => this.changeMap(-1)}>
	      	<div className = "menu-title">
	        	Overlay
	        </div>
	    </div>

      </div>
    );
  }
}

export default withRouter(Sidebar);
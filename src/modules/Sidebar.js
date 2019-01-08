import React from "react";
import {withRouter} from "react-router";
import { Link } from "react-router-dom";
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
    this.props.foldSidebar();
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
            <img className = "menu-icon" src={`${process.env.PUBLIC_URL}/image/icon/${record}.svg`} alt='menu'/>
		      	<div className = "menu-title">
		        	{record}
		        </div>
		        {added[record]?
              <img className = "check-box" src={`${process.env.PUBLIC_URL}/image/icon/check.svg`} onClick={(e) => this.removeOverlay(e, record)} alt='add'/>
    				:
              <img className = "check-box" src={`${process.env.PUBLIC_URL}/image/icon/uncheck.svg`} onClick={(e) => this.addOverlay(e, record)} alt='delete'/>
    				}
		      </div>
      );
    });
    return content;
  }

  render() {
	var content = this.renderMenu();
    var count = 0;
    for (var key in this.props.added){
      if (this.props.added[key]){count ++};
    }
    return (
      <div className="menu" style={this.props.style}>
        <div className="footer-wrapper">
          <img className = "logo" src={process.env.PUBLIC_URL + '/image/infomap-logo.svg'} alt='infomap'/>
      		<Link to={`${process.env.PUBLIC_URL}/${this.props.longitude}/${this.props.latitude}`}>
      			<div className = "back">
              <img className = "back-icon" src={process.env.PUBLIC_URL + '/image/icon/back.svg'} alt='back'/>
              Change Location
            </div>
      		</Link>
      		{content}
          <div className='divider'/>
          <div className={this.props.selected === "Overlay"?"menu-item selected":"menu-item"} onClick={() => this.changeMap("Overlay")}>
            <img className = "menu-icon" src={`${process.env.PUBLIC_URL}/image/icon/Overlay.svg`} alt='menu'/>
  	      	<div className = "menu-title">
  	        	Overlay
  	        </div>
            <div className = "number">{count}</div>
          </div>
          <div className="push"/>
        </div>
        <div className='sidebar-footer'>
          <div className='footer-tab'>About</div>
          <div className='footer-tab'>Help</div>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
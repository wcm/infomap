import React from "react";
import {withRouter} from "react-router";
import { Link } from "react-router-dom";
import '../scss/sidebar.scss'
import DraggableList from 'react-draggable-list';

type PlanetListItem = {
  name: string;
};

type PlanetProps = {
  item: PlanetListItem;
  itemSelected: number;
  dragHandleProps: Object;
};
type PlanetState = {
  opacity: number;
};
class PlanetItem extends React.Component<PlanetProps, PlanetState> {
  state = {
    opacity: 100
  };

  changeOpacity(e) {
    this.setState({
      opacity: e.currentTarget.value
    });
  }

  getDragHeight() {
    return 28;
  }

  removeOverlay = (title) => {
    this.props.removeOverlay(title);
  }

  render() {
    const {item, itemSelected, dragHandleProps} = this.props;
    const {opacity} = this.state;
    const scale = itemSelected * 0.02 + 1;
    const dragged = itemSelected !== 0;

    return (
        <div className="submenu-item" style={{transform: `scale(${scale})`}} key={`${item.name}1`}>
          <div className="dragHandle" {...dragHandleProps} />

          <div className = "submenu-title">
            {item.name}
          </div>
          <svg version="1.1" viewBox="0 0 80 80" className="icon" onClick={() => this.removeOverlay(item)}>
            <path id="XMLID_6_" d="M74,45H6c-2.8,0-5-2.2-5-5s2.2-5,5-5h68c2.8,0,5,2.2,5,5S76.8,45,74,45z"/>
          </svg>
          <div className="slider">
            <input type="range" name="opacity" min="0" max="100" onChange={(e) => this.changeOpacity(e)} value={opacity} />
            <div className="slider-value">{opacity}</div>
          </div>
        </div>

    );
  }
}

type ExampleState = {
  list: $ReadOnlyArray<PlanetListItem>;
};

export default class Sidebar extends React.Component<{}, ExampleState> {
  _container: HTMLElement;

  state = {
    list: this.props.overlay
  };

  _onListChange(newList: $ReadOnlyArray<PlanetListItem>) {
    this.setOverlay(newList);
  }

  changeMap = (key) => {
    this.props.changeMap(key);
  }

  addOverlay = (e, title) => {
    e.stopPropagation();
    this.props.addOverlay(title);
  }

  removeOverlay = (title) => {
    this.props.removeOverlay(title);
  }

  setOverlay = (data) => {
    this.props.setOverlay(data);
  }

  handleUpdate = (evt, updated) => {
    console.log(evt); // tslint:disable-line
    console.log(updated);
  } // tslint:disable-line

  changeOpacity = (e, record) => {
    this.props.setOpacity(record, e.currentTarget.value);
  }

  disableDrag = (e) => {
    this.setState({draggable: false})
  }
  
  enableDrag = (e) => {
    this.setState({draggable: true})
  }

  renderMenu = () => {
    const menu = this.props.sidebar;
    const selected = this.props.selected;
    const overlay = this.props.overlay.map(data => data.name);

    let content = [];
    for (let key in menu) {
      content.push(
      <div className={key == selected?"menu-item selected":"menu-item"} key={`${menu[key]}`} onClick={() => this.changeMap(key)}>
        <div className = "menu-title">
          {menu[key]}
        </div>
        {overlay.indexOf(menu[key]) != -1 || menu[key] == "Overlay" ?
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

    return (
      <div className="menu">
        {this.renderMenu()}
          <DraggableList
            itemKey="name"
            template={PlanetItem}
            list={this.props.overlay}
            onMoveEnd={newList => this._onListChange(newList)}
            container={()=>document.body}
            removeOverlay = {this.removeOverlay}
          />
      </div>
    );
  }
}
import React from "react";
import { Link } from "react-router-dom";

class POIMap extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			tooltip: false,
			info: {},
			left: true,
		}
	}

	componentDidMount() {
	}


	showTooltip = (tags, e) =>{
		var bbox = e.target.getBBox();
		if ((bbox.x + bbox.width/2) >= (this.props.width/2)){
			this.setState({left: true})
		} else {
			this.setState({left: false})
		}
		this.setState({
			tooltip: true,
			info: tags,
		})

	}

	hideTooltip = () =>{

		this.setState({
			tooltip: false,
			info: {}
		})

	}

	render() {
		let content = [];
		var {nodes, ways, relations,width, height} = this.props;
		var selected = this.props.selected;
		var longLinks = this.props.longLinks;
		var shortLinks = this.props.shortLinks;
		var info = this.state.info;
		
		if(this.props.option === "Short Links"){
			content.push(shortLinks.map((link) => <line x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} stroke="rgba(255, 0, 255, .3)" strokeWidth=".5"key={`${link.x1} ${link.y1} ${link.x2} ${link.y2}`}/>));
		}
		if(this.props.option === "Long Links"){
			content.push(longLinks.map((link) => <line x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} stroke="rgba(255, 0, 255, .3)" strokeWidth=".5"key={`${link.x1} ${link.y1} ${link.x2} ${link.y2}`}/>));
		}
		
		content.push(selected.map((node) => <circle cx={node.x} cy={node.y} r={2+node.shortLink/8} fill="red" key={`${node.x} ${node.y}`} onMouseEnter={this.showTooltip.bind(this, node.tag)} onMouseLeave={this.hideTooltip.bind(this)}/>));
		
		var text = [];
		for (var key in info){
			if(!(key === "building" && info[key] === "yes")){
				var attr = key.charAt(0).toUpperCase() + key.substr(1).toLowerCase();
				text.push(
					<div className="tooltip-info" key={key}><span className="tooltip-key">{attr}: </span>{info[key]} {attr === "Footprint"? decodeURI("m%C2%B2"):""}</div>
				)
			}
		}

		var tooltipstyle = {};

		if (this.state.left){
			tooltipstyle = {
				top: "0",
				left: "0"
			}
		}else{
			tooltipstyle = {
				top: "0",
				right: "0"
			}
		}
		return(
			<div className="nollimap">
				<svg version="1.1" viewBox={`0 0 ${width} ${height}`} style = {{width: this.state.width}}>
					{content}
				</svg>
				<div className={this.state.tooltip? "tooltip":"hide"} style={tooltipstyle}>
					<div className="tooltip-title">Building Details</div>
					{text}
				</div>
			</div>
		)
	}

}

export default POIMap
import React from "react";

class TrafficMap extends React.Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			tooltip: false,
			info: {},
			left: true,
		}
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

	getWayCat = (tag) => {
		const keys = [
			["motorway","trunk", "motorway_link", "trunk_link"],
			["primary", "primary_link"],
			["secondary", "tertiary", "secondary_link", "tertiary_link", "raceway"],
			["unclassified", "residential", "living_street", "road", "escape"],
			["service","pedestrian", "track", "bus_guideway", "footway", "bridleway", "steps", "path", "cycleway"]
		]

		var cat = 5;

		keys.forEach((group, index) => {
			if(group.indexOf(tag) !== -1){
				cat = index;
			}
		});

		return cat;
	}

	render() {
		let content = [[], [], [], [], [], []];
		var {width, height, ways, relations} = this.props;
		var ratio = this.props.lengthratio;
		var info = this.state.info;

		const styles = [
			{
				color: "#b5451a",
				strokeWidth: "16"
			},
			{
				color: "#f15c22",
				strokeWidth: "10"
			},
			{
				color: "#f47d4e",
				strokeWidth: "8"
			},
			{
				color: "#f79d7a",
				strokeWidth: "5"
			},
			{
				color: "#f9bea7",
				strokeWidth: "2"
			},
			{
				color: "#fcded3",
				strokeWidth:"4"
			}
		];

		var cat = -1;
		var style = {};

	    for (var id in ways) {

	    	if (ways[id].tag.highway && (this.props.option === "Roads" || this.props.option === "Both")){
	    		var pts = ways[id].points.map(e => e.join(',')).join(' ');
	    		cat = this.getWayCat(ways[id].tag.highway);
	    		style = styles[cat];
		    	content[5-cat].push(
			    	<path d={`M ${pts}`} fill="none" stroke={style.color} strokeWidth={style.strokeWidth * ratio} strokeLinecap="round" strokeLinejoin="round" key={id+"w"} onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
					    <title>{id}</title>
					</path>
		    	)
			}
	    };

	    for (id in relations) {
	    	if (relations[id].tag.route && (this.props.option === "Public Transport" || this.props.option === "Both")){
	    		relations[id].members.forEach((element, index)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			if (element.role === 'platform'){
					    	content.push(
					    		<path d={`M ${pts}`} fill="red" stroke="red" strokeWidth="1" key={index.toString()+id} onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
					    			<title>{id}</title>
					    		</path>
					    	)

		    			}else{
					    	content.push(
					    		<path d={`M ${pts}`} fill="none" stroke="red" strokeWidth="1" key={index.toString()+id} onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
					    			<title>{id}</title>
					    		</path>
					    	)
					    }
		    		}else if(element.type === 'node' && element.value){
		    			var radius = 50;
		    			if (relations[id].tag.route === "subway" || relations[id].tag.route === "train"){radius = 100}
				    	content.push(
				    		<g key={index.toString()+id}>
			    				<circle cx={element.value[0]} cy={element.value[1]} r={radius*ratio} fill="rgba(255,90,90,.1)" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
					    			<title>{id}</title>
					    		</circle> 
			    				<circle cx={element.value[0]} cy={element.value[1]} r="2" fill="#803535" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
					    			<title>{id}</title>
					    		</circle> 
				    		</g>
				    	)    			
		    		}
	    		})
			}else if(relations[id].tag.highway && (this.props.option === "Roads" || this.props.option === "Both")){
	    		var shapes = '';
	    		relations[id].members.forEach((element)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			shapes += `M ${pts}`;
		    		}
	    		})
	    		cat = this.getWayCat(relations[id].tag.highway);
	    		style = styles[cat];
		    	content[5-cat].push(
		    		<path d={shapes} fillRule="evenodd" fill={style.color} stroke="none" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
		    			<title>{id}</title>
		    		</path>
		    	)

			}
	    };

		var text = [];
		for (var key in info){
			var attr = key.charAt(0).toUpperCase() + key.substr(1).toLowerCase();
			text.push(
				<div className="tooltip-info" key={key}><span className="tooltip-key">{attr}: </span>{info[key]} {attr === "Footprint"? decodeURI("m%C2%B2"):""}</div>
			)
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
					<div className="tooltip-title">Route Details</div>
					{text}
				</div>
			</div>
		)
	}

}

export default TrafficMap
import React from "react";

class NaturalElements extends React.Component {
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

	getElementCat = (tag) => {
		
		const water = {
			"water": [],
			"waterway":["riverbank"],
			"natural": ["water", "wetland", "glacier", "bay", "strait"],
			"landuse": ["basin", "reservoir"],
			"leisure": ["water_park", "swimming_pool", "swimming_area", "marina", "fishing"]
		}

		const green = {
			"natural":["wood", "tree_row", "scrub", "heath", "moor", "grassland"],
			"landuse":["allotments", "farmland", "farmyard", "forest", "grass", "greenfield", "greenhouse_horticulture", "meadow", "orchard", "plant_nursery", "recreation_ground", "village_green", "vineyard"],
			"leisure":["park", "garden", "golf_course", "dog_park", "pitch", "track"]
		}

		for (var key in water) {
			if(water[key].indexOf(tag[key]) != -1 || tag[key] != null && water[key].length === 0){
				return "water";
			}
		};

		for (key in green) {
			if(green[key].indexOf(tag[key]) != -1 || tag[key] && green[key].length === 0){
				return "green";
			}
		};

		return "none";
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
		var {width, height, nodes, ways, relations} = this.props;
		var info = this.state.info;
		const styles = [
			{
				fill: "#7693d3",
			},
			{
				fill: "rgba(52, 168, 0, .4)"
			}
		];

		var cat = "none";
		var style = -1;

	    for (var id in relations) {
			cat = this.getElementCat(relations[id].tag);
			style = -1;
			if (cat === "water"){style = 0}else if (cat === "green"){style = 1}
			if (style != -1){
	    		var shapes = '';
	    		relations[id].members.forEach((element)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			shapes += `M ${pts}`;
		    		}
	    		})
	    		if (cat === "water"){
			    	content.push(
			    		<path d={shapes} fillRule="evenodd" fill={styles[style].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    			<title>{id}</title>
			    		</path>
			    	);
			    }else{
			    	content.unshift(
			    		<path d={shapes} fillRule="evenodd" fill={styles[style].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    			<title>{id}</title>
			    		</path>
			    	);
			    }
			}
	    };


	    for (id in ways) {
			cat = this.getElementCat(ways[id].tag);
			style = -1;
			if (cat === "water"){style = 0}else if (cat === "green"){style = 1}
			if (style != -1){
				var pts = ways[id].points.map(e => e.join(',')).join(' ');
				if (cat === "water"){
			    	content.push(
			    		<polygon points={pts} fill={styles[style].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    	)
			    }else{
			    	content.unshift(
			    		<polygon points={pts} fill={styles[style].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    	)			    	
			    }
			}
	    };

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
					<div className="tooltip-title">Details</div>
					{text}
				</div>
			</div>
		)
	}

}

export default NaturalElements;
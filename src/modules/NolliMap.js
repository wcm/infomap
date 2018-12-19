import React from "react";
import { Link } from "react-router-dom";

class NolliMap extends React.Component {
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

	getBuildingCat = (tag) => {
		const keys = [
			["apartments","farm", "hotel", "house", "detached", "residential", "dormitory", "terrace", "houseboat", "bungalow", "static_caravan", "cabin"],
			["commercial", "office", "industrial", "retail", "supermarket", "warehouse", "kiosk"],
			["religious", "cathedral", "chapel", "church", "mosque", "temple", "synagogue", "shrine"],
			["bakehouse", "kindergarten", "civic", "government", "hospital", "school", "stadium", "train_station", "transportation", "university", "grandstand", "public", "toilets", "service", "parking", "garages", "garage", "sports_hall", "bridge", "	carport", "hangar"],
			["greenhouse","pavilion", "farm_auxiliary", "barn"]
		]

		var cat = 5;

		keys.forEach((group, index) => {
			if(group.indexOf(tag) !== -1){
				cat = index;
			}
		});

		return cat;
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
				fill: "#ad4a00",
			},
			{
				fill: "#7693d3",
			},
			{
				fill: "#0053cc",
			},
			{
				fill: "#cb00d1",
			},
			{
				fill: "#b6ff97",
			},
			{
				fill: "rgba(60, 60, 60)",
			}
		];

		var cat = -1

	    var levels = null;
	    var color = "rgba(60, 60, 60)";

	    for (var id in relations) {

	    	if (relations[id].tag.building || relations[id].tag["buidling:part"]){
	    		var shapes = '';
	    		color = "rgba(60,60,60)";
	    		
	    		relations[id].members.forEach((element)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			shapes += `M ${pts}`;
		    		}
	    		})

	    		if (this.props.option === "Height"){
	    			levels = relations[id].tag["building:levels"];
	    			if (levels){
		    			color = `rgba(0,0,255,${levels/10})`;
			    		content.push(
			    			<path d={shapes} fillRule="evenodd" fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    				<title>{id}</title>
			    			</path>
			    		);
		    		}else{
			    		content.unshift(
			    			<path d={shapes} fillRule="evenodd" fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    				<title>{id}</title>
			    			</path>
			    		);
		    		}
		    	}else if (this.props.option === "Program"){
		    		cat = this.getBuildingCat(relations[id].tag.building);
			    	content.push(
			    		<path d={shapes} fillRule="evenodd" fill={styles[cat].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    			<title>{id}</title>
			    		</path>
			    	);
		    	}else if (this.props.option === "None"){
			    	content.push(
			    		<path d={shapes} fillRule="evenodd" fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    			<title>{id}</title>
			    		</path>
			    	);
		    	}

			}else if ((relations[id].tag.leisure || relations[id].tag.landuse === "grass") && this.props.option === "Program"){
	    		var shapes = '';
	    		relations[id].members.forEach((element)=>{
	    			if (element.type === 'way' && element.value) {
		    			var pts = element.value.map(e => e.join(',')).join(' ');
		    			shapes += `M ${pts}`;
		    		}
	    		})
		    	content.push(
		    		<path d={shapes} fillRule="evenodd" fill={styles[4].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
		    			<title>{id}</title>
		    		</path>
		    	);
			}

	    };


	    for (id in ways) {

	    	if (ways[id].tag.building){

	    		var pts = ways[id].points.map(e => e.join(',')).join(' ');
		    	color = "rgba(60,60,60)";
	    		if (this.props.option === "Height"){
		    		levels = ways[id].tag["building:levels"];
	    			if (levels) {
		    			color = `rgba(0,0,255,${levels/10})`;
			    		content.push(
			    			<polygon points={pts} fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    		)
		    		}else{
			    		content.unshift(
			    			<polygon points={pts} fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    		)	    			
		    		}
		    	}else if (this.props.option === "Program"){
					cat = this.getBuildingCat(ways[id].tag.building);
		    		content.push(
			    		<polygon points={pts} fill={styles[cat].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    	)

		    	}else if (this.props.option === "None"){
			    	content.push(
			    		<polygon points={pts} fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    	)
		    	}

			}else if ((ways[id].tag.leisure || ways[id].tag.landuse === "grass") && this.props.option === "Program"){
				var pts = ways[id].points.map(e => e.join(',')).join(' ');
		    	content.push(
		    		<polygon points={pts} fill={styles[4].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseOver={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
		    	)
			}
	    };

/*	    for (var id in nodes) {
	    	if (nodes[id].tag != {}){
				content.push(
					<circle cx={nodes[id].x} cy={nodes[id].y} r="2" fill="red" key={id}/>
				)
			}
	    };
*/
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
		console.log("rerender!");
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

export default NolliMap
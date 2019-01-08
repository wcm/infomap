import React from "react";
import Pie from "./Pie";

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
		var {width, height, ways, relations} = this.props;
		var info = this.state.info;
		var totalFootprint = 0;
		var footprintPro = [0,0,0,0,0,0];
		var totalFloor = 0;
		var floorPro = [0,0,0,0,0,0]
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
			},
			{
				fill: "rgba(52, 168, 0, .4)"
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

	    		levels = relations[id].tag["building:levels"];
		    	cat = this.getBuildingCat(relations[id].tag.building);

	    		if (this.props.option === "Height"){
	    			if (levels){
		    			color = `rgba(0,0,255,${levels/10})`;
			    		content.push(
			    			<path d={shapes} fillRule="evenodd" fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    				<title>{id}</title>
			    			</path>
			    		);
		    		}else{
			    		content.unshift(
			    			<path d={shapes} fillRule="evenodd" fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    				<title>{id}</title>
			    			</path>
			    		);
		    		}
		    	}else if (this.props.option === "Program"){
			    	content.push(
			    		<path d={shapes} fillRule="evenodd" fill={styles[cat].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    			<title>{id}</title>
			    		</path>
			    	);
		    	}else if (this.props.option === "None"){
			    	content.push(
			    		<path d={shapes} fillRule="evenodd" fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, relations[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}>
			    			<title>{id}</title>
			    		</path>
			    	);
		    	}
	    		totalFootprint += parseFloat(relations[id].tag.footprint);
	    		footprintPro[cat] += parseFloat(relations[id].tag.footprint);
	    		totalFloor += parseFloat(relations[id].tag.footprint) * levels;
	    		floorPro[cat] += parseFloat(relations[id].tag.footprint) * levels;

			}

	    };


	    for (id in ways) {

	    	if (ways[id].tag.building){

	    		var pts = ways[id].points.map(e => e.join(',')).join(' ');
		    	color = "rgba(60,60,60)";
		    	levels = ways[id].tag["building:levels"];
				cat = this.getBuildingCat(ways[id].tag.building);
	    		if (this.props.option === "Height"){
	    			if (levels) {
		    			color = `rgba(0,0,255,${levels/10})`;
			    		content.push(
			    			<polygon points={pts} fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    		)
		    		}else{
			    		content.unshift(
			    			<polygon points={pts} fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    		)	    			
		    		}
		    	}else if (this.props.option === "Program"){
		    		content.push(
			    		<polygon points={pts} fill={styles[cat].fill} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    	)

		    	}else if (this.props.option === "None"){
			    	content.push(
			    		<polygon points={pts} fill={color} stroke="white" strokeWidth=".5" key={id} className="nolli-building" onMouseEnter={this.showTooltip.bind(this, ways[id].tag)} onMouseLeave={this.hideTooltip.bind(this)}/>
			    	)
		    	}

	    		totalFootprint += parseFloat(ways[id].tag.footprint);
	    		footprintPro[cat] += parseFloat(ways[id].tag.footprint);
	    		totalFloor += parseFloat(ways[id].tag.footprint) * levels;
	    		floorPro[cat] += parseFloat(ways[id].tag.footprint) * levels;

			}
	    };

	    var totalArea = this.props.width * this.props.height / this.props.lengthratio / this.props.lengthratio;
	    var unbuilt = totalArea - totalFootprint;

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

		var radius = 60;
		console.log(footprintPro);

		return(
			<div className="nollimap">
				<svg version="1.1" viewBox={`0 0 ${width} ${height}`}>
					{content}
				</svg>
				{totalFootprint != 0?
					<div className="charts">
						<Pie 
							title={"Building footprint"}
							tags={["Built", "Unbuilt"]}
							height = {0}
						    innerRadius={radius * .35}
						    outerRadius={radius}
						    cornerRadius={2}
						    padAngle={.02}
						    data={[totalFootprint, unbuilt]} 
						    styles={[{fill:"rgba(60, 60, 60)"},{fill:"rgba(200, 200, 200)"}]}
						/>
						<Pie 
							title={"Total floor area by program"}
							tags={["Residential", "Commercial", "Religious", "Civic", "Others", "Unknown"]}
							height = {0}
						    innerRadius={radius * .35}
						    outerRadius={radius}
						    cornerRadius={2}
						    padAngle={.02}
						    data={footprintPro} 
						    styles={styles}
						/>
					</div>
				:
					<div/>
				}
				<div className={this.state.tooltip? "tooltip":"hide"} style={tooltipstyle}>
					<div className="tooltip-title">Building Details</div>
					{text}
				</div>
			</div>
		)
	}

}

export default NolliMap
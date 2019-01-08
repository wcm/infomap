import React from "react";
import * as d3 from "d3";

class Slice extends React.Component {
  render() {
    let {pie, innerRadius, outerRadius, cornerRadius, padAngle, styles} = this.props;

    let arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle);

    let interpolate = d3.interpolateRgb("#eaaf79", "#bc3358");

    return pie.map((slice, index) => {
      let sliceColor = interpolate(index / (pie.length - 1));
      return (
        <g  key={index}>
          <path d={arc(slice)} fill={styles[index].fill}/>
          <text transform={`translate(${arc.centroid(slice)[0]}, ${arc.centroid(slice)[1]})`} dy=".35em" color="grey">
            {this.props.tags[index]}
          </text>
        </g>
      );
    });
  };
}

class Pie extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const height = 200;
    const width = 200;
    let {data, innerRadius, outerRadius, cornerRadius, padAngle, styles} = this.props;
    let pie = d3.pie()(data);

    return (
      <svg height={height} width={width}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          <Slice 
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cornerRadius={cornerRadius}
            padAngle={padAngle}
            styles = {styles}
            pie={pie}
            tags={this.props.tags} 
          />
        </g>
      </svg>
    )
  }
}
export default Pie;
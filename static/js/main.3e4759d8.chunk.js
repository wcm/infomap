(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{158:function(e,t,a){},162:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),o=a(30),i=a.n(o),r=a(168),c=a(167);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var l=a(5),p=a(4),h=a(7),d=a(6),u=a(8),m=a(164),g=(a(81),function(e){function t(){return Object(l.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"navbar-wrapper"},s.a.createElement("div",{className:"navbar-logo"},s.a.createElement(m.a,{to:"/infomap/"},s.a.createElement("img",{style:{height:40},src:"/infomap/image/logo.svg",alt:"Infomap Logo"}))),s.a.createElement("div",{className:"navbar-tabs"},s.a.createElement(m.a,{className:"navbar-tabitem",to:"/infomap/about"},"About"),s.a.createElement(m.a,{className:"navbar-tabitem",to:"/infomap/help"},"Help")))}}]),t}(s.a.Component)),b=(a(86),a(48)),w=a(39),v=a(73),f=a.n(v),E=a(26),y=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(h.a)(this,Object(d.a)(t).call(this,e))).updateWindowDimensions=function(){a.setState({width:.833333*window.innerWidth})},a.updateXY=function(e,t,n){var s=n.deltaX,o=n.deltaY;"1"===e?a.props.x+s>=40&&a.props.x+s<=a.state.width/2-40&&a.props.y+o>=60&&a.props.y+o<=a.state.height/2-40&&a.props.setXY({x:a.props.x+s,y:a.props.y+o}):"2"===e?a.props.x-s>=40&&a.props.x-s<=a.state.width/2-40&&a.props.y+o>=60&&a.props.y+o<=a.state.height/2-40&&a.props.setXY({x:a.props.x-s,y:a.props.y+o}):"3"===e?a.props.x+s>=40&&a.props.x+s<=a.state.width/2-40&&a.props.y-o>=60&&a.props.y-o<=a.state.height/2-40&&a.props.setXY({x:a.props.x+s,y:a.props.y-o}):"4"===e&&a.props.x-s>=40&&a.props.x-s<=a.state.width/2-40&&a.props.y-o>=60&&a.props.y-o<=a.state.height/2-40&&a.props.setXY({x:a.props.x-s,y:a.props.y-o})},a.handleStart=function(e,t,n){var s=n.deltaX,o=n.deltaY;a.props.setDragging(!0),a.updateXY(e,t,{deltaX:s,deltaY:o})},a.handleStop=function(e,t,n){var s=n.deltaX,o=n.deltaY;a.props.setDragging(!1),a.updateXY(e,t,{deltaX:s,deltaY:o})},a.handleDrag=function(e,t,n){var s=n.deltaX,o=n.deltaY;a.updateXY(e,t,{deltaX:s,deltaY:o})},a.state={width:0,height:600,dragging:!1},a}return Object(u.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){this.updateWindowDimensions(),window.addEventListener("resize",this.updateWindowDimensions)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateWindowDimensions)}},{key:"render",value:function(){var e=this.state.width,t=this.state.height;return s.a.createElement("div",{className:"selector"},s.a.createElement("div",{className:"shader",style:{position:"absolute",left:0,top:0,height:"".concat(t,"px"),width:"".concat(this.props.x,"px")}}),s.a.createElement("div",{className:"shader",style:{position:"absolute",left:"".concat(e-this.props.x,"px"),top:0,height:"".concat(t,"px"),width:"".concat(this.props.x,"px")}}),s.a.createElement("div",{className:"shader",style:{position:"absolute",left:"".concat(this.props.x,"px"),top:0,height:"".concat(this.props.y,"px"),width:"".concat(e-2*this.props.x,"px")}}),s.a.createElement("div",{className:"shader",style:{position:"absolute",left:"".concat(this.props.x,"px"),top:"".concat(t-this.props.y,"px"),height:"".concat(this.props.y,"px"),width:"".concat(e-2*this.props.x,"px")}}),s.a.createElement(E.DraggableCore,{onStart:this.handleStart.bind(this,"1"),onDrag:this.handleDrag.bind(this,"1"),onStop:this.handleStop.bind(this,"1")},s.a.createElement("div",{className:"handler",style:{top:this.props.y-6,left:this.props.x-6}})),s.a.createElement(E.DraggableCore,{onStart:this.handleStart.bind(this,"2"),onDrag:this.handleDrag.bind(this,"2"),onStop:this.handleStop.bind(this,"2")},s.a.createElement("div",{className:"handler",style:{top:this.props.y-6,left:e-this.props.x-6}})),s.a.createElement(E.DraggableCore,{onStart:this.handleStart.bind(this,"3"),onDrag:this.handleDrag.bind(this,"3"),onStop:this.handleStop.bind(this,"3")},s.a.createElement("div",{className:"handler",style:{top:t-this.props.y-6,left:this.props.x-6}})),s.a.createElement(E.DraggableCore,{onStart:this.handleStart.bind(this,"4"),onDrag:this.handleDrag.bind(this,"4"),onStop:this.handleStop.bind(this,"4")},s.a.createElement("div",{className:"handler",style:{top:t-this.props.y-6,left:e-this.props.x-6}})))}}]),t}(n.Component),x="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",j=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(h.a)(this,Object(d.a)(t).call(this,e))).resize=function(){a.setState({width:.833333*window.innerWidth}),a.handleViewportChange({width:"100%"})},a.handleViewportChange=function(e){if(!1===a.state.isdragging&&(a.setState({viewport:Object(b.a)({},a.state.viewport,e)}),a.mapRef.current)){var t=a.mapRef.current.getMap().getBounds();a.setState({selBounds:{n:t._ne.lat,s:t._sw.lat,w:t._sw.lng,e:t._ne.lng}})}},a.handleOnResult=function(e){console.log(e.result)},a.handleGeocoderViewportChange=function(e){console.log(e),a.handleViewportChange(Object(b.a)({},e,{transitionDuration:100}))},a.setDragging=function(e){a.setState({isdragging:e})},a.setXY=function(e){a.setState({selector:e})},a.getDistance=function(e,t,a,n){var s=e*Math.PI/180,o=a*Math.PI/180,i=(a-e)*Math.PI/180,r=(n-t)*Math.PI/180,c=Math.sin(i/2)*Math.sin(i/2)+Math.cos(s)*Math.cos(o)*Math.sin(r/2)*Math.sin(r/2);return 6371e3*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))},a.getBoundArea=function(e,t,n,s){return a.getDistance(e,n,e,s)*a.getDistance(e,n,t,n)},a.state={viewport:{width:"100%",height:"600px",latitude:37.7577,longitude:-122.4376,zoom:16},searchResultLayer:null,selector:{x:0,y:0},isdragging:!1,selBounds:{n:0,s:0,w:0,e:0},width:0},a.mapRef=s.a.createRef(),a}return Object(u.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.resize),this.resize();var e=this.mapRef.current.getMap().getBounds();this.setState({selBounds:{n:e._ne.lat,s:e._sw.lat,w:e._sw.lng,e:e._ne.lng},selector:{x:.833333*window.innerWidth/4,y:150}})}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resize)}},{key:"render",value:function(){var e=this.state,t=e.viewport,a=(e.searchResultLayer,e.selector),n=e.selBounds,o=n.n-a.y/600*(n.n-n.s),i=n.s+a.y/600*(n.n-n.s),r=n.w+a.x/this.state.width*(n.e-n.w),c=n.e-a.x/this.state.width*(n.e-n.w),l=this.getBoundArea(o,i,r,c);return s.a.createElement("div",{className:"map"},s.a.createElement(w.default,Object.assign({ref:this.mapRef},t,{onViewportChange:this.handleViewportChange,mapboxApiAccessToken:x,mapStyle:"mapbox://styles/mapbox/streets-v9"}),s.a.createElement(f.a,{mapRef:this.mapRef,onResult:this.handleOnResult,onViewportChange:this.handleGeocoderViewportChange,mapboxApiAccessToken:x,position:"top-left"}),s.a.createElement("div",{className:"control"},s.a.createElement(w.NavigationControl,{showCompass:!1,onViewportChange:this.handleViewportChange})),s.a.createElement(y,Object.assign({},a,{setDragging:this.setDragging,setXY:this.setXY}))),l<=1e6?s.a.createElement("div",{className:"row"},s.a.createElement(m.a,{to:"".concat("/infomap","/selected/").concat(r,"/").concat(i,"/").concat(c,"/").concat(o)},s.a.createElement("div",{className:"button proceed-button"},"Proceed to Analysis ")),s.a.createElement("div",{className:"proceed-alert green"}," You can use this selected region. ")):s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"button button-disabled proceed-button"},"Proceed to Analysis "),s.a.createElement("div",{className:"proceed-alert red"}," Area of the selected region is too big. ")),s.a.createElement("div",{className:"clearfix"}),s.a.createElement("div",{className:"raw"},s.a.createElement("div",null,s.a.createElement("p",null,"Viewport Coordinates:"),s.a.createElement("p",null," ","n: ".concat(n.n," s: ").concat(n.s," w: ").concat(n.w," e: ").concat(n.e))),s.a.createElement("div",null,s.a.createElement("p",null,"Selected Region Coordinates:"),s.a.createElement("p",null," ","n: ".concat(o," s: ").concat(i," w: ").concat(r," e: ").concat(c))),s.a.createElement("div",null,s.a.createElement("p",null,"Selected Region Area:"),s.a.createElement("p",null," ",l))))}}]),t}(n.Component),O=function(e){function t(){return Object(l.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"content-wrapper"},s.a.createElement("div",{className:"title"},"Select an Area"),s.a.createElement(j,null))}}]),t}(s.a.Component),S=function(e){function t(){return Object(l.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return s.a.createElement("div",null,s.a.createElement("div",null,"Help"))}}]),t}(s.a.Component),D=function(e){function t(){return Object(l.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){return s.a.createElement("div",null,s.a.createElement("div",null,"About"))}}]),t}(s.a.Component),N=a(74),C=a.n(N),Y=(a(151),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(h.a)(this,Object(d.a)(t).call(this,e))).state={raw:null},a.bounds=a.props.match.params,a}return Object(u.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){var e=this;C.a.get("https://api.openstreetmap.org/api/0.6/map?bbox=".concat(this.bounds.wlng,",").concat(this.bounds.slat,",").concat(this.bounds.elng,",").concat(this.bounds.nlat)).then(function(t){t.data&&e.setState({raw:t.data})})}},{key:"render",value:function(){return s.a.createElement("div",null,s.a.createElement("div",null,"n: ".concat(this.bounds.nlat," s: ").concat(this.bounds.slat," w: ").concat(this.bounds.wlng," e: ").concat(this.bounds.elng)),s.a.createElement("div",null,"API address: ","https://api.openstreetmap.org/api/0.6/map?bbox=".concat(this.bounds.wlng,",").concat(this.bounds.slat,",").concat(this.bounds.elng,",").concat(this.bounds.nlat)),s.a.createElement("div",null,this.state.raw))}}]),t}(s.a.Component));a(158);i.a.render(s.a.createElement(r.a,null,s.a.createElement("div",{className:"content"},s.a.createElement(g,null),s.a.createElement(c.a,{exact:!0,path:"/infomap/",component:O}),s.a.createElement(c.a,{exact:!0,path:"/infomap/help",component:S}),s.a.createElement(c.a,{exact:!0,path:"/infomap/about",component:D}),s.a.createElement(c.a,{exact:!0,path:"/infomap/selected/:wlng/:slat/:elng/:nlat",component:Y}))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},76:function(e,t,a){e.exports=a(162)},81:function(e,t,a){},86:function(e,t,a){}},[[76,2,1]]]);
//# sourceMappingURL=main.3e4759d8.chunk.js.map
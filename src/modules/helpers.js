export function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

export function distSq(x1, y1, x2, y2){
    return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
}

export function	getArea(array) {
	var x = array;
	var a = 0;
	if (x.length < 3) return 0;
	for (var i = 0; i < (x.length-1); i += 1) {
	    a += x[i][0] * x[i+1][1] - x[i+1][0] * x[i][1];
	}
	return Math.abs(a * 1.0 / 2);
}

export function getDistance(lat1, lon1, lat2, lon2) {
	var R = 6371e3; // metres
	var φ1 = lat1* Math.PI / 180;
	var φ2 = lat2* Math.PI / 180;
	var Δφ = (lat2-lat1)* Math.PI / 180;
	var Δλ = (lon2-lon1)* Math.PI / 180;

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		Math.cos(φ1) * Math.cos(φ2) *
		Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}

export function getBoundArea(lat1, lat2, lon1, lon2) {
	return getDistance(lat1, lon1, lat1, lon2) * getDistance(lat1, lon1, lat2, lon1)
}



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

var n = 0;
var m = Infinity;

function tick() {
	if ( --m <= 0 ) return;
	++n
	try {
		var x = process.nextTick( tick );
		if ( x !== void 0 ) {
			console.log("returned: %s - at call %d", x, n);
		}
	} catch ( e ) {
		console.log(n);
		throw e;
	}
}


module.exports = function( c ) {
	n = 0;
	m = c;
	tick();
};


module.exports.n = function() {
	return n;
};

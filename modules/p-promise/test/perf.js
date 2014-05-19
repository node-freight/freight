
var P = require('../p');
var task = function(){};

function testOne( name, f, n ) {
	var time = process.hrtime();

	while ( n-- ) {
		f( task );
	}

	var diff = process.hrtime( time );
	console.log( "%s: %d ns", name, diff[0] * 1e9 + diff[1] );
}

module.exports = function( n ) {
	testOne('nextTick', process.nextTick, n);

	P.setSafe(false);
	testOne('runLater (unsafe)', P.runLater, n);

	P.setSafe(true);
	testOne('runLater (safe)', P.runLater, n);
}


var P = require("../p");
var each = P._each;
var ALT = P.ALT;

function settled( value ) {
	var deferred = P.defer();
	deferred.fulfill( value );
	return deferred.promise;
}

function rejected( reason ) {
	var deferred = P.defer();
	deferred.reject( reason );
	return deferred.promise;
}

exports.reduceInOrder = function( promises, func ) {
	var accPromise;

	if ( arguments.length > 2 ) {
		accPromise = P( arguments[2] );
	}

	each( promises, function( promise, index ) {
		accPromise = accPromise ?
			accPromise.then(function( acc ) {
				return P( promise ).then(function( value ) {
					return func( acc, value, index, promise );
				});
			}) :
			P( promise );
	});

	if ( !accPromise ) {
		throw new TypeError("reduce of empty array with no initial value");
	}

	return accPromise;
}

exports.reduce = function( promises, func ) {
	var deferred = P.defer();
	var waiting = 1;
	var accPromise;
	var finished = false;

	if ( arguments.length > 2 ) {
		++waiting;
		accPromise = P( arguments[2] );
		accPromise.then( check, reject, ALT );
	}

	function check() {
		if ( --waiting === 0 && !finished ) {
			deferred.resolve( accPromise );
		}
	}

	function reject( reason ) {
		if ( !finished ) {
			finished = true;
			deferred.reject( reason );
		}
	}

	each( promises, function( promise, index ) {
		++waiting;
		P( promise ).then(function( value ) {
			if ( finished ) {
				return;
			}

			accPromise = accPromise ?
				accPromise.then(function( acc ) {
					return func( acc, value, index, promises );
				}) :
				settled( value );

			accPromise.then( check, reject, ALT, true );

		}, reject, ALT);
	});

	if ( !waiting ) {
		throw new TypeError("reduce of empty array with no initial value");
	}

	return deferred.promise;
};

exports.reduce2 = function( promises, func ) {
	var deferred = P.defer();
	var waiting = 0;
	var finished = false;
	var haveValue = false;
	var lastValue, lastIndex;

	if ( arguments.length > 2 ) {
		++waiting;
		P( arguments[2] ).then( check, reject, ALT );
	}

	function reject( reason ) {
		finished = true;
		lastValue = void 0;
		deferred.reject( reason );
	}

	function check( value, index ) {
		var tmp, undef;

		if ( finished ) {
			return;
		}

		if ( !waiting && index === void 0 ) {
			deferred.fulfill( value );
			return;
		}

		if ( haveValue ) {
			haveValue = false;
			if ( index === undef && lastIndex !== undef ) {
				tmp = value;
				value = lastValue;
				index = lastIndex;
			} else {
				tmp = lastValue;
			}
			lastValue = undef;

			try {
				tmp = func( tmp, value, index, promises );
			} catch ( ex ) {
				reject( ex );
				return;
			}

			P( tmp ).then( check, reject, ALT );

		} else {
			haveValue = true;
			lastValue = value;
			lastIndex = index;
		}
	}

	each( promises, function( promise, index ) {
		++waiting;
		P( promise ).then(function( value ) {
			--waiting;
			check( value, index );
		}, reject, ALT );
	});

	if ( !waiting ) {
		throw new TypeError("reduce of empty array with no initial value");
	}

	return deferred.promise;
}

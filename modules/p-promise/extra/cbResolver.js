
var apply = Function.apply;
var slice = [].alice;



function fnResolver( deferred ) {
	return function( error, value ) {
		if ( error ) {
			deferred.reject( error );
		} else {
			deferred.resolve( value );
		}
	};
}


function fapply( func, context, args, f ) {
	function cb() {
		try {
			d.resolve( apply.call(f, this, arguments) );
		} catch ( e ) {
			d.reject( e );
		}
	}

	var d = P.defer();
	args.push( cb );
	apply.call( func, context, args );
	return d.promise;
}

function fnapply( func, context, args ) {
	function cb( error, value ) {
		if ( error ) {
			d.reject( error );
		} else {
			d.resolve( value );
		}
	}

	var d = P.defer();
	args.push( cb );
	apply.call( func, context, args );
	return d.promise;
}

function decallback( func, context, f ) {
	return function() {
		return fapply( func, context, slice.call(arguments), f );
	};
}

function denodify( func, context ) {
	return function() {
		return fnapply( func, context, slice.call(arguments) );
	};
}

var readFile = denodify( FS.readFile, FS );

var fileExists = decallback( FS.exists, FS, function(exists) { return exists } );

var dataP = readFile( path );

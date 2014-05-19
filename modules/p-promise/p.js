/*!
 * Copyright 2013 Robert Katić
 * Released under the MIT license
 * https://github.com/rkatic/p/blob/master/LICENSE
 */
;(function( factory ){
	// CommonJS
	if ( typeof module !== "undefined" && module && module.exports ) {
		module.exports = factory();

	// RequireJS
	} else if ( typeof define === "function" && define.amd ) {
		define( factory );

	// global
	} else {
		P = factory();
	}
})(function() {
	"use strict";

	var
		head = { f: null, n: null }, tail = head,
		running = false,

		channel, // MessageChannel
		requestTick, // --> requestTick( onTick, 0 )

		// window or worker
		wow = ot(typeof window) && window || ot(typeof worker) && worker,

		call = ot.call,
		apply = ot.apply;

	function onTick() {
		while ( head.n ) {
			head = head.n;
			var f = head.f;
			head.f = null;
			f();
		}
		running = false;
	}

	var runLater = function( f ) {
		tail = tail.n = { f: f, n: null };
		if ( !running ) {
			running = true;
			requestTick( onTick, 0 );
		}
	};

	function ot( type ) {
		return type === "object" || type === "function";
	}

	if ( ot(typeof process) && process && process.nextTick ) {
		requestTick = process.nextTick;

	} else if ( ot(typeof setImmediate) ) {
		requestTick = wow ?
			function( cb ) {
				wow.setImmediate( cb );
			} :
			function( cb ) {
				setImmediate( cb );
			};

	} else if ( ot(typeof MessageChannel) ) {
		channel = new MessageChannel();
		channel.port1.onmessage = onTick;
		requestTick = function() {
			channel.port2.postMessage(0);
		};

	} else {
		requestTick = setTimeout;

		if ( wow && ot(typeof Image) && Image ) {
			(function(){
				var c = 0;

				var requestTickViaImage = function( cb ) {
					var img = new Image();
					img.onerror = cb;
					img.src = 'data:image/png,';
				};

				// Before using it, test if it works properly, with async dispatching.
				try {
					requestTickViaImage(function() {
						if ( --c === 0 ) {
							requestTick = requestTickViaImage;
						}
					});
					++c;
				} catch (e) {}

				// Also use it only if faster then setTimeout.
				c && setTimeout(function() {
					c = 0;
				}, 0);
			})();
		}
	}

	//__________________________________________________________________________


	function forEach( arr, cb ) {
		for ( var i = 0, l = arr.length; i < l; ++i ) {
			if ( i in arr ) {
				cb( arr[i], i );
			}
		}
	}

	function reportError( error ) {
		try {
			if ( P.onerror ) {
				P.onerror( error );
			} else {
				throw error;
			}

		} catch ( e ) {
			setTimeout(function() {
				throw e;
			}, 0);
		}
	}

	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	function P( x ) {
		return x instanceof Promise ?
			x :
			Resolve( new Promise(), x );
	}

	function Settle( p, state, value ) {
		if ( p._state ) {
			return p;
		}

		p._state = state;
		p._value = value;

		if ( p._pending.length > 0 ) {
			forEach( p._pending, runLater );
		}
		p._pending = null;

		return p;
	}

	function OnSettled( p, f ) {
		p._pending.push( f );
		//p._tail = p._tail.n = { f: f, n: null };
	}

	function Resolve( p, x ) {
		if ( p._state ) {
			return p;
		}

		if ( x instanceof Promise ) {
			if ( x === p ) {
				Settle( p, REJECTED, new TypeError("You can't resolve a promise with itself") );

			} else if ( x._state ) {
				Settle( p, x._state, x._value );

			} else {
				OnSettled(x, function() {
					Settle( p, x._state, x._value );
				});
			}

		} else if ( x !== Object(x) ) {
			Settle( p, FULFILLED, x );

		} else {
			runLater(function() {
				var r = resolverFor( p );

				try {
					var then = x.then;

					if ( typeof then === "function" ) {
						call.call( then, x, r.resolve, r.reject );

					} else {
						Settle( p, FULFILLED, x );
					}

				} catch ( e ) {
					r.reject( e );
				}
			});
		}

		return p;
	}

	function resolverFor( promise ) {
		var done = false;

		return {
			promise: promise,

			resolve: function( y ) {
				if ( !done ) {
					done = true;
					Resolve( promise, y );
				}
			},

			reject: function( reason ) {
				if ( !done ) {
					done = true;
					Settle( promise, REJECTED, reason );
				}
			}
		};
	}

	P.defer = defer;
	function defer() {
		return resolverFor( new Promise() );
	}

	P.reject = reject;
	function reject( reason ) {
		return Settle( new Promise(), REJECTED, reason );
	}

	function Promise() {
		this._state = 0;
		this._value = void 0;
		this._pending = [];
	}

	Promise.prototype.then = function( onFulfilled, onRejected ) {
		var cb = typeof onFulfilled === "function" ? onFulfilled : null;
		var eb = typeof onRejected === "function" ? onRejected : null;

		var p = this;
		var p2 = new Promise();

		function onSettled() {
			var x, func = p._state === FULFILLED ? cb : eb;

			if ( func !== null ) {
				try {
					x = func( p._value );

				} catch ( e ) {
					Settle( p2, REJECTED, e );
					return;
				}

				Resolve( p2, x );

			} else {
				Settle( p2, p._state, p._value );
			}
		}

		if ( p._state === PENDING ) {
			OnSettled( p, onSettled );

		} else {
			runLater( onSettled );
		}

		return p2;
	};

	Promise.prototype.done = function( cb, eb ) {
		var p = this;

		if ( cb || eb ) {
			p = p.then( cb, eb );
		}

		p.then( null, reportError );
	};

	Promise.prototype.fail = function( eb ) {
		return this.then( null, eb );
	};

	Promise.prototype.spread = function( cb, eb ) {
		return this.then(cb && function( array ) {
			return all( array, [] ).then(function( values ) {
				return apply.call( cb, void 0, values );
			}, eb);
		}, eb);
	};

	Promise.prototype.timeout = function( ms, msg ) {
		var p = this;
		var p2 = new Promise();

		if ( p._state !== PENDING ) {
			Settle( p2, p._state, p._value );

		} else {
			var timeoutId = setTimeout(function() {
				Settle( p2, REJECTED,
					new Error(msg || "Timed out after " + ms + " ms") );
			}, ms);

			OnSettled(p, function() {
				clearTimeout( timeoutId );
				Settle( p2, p._state, p._value );
			});
		}

		return p2;
	};

	Promise.prototype.delay = function( ms ) {
		var d = defer();

		this.then(function( value ) {
			setTimeout(function() {
				d.resolve( value );
			}, ms);
		}, d.reject);

		return d.promise;
	};

	Promise.prototype.inspect = function() {
		switch ( this._state ) {
			case PENDING:   return { state: "pending" };
			case FULFILLED: return { state: "fulfilled", value: this._value };
			case REJECTED:  return { state: "rejected", reason: this._value };
			default: throw new TypeError("invalid state");
		}
	};

	function valuesHandler( f ) {
		function onFulfilled( values ) {
			return f( values, [] );
		}

		function handleValues( values ) {
			return P( values ).then( onFulfilled );
		}

		handleValues._ = f;
		return handleValues;
	}

	P.allSettled = valuesHandler( allSettled );
	function allSettled( input, output ) {
		var waiting = 0;
		var promise = new Promise();
		forEach( input, function( x, index ) {
			var p = P( x );
			if ( p._state === PENDING ) {
				++waiting;
				OnSettled(p, function() {
					output[ index ] = p.inspect();
					if ( --waiting === 0 ) {
						Settle( promise, FULFILLED, output );
					}
				});
			} else {
				output[ index ] = p.inspect();
			}
		});
		if ( waiting === 0 ) {
			Settle( promise, FULFILLED, output );
		}
		return promise;
	}

	P.all = valuesHandler( all );
	function all( input, output ) {
		var waiting = 0;
		var d = defer();
		forEach( input, function( x, index ) {
			var p = P( x );
			if ( p._state === FULFILLED ) {
				output[ index ] = p._value;

			} else {
				++waiting;
				p.then(function( value ) {
					output[ index ] = value;
					if ( --waiting === 0 ) {
						d.resolve( output );
					}
				}, d.reject);
			}
		});
		if ( waiting === 0 ) {
			d.resolve( output );
		}
		return d.promise;
	}

	P.promised = promised;
	function promised( f ) {
		function onFulfilled( thisAndArgs ) {
			return apply.apply( f, thisAndArgs );
		}

		return function() {
			var allArgs = all( arguments, [] );
			return all( [this, allArgs], [] ).then( onFulfilled );
		};
	}

	P.onerror = null;

	P.nextTick = function( f ) {
		runLater(function() {
			try {
				f();

			} catch ( ex ) {
				setTimeout(function() {
					throw ex;
				}, 0);
			}
		});
	};

	return P;
});



;(function( factory ){
	// CommonJS
	if ( typeof module !== "undefined" && module && module.exports ) {
		module.exports = factory();

	// RequireJS
	} else if ( typeof define === "function" && define.amd ) {
		define( factory );

	// global
	} else {
		nextTurn = factory();
	}
})(function() {
	"use strict";

	var exports = nextTick,

		head = { task: null, next: null }, tail = head,
		looping = false,

		nextEventLoop,
		nextTickish,

		channel, // MessageChannel

		// window or worker
		wow = ot(typeof window) && window || ot(typeof worker) && worker;


	function loop( end ) {
		// NOTE: use not-strict equality check here!
		// `end` can be `undefined`, and not `null`.
		looping = true;
		while ( head.next != end ) {
			head = head.next;
			var task = head.task;
			head.task = null;
			task();
		}
		looping = false;
	}


	function addNode( node, run ) {
		if ( node ) {
			tail = tail.next = node;
		}
		if ( run && !looping ) {
			nextTickish( loop );
		}
	}

	function ot( type ) {
		return type === "object" || type === "function";
	}

	if ( ot(typeof process) && process ) {
		nextTick = process.nextTick;
	}

	if ( wow && wow.setImmediate ) {
		nextEventLoop = function( cb ) {
			wow.setImmediate( cb );
		};

	} else if ( ot(typeof setImmediate) ) {
		nextEventLoop = function( cb ) {
			setImmediate( cb );
		}

	} else if ( ot(typeof MessageChannel) ) {
		channel = new MessageChannel();
		channel.port1.onmessage = onTick;
		nextEventLoop = function() {
			channel.port2.postMessage(0);
		};

	} else {
		nextEventLoop = function( cb ) {
			setTimeout( cb, 0 );
		}

		if ( wow && ot(typeof Image) && Image ) {
			(function(){
				var c = 0;

				var requestEventViaImage = function( cb ) {
					var img = new Image();
					img.onerror = cb;
					img.src = 'data:image/png,';
				};

				// Before using it, test if it works properly, with async dispatching.
				try {
					requestEventViaImage(function() {
						if ( --c === 0 ) {
							nextEventLoop = requestEventViaImage;
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

	nextTickish = nextTick || nextEventLoop;

	function nextTick( f ) {
		nextTickUnsafe( makeSafe( f ) );
	}

	nextTick.unsafe = nextTickUnsafe;
	function nextTickUnsafe( f ) {
		addTaskNode( { task: f, next: null }, true );
	}

	exports.makeSafe = makeSafe;
	function makeSafe( f ) {
		try {
			f();
		} catch ( e ) {
			nextEventLoop(function() {
				throw e;
			});
		}
	}


	exports.TaskBuffer = TaskBuffer;
	function TaskBuffer() {
		this.next = null;
		this.tail = this;
	}

	TaskBuffer.prototype.push = function( task ) {
		this.tail = this.tail.next = {
			task: task,
			token: head,
			next: null
		};
	};

	TaskBuffer.prototype.flush = function( sync ) {
		var node = head.next;

		node && addTaskNode( node, true );

		if ( sync && !head.next ) {
			while ( node && node.token !== head ) {
				node = node.next;
			}

			loop( node );
		}
	};

	return exports;
});

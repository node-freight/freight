
var P = require('../p');

exports.pending = function() {
	var d = P.defer();

	return {
		promise: d.promise,
		fulfill: d.resolve,
		reject: d.reject
	};
};

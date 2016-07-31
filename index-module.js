function IOCDepNotFound(key) {
	this.key = key;
	this.name = "IOCDepNotFound";
}
var ioc;
(function (ioc) {
	var $data = {};
	function $get(key) {
		var value = $data[key];
		if (value === undefined || value === null) {
			throw new IOCDepNotFound(key);
		}
		return value;
	}
	ioc.$get = $get;
	function $set(key, value) {
		$data[key] = value;
	}
	ioc.$set = $set;
	function _inject(args) {
		var values = [];
		console.log(args);
		for (var i = 0; i < args.length; i++) {
			var d = $data[args[i]];
			if (d === undefined || d === null) {
				throw new IOCDepNotFound(args[i]);
			}
			values.push($data[args[i]]);
		}
		return values;
	}
	function $inject() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			args[_i - 0] = arguments[_i];
		}
		// Check last arg is a func
		var fn = args[args.length - 1];
		if (typeof fn !== "function") {
			throw "Last argument must be a function";
		}
		args.pop(); // Remove fn argument
		var values = _inject(args);
		return fn.apply(this, values);
	}
	ioc.$inject = $inject;
	function $invoke(args, fn) {
		var values = _inject(args);
		console.log(values);
		return fn.apply(this, values);
	}
	ioc.$invoke = $invoke;
	function $call(fn) {
		var args = _getArgs(fn);
		var values = _inject(args);
		return fn.apply(this, values);
	}
	ioc.$call = $call;
	function _getArgs(func) {
		// First match everything inside the function argument parens.
		var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
		// Split the arguments string into an array comma delimited.
		var mapstr = args.split(',').map(function (arg) {
			// Ensure no inline comments are parsed and trim the whitespace.
			return arg.replace(/\/\*.*\*\//, '').trim();
		});
		//return mapstr;
		return mapstr.filter(function (arg) {
			// Ensure no undefined values are added.
			return arg;
		});
	}
})(ioc || (ioc = {}));
;
exports = module.exports = ioc;
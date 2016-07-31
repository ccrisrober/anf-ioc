function iocDepNotFound(key) {
	this.key = key;
	this.name = "iocDepNotFound";
}
var ioc = (function () {
	function ioc() {
		this.$data = {};
	}
	ioc.prototype.$get = function (key) {
		var value = this.$data[key];
		if (value === undefined || value === null) {
			throw new iocDepNotFound(key);
		}
		return value;
	};
	ioc.prototype.$set = function (key, value) {
		this.$data[key] = value;
	};
	ioc.prototype._inject = function (args) {
		var values = [];
		console.log(args);
		for (var i = 0; i < args.length; i++) {
			var d = this.$data[args[i]];
			if (d === undefined || d === null) {
				throw new iocDepNotFound(args[i]);
			}
			values.push(this.$data[args[i]]);
		}
		return values;
	};
	ioc.prototype.$inject = function () {
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
		var values = this._inject(args);
		return fn.apply(this, values);
	};
	ioc.prototype.$invoke = function (args, fn) {
		var values = this._inject(args);
		console.log(values);
		return fn.apply(this, values);
	};
	ioc.prototype.$call = function (fn) {
		var args = this._getArgs(fn);
		var values = this._inject(args);
		return fn.apply(this, values);
	};
	ioc.prototype._getArgs = function (func) {
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
	};
	return ioc;
}());
;

exports = module.exports = ioc;
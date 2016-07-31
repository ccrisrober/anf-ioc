function IOCDepNotFound(key) {
	this.key = key;
	this.name = "IOCDepNotFound";
}

module IOC2 {
	var $data = {};
	export function $get(key) {
		var value = $data[key];
		if(value === undefined || value === null) {
			throw new IOCDepNotFound(key);
		}
		return value;
	}
	export function $set(key, value) {
		$data[key] = value;
	}
	function _inject(args: string[]) {
		var values : string[] = [];
		// console.log(args);
		for(var i = 0; i < args.length; i++) {
			var d = $data[args[i]];
			if(d === undefined || d === null) {
				throw new IOCDepNotFound(args[i]);
			}
			values.push($data[args[i]]);
		}
		return values;
	}
	export function $inject(...args: any[]) {
		// Check last arg is a func
		var fn = args[args.length-1];
		if(typeof fn !== "function") {
			throw "Last argument must be a function";
		}
		args.pop(); // Remove fn argument
		var values = _inject(args);
		return fn.apply(this, values);
	}
	export function $invoke(args : Array<string>, fn) {
		var values = _inject(args);
		// console.log(values);
		return fn.apply(this, values);
	}
	export function $call(fn: Function) {
		var args = _getArgs(fn);
		var values = _inject(args);
		return fn.apply(this, values);
	}
	
	function _getArgs(func: Function) {
		// First match everything inside the function argument parens.
		var args : string = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
		
		// Split the arguments string into an array comma delimited.
		var mapstr : string[] = args.split(',').map((arg) => {
			// Ensure no inline comments are parsed and trim the whitespace.
			return arg.replace(/\/\*.*\*\//, '').trim();
		});
		//return mapstr;
		return mapstr.filter((arg: any) => {
			// Ensure no undefined values are added.
			return arg;
		});
	}
};
function IOCDepNotFound(key) {
	this.key = key;
	this.name = "IOCDepNotFound";
}
class IOC {
	public $data = {};
	constructor() {
	}
	public $get(key) {
		var value = this.$data[key];
		if(value === undefined || value === null) {
			throw new IOCDepNotFound(key);
		}
		return value;
	}
	public $set(key, value) {
		this.$data[key] = value;
	}
	protected _inject(args: string[]) {
		var values : string[] = [];
		// console.log(args);
		for(var i = 0; i < args.length; i++) {
			var d = this.$data[args[i]];
			if(d === undefined || d === null) {
				throw new IOCDepNotFound(args[i]);
			}
			values.push(this.$data[args[i]]);
		}
		return values;
	}
	public $inject(...args: any[]) {
		// Check last arg is a func
		var fn = args[args.length-1];
		if(typeof fn !== "function") {
			throw "Last argument must be a function";
		}
		args.pop(); // Remove fn argument
		var values = this._inject(args);
		return fn.apply(this, values);
	}
	public $invoke(args : Array<string>, fn) {
		var values = this._inject(args);
		// console.log(values);
		return fn.apply(this, values);
	}
	public $call(fn: Function) {
		var args = this._getArgs(fn);
		var values = this._inject(args);
		return fn.apply(this, values);
	}
	
	private _getArgs(func: Function) {
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
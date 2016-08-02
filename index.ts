function IOCDepNotFound(key) {
	this.key = key;
	this.name = "IOCDepNotFound";
}
class IOC {
	public _data : { [key:string]:any; } = {};
	constructor() {
		this._data = {};
	}
	public $get(key: string) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		var value = this._data[key];
		if(value === undefined || value === null) {
			throw new IOCDepNotFound(key);
		}
		return value;
	}
	public $set(key: string, value : any) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		this._data[key] = value;
	}
	protected _inject(args: string[]) {
		var values : string[] = [];
		// console.log(args);
		for(var i = 0; i < args.length; i++) {
			var d = this._data[args[i]];
			if(d === undefined || d === null) {
				throw new IOCDepNotFound(args[i]);
			}
			values.push(this._data[args[i]]);
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
	
	private _getArgs(fn: Function) {
		// First match everything inside the function argument parens.
		var args : string = fn.toString().match(/function\s.*?\(([^)]*)\)/)[1];
		
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
	public keys() {
		return Object.keys(this._data);
	}
	public has(key: string) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		return (key in this._data === true);
	}
	public remove(key: string) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		delete this._data[key];
	}
	public addList(list : { [key:string]:any; }) {
		for (var key in list) {
			var value = list[key];
			this.$set(key, value);
		}
	}
	public _getAll() {
		return this._data;
	}
};
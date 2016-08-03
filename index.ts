/** 
 * Copyright (c) 2016, maldicion069 (Cristian Rodríguez) <ccrisrober@gmail.con>
 *	
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */
class IOCDepNotFound extends Error {
    public name = "IOCDepNotFound";
    constructor (public message?: string) {
        super(message);
    }
}

interface IIOC {
	$get(key: string): any;
	$set(key: string, value: any, check_exist?: boolean) : void;
	$inject(...args: any[]) : void;
	$invoke(args: Array<string>, fn: Function) : void;
	$call(fn: Function) : void;
	$remove(key: string) : void;
	$addList(list : { [key:string]:any; }) : void;
	
	$singleton(key: string, fn: Function);
	//has(key: string);
	//item(key: string)
	//getAll();
	//clear();
};

class IOC implements IIOC{
	private _data : { [key:string]:any; };
	constructor() {
		this._data = {};
	}
	public $get(key: string) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		if(!this._has(key)) {
			throw new IOCDepNotFound(key);
		}
		var value = this._data[key];
		return (typeof value === "function") ? value() : value;
	}
	public $set(key: string, value: any, check_exist?: boolean) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		if((check_exist === true) && (this._has(key))) {
			console.warn("Key " + key + " is already defined ...");
		}
		this._data[key] = value;
	}
	public $inject(...args: any[]) {
		var fn : Function = <Function>args[args.length-1];
		// Check last arg is a func
		if(typeof fn !== "function") {
			throw new TypeError("Last argument must be a function");
		}
		args.pop(); // Remove fn argument
		for(var i in args) {
			args[i] = this._item(args[i]);
		}
		return fn.apply(null, args);
	}
	public $invoke(args: Array<string>, fn: Function) {
		for(var i in args) {
			args[i] = this.$get(args[i]);
		}
		return fn.apply(null, args);
	}
	public $call(fn: Function) {
		// Get args from function arguments definition
		var args: Array<string> = this._getArgs(fn);
		for(var i in args) {
			args[i] = this.$get(args[i]);
		}
		return fn.apply(null, args);
	}
	public $remove(key: string) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		delete this._data[key];
	}
	public $addList(list : { [key:string]:any; }) {
		for (var key in list) {
			this.$set(key, list[key]);
		}
	}
	public $singleton(key: string, fn: Function) {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		if(typeof fn !== "function") {
			throw new TypeError("key argument must be a function");
		}
		var eval_func;
		this._data[key] = function() {
			if(!eval_func) {
				eval_func = arguments.length ? fn.apply(null, arguments) : fn();
			}
			return eval_func;
		}
		return this;
	}
	// ================= PROTECTED ================= //
	protected _getArgs(fn: Function) : Array<string> {
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
	protected _item(key: string) : any {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		if(this._has(key)) {
			return this._data[key];
		}
		throw new IOCDepNotFound(key);
	}
	protected _has(key: string) : boolean {
		if(typeof key !== "string") {
			throw new TypeError("key argument must be a string");
		}
		return (key in this._data) === true;
	}
	protected _getAll(): { [key:string]:any; } {
		return this._data;
	}
	protected _clear() {
		// Each keys in _data dictionary
		for (var x in this._data) 
			if (this._data.hasOwnProperty(x)) 
				delete this._data[x];
	}
	protected _keys() : Array<string> {
		return Object.keys(this._data);
	}
};
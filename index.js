var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var IOCDepNotFound = (function (_super) {
    __extends(IOCDepNotFound, _super);
    function IOCDepNotFound(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "IOCDepNotFound";
    }
    return IOCDepNotFound;
}(Error));
;
var IOC = (function () {
    function IOC() {
        this._data = {};
    }
    IOC.prototype.$get = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        if (!this._has(key)) {
            throw new IOCDepNotFound(key);
        }
        var value = this._data[key];
        return (typeof value === "function") ? value() : value;
    };
    IOC.prototype.$set = function (key, value, check_exist) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        if ((check_exist === true) && (this._has(key))) {
            console.warn("Key " + key + " is already defined ...");
        }
        this._data[key] = value;
    };
    IOC.prototype.$inject = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var fn = args[args.length - 1];
        // Check last arg is a func
        if (typeof fn !== "function") {
            throw new TypeError("Last argument must be a function");
        }
        args.pop(); // Remove fn argument
        for (var i in args) {
            args[i] = this._item(args[i]);
        }
        return fn.apply(null, args);
    };
    IOC.prototype.$invoke = function (args, fn) {
        for (var i in args) {
            args[i] = this.$get(args[i]);
        }
        return fn.apply(null, args);
    };
    IOC.prototype.$call = function (fn) {
        // Get args from function arguments definition
        var args = this._getArgs(fn);
        for (var i in args) {
            args[i] = this.$get(args[i]);
        }
        return fn.apply(null, args);
    };
    IOC.prototype.$remove = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        delete this._data[key];
    };
    IOC.prototype.$addList = function (list) {
        for (var key in list) {
            this.$set(key, list[key]);
        }
    };
    IOC.prototype.$singleton = function (key, fn) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        if (typeof fn !== "function") {
            throw new TypeError("key argument must be a function");
        }
        var eval_func;
        this._data[key] = function () {
            if (!eval_func) {
                eval_func = arguments.length ? fn.apply(null, arguments) : fn();
            }
            return eval_func;
        };
        return this;
    };
    // ================= PROTECTED ================= //
    IOC.prototype._getArgs = function (fn) {
        // First match everything inside the function argument parens.
        var args = fn.toString().match(/function\s.*?\(([^)]*)\)/)[1];
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
    IOC.prototype._item = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        if (this._has(key)) {
            return this._data[key];
        }
        throw new IOCDepNotFound(key);
    };
    IOC.prototype._has = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        return (key in this._data) === true;
    };
    IOC.prototype._getAll = function () {
        return this._data;
    };
    IOC.prototype._clear = function () {
        // Each keys in _data dictionary
        for (var x in this._data)
            if (this._data.hasOwnProperty(x))
                delete this._data[x];
    };
    IOC.prototype._keys = function () {
        return Object.keys(this._data);
    };
    return IOC;
}());
;

exports = module.exports = IOC;
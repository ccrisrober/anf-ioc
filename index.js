function IOCDepNotFound(key) {
    this.key = key;
    this.name = "IOCDepNotFound";
}
var IOC = (function () {
    function IOC() {
        this._data = {};
        this._data = {};
    }
    IOC.prototype.$get = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        var value = this._data[key];
        if (value === undefined || value === null) {
            throw new IOCDepNotFound(key);
        }
        return value;
    };
    IOC.prototype.$set = function (key, value) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        this._data[key] = value;
    };
    IOC.prototype._inject = function (args) {
        var values = [];
        // console.log(args);
        for (var i = 0; i < args.length; i++) {
            var d = this._data[args[i]];
            if (d === undefined || d === null) {
                throw new IOCDepNotFound(args[i]);
            }
            values.push(this._data[args[i]]);
        }
        return values;
    };
    IOC.prototype.$inject = function () {
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
    IOC.prototype.$invoke = function (args, fn) {
        var values = this._inject(args);
        // console.log(values);
        return fn.apply(this, values);
    };
    IOC.prototype.$call = function (fn) {
        var args = this._getArgs(fn);
        var values = this._inject(args);
        return fn.apply(this, values);
    };
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
    IOC.prototype.keys = function () {
        return Object.keys(this._data);
    };
    IOC.prototype.has = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        return (key in this._data === true);
    };
    IOC.prototype.remove = function (key) {
        if (typeof key !== "string") {
            throw new TypeError("key argument must be a string");
        }
        delete this._data[key];
    };
    IOC.prototype.addList = function (list) {
        for (var key in list) {
            var value = list[key];
            this.$set(key, value);
        }
    };
    IOC.prototype._getAll = function () {
        return this._data;
    };
    return IOC;
}());
;

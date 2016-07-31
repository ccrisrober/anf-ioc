# Another NodeJS Framework (Inversion of Control module)
Simple IOC module from my NodeJS Framework. <br />
This library works with any project based on JavaScript, both web and server.

## About
We present a class and module version using vanilla javascript and typescript.

## Examples
```javascript
// Create IOC and save values
var ioc = new IOC();
ioc.$set("var1", "mr sandman");
ioc.$set("var2", 12*5);
ioc.$set("var3", "hello");
ioc.$set("var4", "*****");

// Call ioc methods
try {
	// Inject values name from function arguments
	ioc.$call(function(var1, var4) {
		alert(var1);
		alert(var4);
	});
	// Inject values from all arguments but the last (function)
	ioc.$inject("var2", "var2", function(myvar, myvar2) {
		alert(myvar);
		alert(myvar2);
	});
	// Inject values from firt argument (array)
	ioc.$invoke(["var2", "var4", "var3", "var1"], 
		function(name0, name1, name2, name3) {
			alert(name0);
			alert(name1);
			alert(name2);
			alert(name3);
		});
} catch(e) {
	console.log(e);
}
```

## TODO
- [x] $get and $set
- [x] $call
- [x] $inject
- [x] $invoke
- [ ] $singleton
- [ ] $provider
- [ ] $factory
# jstokenfield
A javascript token field that is easy to use and customize.

<a href="http://lucaslouca.github.io/jstokenfield/" target="_blank">Demo</a>

## How to use it

Include the neccesary stylesheet and javascript files:
```
<link rel="stylesheet" type="text/css" href="jstokenfield.css" media="screen" />
<script src='jstokenfield.js'></script>
```

Include a simple div to hold your token field:
```
<div id="myTokenField" class="jsTokenField"></div>
```

Instantiate the token field:
```
<script>
	var tokenField = new JSTokenField('myTokenField');
			tokenField.onChange(function(content) {
				// input has changed
			});
			
			tokenField.setValidator(function(text) {
			  // Add validation logic here
				return true;
			});
</script>
```

## Public methods

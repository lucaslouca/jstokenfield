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
				// Content has changed
			});
			
			tokenField.setValidator(function(text) {
			  // Add validation logic here
				return true;
			});
</script>
```

## Public methods
> `onChange(handler)`

>**handler**

>Type: Function(content)

>A function to execute when the content changes. The `content` represents the token text values in form of an array

<br>

> `getContent()`

>Returns an array holding the text values of all the tokens in the token field.

<br>

> `setValidator(validator)`
> Set validator method that is called for every token generated.

>**validator**

>Type: Function(text)

>**text**
> The text value of the new token

>A function to execute when a new token is about to be generated. Validator should return true if text is valid, false otherwise. If validator returns true, tokens will appear normal, else tokens are represented as invalid.

<br>

> `getValidContent()`

>Returns an array holding the text values of only the valid (based on the given validator) tokens in the token field.

<br>

> `getInvalidContent()`

>Returns an array holding the text values of only the invalid (based on the given validator) tokens in the token field.

'use strict';

/**
 * Constructor for our JSTokenField.
 *
 * @param tokenFieldId The DOM id of the element (e.g. a 'div') that should hold our JSTokenField elements.
 */
var JSTokenField = function(tokenFieldId) {
	var exports = {};
	
	var _tokenField;
	var _input;
	var _SEPARATOR = ",";
    var _onChangeCallback = null;
    var _validatorFunction = null;
    
	_tokenField = document.getElementById(tokenFieldId);
	_input = document.createElement("input");
	_input.type = "text";
      
    ////////////////////////////////////////////////
    // INPUT FIELD EVENT HANDLING
    ////////////////////////////////////////////////
    
    _tokenField.onclick = function() {
        _input.focus();
    }
	
	_input.onfocus = function() {
		_tokenField.classList.add("focus");
	}

	_input.oninput = function(e) {
		var value = e.target.value;
		var tokens = value.split(_SEPARATOR);
		if (tokens.length>1) {
			this.value = "";
			createTokens(tokens);
		}
	}
	
    _input.onkeydown = function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) { //Enter keycode
            var value = e.target.value;
            var tokens = value.split(_SEPARATOR);
            this.value = "";
            createTokens(tokens);
        } else if( code == 8 || code == 46 ) { // Backspace or Delete keycode
            if (this.value == '') {
                // remove last token
                var remaining = _tokenField.getElementsByClassName('tokenWrapper');
                var last = remaining[remaining.length-1];
                if (typeof last != 'undefined') {
                    removeToken(last);
                }
            }
        }
    }
    
	_input.onblur = function(e) {
		_tokenField.classList.remove("focus");
		var value = e.target.value;
		var tokens = value.split(_SEPARATOR);
		this.value = "";
		createTokens(tokens);
		
	}

    ////////////////////////////////////////////////
    // APPEARANCE AND MAIN LOGIC
    ////////////////////////////////////////////////
    
	_tokenField.appendChild(_input); // put it into the DOM
	
	/**
	 * Generates and display token elements out of a given array of text elements
	 *
	 * 
	 * @param tokens An array containing the text values for each token to be created. Example: ['joe@email.com', 'alice@bob.com']
	 */
	function createTokens(tokens) {
		for (var i=0; i<tokens.length; i++) {
			var text = tokens[i];
			if (text != '') {
                var tokenWrapper = document.createElement("div");
				tokenWrapper.classList.add("tokenWrapper");

				var token = document.createElement("div");
				token.classList.add("token");
				
				// Validate text to see if we should mark the token as valid/invalid
				if (_validatorFunction != null && _validatorFunction(text)==false) {
					token.classList.add("invalid");
				} else {
					token.classList.add("valid");
				}
				
                tokenWrapper.appendChild(token);
                
				var close = document.createElement("div");
				close.classList.add("close");
				close.appendChild(document.createTextNode('✕')); 
				var onclickWrapper = function(w) {
		            return function callback() {
		                var ftokenWrapper = w;	
	                    removeToken(ftokenWrapper);
					}
		        }
                close.onclick = onclickWrapper(tokenWrapper);

				var tokenText = document.createElement("span");
				tokenText.classList.add("tokenText");
				tokenText.appendChild(document.createTextNode(text)); 
                
                token.appendChild(tokenText); 
				token.appendChild(close);    
				_tokenField.insertBefore(tokenWrapper, _input); 
                
                // Resize input field accordingly
                resizeInput(tokenWrapper);
			}
		}
        
        // Inform that number of tokens has changed
        if (_onChangeCallback != null) {
            _onChangeCallback(getContent());
        }
	}

    ////////////////////////////////////////////////
    // UTIL METHODS
    ////////////////////////////////////////////////
    
    /**
	 * Removes a token (tokenWrapper) and adjusts the width of the text input field.
	 *
	 * 
	 * @param tokenWrapper The tokenWrapper element to remove
	 */
    function removeToken(tokenWrapper) {					
        var ftokenWrapper = tokenWrapper;
        ftokenWrapper.parentNode.removeChild(ftokenWrapper);

        // find last token in list
        var remaining = _tokenField.getElementsByClassName('tokenWrapper');
        var last = remaining[remaining.length-1];
        if (typeof last != 'undefined') {
            resizeInput(last);
        } else {
            _input.style.width = 100+"%";
        }

        if (_onChangeCallback != null) {
            _onChangeCallback(getContent());
        }
    }
    
    /**
	 * Adjusts the width of the text input field based on the last tokenWrapper element.
	 *
	 * 
	 * @param tokenWrapper The last tokenWrapper element in the JSTokenField.
	 */
    function resizeInput(tokenWrapper) {
	    var xoffset = tokenWrapper.offsetLeft + tokenWrapper.offsetWidth - _tokenField.offsetLeft;
        var newWidth = (_tokenField.offsetWidth - xoffset - 20);
        if (newWidth<20) {
            newWidth = 100+"%";
            _input.style.width = newWidth;
        } else {
            _input.style.width = (newWidth/_tokenField.offsetWidth)*100+"%";
        }
    }
    
    ////////////////////////////////////////////////
    // PUBLIC METHODS
    ////////////////////////////////////////////////
    
    /**
	 * Returns an array containing the text value of all the tokens in _tokenField.
	 *
	 * e.g. ['joe@mail.com', 'mike@awesome.com', 'alice@bob.com']
	 *
	 */
    function getContent() {
        var content = [];
        var tokens = _tokenField.getElementsByClassName('tokenText');
        for (var i=0; i<tokens.length; i++) {
            content.push(tokens[i].textContent);
        } 
        
        return content;
    }
    
    /**
	 * Returns an array containing the text value of all the tokens in _tokenField that are valid.
	 *
	 * e.g. ['joe@mail.com', 'mike@awesome.com', 'alice@bob.com']
	 *
	 */
    function getValidContent() {
        var content = [];
        var validTokens = _tokenField.getElementsByClassName('valid');
        for (var i=0; i<validTokens.length; i++) {
	        var tokenText = validTokens[i].getElementsByClassName('tokenText');
            content.push(tokenText[0].textContent);
        } 
        
        return content;
    }
    
    /**
	 * Returns an array containing the text value of all the tokens in _tokenField that are invalid.
	 *
	 * e.g. ['jddeeee', 'ssysgd']
	 *
	 */
    function getInvalidContent() {
        var content = [];
        var validTokens = _tokenField.getElementsByClassName('invalid');
        for (var i=0; i<validTokens.length; i++) {
	        var tokenText = validTokens[i].getElementsByClassName('tokenText');
            content.push(tokenText[0].textContent);
        } 
        
        return content;
    }
    
    /**
     * Public method used for setting a callback method that should be called when a
     * the values of the field get 'tokenized' (oninput, on enter-keydown, onblur, closing a token).
     * 
     * callback is of type function(content) where content represents the tokens in form of an array
     *
     * @param callback The callback function to call when the value of the JSTokeField changes
     */
    function onChange(callback) {
        _onChangeCallback = callback;
    }   
    
    /**
     * Set validator method that is called for every token generated.
     *
     * validator:
     * Type function(text)
     * validator should return true if text is valid, false otherwise.
     *
     * If validator returns true, tokens will appear normal, else tokens are represented as invalid.
     *
     * @param validator The validator function to call when each token is generated.
     */
    function setValidator(validator) {
	    _validatorFunction = validator;
    }
    
	////////////////////////////////////////////////
    // EXPORT PUBLIC METHODS
    ////////////////////////////////////////////////
    
    exports.getContent 			= 	getContent;
    exports.getValidContent 	=   getValidContent;
    exports.getInvalidContent 	= 	getInvalidContent;
    exports.onChange    		= 	onChange;
    exports.setValidator 		= 	setValidator;
    
	return exports;
}

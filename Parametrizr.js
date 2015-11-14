(function (global) {
	"use strict";
	
	function isObject(obj) {
		return (typeof obj === 'function' || typeof obj === 'object');
	}
	
	function isArray(obj) {
		return Object.prototype.toString.call( obj )  === '[object Array]';
	}
	
	function isFunction(obj) {
		return typeof obj === 'function';
	}
	
	function isString(obj) {
		return typeof obj === 'string';
	}
	
	function Parametrizr() {
		this.params = {};
		this.required = [];
	}
	
	Parametrizr.configuration = {
		required : []
	}
	
	Parametrizr.prototype = {
		constructor : Parametrizr,
		
		add : function (key, value) {
			if(isFunction(value)){
				throw 'Value must not be a function';
			}
			this.params[key] = value;
			return this;
		},
		addAll: function(obj){
			for(var prop in obj){
				if(!isFunction(obj[prop])){
					this.add(prop, obj[prop]);
				}
			}
			return this;
		},
		get : function (){
			return this.params;
		},
		remove : function (key, value) {
			delete this.params[key];
			return this;
		},
		clear : function() {
			this.params = {};
			return this;
		},
		join : function() {
			for(var i = 0, j = arguments.length ; i < j ; i++){
				var parametrzr = arguments[i];
				if(parametrzr instanceof Parametrizr){
					this.addAll(parametrzr.params);
				}else{
					throw 'The argument in position ' + i + ' is not an instance of Parametrizr'
				}
			}
			return this;
		},
		setRequired : function(keys){
			if(isString(keys)){
				this.required.push(keys);
			} else if (isArray(keys)){
				this.required = this.required.concat(keys);
			} else {
				throw 'setRequired - Must be a string'
			}
			return this;
		},
		invoke : function(fn, args){

			function validate(){
				console.log('Calling validate ...');
				//Check Parametrizr configuration for required parameters
				var conf = Parametrizr.configuration;
				for(var i = 0, j = conf.required.length ; i < j ; i++){
					var paramName = conf.required[i];
					if(this.required.indexOf(paramName) < 0){
						throw 'Missing ' + paramName;
					}
				}
				//Check if all required parameters in Parametrizr instance have been set.
				for(var i = 0, j = this.required.length ; i < j ; i++){
					var key = this.required[i];
					if(!this.params[key]){
						throw key + ' is mandatory';
					}
				}
				return true;
			}
			
			if(!fn) {
				throw 'A function must be passed';
			}
			if(validate.apply(this)) {
				fn.apply(null, args);
			}
		},
		toString : function () {
			return parametersObjectToString(this);
		}
	};
	
	function parametersObjectToString(obj, propertyName) {
		if(!isObject(obj)){
			throw 'parametersObjectToString - Must be an object';
		}
		var stringParams = '';
		for(var prop in obj){
			if(!isFunction(obj[prop])){
				if(isObject(obj[prop]) && !isArray(obj[prop])){
					stringParams += '&' + parametersObjectToString(obj[prop], prop);
				}else if(isArray(obj[prop])){
					for(var i = 0, j = obj[prop].length; i < j ; i++){
						stringParams += '&' + prop + '=' + obj[prop][i];
					}
				}else{
					stringParams += '&' + prop + '=' + obj[prop];
				}
			}
		}
		
		return stringParams.substring(stringParams.startsWith('&')? 1 : 0);
	}
	
	Parametrizr.ParamsToString = function(obj) {
		return parametersObjectToString(obj);
	}
	
	Parametrizr.join = function(){
		var arr = [];
		for(var  i = 0, j = arguments.length ; i < j ; i++){
			var data = arguments[i];
			if(isString(data)){
				arr.push(arguments[i]);
			}else if(isObject(data)){
				arr.push(parametersObjectToString(data));
			}
		}
		return arr.join('&');
	}
	
	Parametrizr.removeParameter = function(strParameter, key){
		if((!key || !isString(key)) || (!strParameter || !isString(strParameter))){
			throw 'removeParameter - Not a valid string';
		}
		var pos = strParameter.indexOf(key);
		var regexp = new RegExp(key + "=[^=<>&]+\(&)?", "g");
		var group = strParameter.match(regexp);
		
		return strParameter.replace(regexp, group);
	}
	
	global.Parametrizr = Parametrizr;
	global.Actualizador = Actualizador;

})(window);



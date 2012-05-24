$.extend({
	extendPrototype : function(subclass, superclass, overrides) {
		subclass.superclass = superclass.prototype;
		$.extend(subclass.prototype, superclass.prototype, overrides);
		
		$.defineAccessors(subclass);
	},
	
	defineAccessors : function(target) {
		if ($.isFunction(target)) {
			var prototype = target.prototype;
			for (var privateName in prototype) {
				if (privateName.indexOf("_") == 0 && !$.isFunction(prototype[privateName])) {
					var name = privateName.substring(1, privateName.length);
					if ($.isNotEmpty(prototype[name])) {
						continue;
					}
					this.defineAccessor(target, name, privateName);
				}
			}
		}
	},
	
	defineAccessor : function(target, name, privateName) {
		target.prototype[name] = function(value) {
			return $.accessor(this, this, privateName, value);
		}
	},
	
	accessor : function(object, target, name, value) {
		if ($.isUndefined(value)) {
			return target[name];
		} else {
			target[name] = value;
			return object;
		}
	},
	
	namespace : function(namespace) {
		var names = namespace.split(".");
		var parent = window;
		for (var i = 0, length = names.length; i < length; i++) {
			if ($.isEmpty(parent[names[i]])) {
				parent[names[i]] = {};
				parent = parent[names[i]];
			} else {
				parent = parent[names[i]];
			}
		}
		return parent;
	},
	
	cloneObject : function(obj) {
		return $.extend(true, {}, obj);
	},
	
	isUndefined : function(value) {
		return value == undefined;
	},
	
	isNull : function(value) {
		return value == undefined;
	},
	
	isEmpty : function(value) {
		return !$.isNotEmpty(value);
	},
	
	isNotEmpty : function(value) {
		return !$.isNull(value) && !$.isUndefined(value);
	},
	
	isBlank : function(value) {
		return !$.isNotBlank(value);
	},
	
	isNotBlank : function(value) {
		return $.isNotEmpty(value) && value != "";
	},
	
	isNumeric : function(value) {
		return typeof value === 'number' && isFinite(value);
	},
	
	toNumber : function(num, def) {
		if ($.isNotEmpty(num)) {
			if (!$.isNumeric(num)) {
				num = new Number(num);
				if (!isNaN(num)) {
					return num;
				}
			} else {
				return num;
			}
		}
		return def;
	},
	
	toBoolean : function(value) {
		if (value === true || value === false) return value;
		return (String(value) == "true");
	},
	
	ltrim : function(value) {
		return String(value).replace(/^[\s|\t|　]+/, "");
	},
	
	rtrim : function(value) {
		return String(value).replace(/[\s|\t|　]+$/, "");
	},
	
	upperCamel : function(value) {
		return value.substring(0, 1).toUpperCase() + value.substring(1, value.length)
	},
	
	lowerCamel : function(value) {
		return value.substring(0, 1).toLowerCase() + value.substring(1, value.length)
	},
	
	escapeHtml : function(value) {
		var $div = $('<div>');
		$div.text(value);
		return $div.html();
	},
	
	unescapeHtml : function(value) {
		var $div = $('<div>');
		$div.html(value);
		return $div.text();
	}
	
});
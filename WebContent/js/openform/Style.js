openform.Style = function(def, unsupportedStyleList) {
	this.init(def, unsupportedStyleList);
};

$.extendPrototype(openform.Style, openform.Object, {
	
	_unsupportedStyleList : null,
	
	init : function(def, unsupportedStyleList) {
		openform.Style.superclass.init.call(this, def);
		
		this._unsupportedStyleList = unsupportedStyleList;
	},
	
	merge : function(style) {
		if ($.isEmpty(style)) return;
		
		var def = this.def();
		var target = style.def();
		var unsupportedStyleList = this.unsupportedStyleList();
		for (var prop in target) {
			if ($.inArray(prop, unsupportedStyleList) >= 0) continue;
			def[prop] = target[prop];
		}
	},
	
	className : function(value) {
		return $.accessor(this, this.def(), "className", value);
	},
	
	name : function(value) {
		return $.accessor(this, this.def(), "name", value);
	},
		
	color : function(value) {
		return this.cssAccess("color", value);
	},
	
	fontSize : function(value) {
		return this.cssAccess("fontSize", value, 12);
	},
	
	fontWeight : function(value) {
		return this.cssAccess("fontWeight", value);
	},
	
	fontFamily : function(value) {
		return this.cssAccess("fontFamily", value);
	},
	
	align : function(value) {
		return this.cssAccess("align", value);
	},
	
	backgroundColor : function(value) {
		return this.cssAccess("backgroundColor", value);
	},
	
	verticalAlign : function(value) {
		return this.cssAccess("verticalAlign", value);
	},
	
	borderStyle : function(value) {
		return this.cssAccess("borderStyle", value);
	},
	
	borderWidth : function(value) {
		return this.cssAccess("borderWidth", value);
	},
	
	borderColor : function(value) {
		return this.cssAccess("borderColor", value);
	},
	
	paddingTop : function(value) {
		return this.cssAccess("paddingTop", value, 0);
	},
	
	paddingRight : function(value) {
		return this.cssAccess("paddingRight", value, 0);
	},
	
	paddingBottom : function(value) {
		return this.cssAccess("paddingBottom", value, 0);
	},
	
	paddingLeft : function(value) {
		return this.cssAccess("paddingLeft", value, 0);
	},
	
	imeMode : function(value) {
		return this.cssAccess("imeMode", value);
	},
	
	cssAccess : function(name, value, def) {
		if ($.isEmpty(def)) def = null;
		
		if ($.isUndefined(value)) {
			return this.def()[name] || def;
		} else {
			this.def()[name] = value;
			return this;
		}
	}
	
});
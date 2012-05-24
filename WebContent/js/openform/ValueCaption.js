openform.ValueCaption = function(def) {
	this.init(def);
};

$.extendPrototype(openform.ValueCaption, openform.Object, {
	
	value : function(value) {
		return $.accessor(this, this.def(), "value", value);
	},
	
	caption : function(value) {
		return $.accessor(this, this.def(), "caption", value);
	}
	
});
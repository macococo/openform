openform.Dimension = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Dimension, openform.ControlAttribute, {
	
	w : function(value) {
		return $.accessor(this, this.def(), "w", value);
	},
	
	h : function(value) {
		return $.accessor(this, this.def(), "h", value);
	}
	
});
openform.Position = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Position, openform.ControlAttribute, {
	
	x : function(value) {
		return $.accessor(this, this.def(), "x", value);
	},
	
	y : function(value) {
		return $.accessor(this, this.def(), "y", value);
	}
	
});
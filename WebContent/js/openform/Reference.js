openform.Reference = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Reference, openform.ControlAttribute, {
	
	url : function(value) {
		return $.accessor(this, this.def(), "url", value);
	},
	
	search : function(value) {
		return $.accessor(this, this.def(), "search", value);
	},
	
	columns : function(value) {
		return $.accessor(this, this.def(), "columns", value);
	}
	
});
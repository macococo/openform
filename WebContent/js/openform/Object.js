openform.Object = function(def) {
	this.init(def);
};

openform.Object.prototype = {

	_def : null,
	
	init : function(def) {
		this._def = def || {};
	},
	
	def : function(value) {
		return $.accessor(this, this, "_def", value);
	}
	
};

$.defineAccessors(openform.Object);
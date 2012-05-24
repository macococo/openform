openform.FormStyles = function(form, def) {
	this.init(form, def);
};

openform.FormStyles.ALL = "$all";

$.extendPrototype(openform.FormStyles, openform.FormAttribute, {
	
	getAllStyle : function() {
		return this.getStyle(openform.FormStyles.ALL);
	},
	
	getControlStyle : function(control) {
		return this.getStyle(control.type());
	},
	
	getStyle : function(type) {
		if ($.isEmpty(type)) return null;
		return new openform.Style(this.def()[type]);
	}
	
});
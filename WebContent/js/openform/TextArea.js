openform.TextArea = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.TextArea, openform.PageInputControl, {
	
	createElement : function() {
		openform.TextArea.superclass.createElement.call(this);
		
		this.$mainElement().css("resize", "none");
	},

	createMainElementFragment : function() {
		return document.createElement("textarea");
	}
	
});
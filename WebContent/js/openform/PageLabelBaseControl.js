openform.PageLabelBaseControl = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PageLabelBaseControl, openform.Label, {
	
	isInput : function() {
		return true;
	}
	
});
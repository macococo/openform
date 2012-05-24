openform.ListIndex = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.ListIndex, openform.Label, {
	
	captionValue : function() {
		return this.index() + 1;
	}
	
});
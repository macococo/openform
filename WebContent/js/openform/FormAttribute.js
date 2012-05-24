openform.FormAttribute = function(form, def) {
	this.init(form, def);
};

$.extendPrototype(openform.FormAttribute, openform.Object, {
	
	_form : null,
	
	init : function(form, def) {
		openform.FormAttribute.superclass.init.call(this, def);
		
		this._form = form;
	}
	
});
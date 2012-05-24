openform.FormControl = function(form, def) {
	this.init(form, def);
};

$.extendPrototype(openform.FormControl, openform.Control, {
	
	_event : null,
	
	init : function(form, def) {
		openform.FormControl.superclass.init.call(this, def.id, form, def);

		this._event = new openform.Event(form, this);
	},
	
	form : function() {
		return this.parent();
	}
	
});
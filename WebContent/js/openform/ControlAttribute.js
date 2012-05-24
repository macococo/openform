openform.ControlAttribute = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.ControlAttribute, openform.Object, {
	
	_control : null,
	
	init : function(control, def) {
		openform.ControlAttribute.superclass.init.call(this, def);
		
		this._control = control;
	}
	
});
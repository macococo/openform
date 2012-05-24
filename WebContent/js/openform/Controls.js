openform.Controls = function(page, parent, def, index) {
	this.init(page, parent, def, index);
};

$.extendPrototype(openform.Controls, openform.Object, {
	
	_page : null,
	
	_parent : null,
	
	_controls : null,
	
	_controlMap : null,
	
	init : function(page, parent, def, index) {
		openform.Controls.superclass.init.call(this, def);
		
		this._page = page;
		this._parent = parent;
		this._controls = null;
		this._controlMap = null;
		
		var self = this;
		$(def).each(function() {
			var control = this;
			control.index = index;
			
			if ($.isNotEmpty(control.type) && $.isNotEmpty(openform[control.type])) {
				var control = new openform[control.type](page, parent, control);
				self.addControl(control);
			}
		});
	},
	
	addControl : function(control) {
		if ($.isEmpty(this._controls)) this._controls = [];
		this._controls.push(control);
		
		this.page().form().registControl(control);
	},
	
	getMaxHeight : function() {
		var max = 0;
		
		for (var i = 0, controls = this.controls(), length = controls.length; i < length; i++) {
			var height = controls[i].dimension().h();
			if (height > max) max = height;
		}
		
		return max;
	}
	
});
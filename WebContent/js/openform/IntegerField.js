openform.IntegerField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.IntegerField, openform.NumberField, {
	
	formatValue : function(value) {
		if ($.isNotEmpty(value)) {
			value = parseInt(value);
		}
		return openform.IntegerField.superclass.formatValue.call(this, value);
	}
	
});
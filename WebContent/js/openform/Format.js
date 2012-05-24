openform.Format = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Format, openform.ControlAttribute, {
	
	comma : function(value) {
		return $.accessor(this, this.def(), "comma", value);
	},
	
	formatComma : function(value) {
		if (!this.comma()) return value;
		if ($.isEmpty(value)) return value;
		
		var to = String(value);
		var tmp = "";
		while (to != (tmp = to.replace(/^([+-]?\d+)(\d\d\d)/, "$1,$2"))) {
			to = tmp;
		}
		return to;
	},
	
	dateFormat : function(value) {
		return $.accessor(this, this.def(), "dateFormat", value);
	},
	
	formatDate : function(value) {
		if (!this.dateFormat()) return value;
		if ($.isEmpty(value)) return value;
		
		if (this.control().dataSource().isNumberField()) {
			return $.datepicker.formatDate(this.dateFormat(), new Date(value));
		}
		return value;
	},
	
	unformatDate : function(value) {
		if (!this.dateFormat()) return value;
		if ($.isEmpty(value)) return value;
		
		if (this.control().dataSource().isNumberField()) {
			return $.datepicker.parseDate(this.dateFormat(), value).getTime();
		}
		return value;
	}
	
});
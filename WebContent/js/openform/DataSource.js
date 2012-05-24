openform.DataSource = function(id, form, def) {
	this.init(id, form, def);
};

$.extendPrototype(openform.DataSource, openform.Object, {
	
	_id : null,
	
	_form : null,
	
	_fieldMap : null,
	
	init : function(id, form, def) {
		openform.DataSource.superclass.init.call(this, def);
		
		this._id = id;
		this._form = form;
		this._fieldMap = null;
	},
	
	field : function(name) {
		this.initFieldMap();
		
		return this._fieldMap[name];
	},
	
	initFieldMap : function() {
		if ($.isEmpty(this._fieldMap)) {
			this._fieldMap = [];
			var def = this.def();
			if (def.fields) {
				for (var i = 0, fields = def.fields, length = fields.length; i < length; i++) {
					var field = fields[i];
					field.index = i;
					this._fieldMap[field.name] = field;
				}	
			}
		}
	},
	
	record : function(index, record) {
		if (index < 0) return null;
		
		var def = this.def();
		var records = def.records;
		if ($.isEmpty(records)) {
			records = [];
			def.records = records;
		}
		if (index >= records.length) {
			records[index] = [];
		}
		
		if ($.isUndefined(record)) {
			return records[index];
		} else {
			records[index] = record;
			
			var form = this.form();
			form.renderByDataSourceChange(this.id(), null, index, null);
			for (var i = 0, fields = def.fields, length = fields.length; i < length; i++) {
				form.evaluateExpression(form.getControl(fields[i].name, index));
			}
			
			return this;
		}
	},
	
	value : function(name, recordIndex, value, control) {
		var field = this.field(name);
		if (field) {
			var index = field.index;
			var record = this.record(recordIndex);
			if ($.isUndefined(value)) {
				if (index >= record.length) {
					record[index] = null;
				}
				return record[index];
			} else {
				v = this.cast(field, value);
				if (this.validate(field, v)) {
					record[index] = v;
					
					var form = this.form();
					if (control != null) control.event().fire("change", form, value);
					form.event().fire("change", this, field, name, recordIndex, value);
					form.renderByDataSourceChange(this.id(), name, recordIndex, control);
					form.evaluateExpression(form.getControl(name, recordIndex));
				}
			}
		}
	},
	
	cast : function(field, value) {
		switch (field.type) {
		case "str" :
			return ($.isNotEmpty(value)) ? $.rtrim(String(value)) : value;
		case "num" :
			value = Number($.rtrim(String(value)));
			return ($.isNumeric(value)) ? value : null;
		case "int" :
			value = parseInt($.rtrim(String(value)));
			return ($.isNumeric(value)) ? value : null;
		case "bool" :
			return $.toBoolean(value);
		}
		return value;
	},
	
	validate : function(field, value) {
		if ($.isEmpty(value)) return true;
		
		switch (field.type) {
		case "str" :
			return true;
		case "bool" :
			return true;
		case "num" :
		case "int" :
			if ($.isNumeric(value)) {
				if ($.isNotEmpty(field.min) && field.min > value) return false;
				if ($.isNotEmpty(field.max) && field.max < value) return false;
				return true;
			}
			return false;
		}
		return true;
	}
	
});
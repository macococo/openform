openform.PageControlDataSource = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.PageControlDataSource, openform.Object, {
	
	_control : null,
	
	_dataSource : null,
	
	_recordIndex : null,
	
	init : function(control, def) {
		openform.PageControlDataSource.superclass.init.call(this, def);
		
		this._control = control;
		this._dataSource = null;
		this._recordIndex = 0;

		var dataSources = control.form().dataSources();
		var defaultDs = this.getDefaultDataSource(dataSources, control);
		if ($.isNotEmpty(def)) {
			this._dataSource = ($.isEmpty(def.id)) ? defaultDs : dataSources.dataSource(def.id);
		} else {
			if ($.isNotEmpty(control.def().value)) {
				this.def().value = control.def().value;
			} else {
				if (defaultDs.field(control.id())) {
					this._dataSource = defaultDs;
					this.field(control.id());
				} else if (defaultDs.field(control.name())) {
					this._dataSource = defaultDs;
					this.field(control.name());
				}
			}
		}
	},
	
	getDefaultDataSource : function(dataSources, control) {
		var ds = null;
		if (control.parent().dataSource) {
			ds = control.parent().dataSource().dataSource();
		}
		if (ds == null) {
			ds = dataSources.main();
		}
		return ds;
	},
	
	field : function(value) {
		return $.accessor(this, this.def(), "field", value);
	},
	
	record : function(index, record) {
		if ($.isNotEmpty(this._dataSource)) {
			return this._dataSource.record(index, record);
		}
	},
	
	value : function(value, triggered) {
		if ($.isUndefined(value)) {
			if ($.isNotEmpty(this._dataSource)) {
				return this._dataSource.value(this.field(), this.recordIndex());
			} else {
				var value = this.def().value;
				if ($.isEmpty(value)) value = null;
				return value;
			}			
		} else {
			var control = this.control();
			if (!control.validateValue(value)) {
				control.applyValue();
				return false;
			}
			if ($.isNotEmpty(this._dataSource)) {
				return this._dataSource.value(this.field(), this.recordIndex(), value, (triggered) ? this.control() : null);
			} else {
				var before = this.def().value;
				this.def().value = value;
				if (before != value) {
					control.applyValue();
					control.form().evaluateExpression(control);
					control.event().fire("change", control.form(), value);
					return true;	
				} else {
					return false;	
				}
			}
		}
	},
	
	isRequired : function() {
		var dataSource = this.dataSource();
		if ($.isNotEmpty(dataSource)) {
			return dataSource.field(this.field()).required;
		}
		return false;
	},
	
	caption : function() {
		var dataSource = this.dataSource();
		if ($.isNotEmpty(dataSource)) {
			return dataSource.field(this.field()).caption;
		}
		return null;
	},
	
	isNumberField : function() {
		var dataSource = this.dataSource();
		if ($.isNotEmpty(dataSource)) {
			var type = dataSource.field(this.field()).type;
			return type == "num" || type == "int";
		}
		return false;
	}
	
});
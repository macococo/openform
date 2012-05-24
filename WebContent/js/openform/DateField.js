openform.DateField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.DateField, openform.TextField, {
	
	getDefaultStyle : function() {
		return new openform.Style({"verticalAlign" : "middle"});
	},
	
	getUnsupportedStyleList : function() {
		return ["verticalAlign"];
	},
	
	applyEvent : function() {
		openform.DateField.superclass.applyEvent.call(this);
		
		if (this.calendar() != false) {
			var self = this;
			var settings = $.cloneObject($.datepicker.regional["ja"]);
			settings.showButtonPanel = true;
			settings.dateFormat = this.format().dateFormat();
			settings.onSelect = function(dateText, inst) {
				self.fireChangeEvent(dateText);
			};
			this.$mainElement().datepicker(settings);
		}
	},
	
	formatValue : function(value) {
		return this.format().formatDate(value);
	},
	
	unformatValue : function(value) {
		return this.format().unformatDate(value);
	},

	calendar : function(value) {
		return $.accessor(this, this.def(), "calendar", value);
	}
	
});
openform.NumberField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.NumberField, openform.TextField, {
	
	getDefaultStyle : function() {
		return new openform.Style({"verticalAlign" : "middle", "align" : "right", "imeMode" : "disabled"});
	},
	
	getUnsupportedStyleList : function() {
		return ["verticalAlign"];
	},
	
	validateValue : function(value) {
		return $.isNumeric(Number(value));
	},
	
	formatValue : function(value) {
		return this.format().formatComma(value);
	},

	applyEvent : function() {
		openform.TextField.superclass.applyEvent.call(this);
		
		if (!this.readOnly()) {
			var self = this;
			this.$mainElement().on("focus", function() {
				self.applyValue(self.value());
			}).on("blur", function() {
				self.applyValue();
			});
		} else {
			this.$mainElement().off("focus").off("blur");
		}
	}
	
});
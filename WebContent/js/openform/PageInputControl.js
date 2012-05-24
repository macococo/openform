openform.PageInputControl = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PageInputControl, openform.PageControl, {
	
	isInput : function() {
		return true;
	},

	applyEvent : function() {
		openform.PageInputControl.superclass.applyEvent.call(this);
		
		this.applyChangeEvent();
	},
	
	applyChangeEvent : function() {
		var self = this;
		this.$mainElement().on("change", function() {
			self.fireChangeEvent($(this).val());
		});
	},
	
	fireChangeEvent : function(value) {
		this.value(this.unformatValue(value), true);
	}
	
});
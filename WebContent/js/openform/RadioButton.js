openform.RadioButton = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.RadioButton, openform.PageLabelBaseControl, {
	
	_checkedValue : null,
	
	init : function(page, parent, def) {
		openform.RadioButton.superclass.init.call(this, page, parent, def);
		
		this._checkedValue = new openform.ValueCaption(def.checked);
	},
	
	applyEvent : function() {
		openform.RadioButton.superclass.applyEvent.call(this);
		
		var self = this;
		this.$mainElement().on("click", function() {
			self.toggleValue();
			self.applyValue();
		}).on("keydown", function(e) {
			// Enter or Space Key
			if (e.keyCode == 13 || e.keyCode == 32) {
				self.toggleValue();
				self.applyValue();
			}
		});
	},
	
	toggleValue : function() {
		if (this.readOnly()) return;
		
		this.value(this.checkedValue().value());
		
		var page = this.page();
		for (var i = 0, controls = page.controls().controls(), length = controls.length; i < length; i++) {
			var control = controls[i];
			if (control != this) {
				control.applyValue();
			}
		}
	},
	
	captionValue : function() {
		var value = this.dataSource().value();
		if (this.checkedValue().value() == value) {
			return this.checkedValue().caption();
		} else {
			return "";
		}
	}
	
});
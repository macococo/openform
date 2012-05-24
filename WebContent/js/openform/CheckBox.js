openform.CheckBox = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.CheckBox, openform.PageLabelBaseControl, {
	
	_checkedValue : null,
	
	_uncheckedValue : null,
	
	init : function(page, parent, def) {
		openform.CheckBox.superclass.init.call(this, page, parent, def);
		
		this._checkedValue = new openform.ValueCaption(def.checked);
		this._uncheckedValue = new openform.ValueCaption(def.unchecked);
	},
	
	applyEvent : function() {
		openform.CheckBox.superclass.applyEvent.call(this);
		
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
		
		var value = this.dataSource().value();
		if (this.checkedValue().value() == value) {
			this.value(this.uncheckedValue().value());
		} else {
			this.value(this.checkedValue().value());
		}
	},
	
	captionValue : function() {
		var value = this.dataSource().value();
		if (this.checkedValue().value() == value) {
			return this.checkedValue().caption();
		} else {
			return this.uncheckedValue().caption() || "";
		}
	}
	
});
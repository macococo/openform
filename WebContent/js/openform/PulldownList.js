openform.PulldownList = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PulldownList, openform.PageInputControl, {
	
	createElement : function() {
		openform.PulldownList.superclass.createElement.call(this);
		
		var options = this.def().options;
		if (options) {
			for (var i = 0, length = options.length; i < length; i++) {
				var option = options[i];
				if ($.isEmpty(option.caption)) {
					option.caption = option.value;
				}
				this.$mainElement().append("<option value='" + option.value + "'>" + option.caption + "</option>");
			}
		}
	},

	createMainElementFragment : function() {
		return document.createElement("select");
	},
	
	applyMainElementAttribute : function() {
		openform.PulldownList.superclass.applyMainElementAttribute.call(this);
		
		// readOnly属性が無いため disabled で代用
		this.$mainElement().attr("disabled", this.readOnly());
	},

	applyValue : function(value) {
		var option = this.getCurrentOption();
		this.$mainElement().val((option != null) ? (option.value || option.caption) : null);
	},
	
	captionValue : function() {
		var option = this.getCurrentOption();
		return (option != null) ? (option.caption || option.value) : null;
	},
	
	getCurrentOption : function() {
		var options = this.def().options;
		if (options) {
			var value = this.value();
			var first = null;
			for (var i = 0, length = options.length; i < length; i++) {
				var option = options[i];
				
				if (first == null) first = option.caption || option.value;
				if (option.value == value) {
					return option;
				}
			}
			return first;
		}
		return null;
	}
	
});
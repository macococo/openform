openform.TextField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.TextField, openform.PageInputControl, {

	createMainElementFragment : function() {
		return document.createElement("input");
	},
	
	getDefaultStyle : function() {
		return new openform.Style({verticalAlign : "middle"});
	},
	
	getUnsupportedStyleList : function() {
		return ["verticalAlign"];
	},
	
	applyStyleVerticalAlign : function($main, value) {
		// TODO IE の場合は line-height を指定
		 $main.css("line-height", this.dimension().h() + "px");
	}
	
});
openform.HiddenField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.HiddenField, openform.PageInputControl, {

	createMainElementFragment : function() {
		var input = document.createElement("input");
		input.type = "hidden";
		return input;
	},
	
	renderPdf : function(pcb, x, y, w, h) {
	}
	
});
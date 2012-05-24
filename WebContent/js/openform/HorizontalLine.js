openform.HorizontalLine = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.HorizontalLine, openform.PageControl, {
	
	init : function(page, parent, def) {
		openform.HorizontalLine.superclass.init.call(this, page, parent, def);
		
		this.dimension().h(0);
	},
	
	renderPdf : function(pcb, x, y, w, h) {
		openform.Pdf.hline(pcb, x, y, w, this.getComputedStyle());
	},
	
	getComputedWidth : function() {
		return this.dimension().w();
	},
	
	getComputedHeight : function() {
		return this.dimension().h();
	},
	
	applyStyleBorderWidth : function($main, value) {
		return "border-width", value + "px 0px 0px 0px";
	}
	
});
openform.VerticalLine = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.VerticalLine, openform.PageControl, {
	
	init : function(page, parent, def) {
		openform.VerticalLine.superclass.init.call(this, page, parent, def);
		
		this.dimension().w(0);
	},
	
	renderPdf : function(pcb, x, y, w, h) {
		openform.Pdf.vline(pcb, x, y, h, this.getComputedStyle());
	},
	
	getComputedWidth : function() {
		return this.dimension().w();
	},
	
	getComputedHeight : function() {
		return this.dimension().h();
	},
	
	applyStyleBorderWidth : function($main, value) {
		return "0px 0px 0px " + value + "px";
	}
	
});
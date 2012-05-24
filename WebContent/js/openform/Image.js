openform.Image = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.Image, openform.PageControl, {

	createMainElementFragment : function() {
		return document.createElement("img");
	},
	
	createMainElement : function() {
		openform.Image.superclass.createMainElement.call(this);
		
		var src = this.value() || this.src();
		this.$mainElement().attr("src", src);
	},
	
	renderPdf : function(pcb, x, y, w, h, style) {
		openform.Pdf.image(pcb, x, y, w, h, style, this.value() || this.pdfSrc() || this.src());
	},
	
	src : function(value) {
		return $.accessor(this, this.def(), "src", value);
	},
	
	pdfSrc : function(value) {
		return $.accessor(this, this.def(), "pdfSrc", value);
	}
	
});
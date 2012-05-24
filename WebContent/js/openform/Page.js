openform.Page = function(form, def) {
	this.init(form, def);
};

$.extendPrototype(openform.Page, openform.FormControl, {
	
	_controls : null,
	
	init : function(form, def) {
		openform.Page.superclass.init.call(this, form, def);
		
		this._controls = new openform.Controls(this, this, def.controls);
	},

	render : function() {
		if (this.isRendered()) {
			this.$mainElement().css("display", "");
		} else {
			openform.Page.superclass.render.call(this);
			
			var page = this
			for (var i = 0, controls = this.controls().controls(), length = controls.length; i < length; i++) {
				(function(page, control, isLast) {
					setTimeout(function() {
						control.render();
						
						if (isLast) {
							page.event().fire("load");
						}
					}, 1);
				})(page, controls[i], i == length - 1);
			}
		}

		this.event().fire("render");
	},
	
	renderPdf : function(outputStream) {
		var form = this.form();
		var dimension = this.dimension();
		if (!form._pdfWriter) {
			form._pdfDocument = new Document(new Rectangle(dimension.w(), dimension.h()), 0, 0, 0, 0);
			form._pdfWriter = PdfWriter.getInstance(form._pdfDocument, outputStream);
			
			form._pdfDocument.open();
		} else {
			form._pdfDocument.setPageSize(new Rectangle(dimension.w(), dimension.h()));
			form._pdfDocument.newPage();
		}

		var Pdf = openform.Pdf;
		for (var i = 0, controls = this.controls().controls(), length = controls.length; i < length; i++) {
			Pdf.callControlRenderPdf(controls[i]);
		}
	},

	remove : function() {
		if (this.isRendered()) {
			this.$mainElement().css("display", "none");
		} else {
			openform.Page.superclass.remove.call(this);

			for (var i = 0, controls = this.controls().controls(), length = controls.length; i < length; i++) {
				controls[i].remove();
			}
		}
	},
	
	getSystemClassName : function() {
		return openform.System.CLASSNAME_PAGE;
	}
	
});
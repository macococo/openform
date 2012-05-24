openform.PageControl = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PageControl, openform.Control, {
	
	_page : null,
	
	_dataSource : null,
	
	_event : null,
	
	init : function(page, parent, def) {
		openform.PageControl.superclass.init.call(this, def.id, parent, def);
		
		this._page = page;
		this._dataSource = new openform.PageControlDataSource(this, def.ds);
		this._dataSource.recordIndex(this.def().index || 0);
		this._event = new openform.Event(page.parent(), this);
	},
	
	render : function() {
		openform.PageControl.superclass.render.call(this);
		this.event().fire("render");
	},
	
	form : function() {
		return this.page().parent();
	},
	
	value : function(value, triggered) {
		return this.dataSource().value(value, triggered);
	},
	
	validateValue : function(value) {
		return true;
	},
	
	captionValue : function() {
		return this.formatValue(this.value());
	},
	
	applyValue : function(value) {
		value = value || this.captionValue();
		this.$mainElement().val(value);
	},
	
	formatValue : function(value) {
//		value = value || this.$mainElement().val();
		return value;
	},
	
	unformatValue : function(value) {
//		value = value || this.$mainElement().val();
		return value;
	},
	
	renderPdf : function(pcb, x, y, w, h, style) {
		openform.Pdf.text(pcb, x, y, w, h, style, this.captionValue());
	},

	getComputedStyle : function() {
		var defaultStyle = this.getDefaultStyle();
		defaultStyle.unsupportedStyleList(this.getUnsupportedStyleList());
		
		defaultStyle.merge(this.form().styles().getAllStyle());
		defaultStyle.merge(this.form().styles().getControlStyle(this));
		defaultStyle.merge(this.form().styles().getStyle(this.style().name()));
		defaultStyle.merge(this.style());
		
		return defaultStyle;
	}
	
});
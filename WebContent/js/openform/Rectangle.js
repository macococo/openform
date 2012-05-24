openform.Rectangle = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.Rectangle, openform.PageControl, {
	
	_topLine : null,
	
	_rightLine : null,
	
	_bottomLine : null,
	
	_leftLine : null,
	
	init : function(page, parent, def) {
		openform.Rectangle.superclass.init.call(this, page, parent, def);
		
		this._topLine = new openform.HorizontalLine(page, parent, this.cloneDef("HorizontalLine"));
		this._rightLine = new openform.VerticalLine(page, parent, this.cloneDef("VerticalLine", def.dim.w, null));
		this._bottomLine = new openform.HorizontalLine(page, parent, this.cloneDef("HorizontalLine", null, def.dim.h));
		this._leftLine = new openform.VerticalLine(page, parent, this.cloneDef("VerticalLine"));
	},
	
	cloneDef : function(type, offsetX, offsetY) {
		var def = $.cloneObject(this.def());
		def.type = type;
		if ($.isNotEmpty(offsetX)) def.pos.x += offsetX;
		if ($.isNotEmpty(offsetY)) def.pos.y += offsetY;
		return def;
	},
	
	render : function() {
		this.topLine().render();
		this.rightLine().render();
		this.bottomLine().render();
		this.leftLine().render();
	},
	
	renderPdf : function(pcb, x, y, w, h) {
		openform.Pdf.rectangle(pcb, x, y, w, h, this.getComputedStyle());
	},
	
	isRendered : function() {
		return this.topLine.isRendered();
	},
	
	remove : function() {
		this.topLine().remove();
		this.rightLine().remove();
		this.bottomLine().remove();
		this.leftLine().remove();
	}
	
});
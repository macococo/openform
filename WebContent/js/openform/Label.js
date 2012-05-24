openform.Label = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.Label, openform.PageControl, {
	
	_innerElement : null,
	
	_$innerElement : null,
	
	init : function(page, parent, def) {
		openform.Label.superclass.init.call(this, page, parent, def);
		
		this._innerElement = null;
		this._$innerElement = null;
	},
	
	remove : function() {
		openform.Label.superclass.remove.call(this);
		
		var $inner = this.$innerElement() || $(this.innerElement());
		$inner.off().remove();
		this._innerElement = null;
		this._$innerElement = null;
	},
	
	createElement : function() {
		openform.Label.superclass.createElement.call(this);
		this.createInnerElement();
	},
	
	createInnerElement : function() {
		if (this._innerElement == null) {
			var inner = this._innerElement = document.createElement("div");
			var $inner = this._$innerElement = $(inner).css("display", "table-cell");
			this.$mainElement().append(inner);
		}
	},
	
	applyDimension : function(style) {
		openform.Label.superclass.applyDimension.call(this, style);
		
		var style = style || this.getComputedStyle();
		var $innerElement = this.$innerElement();
		var w = this.getComputedWidth(style);
		var h = this.getComputedHeight(style);
		
		if (w > 0) $innerElement.width(w);
		if (h > 0) $innerElement.height(h);
	},
	
	applyPosition : function(style) {
		openform.Label.superclass.applyPosition.call(this, style);
		
		this.$innerElement().css({left : 0, top : 0});
	},
	
	applyValue : function() {
		var caption = this.captionValue();
		if ($.isNotEmpty(caption)) {
			caption = new String(caption).replace(/\n/g, "<br>");
		}
		this.$innerElement().html(caption);
	},
	
	applyStyleVerticalAlign : function($main, value) {
		this.$innerElement().css("vertical-align", value);
	},
	
	formatValue : function(value) {
		return this.format().formatDate(value);
	},
	
	unformatValue : function(value) {
		return this.format().unformatDate(value);
	}
	
});
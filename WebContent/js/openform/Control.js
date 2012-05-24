openform.Control = function(id, parent, def) {
	this.init(id, parent, def);
};

$.extendPrototype(openform.Control, openform.Object, {
	
	_id : null,
	
	_name : null,
	
	_index : null,
	
	_parent : null,
	
	_mainElement : null,
	
	_$mainElement : null,
	
	_dimension : null,
	
	_position : null,
	
	_format : null,
	
	_style : null,
	
	_reference : null,
	
	_mouseHighlightRectangle : null,
	
	_focusHighlightRectangle : null,
	
	init : function(id, parent, def) {
		openform.Control.superclass.init.call(this, def);

		this._id = openform.System.createId(id, def.index);
		this._name = id;
		this._index = def.index;
		this._parent = parent;
		this._mainElement = null;
		this._$mainElement = null;
		this._dimension = new openform.Dimension(this, def.dim);
		this._position = new openform.Position(this, def.pos);
		this._format = new openform.Format(this, def.format);
		this._style = new openform.Style(def.style);
		this._reference = new openform.Reference(this, def.reference);
		this._mouseHighlightRectangle = null;
		this._focusHighlightRectangle = null;
	},
	
	render : function() {
		this.createElement();

		var style = this.getComputedStyle();
		this.applyDimension(style);
		this.applyPosition();
		this.applyStyle(style);
		this.applyEvent();
		this.applyValue();
	},

	isRendered : function() {
		return $.isNotEmpty(this.mainElement());
	},
	
	remove : function() {
		var $main = this.$mainElement() || $(this.mainElement());
		$main.off().remove();
		this._mainElement = null;
		this._$mainElement = null;
	},
	
	createElement : function() {
		this.createMainElement();
	},
	
	createMainElement : function() {
		if (this._mainElement == null) {
			this._mainElement = this.createMainElementFragment();
			this._$mainElement = $(this._mainElement);
			if ($.isNotEmpty(this.id())) this._mainElement.id = this.id();
			
			this.applyMainElementAttribute();
			
			$(this.parent().mainElement()).append(this._mainElement);
		}
	},
	
	applyMainElementAttribute : function() {
		if (this.isInput()) {
			this._$mainElement.attr("tabindex", 1);
			this.$mainElement().attr("readonly", this.readOnly());
			this.$mainElement().attr("required", this.dataSource().isRequired());
		}
	},
	
	createMainElementFragment : function() {
		return document.createElement("div");
	},
	
	getSystemClassName : function() {
		return openform.System.CLASSNAME_CONTROL;
	},
	
	applyDimension : function(style) {
		var style = style || this.getComputedStyle();
		var $mainElement = this.$mainElement();
		var w = this.getComputedWidth(style);
		var h = this.getComputedHeight(style);
		
		if (w > 0) $mainElement.width(w);
		if (h > 0) $mainElement.height(h);
	},
	
	applyPosition : function() {
		var $mainElement = this.$mainElement();
		var position = this.position();
		var x = position.x();
		var y = position.y();
				
		$mainElement.css({left : x, top : y});
	},
	
	applyStyle : function(style) {
		var style = style || this.getComputedStyle();
		var $main = this.$mainElement();

		$main.addClass(this.getSystemClassName());
		if ($.isNotEmpty(style.className())) {
			$main.addClass(style.className());
		}

		var css = {};
		var mapping = openform.System.CSS_MAPPING;
		var styleDef = style.def();
		var setterMap = [];
		for (var name in mapping) {
			var s = styleDef[name];
			if ($.isEmpty(s)) continue;

			var setter = "applyStyle" + $.upperCamel(name);
			if ($.isFunction(this[setter])) {
				s = this[setter].call(this, $main, s);
				if ($.isNotEmpty(s)) {
					css[mapping[name]] = s;
				}
			} else {
				css[mapping[name]] = s;
			}
		}
		$main.css(css);
	},
	
	getComputedWidth : function(style) {
		var style = style || this.getComputedStyle();
		var dimension = this.dimension();
		return dimension.w() - $.toNumber(style.paddingLeft(), 0) - $.toNumber(style.paddingRight(), 0) - ($.toNumber(style.borderWidth(), 0));
	},
	
	getComputedHeight : function(style) {
		var style = style || this.getComputedStyle();
		var dimension = this.dimension();
		return dimension.h() - $.toNumber(style.paddingTop(), 0) - $.toNumber(style.paddingBottom(), 0) - ($.toNumber(style.borderWidth(), 0));
	},
	
	getComputedStyle : function() {
		var defaultStyle = this.getDefaultStyle();
		defaultStyle.unsupportedStyleList(this.getUnsupportedStyleList());
		
		return defaultStyle;
	},
	
	getDefaultStyle : function() {
		return new openform.Style({});
	},
	
	getUnsupportedStyleList : function() {
		return null;
	},
	
	applyEvent : function() {
		if (this.isInput()) {
			this.applyFocusStyleEvent();
		}
		this.applyReference();
	},
	
	isInput : function() {
		return false;
	},
	
	applyFocusStyleEvent : function() {
		var self = this;
		this.$mainElement().on("mouseover", function() {
			self.mouseHighlightRectangle().render();
		}).on("mouseout", function() {
			self.mouseHighlightRectangle().remove();
		}).on("focus", function() {
			self.focusHighlightRectangle().render();
			self.form().focusTooltip().render(self);
		}).on("blur", function() {
			self.focusHighlightRectangle().remove();
		});
	},
	
	mouseHighlightRectangle : function() {
		var highlightRectangle = this._mouseHighlightRectangle;
		if ($.isEmpty(highlightRectangle)) {
			this._mouseHighlightRectangle = highlightRectangle = this.createHighlightRectangle();
		}
		return highlightRectangle;
	},
	
	focusHighlightRectangle : function() {
		var highlightRectangle = this._focusHighlightRectangle;
		if ($.isEmpty(highlightRectangle)) {
			this._focusHighlightRectangle = highlightRectangle = this.createHighlightRectangle();
		}
		return highlightRectangle;
	},
	
	createHighlightRectangle : function() {
		var def = {};
		def.pos = this.position().def();
		def.dim = this.dimension().def();
		def.style = {"className" : "highlight", "borderStyle" : "solid", "borderWidth" : 2, "borderColor" : "#609CD7"};
		return new openform.Rectangle(this.page(), this.parent(), def);
	},
	
	applyReference : function() {
		if (this.hasReference()) {
			var reference = this.reference();
			var url = reference.url();
			var self = this;
			var columns = reference.columns();
			this.$mainElement().reference(url, function(record) {
				var form = self.form();
				for (var i = 0, length = columns.length; i < length; i++) {
					var column = columns[i];
					if ($.isNotEmpty(column.field)) {
						var target = form.getControl(column.field, self.index());
						if (target) {
							target.value(record[i]);	
						}
					}
				}
			}, columns, {"search" : reference.search()});
		}
	},
	
	hasReference : function() {
		return $.isNotEmpty(this.reference().url());
	},
	
	applyValue : function() {
	},
	
	type : function(value) {
		return $.accessor(this, this.def(), "type", value);
	},
	
	caption : function(value) {
		return $.accessor(this, this.def(), "caption", value);
	},
	
	readOnly : function(value) {
		try {
			return $.accessor(this, this.def(), "readOnly", value);	
		} finally {
			if ($.isNotEmpty(value)) {
				this.applyMainElementAttribute();	
			}
		}
	},
	
	expression : function(value) {
		return $.accessor(this, this.def(), "expression", value);
	}
	
});
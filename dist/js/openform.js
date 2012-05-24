//　依存ライブラリを拡張する.

// datepickerにクリアボタンを追加する
(function() {
	//wrap up the redraw function with our new shiz
	var originalFunction = $.datepicker._generateHTML; //record the original
	$.datepicker._generateHTML = function(inst){
		var thishtml = $(originalFunction.call($.datepicker, inst)); //call the original
		
		thishtml = $('<div />').append(thishtml); //add a wrapper div for jQuery context
		
		//locate the button panel and add our button - with a custom css class.
		$('.ui-datepicker-buttonpane', thishtml).append(
			$('<button class="\
				ui-datepicker-clear ui-state-default ui-priority-primary ui-corner-all\
				"\>クリア</button>'
			).click(function(){
				inst.input.attr('value', '');
				inst.input.datepicker('hide');
			})
		);
		
		thishtml = thishtml.children(); //remove the wrapper div
		
		return thishtml; //assume okay to return a jQuery
	};
})();
$.namespace("openform");

openform.System = {
		
	CLASSNAME_OPENFORM : "openform",
		
	CLASSNAME_FORM : "form",

	CLASSNAME_PAGE : "page",

	CLASSNAME_LIST : "list",

	CLASSNAME_CONTROL : "control",
	
	CLASSNAME_LOADING : "loading",
	
	CLASSNAME_TOOLTIP : "tooltip",
	
	CSS_MAPPING : {
		"color" : "color",
		"fontSize" : "font-size",
		"fontWeight" : "font-weight",
		"fontFamily" : "font-family",
		"align" : "text-align",
		"verticalAlign" : "vertical-align",
		"backgroundColor" : "background-color",
		"borderStyle" : "border-style",
		"borderWidth" : "border-width",
		"borderColor" : "border-color",
		"paddingTop" : "padding-top",
		"paddingRight" : "padding-right",
		"paddingBottom" : "padding-bottom",
		"paddingLeft" : "padding-left",
		"imeMode" : "ime-mode"
	},
	
	createId : function(id, index) {
		return ($.isNotEmpty(index)) ? id + "_$" + index : id;
	}

};
openform.Loading = function(form, targetElement) {
	this.init(form, targetElement);
};


openform.Loading.prototype = {
		
	_form : null,

	_targetElement : null,
	
	_$loadingElement : null,
	
	init : function(form, targetElement) {
		this._form = form;
		this._targetElement = targetElement;
		this._$loadingElement = null;
	},
	
	render : function() {
		var $target = $(this._targetElement);
		
		this._$loadingElement = $("<div/>");
		this._$loadingElement.addClass(openform.System.CLASSNAME_LOADING);
		this._$loadingElement.width($target.width());
		this._$loadingElement.height($target.height());
		
		this._form.$mainElement().append(this._$loadingElement);
		$target.css("display", "none");
	},
	
	remove : function() {
		this._$loadingElement.remove();
		$(this._targetElement).fadeIn();
	}
	
};
openform.Object = function(def) {
	this.init(def);
};

openform.Object.prototype = {

	_def : null,
	
	init : function(def) {
		this._def = def || {};
	},
	
	def : function(value) {
		return $.accessor(this, this, "_def", value);
	}
	
};

$.defineAccessors(openform.Object);
openform.Event = function(form, target) {
	this.init(form, target);
};

$.extendPrototype(openform.Event, openform.Object, {
	
	_form : null,
	
	_target : null,
	
	_events : null,
	
	init : function(form, target) {
		openform.Event.superclass.init.call(this);
		
		this._form = form;
		this._target = target;
		this._events = [];
	},
	
	on : function(name, func) {
		if ($.isNotBlank(name) && $.isFunction(func)) {
			var funcs = this._events[name];
			if ($.isEmpty(funcs)) {
				funcs = this._events[name] = [];
			}
			funcs.push(func);
		}
		return this;
	},
	
	off : function(name, func) {
		if ($.isNotBlank(name)) {
			if ($.isFunction(func)) {
				var funcs = this._events[name];
				if ($.isNotEmpty(funcs)) {
					for (var length = funcs.length, i = length - 1; i >= 0; i--) {
						if (funcs[i] === func) {
							funcs.splice(i);
						}
					}
				}
			} else {
				this._events[name] = null;
			}
		} else {
			this._events = [];
		}
		return this;
	},
	
	fire : function() {
		var name = arguments[0];
		var funcs = this._events[name];
		if ($.isNotEmpty(funcs)) {
			var args = Array.prototype.slice.apply(arguments).slice(1);
			if (args.length == 0) args = [this.form()];
			for (var i = 0, length = funcs.length; i < length; i++) {
				funcs[i].apply(this.target(), args);
			}
		}
		return this;
	}
	
});
openform.ValueCaption = function(def) {
	this.init(def);
};

$.extendPrototype(openform.ValueCaption, openform.Object, {
	
	value : function(value) {
		return $.accessor(this, this.def(), "value", value);
	},
	
	caption : function(value) {
		return $.accessor(this, this.def(), "caption", value);
	}
	
});
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
openform.Controls = function(page, parent, def, index) {
	this.init(page, parent, def, index);
};

$.extendPrototype(openform.Controls, openform.Object, {
	
	_page : null,
	
	_parent : null,
	
	_controls : null,
	
	_controlMap : null,
	
	init : function(page, parent, def, index) {
		openform.Controls.superclass.init.call(this, def);
		
		this._page = page;
		this._parent = parent;
		this._controls = null;
		this._controlMap = null;
		
		var self = this;
		$(def).each(function() {
			var control = this;
			control.index = index;
			
			if ($.isNotEmpty(control.type) && $.isNotEmpty(openform[control.type])) {
				var control = new openform[control.type](page, parent, control);
				self.addControl(control);
			}
		});
	},
	
	addControl : function(control) {
		if ($.isEmpty(this._controls)) this._controls = [];
		this._controls.push(control);
		
		this.page().form().registControl(control);
	},
	
	getMaxHeight : function() {
		var max = 0;
		
		for (var i = 0, controls = this.controls(), length = controls.length; i < length; i++) {
			var height = controls[i].dimension().h();
			if (height > max) max = height;
		}
		
		return max;
	}
	
});
openform.ControlAttribute = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.ControlAttribute, openform.Object, {
	
	_control : null,
	
	init : function(control, def) {
		openform.ControlAttribute.superclass.init.call(this, def);
		
		this._control = control;
	}
	
});
openform.Dimension = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Dimension, openform.ControlAttribute, {
	
	w : function(value) {
		return $.accessor(this, this.def(), "w", value);
	},
	
	h : function(value) {
		return $.accessor(this, this.def(), "h", value);
	}
	
});
openform.Position = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Position, openform.ControlAttribute, {
	
	x : function(value) {
		return $.accessor(this, this.def(), "x", value);
	},
	
	y : function(value) {
		return $.accessor(this, this.def(), "y", value);
	}
	
});
openform.Format = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Format, openform.ControlAttribute, {
	
	comma : function(value) {
		return $.accessor(this, this.def(), "comma", value);
	},
	
	formatComma : function(value) {
		if (!this.comma()) return value;
		if ($.isEmpty(value)) return value;
		
		var to = String(value);
		var tmp = "";
		while (to != (tmp = to.replace(/^([+-]?\d+)(\d\d\d)/, "$1,$2"))) {
			to = tmp;
		}
		return to;
	},
	
	dateFormat : function(value) {
		return $.accessor(this, this.def(), "dateFormat", value);
	},
	
	formatDate : function(value) {
		if (!this.dateFormat()) return value;
		if ($.isEmpty(value)) return value;
		
		if (this.control().dataSource().isNumberField()) {
			return $.datepicker.formatDate(this.dateFormat(), new Date(value));
		}
		return value;
	},
	
	unformatDate : function(value) {
		if (!this.dateFormat()) return value;
		if ($.isEmpty(value)) return value;
		
		if (this.control().dataSource().isNumberField()) {
			return $.datepicker.parseDate(this.dateFormat(), value).getTime();
		}
		return value;
	}
	
});
openform.Style = function(def, unsupportedStyleList) {
	this.init(def, unsupportedStyleList);
};

$.extendPrototype(openform.Style, openform.Object, {
	
	_unsupportedStyleList : null,
	
	init : function(def, unsupportedStyleList) {
		openform.Style.superclass.init.call(this, def);
		
		this._unsupportedStyleList = unsupportedStyleList;
	},
	
	merge : function(style) {
		if ($.isEmpty(style)) return;
		
		var def = this.def();
		var target = style.def();
		var unsupportedStyleList = this.unsupportedStyleList();
		for (var prop in target) {
			if ($.inArray(prop, unsupportedStyleList) >= 0) continue;
			def[prop] = target[prop];
		}
	},
	
	className : function(value) {
		return $.accessor(this, this.def(), "className", value);
	},
	
	name : function(value) {
		return $.accessor(this, this.def(), "name", value);
	},
		
	color : function(value) {
		return this.cssAccess("color", value);
	},
	
	fontSize : function(value) {
		return this.cssAccess("fontSize", value, 12);
	},
	
	fontWeight : function(value) {
		return this.cssAccess("fontWeight", value);
	},
	
	fontFamily : function(value) {
		return this.cssAccess("fontFamily", value);
	},
	
	align : function(value) {
		return this.cssAccess("align", value);
	},
	
	backgroundColor : function(value) {
		return this.cssAccess("backgroundColor", value);
	},
	
	verticalAlign : function(value) {
		return this.cssAccess("verticalAlign", value);
	},
	
	borderStyle : function(value) {
		return this.cssAccess("borderStyle", value);
	},
	
	borderWidth : function(value) {
		return this.cssAccess("borderWidth", value);
	},
	
	borderColor : function(value) {
		return this.cssAccess("borderColor", value);
	},
	
	paddingTop : function(value) {
		return this.cssAccess("paddingTop", value, 0);
	},
	
	paddingRight : function(value) {
		return this.cssAccess("paddingRight", value, 0);
	},
	
	paddingBottom : function(value) {
		return this.cssAccess("paddingBottom", value, 0);
	},
	
	paddingLeft : function(value) {
		return this.cssAccess("paddingLeft", value, 0);
	},
	
	imeMode : function(value) {
		return this.cssAccess("imeMode", value);
	},
	
	cssAccess : function(name, value, def) {
		if ($.isEmpty(def)) def = null;
		
		if ($.isUndefined(value)) {
			return this.def()[name] || def;
		} else {
			this.def()[name] = value;
			return this;
		}
	}
	
});
openform.Reference = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.Reference, openform.ControlAttribute, {
	
	url : function(value) {
		return $.accessor(this, this.def(), "url", value);
	},
	
	search : function(value) {
		return $.accessor(this, this.def(), "search", value);
	},
	
	columns : function(value) {
		return $.accessor(this, this.def(), "columns", value);
	}
	
});
openform.DataSources = function(form, def) {
	this.init(form, def);
};

openform.DataSources.MAIN = "main";

$.extendPrototype(openform.DataSources, openform.Object, {
	
	_form : null,
	
	init : function(form, def) {
		openform.DataSources.superclass.init.call(this, def);
		this._form = form;
	},
	
	dataSource : function(id) {
		return new openform.DataSource(id, this.form(), this.def()[id]);
	},
	
	main : function() {
		return this.dataSource(openform.DataSources.MAIN);
	},
	
	all : function() {
		var result = [];
		for (var id in this.def()) {
			result.push(this.dataSource(id));
		}
		return result;
	}
	
});
openform.DataSource = function(id, form, def) {
	this.init(id, form, def);
};

$.extendPrototype(openform.DataSource, openform.Object, {
	
	_id : null,
	
	_form : null,
	
	_fieldMap : null,
	
	init : function(id, form, def) {
		openform.DataSource.superclass.init.call(this, def);
		
		this._id = id;
		this._form = form;
		this._fieldMap = null;
	},
	
	field : function(name) {
		this.initFieldMap();
		
		return this._fieldMap[name];
	},
	
	initFieldMap : function() {
		if ($.isEmpty(this._fieldMap)) {
			this._fieldMap = [];
			var def = this.def();
			if (def.fields) {
				for (var i = 0, fields = def.fields, length = fields.length; i < length; i++) {
					var field = fields[i];
					field.index = i;
					this._fieldMap[field.name] = field;
				}	
			}
		}
	},
	
	record : function(index, record) {
		if (index < 0) return null;
		
		var def = this.def();
		var records = def.records;
		if ($.isEmpty(records)) {
			records = [];
			def.records = records;
		}
		if (index >= records.length) {
			records[index] = [];
		}
		
		if ($.isUndefined(record)) {
			return records[index];
		} else {
			records[index] = record;
			
			var form = this.form();
			form.renderByDataSourceChange(this.id(), null, index, null);
			for (var i = 0, fields = def.fields, length = fields.length; i < length; i++) {
				form.evaluateExpression(form.getControl(fields[i].name, index));
			}
			
			return this;
		}
	},
	
	value : function(name, recordIndex, value, control) {
		var field = this.field(name);
		if (field) {
			var index = field.index;
			var record = this.record(recordIndex);
			if ($.isUndefined(value)) {
				if (index >= record.length) {
					record[index] = null;
				}
				return record[index];
			} else {
				v = this.cast(field, value);
				if (this.validate(field, v)) {
					record[index] = v;
					
					var form = this.form();
					if (control != null) control.event().fire("change", form, value);
					form.event().fire("change", this, field, name, recordIndex, value);
					form.renderByDataSourceChange(this.id(), name, recordIndex, control);
					form.evaluateExpression(form.getControl(name, recordIndex));
				}
			}
		}
	},
	
	cast : function(field, value) {
		switch (field.type) {
		case "str" :
			return ($.isNotEmpty(value)) ? $.rtrim(String(value)) : value;
		case "num" :
			value = Number($.rtrim(String(value)));
			return ($.isNumeric(value)) ? value : null;
		case "int" :
			value = parseInt($.rtrim(String(value)));
			return ($.isNumeric(value)) ? value : null;
		case "bool" :
			return $.toBoolean(value);
		}
		return value;
	},
	
	validate : function(field, value) {
		if ($.isEmpty(value)) return true;
		
		switch (field.type) {
		case "str" :
			return true;
		case "bool" :
			return true;
		case "num" :
		case "int" :
			if ($.isNumeric(value)) {
				if ($.isNotEmpty(field.min) && field.min > value) return false;
				if ($.isNotEmpty(field.max) && field.max < value) return false;
				return true;
			}
			return false;
		}
		return true;
	}
	
});
openform.Expression = function(expression, control) {
	this.init(expression, control);
};

$.extendPrototype(openform.Expression, openform.Object, {
	
	_expression : null,
	
	_control : null,
	
	_argumentControlNames : null,
	
	init : function(expression, control) {
		this._expression = expression;
		this._control = control;
		this._argumentControlNames = [];
		
		var pattern = /\$([^\$]+)\$/g;
		var result;
		while((result = pattern.exec(expression)) != null) {
			this._argumentControlNames.push(RegExp.$1);
		}
	},
	
	getAllTargetControlNames : function() {
		return this._argumentControlNames;
	},
	
	evaluate : function(control) {
		var exp = this._expression;
		var expControl = this.control();
		var form = control.form();
		
		var isListToList = $.isNotEmpty(expControl.index()) && $.isNotEmpty(control.index());
		
		var scripts = ["(function() {"];
		for (var i = 0, args = this._argumentControlNames, length = args.length; i < length; i++) {
			var name = args[i];
			var target = (isListToList) ? form.getControl(name, control.index()) : form.getControl(name);
			var value = null;
			
			if (target) {
				value = target.value();
			} else {
				value = "'" + name + "'";
			}
			if ($.isEmpty(value)) {
				return;
			}
			
			scripts.push("var $" + name + "$" + " = " + value + ";");
		}
		
		scripts.push("return " + exp);
		scripts.push("})();");
		
		// for debug
		console.log(scripts.join("\n"));
		
		// defined functions
		var sum = function(id) {
			var target = form.getControl(id);
			if ($.isEmpty(target)) {
				target = form.getControl(id, 0);
				if ($.isNotEmpty(target)) {
					var sum = 0;
					for (var i = 0, parent = target.parent(), length = parent.size(); i < length; i++) {
						sum += form.getControl(id, i).value();
					}
					return sum;
				}
			} else {
				return target.value();
			}
		};
		
		form.getControl(expControl.name(), control.index()).value(eval(scripts.join("")));
	}
	
});
openform.Form = function(id, def, dataSources) {
	this.init(id, def, dataSources);
};

openform.Form.ID_NAVIGATION = "openform-navigation";

$.extendPrototype(openform.Form, openform.Control, {
	
	_dataSources : null,
	
	_pages : null,
	
	_currentPageIndex : null,
	
	_styles : null,
	
	_pdfDocument : null,
	
	_pdfWriter : null,
	
	_controlMapById : null,
	
	_controlMapByDataSource : null,
	
	_expressionMap : null,
	
	_expressionMapByName : null,
	
	_navigation : null,
	
	_focusTooltip : null,
	
	_event : null,
	
	init : function(id, def, dataSources) {
		openform.Form.superclass.init.call(this, id, null, def);
	
		this._mainElement = $("#" + id).get(0);
		this._$mainElement = $(this._mainElement);
		this._dataSources = new openform.DataSources(this, dataSources);
		this._pages = [];
		this._currentPageIndex = 0;
		this._styles = new openform.FormStyles(this, def.styles);
		this._pdfDocument = null;
		this._pdfWriter = null;
		this._controlMapById = [];
		this._controlMapByDataSource = [];
		this._expressionMap = [];
		this._expressionMapByName = [];
		this._navigation = new openform.FormNavigation(openform.Form.ID_NAVIGATION, this, {});
		this._focusTooltip = null;
		this._event = new openform.Event(this, this);
		
		for (var i = 0, pages = this._def.pages, length = pages.length; i < length; i++) {
			this._pages.push(new openform.Page(this, pages[i]));
		}
	},
	
	render : function() {
		this.$mainElement().addClass(openform.System.CLASSNAME_OPENFORM);
		this.renderPage();
	},
	
	renderPage : function() {
		this.getCurrentPage().render();
		this.navigation().render();
	},
	
	getPageSize : function() {
		return this._pages.length;
	},
	
	getPage : function(id) {
		for (var i = 0, length = this._pages.length; i < length; i++) {
			if (this._pages[i].id() == id) {
				return this._pages[i];
			}
		}
		return null;
	},
	
	getCurrentPage : function() {
		return this._pages[this._currentPageIndex];
	},
	
	movePage : function(index) {
		if (this._currentPageIndex == index) return;
		this.getCurrentPage().remove();
		this._currentPageIndex = index;
		this.renderPage();
	},
	
	renderPdf : function(pages, outputStream) {
		for (var i = 0, length = this._pages.length; i < length; i++) {
			if (this.containsTargetPage(pages, i)) {
				this._pages[i].renderPdf(outputStream);	
			}
		}
		
		if (this._pdfDocument) this._pdfDocument.close();
		if (this._pdfWriter) this._pdfWriter.close();
	},
	
	containsTargetPage : function(pages, index) {
		if (!pages) return true;
		for (var i = 0, length = pages.length; i < length; i++) {
			if (pages[i] == (index + 1)) return true;
		}
		return false;
	},
	
	renderByDataSourceChange : function(id, name, recordIndex, triggerControl) {
		var list = this.getControlListByDataSource(id, name, recordIndex);
		for (var i = 0, length = list.length; i < length; i++) {
			var control = list[i];
			if ($.isNotEmpty(triggerControl) && triggerControl == control) continue;
			control.applyValue();
		}
	},
	
	remove : function() {
		for (var i = 0, length = this._pages.length; i < length; i++) {
			this._pages[i].remove();
		}
	},
	
	registControl : function(control) {
		var id = control.id();
		var pageControlDataSource = (control.dataSource) ? control.dataSource() : null;
		
		if ($.isNotEmpty(id)) {
			this._controlMapById[id] = control;	
		}
		if ($.isNotEmpty(pageControlDataSource) && $.isNotEmpty(pageControlDataSource.dataSource())) {
			this.registControlMapDataSourceByKey(this.createFieldKeyByPageControlDataSource(pageControlDataSource), control);
			if (pageControlDataSource.dataSource()) {
				this.registControlMapDataSourceByKey(this.createIndexKeyByPageControlDataSource(pageControlDataSource), control);	
			}
		}
		
		this.registExpression(control);
	},
	
	registControlMapDataSourceByKey : function(key, control) {
		var controls = this._controlMapByDataSource[key];
		if ($.isEmpty(controls)) {
			controls = [];
			this._controlMapByDataSource[key] = controls;
		}
		controls.push(control);
	},
	
	registExpression : function(control) {
		var expression = control.expression();
		if ($.isNotEmpty(expression) && !this._expressionMap[expression]) {
			var exp = new openform.Expression(expression, control);
			this._expressionMap[expression] = exp;
			
			for (var i = 0, names = exp.getAllTargetControlNames(), length = names.length; i < length; i++) {
				var name = names[i];
				var list = this._expressionMapByName[name];
				if ($.isEmpty(list)) {
					list = this._expressionMapByName[name] = [];
				}
				list.push(exp);
			}
		}
	},
	
	getControl : function(name, index) {
		var target = this._controlMapById[name];
		if ($.isEmpty(target)) {
			target = this._controlMapById[openform.System.createId(name, index)];
		}
		return target;
	},
	
	getControlListByDataSource : function(id, field, recordIndex) {
		var result = [];
		var list = this._controlMapByDataSource[this.createFieldKey(id, field)];
		if ($.isEmpty(list)) {
			list = this._controlMapByDataSource[this.createIndexKey(id, recordIndex)];
		}
		if ($.isNotEmpty(list)) {
			for (var i = 0, length = list.length; i < length; i++) {
				var control = list[i];
				if (control.dataSource().recordIndex() == recordIndex) {
					result.push(control);
				}
			}
		}
		return result;
	},
	
	createFieldKeyByPageControlDataSource : function(pageControlDataSource) {
		var dataSource = pageControlDataSource.dataSource();
		return this.createFieldKey(dataSource.id(), pageControlDataSource.field());
	},
	
	createIndexKeyByPageControlDataSource : function(pageControlDataSource) {
		var dataSource = pageControlDataSource.dataSource();
		return this.createIndexKey(dataSource.id(), pageControlDataSource.recordIndex());
	},
	
	createFieldKey : function(id, field) {
		return id + "#" + field;
	},
	
	createIndexKey : function(id, index) {
		return id + "#" + index;
	},
	
	evaluateExpression : function(control) {
		if ($.isEmpty(control)) return;
		
		var list = this._expressionMapByName[control.name()];
		if ($.isNotEmpty(list)) {
			for (var i = 0, length = list.length; i < length; i++) {
				list[i].evaluate(control);
			}
		}
	},

	focusTooltip : function() {
		var tooltip = this._focusTooltip;
		if ($.isEmpty(tooltip)) {
			this._focusTooltip = tooltip = new openform.Tooltip(this);
		}
		return tooltip;
	}
	
});
openform.FormNavigation = function(id, parent, def) {
	this.init(id, parent, def);
};

$.extendPrototype(openform.FormNavigation, openform.Control, {
	
	render : function() {
		var form = this.parent();
		
		if (form.getPageSize() <= 1) return;
		
		var html = [];
		var id = openform.Form.ID_NAVIGATION;
		var $nav = $("#" + id);
		if ($nav.get(0) == null) {
			html.push("<div id=\"" + id + "\">");
			html.push("<ul>");
			for (var i = 0, length = form._pages.length; i < length; i++) {
				if (i != 0) {
					html.push("<hr class='style-six'/>");
				}
				var name = form._pages[i].caption() || "Page." + (i + 1);
				html.push("<li class=\"movepage\" index=\"" + i + "\">" + name + "</li>");
			}
			html.push("</ul>");
			html.push("</div>");
			form.$mainElement().append(html.join(""));
			$nav = $("#" + id);
			
			this.applyEvent($nav);
		}
		
		this.applyNavigationStyle();
	},
	
	applyEvent : function($nav) {
		$nav = $nav || $("#" + openform.Form.ID_NAVIGATION);
		var form = this.parent();
		
		$nav.on("mouseover", function() {
			$(this).addClass("over");
		}).on("mouseout", function() {
			$(this).removeClass("over");
		});
		
		$nav.find(".movepage").on("click", function() {
			form.movePage(parseInt($(this).attr("index")));
			$(window).scrollTop(0);
		});
		
		var self = this;
		$(window).scroll(function() {
			$nav.stop().animate(self.calculatePosition($nav));
		}).resize(function() {
			$nav.stop().animate(self.calculatePosition($nav));
		});
	},
	
	applyNavigationStyle : function() {
		var $nav = $("#" + openform.Form.ID_NAVIGATION);
		$nav.css(this.calculatePosition($nav));
	},
	
	calculatePosition : function($nav) {
		$nav = $nav || $("#" + openform.Form.ID_NAVIGATION);
		var form = this.parent();
		var $window = $(window);
		var top = $window.scrollTop() + 10;
		var left = $window.scrollLeft() + $window.width() - $nav.width() - 10;
		var leftMax = form.getCurrentPage().$mainElement().position().left + form.getCurrentPage().dimension().w() - 10;
		if (left > leftMax) left = leftMax;
		return {"top" : top, "left" : left};
	}
	
});
openform.FormAttribute = function(form, def) {
	this.init(form, def);
};

$.extendPrototype(openform.FormAttribute, openform.Object, {
	
	_form : null,
	
	init : function(form, def) {
		openform.FormAttribute.superclass.init.call(this, def);
		
		this._form = form;
	}
	
});
openform.FormStyles = function(form, def) {
	this.init(form, def);
};

openform.FormStyles.ALL = "$all";

$.extendPrototype(openform.FormStyles, openform.FormAttribute, {
	
	getAllStyle : function() {
		return this.getStyle(openform.FormStyles.ALL);
	},
	
	getControlStyle : function(control) {
		return this.getStyle(control.type());
	},
	
	getStyle : function(type) {
		if ($.isEmpty(type)) return null;
		return new openform.Style(this.def()[type]);
	}
	
});
openform.FormControl = function(form, def) {
	this.init(form, def);
};

$.extendPrototype(openform.FormControl, openform.Control, {
	
	_event : null,
	
	init : function(form, def) {
		openform.FormControl.superclass.init.call(this, def.id, form, def);

		this._event = new openform.Event(form, this);
	},
	
	form : function() {
		return this.parent();
	}
	
});
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
openform.PageControlDataSource = function(control, def) {
	this.init(control, def);
};

$.extendPrototype(openform.PageControlDataSource, openform.Object, {
	
	_control : null,
	
	_dataSource : null,
	
	_recordIndex : null,
	
	init : function(control, def) {
		openform.PageControlDataSource.superclass.init.call(this, def);
		
		this._control = control;
		this._dataSource = null;
		this._recordIndex = 0;

		var dataSources = control.form().dataSources();
		var defaultDs = this.getDefaultDataSource(dataSources, control);
		if ($.isNotEmpty(def)) {
			this._dataSource = ($.isEmpty(def.id)) ? defaultDs : dataSources.dataSource(def.id);
		} else {
			if ($.isNotEmpty(control.def().value)) {
				this.def().value = control.def().value;
			} else {
				if (defaultDs.field(control.id())) {
					this._dataSource = defaultDs;
					this.field(control.id());
				} else if (defaultDs.field(control.name())) {
					this._dataSource = defaultDs;
					this.field(control.name());
				}
			}
		}
	},
	
	getDefaultDataSource : function(dataSources, control) {
		var ds = null;
		if (control.parent().dataSource) {
			ds = control.parent().dataSource().dataSource();
		}
		if (ds == null) {
			ds = dataSources.main();
		}
		return ds;
	},
	
	field : function(value) {
		return $.accessor(this, this.def(), "field", value);
	},
	
	record : function(index, record) {
		if ($.isNotEmpty(this._dataSource)) {
			return this._dataSource.record(index, record);
		}
	},
	
	value : function(value, triggered) {
		if ($.isUndefined(value)) {
			if ($.isNotEmpty(this._dataSource)) {
				return this._dataSource.value(this.field(), this.recordIndex());
			} else {
				var value = this.def().value;
				if ($.isEmpty(value)) value = null;
				return value;
			}			
		} else {
			var control = this.control();
			if (!control.validateValue(value)) {
				control.applyValue();
				return false;
			}
			if ($.isNotEmpty(this._dataSource)) {
				return this._dataSource.value(this.field(), this.recordIndex(), value, (triggered) ? this.control() : null);
			} else {
				var before = this.def().value;
				this.def().value = value;
				if (before != value) {
					control.applyValue();
					control.form().evaluateExpression(control);
					control.event().fire("change", control.form(), value);
					return true;	
				} else {
					return false;	
				}
			}
		}
	},
	
	isRequired : function() {
		var dataSource = this.dataSource();
		if ($.isNotEmpty(dataSource)) {
			return dataSource.field(this.field()).required;
		}
		return false;
	},
	
	caption : function() {
		var dataSource = this.dataSource();
		if ($.isNotEmpty(dataSource)) {
			return dataSource.field(this.field()).caption;
		}
		return null;
	},
	
	isNumberField : function() {
		var dataSource = this.dataSource();
		if ($.isNotEmpty(dataSource)) {
			var type = dataSource.field(this.field()).type;
			return type == "num" || type == "int";
		}
		return false;
	}
	
});
openform.PageInputControl = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PageInputControl, openform.PageControl, {
	
	isInput : function() {
		return true;
	},

	applyEvent : function() {
		openform.PageInputControl.superclass.applyEvent.call(this);
		
		this.applyChangeEvent();
	},
	
	applyChangeEvent : function() {
		var self = this;
		this.$mainElement().on("change", function() {
			self.fireChangeEvent($(this).val());
		});
	},
	
	fireChangeEvent : function(value) {
		this.value(this.unformatValue(value), true);
	}
	
});
openform.List = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.List, openform.PageControl, {
	
	_records : null,
	
	init : function(page, parent, def) {
		openform.List.superclass.init.call(this, page, parent, def);
		
		this._records = [];
		
		this.position().x(0).y(0);
		
		var maxHeight = null;
		for (var i = 0, length = this.size(); i < length; i++) {
			this._records[i] = new openform.Controls(page, this, $.cloneObject(def).controls, i);
			if (maxHeight == null) {
				maxHeight = this._records[i].getMaxHeight();
			}
			
			for (var j = 0, controls = this._records[i].controls(), controlLength = controls.length; j < controlLength; j++) {
				var control = controls[j];

				var position = control.position();
				position.y(position.y() + (maxHeight * i));
			}
			
		}
	},
	
	getSystemClassName : function() {
		return openform.System.CLASSNAME_LIST;
	},
	
	size : function(value) {
		return $.accessor(this, this.def(), "size", value);
	},
	
	render : function() {
		openform.List.superclass.render.call(this);
		
		for (var i = 0, records = this.records(), length = records.length; i < length; i++) {
			for (var j = 0, record = records[i], controls = record.controls(), recordLength = controls.length; j < recordLength; j++) {
				controls[j].render();
			}
		}
	},
	
	renderPdf : function(pcb, x, y, w, h) {
		var Pdf = openform.Pdf;
		for (var i = 0, records = this.records(), length = records.length; i < length; i++) {
			for (var j = 0, record = records[i], controls = record.controls(), recordLength = controls.length; j < recordLength; j++) {
				Pdf.callControlRenderPdf(controls[j]);
			}
		}
	}

});
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
openform.PageLabelBaseControl = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PageLabelBaseControl, openform.Label, {
	
	isInput : function() {
		return true;
	}
	
});
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
openform.NumberField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.NumberField, openform.TextField, {
	
	getDefaultStyle : function() {
		return new openform.Style({"verticalAlign" : "middle", "align" : "right", "imeMode" : "disabled"});
	},
	
	getUnsupportedStyleList : function() {
		return ["verticalAlign"];
	},
	
	validateValue : function(value) {
		return $.isNumeric(Number(value));
	},
	
	formatValue : function(value) {
		return this.format().formatComma(value);
	},

	applyEvent : function() {
		openform.TextField.superclass.applyEvent.call(this);
		
		if (!this.readOnly()) {
			var self = this;
			this.$mainElement().on("focus", function() {
				self.applyValue(self.value());
			}).on("blur", function() {
				self.applyValue();
			});
		} else {
			this.$mainElement().off("focus").off("blur");
		}
	}
	
});
openform.IntegerField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.IntegerField, openform.NumberField, {
	
	formatValue : function(value) {
		if ($.isNotEmpty(value)) {
			value = parseInt(value);
		}
		return openform.IntegerField.superclass.formatValue.call(this, value);
	}
	
});
openform.DateField = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.DateField, openform.TextField, {
	
	getDefaultStyle : function() {
		return new openform.Style({"verticalAlign" : "middle"});
	},
	
	getUnsupportedStyleList : function() {
		return ["verticalAlign"];
	},
	
	applyEvent : function() {
		openform.DateField.superclass.applyEvent.call(this);
		
		if (this.calendar() != false) {
			var self = this;
			var settings = $.cloneObject($.datepicker.regional["ja"]);
			settings.showButtonPanel = true;
			settings.dateFormat = this.format().dateFormat();
			settings.onSelect = function(dateText, inst) {
				self.fireChangeEvent(dateText);
			};
			this.$mainElement().datepicker(settings);
		}
	},
	
	formatValue : function(value) {
		return this.format().formatDate(value);
	},
	
	unformatValue : function(value) {
		return this.format().unformatDate(value);
	},

	calendar : function(value) {
		return $.accessor(this, this.def(), "calendar", value);
	}
	
});
openform.TextArea = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.TextArea, openform.PageInputControl, {
	
	createElement : function() {
		openform.TextArea.superclass.createElement.call(this);
		
		this.$mainElement().css("resize", "none");
	},

	createMainElementFragment : function() {
		return document.createElement("textarea");
	}
	
});
openform.CheckBox = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.CheckBox, openform.PageLabelBaseControl, {
	
	_checkedValue : null,
	
	_uncheckedValue : null,
	
	init : function(page, parent, def) {
		openform.CheckBox.superclass.init.call(this, page, parent, def);
		
		this._checkedValue = new openform.ValueCaption(def.checked);
		this._uncheckedValue = new openform.ValueCaption(def.unchecked);
	},
	
	applyEvent : function() {
		openform.CheckBox.superclass.applyEvent.call(this);
		
		var self = this;
		this.$mainElement().on("click", function() {
			self.toggleValue();
			self.applyValue();
		}).on("keydown", function(e) {
			// Enter or Space Key
			if (e.keyCode == 13 || e.keyCode == 32) {
				self.toggleValue();
				self.applyValue();
			}
		});
	},
	
	toggleValue : function() {
		if (this.readOnly()) return;
		
		var value = this.dataSource().value();
		if (this.checkedValue().value() == value) {
			this.value(this.uncheckedValue().value());
		} else {
			this.value(this.checkedValue().value());
		}
	},
	
	captionValue : function() {
		var value = this.dataSource().value();
		if (this.checkedValue().value() == value) {
			return this.checkedValue().caption();
		} else {
			return this.uncheckedValue().caption() || "";
		}
	}
	
});
openform.RadioButton = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.RadioButton, openform.PageLabelBaseControl, {
	
	_checkedValue : null,
	
	init : function(page, parent, def) {
		openform.RadioButton.superclass.init.call(this, page, parent, def);
		
		this._checkedValue = new openform.ValueCaption(def.checked);
	},
	
	applyEvent : function() {
		openform.RadioButton.superclass.applyEvent.call(this);
		
		var self = this;
		this.$mainElement().on("click", function() {
			self.toggleValue();
			self.applyValue();
		}).on("keydown", function(e) {
			// Enter or Space Key
			if (e.keyCode == 13 || e.keyCode == 32) {
				self.toggleValue();
				self.applyValue();
			}
		});
	},
	
	toggleValue : function() {
		if (this.readOnly()) return;
		
		this.value(this.checkedValue().value());
		
		var page = this.page();
		for (var i = 0, controls = page.controls().controls(), length = controls.length; i < length; i++) {
			var control = controls[i];
			if (control != this) {
				control.applyValue();
			}
		}
	},
	
	captionValue : function() {
		var value = this.dataSource().value();
		if (this.checkedValue().value() == value) {
			return this.checkedValue().caption();
		} else {
			return "";
		}
	}
	
});
openform.PulldownList = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.PulldownList, openform.PageInputControl, {
	
	createElement : function() {
		openform.PulldownList.superclass.createElement.call(this);
		
		var options = this.def().options;
		if (options) {
			for (var i = 0, length = options.length; i < length; i++) {
				var option = options[i];
				if ($.isEmpty(option.caption)) {
					option.caption = option.value;
				}
				this.$mainElement().append("<option value='" + option.value + "'>" + option.caption + "</option>");
			}
		}
	},

	createMainElementFragment : function() {
		return document.createElement("select");
	},
	
	applyMainElementAttribute : function() {
		openform.PulldownList.superclass.applyMainElementAttribute.call(this);
		
		// readOnly属性が無いため disabled で代用
		this.$mainElement().attr("disabled", this.readOnly());
	},

	applyValue : function(value) {
		var option = this.getCurrentOption();
		this.$mainElement().val((option != null) ? (option.value || option.caption) : null);
	},
	
	captionValue : function() {
		var option = this.getCurrentOption();
		return (option != null) ? (option.caption || option.value) : null;
	},
	
	getCurrentOption : function() {
		var options = this.def().options;
		if (options) {
			var value = this.value();
			var first = null;
			for (var i = 0, length = options.length; i < length; i++) {
				var option = options[i];
				
				if (first == null) first = option.caption || option.value;
				if (option.value == value) {
					return option;
				}
			}
			return first;
		}
		return null;
	}
	
});
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
openform.ListIndex = function(page, parent, def) {
	this.init(page, parent, def);
};

$.extendPrototype(openform.ListIndex, openform.Label, {
	
	captionValue : function() {
		return this.index() + 1;
	}
	
});
openform.Tooltip = function(form) {
	this.init(form);
};

$.extendPrototype(openform.Tooltip, openform.Control, {
	
	init : function(form) {
		openform.Tooltip.superclass.init.call(this, null, form, {});
	},
	
	render : function(control) {
		this.remove();
		
		var html = this.createHtml(control);
		if (html) {
			openform.Tooltip.superclass.render.call(this);
			var $main = this.$mainElement();
			$main.addClass(openform.System.CLASSNAME_TOOLTIP).css({"width" : "auto", "height" : "auto"});
			$main.html(html);
			
			var position = control.position();
			var dimension = control.dimension();
			
			var x = position.x() + dimension.w() + 5;
			var y = y = position.y() + dimension.h() + 5;

			if ((x + $main.outerWidth()) > $(document.body).outerWidth()) {
				x = position.x() - $main.outerWidth() - 5;
			}
			if (this.existCalendarInDownPosition(control)) {
				y = position.y() - $main.outerHeight() - 5;
			}
			
			this.position().x(x).y(y);
			this.applyPosition();
			
			var self = this;
			$main.fadeIn("normal", function() {
				self.applyDelayedEvent(control);
			});
		}
	},
	
	applyEvent : function() {
		
	},
	
	applyDelayedEvent : function(control) {
		var $main = this.$mainElement();
		var self = this;
		$main.find("a").each(function() {
			var $this = $(this);
			var name = $this.attr("name");
			$this.click(function() {
				self[name].call(self, control);
			});
		});
	},
	
	renderPdf : function(pcb, x, y, w, h) {
	},
	
	existCalendarInDownPosition : function(control) {
		var $calendar = $("#ui-datepicker-div");
		if ($calendar.css("display") == "none") return false;
		
		var offset = $calendar.offset();
		if (offset == null) return false;
		return control.position().y() < offset.top;
	},
	
	createHtml : function(control) {
		var html = [];
		
//		var caption = control.caption() || control.dataSource().caption();
//		if (caption) {
//			html.push("<span class='caption'>" + caption + "</span>");
//			html.push(this.createAttrHtml(control));
//		}
		var operationHtml = this.createOperationHtml(control);
		if (operationHtml) {
//			if (caption) {
//				html.push("<div class='separate'></div>");
//			}
			html.push(operationHtml);
		}
		
		return html.join("");
	},
	
	createAttrHtml : function(control) {
		var html = [];
		var isRequired = control.dataSource().isRequired();
		var isReadOnly = control.readOnly();
		
		if (isRequired) {
			html.push("<span class='required'>必須</span>");				
		}
		if (isReadOnly) {
			html.push("<span class='readonly'>編集不可</span>");
		}
		
		return html.join("");
	},
	
	createOperationHtml : function(control) {
		var html = [];
		if (control.hasReference()) {
			html.push("<a href='javascript:void(0);' name='reference' class='menu menu-black'><span>参照...</span></a>");	
		}
		if ($.isNotEmpty(control.index())) {
			html.push("<a href='javascript:void(0);' name='listUp'    class='menu menu-black'><span>上へ</span></a>");
			html.push("<a href='javascript:void(0);' name='listDown'  class='menu menu-black'><span>下へ</span></a>");
			html.push("<a href='javascript:void(0);' name='listClear' class='menu menu-black'><span>削除</span></a>");
		}
		return html.join("");
	},
	
	listUp : function(control) {
		if (control.index() == 0) return;
		
		var index = control.index();
		var targetIndex = index - 1;
		var dataSource = control.dataSource();
		var current = dataSource.record(index);
		var target = dataSource.record(targetIndex);
		dataSource.record(index, target);
		dataSource.record(targetIndex, current);
		
		control.form().getControl(control.name(), targetIndex).$mainElement().focus();
	},
	
	listDown : function(control) {
		if (control.index() + 1 >= control.parent().size()) return;
		
		var index = control.index();
		var targetIndex = index + 1;
		var dataSource = control.dataSource();
		var current = dataSource.record(index);
		var target = dataSource.record(targetIndex);
		dataSource.record(index, target);
		dataSource.record(targetIndex, current);
		
		control.form().getControl(control.name(), targetIndex).$mainElement().focus();
	},
	
	listClear : function(control) {
		control.dataSource().record(control.index(), []);
	},
	
	reference : function(control) {
		control.$mainElement().reference();
	}
	
});
openform.Pdf = {
		
	FONT_GOTHIC : {name : "HeiseiKakuGo-W5", encode : "UniJIS-UCS2-H"},
	FONT_MINCHO : {name : "HeiseiMin-W3", encode : "UniJIS-UCS2-H"},
	FONT_PGOTHIC : {name : "HeiseiKakuGo-W5", encode : "niJIS-UCS2-HW-H"},
	FONT_PMINCHO : {name : "HeiseiMin-W3", encode : "UniJIS-UCS2-HW-H"},
	
	_fontMap : [],
	
	callControlRenderPdf : function(control) {
		var form = control.form();
		var doc = form._pdfDocument;
		var pcb = form._pdfWriter.getDirectContent();
		var style = control.getComputedStyle();
		var w = control.dimension().w();
		var h = control.dimension().h();
		var x = control.position().x();
		var y = doc.getPageSize().getHeight() - control.position().y() - h;
		
		pcb.saveState();
		control.renderPdf(pcb, x, y, w, h, style);
		pcb.restoreState();
	},
	
	getFont : function(fontType, style) {
		var fontWeight = style.fontWeight() || "normal";
		var key = fontType.name + "#" + fontWeight;
		var font = this._fontMap[key];
		if (!font) {
			var name = fontType.name;
			if (fontWeight == "bold") {
				name += ",Bold";
			}
			font = BaseFont.createFont(name, fontType.encode, BaseFont.NOT_EMBEDDED);
			this._fontMap[key] = font;
		}
		return font;
	},
	
	getTextWidth : function(font, fontSize, text) {
		return font.getWidthPoint(text, fontSize);
	},

	hline : function(pcb, x, y, w, style) {
		this.applyBorderStyle(pcb, style);
		pcb.moveTo(x, y);
		pcb.lineTo(x + w, y);
		pcb.stroke();
	},
		
	vline : function(pcb, x, y, h, style) {
		this.applyBorderStyle(pcb, style);
		pcb.moveTo(x, y);
		pcb.lineTo(x, y + h);
		pcb.stroke();
	},
	
	rectangle : function(pcb, x, y, w, h, style) {
		this.hline(pcb, x, y, w, style);
		this.hline(pcb, x, y + h, w, style);
		this.vline(pcb, x, y, h, style);
		this.vline(pcb, x + w, y, h, style);
	},
	
	fill : function(pcb, x, y, w, h, backgroundColor) {
		var rgb = $.RGB(backgroundColor);
		pcb.rectangle(x, y, w, h);
		pcb.setRGBColorFill(rgb[0], rgb[1], rgb[2]);
		pcb.fill();
	},
	
	control : function(pcb, x, y, w, h, style) {
		// 背景色
		if (style.backgroundColor()) {
			openform.Pdf.fill(pcb, x, y, w, h, style.backgroundColor());
		}
		
		// 枠線
		if (style.borderWidth()) {
			openform.Pdf.rectangle(pcb, x, y, w, h, style);
		}
	},
	
	text : function(pcb, x, y, w, h, style, text) {
		var Pdf = openform.Pdf;
		
		this.control(pcb, x, y, w, h, style);

		if (text) {
			var cw = w - style.paddingLeft() - style.paddingRight();
			var ch = h - style.paddingTop() - style.paddingBottom();
			var cx = x + style.paddingLeft();
			var cy = y - style.paddingTop();
			
			var font = Pdf.getFont(openform.Pdf.FONT_MINCHO, style);
//			var fontSize = Math.ceil((style.fontSize() / 96) * 72);
			var fontSize = style.fontSize();
			
			// 色
			if (style.color()) {
				var rgb = $.RGB(style.color());
				pcb.setRGBColorFill(rgb[0], rgb[1], rgb[2]);
			} else {
				pcb.setRGBColorFill(0, 0, 0);
			}
			
			text = new String(text);
			pcb.beginText();
			var lines = [];
			var strs = text.split("\n");
			for (var i = 0, length = strs.length; i < length; i++) {
				var str = strs[i];
				var strWidth = Pdf.getTextWidth(font, fontSize, str);
				if (strWidth > cw) {
					var curw = 0;
					var chars = [];
					for (var j = 0, strLength = str.length; j < strLength; j++) {
						var c = str.charAt(j);
						var tw = Pdf.getTextWidth(font, fontSize, c);
						if (curw + tw > cw) {
							lines.push(chars.join(""));
							curw = tw;
							chars = [];
						} else {
							curw += tw;
						}
						chars.push(c);
					}
					lines.push(chars.join(""));
				} else {
					lines.push(str);
				}
			}
			
			var align = style.align();
			var verticalAlign = style.verticalAlign();
			var tx = cx;
			var ty = cy;
			
			length = lines.length;
			
			if (!verticalAlign || verticalAlign == "top") {
				ty = cy + h - fontSize;
			} else if (verticalAlign == "middle") {
				ty = y + h - ((h - (fontSize * length)) / 2) - fontSize;
			} else if (verticalAlign == "bottom") {
				ty = cy + (fontSize * length);
			}
			
			pcb.setFontAndSize(font, fontSize);
			for (var i = 0; i < length; i++) {
				var line = lines[i];

				tx = cx;
				if (align == "center") {
					tx += (cw - Pdf.getTextWidth(font, fontSize, line)) / 2;
				} else if (align == "right") {
					tx += (cw - Pdf.getTextWidth(font, fontSize, line));
				}
				
				pcb.setTextMatrix(tx, ty);
				for (var j = 0, lineLength = line.length; j < lineLength; j++) {
					var c = line.charAt(j);
					pcb.showText(c);
					tx += Pdf.getTextWidth(font, fontSize, c);
					pcb.setTextMatrix(tx, ty);
				}
				ty -= fontSize;
			}
			pcb.endText();
		}
	},
	
	image : function(pcb, x, y, w, h, style, src) {
		this.control(pcb, x, y, w, h, style);
		
		var image = Image.getInstance(src);
		image.setAbsolutePosition(x, y);
		image.scaleAbsolute(w, h);
		image.setCompressionLevel(PdfStream.NO_COMPRESSION);
		pcb.addImage(image);
	},
	
	applyBorderStyle : function(pcb, style) {
		if (style.borderWidth()) {
			pcb.setLineWidth(style.borderWidth());
		}
		if (style.borderColor()) {
			var rgb = $.RGB(style.borderColor());
			pcb.setColorStroke(PdfHelper.toColor(rgb[0], rgb[1], rgb[2]));
		}
		if (style.borderStyle()) {
			switch (style.borderStyle()) {
			case "dashed" :
				pcb.setLineDash(5, 5);
				break;
			case "dotted" :
				pcb.setLineDash(1, 1);
				break;
			}
		}
	}
		
}

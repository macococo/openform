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
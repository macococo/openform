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
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
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
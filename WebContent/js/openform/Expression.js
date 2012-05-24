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
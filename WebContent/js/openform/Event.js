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
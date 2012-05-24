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
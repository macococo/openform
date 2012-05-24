var Element = function() {};
Element.prototype = {
	firstChild : new Element(),
	lastChild : new Element(),
	style : {},
	appendChild : function() {return new Element();},
	removeChild : function() {},
	insertBefore : function() {},
	cloneNode : function() {return new Element();},
	getAttribute : function() {return null;},
	setAttribute : function() {},
	getElementsByTagName : function() {return [new Element()]}
}

window = this;
window.document = {
	documentElement : new Element(),
	addEventListener : function() {},
	createElement : function() {return new Element();},
	createDocumentFragment : function() {return new Element();},
	getElementById : function() {},
	createComment : function() {}
}
window.navigator = {
	userAgent : "hoge"
}
window.addEventListener = function() {};
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
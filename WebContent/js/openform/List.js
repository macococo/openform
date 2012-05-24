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
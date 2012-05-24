openform.Pdf = {
		
	FONT_GOTHIC : {name : "HeiseiKakuGo-W5", encode : "UniJIS-UCS2-H"},
	FONT_MINCHO : {name : "HeiseiMin-W3", encode : "UniJIS-UCS2-H"},
	FONT_PGOTHIC : {name : "HeiseiKakuGo-W5", encode : "niJIS-UCS2-HW-H"},
	FONT_PMINCHO : {name : "HeiseiMin-W3", encode : "UniJIS-UCS2-HW-H"},
	
	_fontMap : [],
	
	callControlRenderPdf : function(control) {
		var form = control.form();
		var doc = form._pdfDocument;
		var pcb = form._pdfWriter.getDirectContent();
		var style = control.getComputedStyle();
		var w = control.dimension().w();
		var h = control.dimension().h();
		var x = control.position().x();
		var y = doc.getPageSize().getHeight() - control.position().y() - h;
		
		pcb.saveState();
		control.renderPdf(pcb, x, y, w, h, style);
		pcb.restoreState();
	},
	
	getFont : function(fontType, style) {
		var fontWeight = style.fontWeight() || "normal";
		var key = fontType.name + "#" + fontWeight;
		var font = this._fontMap[key];
		if (!font) {
			var name = fontType.name;
			if (fontWeight == "bold") {
				name += ",Bold";
			}
			font = BaseFont.createFont(name, fontType.encode, BaseFont.NOT_EMBEDDED);
			this._fontMap[key] = font;
		}
		return font;
	},
	
	getTextWidth : function(font, fontSize, text) {
		return font.getWidthPoint(text, fontSize);
	},

	hline : function(pcb, x, y, w, style) {
		this.applyBorderStyle(pcb, style);
		pcb.moveTo(x, y);
		pcb.lineTo(x + w, y);
		pcb.stroke();
	},
		
	vline : function(pcb, x, y, h, style) {
		this.applyBorderStyle(pcb, style);
		pcb.moveTo(x, y);
		pcb.lineTo(x, y + h);
		pcb.stroke();
	},
	
	rectangle : function(pcb, x, y, w, h, style) {
		this.hline(pcb, x, y, w, style);
		this.hline(pcb, x, y + h, w, style);
		this.vline(pcb, x, y, h, style);
		this.vline(pcb, x + w, y, h, style);
	},
	
	fill : function(pcb, x, y, w, h, backgroundColor) {
		var rgb = $.RGB(backgroundColor);
		pcb.rectangle(x, y, w, h);
		pcb.setRGBColorFill(rgb[0], rgb[1], rgb[2]);
		pcb.fill();
	},
	
	control : function(pcb, x, y, w, h, style) {
		// 背景色
		if (style.backgroundColor()) {
			openform.Pdf.fill(pcb, x, y, w, h, style.backgroundColor());
		}
		
		// 枠線
		if (style.borderWidth()) {
			openform.Pdf.rectangle(pcb, x, y, w, h, style);
		}
	},
	
	text : function(pcb, x, y, w, h, style, text) {
		var Pdf = openform.Pdf;
		
		this.control(pcb, x, y, w, h, style);

		if (text) {
			var cw = w - style.paddingLeft() - style.paddingRight();
			var ch = h - style.paddingTop() - style.paddingBottom();
			var cx = x + style.paddingLeft();
			var cy = y - style.paddingTop();
			
			var font = Pdf.getFont(openform.Pdf.FONT_MINCHO, style);
//			var fontSize = Math.ceil((style.fontSize() / 96) * 72);
			var fontSize = style.fontSize();
			
			// 色
			if (style.color()) {
				var rgb = $.RGB(style.color());
				pcb.setRGBColorFill(rgb[0], rgb[1], rgb[2]);
			} else {
				pcb.setRGBColorFill(0, 0, 0);
			}
			
			text = new String(text);
			pcb.beginText();
			var lines = [];
			var strs = text.split("\n");
			for (var i = 0, length = strs.length; i < length; i++) {
				var str = strs[i];
				var strWidth = Pdf.getTextWidth(font, fontSize, str);
				if (strWidth > cw) {
					var curw = 0;
					var chars = [];
					for (var j = 0, strLength = str.length; j < strLength; j++) {
						var c = str.charAt(j);
						var tw = Pdf.getTextWidth(font, fontSize, c);
						if (curw + tw > cw) {
							lines.push(chars.join(""));
							curw = tw;
							chars = [];
						} else {
							curw += tw;
						}
						chars.push(c);
					}
					lines.push(chars.join(""));
				} else {
					lines.push(str);
				}
			}
			
			var align = style.align();
			var verticalAlign = style.verticalAlign();
			var tx = cx;
			var ty = cy;
			
			length = lines.length;
			
			if (!verticalAlign || verticalAlign == "top") {
				ty = cy + h - fontSize;
			} else if (verticalAlign == "middle") {
				ty = y + h - ((h - (fontSize * length)) / 2) - fontSize;
			} else if (verticalAlign == "bottom") {
				ty = cy + (fontSize * length);
			}
			
			pcb.setFontAndSize(font, fontSize);
			for (var i = 0; i < length; i++) {
				var line = lines[i];

				tx = cx;
				if (align == "center") {
					tx += (cw - Pdf.getTextWidth(font, fontSize, line)) / 2;
				} else if (align == "right") {
					tx += (cw - Pdf.getTextWidth(font, fontSize, line));
				}
				
				pcb.setTextMatrix(tx, ty);
				for (var j = 0, lineLength = line.length; j < lineLength; j++) {
					var c = line.charAt(j);
					pcb.showText(c);
					tx += Pdf.getTextWidth(font, fontSize, c);
					pcb.setTextMatrix(tx, ty);
				}
				ty -= fontSize;
			}
			pcb.endText();
		}
	},
	
	image : function(pcb, x, y, w, h, style, src) {
		this.control(pcb, x, y, w, h, style);
		
		var image = Image.getInstance(src);
		image.setAbsolutePosition(x, y);
		image.scaleAbsolute(w, h);
		image.setCompressionLevel(PdfStream.NO_COMPRESSION);
		pcb.addImage(image);
	},
	
	applyBorderStyle : function(pcb, style) {
		if (style.borderWidth()) {
			pcb.setLineWidth(style.borderWidth());
		}
		if (style.borderColor()) {
			var rgb = $.RGB(style.borderColor());
			pcb.setColorStroke(PdfHelper.toColor(rgb[0], rgb[1], rgb[2]));
		}
		if (style.borderStyle()) {
			switch (style.borderStyle()) {
			case "dashed" :
				pcb.setLineDash(5, 5);
				break;
			case "dotted" :
				pcb.setLineDash(1, 1);
				break;
			}
		}
	}
		
}
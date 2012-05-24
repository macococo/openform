$.fn.extend({
	
	reference : function(url, callback, displayFields, option) {
		if (arguments.length == 0) {
			this.trigger("dblclick");
			return;
		}
		
		var id = "reference";
		
		var loadData = function(keyword, callback) {
			$.ajax({
				type : "post",
				url : url,
				dataType : "json",
				data : {"keyword" : keyword || ""},
				success : function(data, textStatus, jqXHR) {
					if ($.isNotEmpty(data.id)) {
						callback.call(this, data);
					} else {
						alert(data.detailMessages.join("\n"));
					}
				}
			});
		};
		
		var self = this;
		var loadList = function(init, keyword) {
			loadData(keyword, function(data) {
				var $layer = $("#" + id);
				if ($layer.size() == 0) {
					$layer = $(document.body).append("<div id='" + id + "' class='reference'/>").find("#" + id);
				}
				$layer.unbind();
				
				var html = [];
				var width = 65;
				var height = 440;
				
				if ($.isNotEmpty(option) && option.search != false) {
					html.push("<div class='condition'>");
					html.push("	<form>");
					html.push("		<input type='text' name='keyword' value='" + keyword + "'/>");
					html.push("		<input type='submit' value='検索'/>");
					html.push("	</form>");
					html.push("</div>");
				} else {
					height -= 30;
				}
				
				html.push("<div class='total'>");
				html.push("	全 " + data.records.length + " 件");
				html.push("</div>");
				
				html.push("<table cellspacing='0' cellpadding='0'>");
				html.push("<tr>");
				
				var fieldMap = [];
				for (var i = 0, fields = data.fields, length = fields.length; i < length; i++) {
					fieldMap[fields[i].name] = {"field" : fields[i], "index" : i};
				}
				for (var i = 0, length = displayFields.length; i < length; i++) {
					var displayField = displayFields[i];
					var fieldObject = fieldMap[displayField.name];
					if ($.isNotEmpty(fieldObject) && !displayField.hidden) {
						var caption = fieldObject.field.caption || displayField.name;
						html.push("<th width='" + displayField.width + "'>" + caption + "</th>");
						width += displayField.width;
					}
				}
				html.push("</tr>");
				html.push("</table>");
				$layer.html(html.join(""));
				
				var $table = $layer.append("<div class='records'><table id='records' cellspacing='0' cellpadding='0'></table></div>").find("#records");
				for (var i = 0, records = data.records, length = records.length; i < length; i++) {
					var record = records[i];
					var callbackRecord = [];
					var html = [];

					html.push("<tr index='" + i + "'>");
					for (var j = 0, fieldLength = displayFields.length; j < fieldLength; j++) {
						var displayField = displayFields[j];
						var fieldObject = fieldMap[displayField.name];
						if (fieldObject) {
							var value = record[fieldObject.index];
							if (!displayField.hidden) {
								html.push("<td width='" + (displayField.width) + "'>" + $.escapeHtml(value) + "</td>");	
							}
							callbackRecord[j] = value;
						}
					}
					html.push("</tr>");

					var $tr = $table.append(html.join("")).find("[index=" + i + "]");
					
					(function($tr, record, callback) {
						$tr.bind("mouseover", function() {
							$(this).toggleClass("over");
						}).bind("mouseout", function() {
							$(this).toggleClass("over");
						}).bind("click", function() {
							callback.call(self, record);
							$layer.dialog("close");
						});
					})($tr, callbackRecord, callback);
				}
				
				if (init) {
					$layer.dialog($.extend((option || {}), {width : width, height : height, resizable : false, modal : true}));	
				}
				
				var $keyword = $layer.find("[name=keyword]").val(keyword);
				$layer.find("form").on("submit", function() {
					loadList(false, $keyword.val());
					return false;
				});
			});
		};
		this.bind("dblclick", function() {
			loadList(true, null);
		});
		return this;
	}

});
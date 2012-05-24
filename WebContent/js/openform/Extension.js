//　依存ライブラリを拡張する.

// datepickerにクリアボタンを追加する
(function() {
	//wrap up the redraw function with our new shiz
	var originalFunction = $.datepicker._generateHTML; //record the original
	$.datepicker._generateHTML = function(inst){
		var thishtml = $(originalFunction.call($.datepicker, inst)); //call the original
		
		thishtml = $('<div />').append(thishtml); //add a wrapper div for jQuery context
		
		//locate the button panel and add our button - with a custom css class.
		$('.ui-datepicker-buttonpane', thishtml).append(
			$('<button class="\
				ui-datepicker-clear ui-state-default ui-priority-primary ui-corner-all\
				"\>クリア</button>'
			).click(function(){
				inst.input.attr('value', '');
				inst.input.datepicker('hide');
			})
		);
		
		thishtml = thishtml.children(); //remove the wrapper div
		
		return thishtml; //assume okay to return a jQuery
	};
})();
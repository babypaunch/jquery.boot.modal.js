function cssToStyle(json){
	var result = "";
	for(var i in json){
		result += i + ": " + json[i] + "; ";
	}
	return result;
}

function ACE(type, text, callback){
	/*
	* type에 따라 alert/confirm/error로 분류한다.
	* width는 modal의 전체 크기를 pixel 값으로 지정함.
	* static이 true면 배경을 클릭해도 modal이 닫히지 않는다.
	* footer는 보이지 않게 처리하고자 하는 경우, 공백을 대입하면 된다.
	*/
	var defaults = {
		type: type
		, id: "ace-modal-" + type //modal id
		, width: 400
		, static: true
		, header: {
			title: type.toUpperCase()
			, closeButton: true
			, css: {
				"border-top-left-radius": "5px"
				, "border-top-right-radius": "5px"
				, background: type === "alert" ? "orange" : type === "confirm" ? "#3ae" : "red"
				, color: type === "error" ? "white" : "black"
			}
		}
		, body: {
			css: {
				overflow: "auto"
			}
			, html: text
		}
		, footer: "<a href='#' data-dismiss='modal' class='btn btn-default'>" + (type === "confirm" ? "Cancel" : "Close") + "</a>" + (type === "confirm" ? " <a href='#' data-dismiss='modal' class='btn btn-success'>Agree</a>" : "")
	};

	var modal = (function(defaults){
		return ""
		+ "<div class='modal' id='" + defaults.id + "' " + (defaults.static ? "data-backdrop='static'" : "") + ">\n"
			+ "<div style='display:table; height: 100%; width: 100%;'>\n"
				+ "<div class='modal-dialog' style='width: " + defaults.width + "px; display: table-cell; vertical-align: middle;'>\n"
					+ "<div class='modal-content' style='width: inherit; height: inherit; margin: 0 auto;'>\n"
						+ "<div class='modal-header' style='" + cssToStyle(defaults.header.css) + "'>\n"
							+ (defaults.header.closeButton ? "<button type='button' class='close' data-dismiss='modal'>×</button>\n" : "")
							+ "<h4 class='modal-title'>" + defaults.header.title + "</h4>\n"
						+ "</div>\n"
						+ "<div class='modal-body' style='" + cssToStyle(defaults.body.css) + "'>\n"
							+ defaults.body.html
						+ "</div>\n"
						+ (defaults.footer === "" ? "" : "<div class='modal-footer' style='text-align: center;'>" + defaults.footer + "</div>\n")
					+ "</div>\n"
				+ "</div>\n"
			+ "</div>\n"
		+ "</div>\n";
	})(defaults);

	var $ace = $("body #ace-modal-" + type);
	if($ace.length !== 0){
		$ace.remove();
	}
	$("body").append(modal).find("#ace-modal-" + type).show();

	$("[id^='ace-modal-'] [data-dismiss]").click(function(){
		$(this).closest("div.modal").hide();

		if(type === "confirm" && callback !== undefined && $(this).closest(".modal").attr("id") === "ace-modal-confirm"){
			callback($(this).attr("class") === "btn btn-success");
		}
	});
} //end: function ACE(type, text, callback){

function ALERT(text){
	new ACE("alert", text);
}
function CONFIRM(text, callback){
	new ACE("confirm", text, callback);
}
function ERROR(text){
	new ACE("error", text);
}

$.fn.modal = function(data){
	/*
	* width는 modal의 전체 크기를 pixel 값으로 지정함.
	* static이 true면 배경을 클릭해도 modal이 닫히지 않는다.
	* footer는 보이지 않게 처리하고자 하는 경우, 공백을 대입하면 된다.
	*/
	var defaults = {
		id: "" //modal id
		, width: 1000
		, static: true
		, header: {
			title: ""
			, closeButton: true
			, css: {}
		}
		, body: {
			css: {
				overflow: "auto"
			}
			, html: ""
		}
		, footer: "<a href='#' data-dismiss='modal' class='btn btn-default'>Cancel</a> <a href='#' class='btn btn-success'>Save</a>"
	};
	$.extend(true, defaults, data);

	var modal = (function(defaults){
		return ""
		+ "<div class='modal' id='" + defaults.id + "' " + (defaults.static ? "data-backdrop='static'" : "") + ">"
			+ "<div style='display:table; height: 100%; width: 100%;'>"
				+ "<div class='modal-dialog' style='width: " + defaults.width + "px; display: table-cell; vertical-align: middle;'>"
					+ "<div class='modal-content' style='width: inherit; height: inherit; margin: 0 auto;'>"
						+ "<div class='modal-header' style='" + cssToStyle(defaults.header.css) + "'>"
							+ (defaults.header.closeButton ? "<button type='button' class='close' data-dismiss='modal'>×</button>" : "")
							+ "<h4 class='modal-title'>"
								+ defaults.header.title
							+ "</h4>"
						+ "</div>"
						+ "<div class='modal-body' style='" + cssToStyle(defaults.body.css) + "'>"
							+ defaults.body.html
						+ "</div>"
						+ (defaults.footer === "" ? "" : "<div class='modal-footer' style='text-align: center;'>" + defaults.footer + "</div>")
					+ "</div>"
				+ "</div>"
			+ "</div>"
		+ "</div>";
	})(defaults);

	$("body").append(modal);

	$("[id^='ace-modal-'] [data-dismiss]").click(function(){
		$(this).closest("div.modal").hide();

		if(type === "confirm" && callback !== undefined && $(this).closest(".modal").attr("id") === "ace-modal-confirm"){
			callback($(this).attr("class") === "btn btn-success");
		}
	});

	return this.each(function(){
		$(this).attr({"data-toggle": "modal", "href": "#" + defaults.id});
	});
} //end: $.fn.modal = function(data){

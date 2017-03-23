function cssToStyle(json){
	var result = "";
	for(var i in json){
		result += i + ": " + json[i] + "; ";
	}
	return result;
} //end: function cssToStyle(json){

var BootModal = {
	defaults: function(){
		console.log(arguments);
		if(arguments.length === 1){ //button modal
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
			$.extend(true, defaults, arguments[0]);
			return defaults;
		}else{ //direct modal
			/*
			* type에 따라 alert/confirm/error로 분류한다.
			* width는 modal의 전체 크기를 pixel 값으로 지정함.
			* static이 true면 배경을 클릭해도 modal이 닫히지 않는다.
			* footer는 보이지 않게 처리하고자 하는 경우, 공백을 대입하면 된다.
			*/
			return {
				type: arguments[0]
				, id: "ace-modal-" + arguments[0] //modal id
				, width: 400
				, static: true
				, header: {
					title: arguments[0].toUpperCase()
					, closeButton: true
					, css: {
						"border-top-left-radius": "5px"
						, "border-top-right-radius": "5px"
						, background: arguments[0] === "alert" ? "orange" : arguments[0] === "confirm" ? "#3ae" : "red"
						, color: arguments[0] === "error" ? "white" : "black"
					}
				}
				, body: {
					css: {
						overflow: "auto"
					}
					, html: arguments[1]
				}
				, footer: "<a href='#' data-dismiss='modal' class='btn btn-default'>" + (arguments[0] === "confirm" ? "Cancel" : "Close") + "</a>" + (arguments[0] === "confirm" ? " <a href='#' data-dismiss='modal' class='btn btn-success'>Agree</a>" : "")
			};
		}
	} //end: defaults: function(){
	, inner: function(defaults){
		return ""
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
		+ "</div>\n";
	} //end: , inner: function(defaults){
}; //end: var BootModal = {

function ACE(type, text, callback){
	var defaults = BootModal.defaults(arguments[0], arguments[1], arguments[2]);
	var modal = "<div class='modal' id='" + defaults.id + "' " + (defaults.static ? "data-backdrop='static'" : "") + " style='z-index: 9999;'>\n" + BootModal.inner(defaults) + "</div>\n";
	var $ace = $("body #ace-modal-" + type);

	if($ace.length !== 0){
		$ace.remove();
	}
	$("body").append(modal).find("#ace-modal-" + type).show();

	$("[id^='ace-modal-'] [data-dismiss]").click(function(){
		$(this).closest("div.modal").hide();

		if(type === "alert" && callback !== undefined){
			callback();
		}

		if(type === "confirm" && callback !== undefined && $(this).closest(".modal").attr("id") === "ace-modal-confirm"){
			callback($(this).attr("class") === "btn btn-success");
		}
	});
} //end: function ACE(type, text, callback){

function ALERT(text, callback){
	new ACE("alert", text, callback);
} //end: function ALERT(text, callback){
function CONFIRM(text, callback){
	new ACE("confirm", text, callback);
} //end: function CONFIRM(text, callback){
function ERROR(text){
	new ACE("error", text);
} //end: function ERROR(text){
function _MODAL(data){
	var defaults = BootModal.defaults(data);
	var $modal = $("#" + defaults.id);
	var inner = BootModal.inner(defaults);
	var modal = $modal.length === 0 ? "<div class='modal' id='" + defaults.id + "' " + (defaults.static ? "data-backdrop='static'" : "") + " style='z-index: 9999;'>\n" + inner + "</div>\n" : inner;

	$modal.length === 0 ? $("body").append(modal) : $modal.html(modal);

	return defaults;
} //end: function _MODAL(data){
function MODAL(data){
	var defaults = _MODAL(data);
	var $modal = $("#" + defaults.id);

	$modal.show();
	$("body").append('<div class="modal-backdrop in"></div>');

	$("#" + defaults.id  + " [data-dismiss]").click(function(){
		$modal.hide();
		$("div.modal-backdrop.in").remove();
	});
} //end: function MODAL(data){

$.fn.modal = function(data){
	var defaults = _MODAL(data);

	return this.each(function(){
		$(this).attr({"data-toggle": "modal", "href": "#" + defaults.id});
	});
} //end: $.fn.modal = function(data){
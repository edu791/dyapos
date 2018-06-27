"use strict";

var link_generate_edit_link,
	input_iframe_width,
	input_iframe_height,
	edit_link;

function generateEditLink(event){
	event.preventDefault();
	$.get(event.target.href, function(data){
		edit_link.value = data;
	});
}

window.onload = function(){
	link_generate_edit_link = document.getElementById("link-generate-edit-link");
	edit_link = document.getElementById("edit-link");
	input_iframe_width = document.getElementById("iframe-width");
	input_iframe_height = document.getElementById("iframe-height");

    //	link_generate_edit_link.addEventListener("click", generateEditLink);

	input_iframe_width.onchange = function() {
		document.getElementById("iframe-width-property").innerHTML = parseInt(this.value, 10);
	};
	input_iframe_height.onchange = function() {
		document.getElementById("iframe-height-property").innerHTML = parseInt(this.value, 10);
	};

};

/**
 * @module Slide
 */

/**
 * View for view and edit some helping notes on a slide
 * @class SlideNotesView
 * @extends Backbone.View
 */

define([], function(){
	"use strict";
	return Backbone.View.extend({
		el: document.getElementById("slide-notes-window"),

		events : {
			"click #btn-save-slide-notes" : "saveNotes"
		},

		saveNotes : function(){
			console.log("save notes");
			app.slides.get(app.selected_slide).set("notes", document.getElementById("slide-notes").value).save();
			this.$el.foundation("reveal", "close");
		}
	});
});

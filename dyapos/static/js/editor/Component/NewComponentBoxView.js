/**
 * @module Component
 */

/**
 * Panel view where you can add a new component
 * @class NewComponentBoxView
 * @extends Backbone.View
 */

define(["Component/Text/TextModel"], function(TextCompModel) {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #new-component-box
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("new-component-box"),

		events : {
			/**
			 * Calls addTitle
			 * @event click #btn-add-title
			 */
			"click #btn-add-title" : "addTitle",
			/**
			 * Calls addSubtitle
			 * @event click #btn-add-subtitle
			 */
			"click #btn-add-subtitle" : "addSubtitle",
			/**
			 * Calls addBody
			 * @event click #btn-add-body
			 */
			"click #btn-add-body" : "addBody",
			/**
			 * Calls addImage
			 * @event click #btn-add-image
			 */
			"click #btn-add-image" : "addImage",
			/**
			 * Calls addVideo
			 * @event click #btn-add-video
			 */
			"click #btn-add-video" : "addVideo"
		},

		/**
		 * Adds a new title
		 * @method addTitle
		 */
		addTitle : function() {
			var component = new TextCompModel({
				"type" : "text",
				"text_type" : "title",
				"pos_x" : app.slide_clicked_point.left,
				"pos_y" : app.slide_clicked_point.top,
				"slide" : app.slides.get(app.selected_slide),
				"content" : app.title_default_text
			});

			component.save();
		},

		/**
		 * Adds a new Subtitle
		 * @method addSubtitle
		 */
		addSubtitle : function() {
			var component = new TextCompModel({
				"type" : "text",
				"text_type" : "subtitle",
				"pos_x" : app.slide_clicked_point.left,
				"pos_y" : app.slide_clicked_point.top,
				"slide" : app.slides.get(app.selected_slide),
				"content" : app.subtitle_default_text
			});

			component.save();
		},

		/**
		 * Adds a new Body
		 * @method addBody
		 */
		addBody : function() {
			var component = new TextCompModel({
				"type" : "text",
				"text_type" : "body",
				"pos_x" : app.slide_clicked_point.left,
				"pos_y" : app.slide_clicked_point.top,
				"slide" : app.slides.get(app.selected_slide),
				"content" : app.body_default_text
			});

			component.save();
		},

		/**
		 * Opens a form for adding a new image
		 * @method addImage
		 */
		addImage : function(){
			console.log(app.slides.at(0).get("components").length);
			$("#add-image-box").foundation("reveal", "open");
		},

		/**
		 * Opens a form for adding a new video
		 * @method addVideo
		 */
		addVideo : function(){
			$("#add-video-box").foundation("reveal", "open");
		}
	});
});

/**
 * @module Component
 * @submodule Video
 */

/**
 * Form for adding a new video
 * @class VideoUploadFormView
 * @extends Backbone.View
 */

define(["Component/Video/VideoModel"], function(VideoCompModel) {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #add-video-box
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("add-video-box"),

		events : {
			/**
			 * Calls addVideo()
			 * @event click #btn-add-video-link
			 */
			"click #btn-add-video-link" : "addVideo"
		},

		/**
		 * Adds a video
		 * @method addVideo
		 */
		addVideo : function() {
			var link = document.getElementById("video-link").value,
				url_id = link.split("v=");

			console.log(link);
			url_id = url_id[1].split("&");
			url_id = url_id[0];
			new VideoCompModel({
				"type" : "video",
				"website" : "youtube",
				"url_id" : url_id,
				// "pos_x" : app.slide_clicked_point.left,
				// "pos_y" : app.slide_clicked_point.top,
				"slide" : app.slides.get(app.selected_slide)
			});

			// Close the form
			$("#add-video-box").foundation("reveal", "close");
		}
	});
});

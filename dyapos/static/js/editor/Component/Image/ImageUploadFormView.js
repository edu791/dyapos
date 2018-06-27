/**
 * @module Component
 * @submodule Image
 */

/**
 * Form for adding a new Image
 * @class ImageUploadFormView
 * @extends Backbone.View
 */

define(["Component/Image/ImageModel"], function(ImageCompModel) {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #form-upload-image
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("form-upload-image"),

		events : {
			/**
			 * Calls upload()
			 * @event click #btn-upload-image
			 */
			"click #btn-upload-image" : "addImage",
			/**
			 * Calls showPreview()
			 * @event paste #image-url
			 */
			"paste #image-url" : "showPreview",
			/**
			 * Calls cleanImageURL
			 * @event change #image
			 */
			"change #image" : "cleanImageURL",
			/**
			 * Calls cleanImageInputFile
			 * @event #image-url
			 */
			"change #image-url" : "cleanImageInputFile"
		},

		/**
		 * Adds a new image component
		 * @method addImage
		 */
		addImage : function() {
			var input_file_image = document.getElementById("image"),
				input_url_image = document.getElementById("image-url"),
				image_comp;

			console.log("upload image");

			image_comp = new ImageCompModel({
				"type" : "image",
				"pos_x" : app.slide_clicked_point.left,
				"pos_y" : app.slide_clicked_point.top,
				"slide" : app.slides.get(app.selected_slide),
				"url"	: input_url_image.value
			});

			$("#add-image-box").foundation("reveal", "close");

			if (input_file_image.value !== "") {
				this.upload(image_comp);
			}
		},

		/**
		 * Uploads the image to the server
		 * @method upload
		 * @param {Object} image_comp Image component
		 */

		upload : function(image_comp) {
			console.log("Uploaded image from computer");
			var file = this.el.querySelector("#image").files[0], fr;

			fr = new FileReader();
			fr.onload = function(e) {
				$.ajax({
					url : "https://api.imgur.com/3/upload.json",
					method : "POST",
					headers : {
						Authorization : "Client-ID 3f3402cfcabb4c6",
						Accept : "application/json"
					},
					data : {
						image : e.target.result.split(",")[1],
						type : "base64"
					},
					success : function(result) {
						image_comp.set("url", result.data.link).save();
                        image_comp.get("slide").mini_view.generateThumbnail();
					}
				});

			};
			fr.readAsDataURL(file);
		},

		/**
		 * Shows an image preview when adding a image url on the form
		 * @method showPreview
		 */
		showPreview : function() {
			console.log("Url pasted");

			// When the paste event is caught, you can't access the pasted text, so here I wait for 500 milliseconds
			// and then I can access to the pasted text without problems
			setTimeout(function() {
				console.log("Load image preview");
				var template = $("#template-image-preview").html(),
					data = {},
					view;

				data.url = $("#image-url").val();
				view = Mustache.render(template, data);
				$("#image-preview").html(view);
			}, 500);
		},

		/**
		 * Clears the image input file
		 * @method cleanImageInputFile
		 */
		cleanImageInputFile : function() {
			console.log("changed image url");
			document.getElementById("image").value = "";
		},

		/**
		 * Clears the image input URL
		 * @method cleanImageURL
		 */
		cleanImageURL : function() {
			console.log("changed image file input");
			document.getElementById("image-url").value = "";
		}
	});
});

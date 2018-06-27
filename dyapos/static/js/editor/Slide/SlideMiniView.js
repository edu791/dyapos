/**
 * @module Slide
 */

/**
 * View for Slide mini-previews located at slides list.
 * @class SlideMiniView
 * @extends Backbone.View
 */

define([], function () {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Tag name: li
		 * @property tagName
		 * @type String
		 */
		tagName: "li",

		/**
		 * Class name: slide-mini
		 * @property className
		 * @type String
		 */
		className: "slide-mini",

		/**
		 * Template: #template-slide-mini
		 * @property template
		 * @type String
		 */
		template: document.getElementById("template-slide-mini").innerHTML,

		events: {
			/**
			 * Calls goThere()
			 * @event click
			 */
			"click": "goThere",
			/**
			 * Calls clickDelete
			 * @event click .btn-delete
			 */
			"click .btn-delete": "clickDelete"
		},

		/**
		 * Runs when the class is instantiated
		 * @method initialize
		 */
		initialize: function () {
			// When the its model is destroyed, remove this view
			this.model.on("destroy", this.remove, this);

			// Hack: Add a reverse view relationship to the model, so that way you can access to the view object from the model
			this.model.mini_view = this;
		},

		/**
		 * Renders the view
		 * @method render
		 * @return View object
		 */
		render: function () {
			var template = Mustache.render(this.template, this.model.toJSON());
			this.$el.html(template);
			return this;
		},

		/**
		 * Go to the clicked slide-mini to edit
		 * @param {Object} event Click event
		 */
		goThere: function (event) {
			event.stopPropagation();
			console.log("event: click on mini-slide");

			// Set the clicked slide-mini as the currently selected slide
			app.selected_slide = this.model.cid;

			// Exit from navigation mode in case the user is there.
			app.views.navigation_mode.exitMode();
			app.views.edit_mode.enterMode();
		},

		/**
		 * Update the image thumbnail from the slide
		 * @method generateThumbnail
		 */
		generateThumbnail: function () {
			console.log("Generate thumbnail");
			var cloned_div = this.model.view.el.cloneNode(true);

			cloned_div.attributes.removeNamedItem("id");
			$(cloned_div).removeClass("past future");
			$(cloned_div).addClass("active");
			$(cloned_div).find(".component-options").remove();
			$(cloned_div).find(".component").removeClass("selected-component");
			$(cloned_div).find(".component").removeClass("hoverable");
			$(cloned_div).find(".component").removeClass("ui-draggable");
			$(cloned_div).find(".text-content").attr("contenteditable", false);
			cloned_div.style.zIndex = "-1";
			cloned_div.style.transform = "";
			if (this.model.get("background_color") !== null && app.theme_background_color !== "") {
				cloned_div.style.backgroundColor = this.model.get("background_color");
			} else {
				cloned_div.style.backgroundColor = app.theme_background_color;
			}
			cloned_div.style[app.getSupportedCSSProp(["MozTransformOrigin", "webkitTransformOrigin", "OTransformOrigin"])] = "0% 0%";
			cloned_div.style[[app.getSupportedCSSProp(["MozTransform", "webkitTransform", "OTransform"])]] = "scale(0.14)";
			this.$el.find(".slide-mini-preview").html(cloned_div);
		},

		/**
		 * When the user clicks on the delete button
		 * @method clickDelete
		 * @param {Object} event Click event
		 */
		clickDelete: function (event) {
			event.stopPropagation();
			console.log("remove slide");
			app.selected_slide = null;
			app.views.slide_options_box.$el.hide();
			this.model.destroy();
		}
	});
});
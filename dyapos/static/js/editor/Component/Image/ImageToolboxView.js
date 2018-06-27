/**
 * @module Component
 * @submodule Image
 */

/**
 * Toolbox for image components
 * @class ImageToolboxView
 * @extends Backbone.View
 */

define([], function() {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #toolbox-image
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("toolbox-image"),

		events : {
			/**
			 * Calls increaseSize()
			 * @event click #btn-increase-image-size
			 */
			"click #btn-increase-image-size" : "increaseSize",
			/**
			 * Calls decreaseSize()
			 * @event click #btn-decrease-image-size
			 */
			"click #btn-decrease-image-size" : "decreaseSize"
		},

		/**
		 * Shows the toolbox
		 * @method show
		 */
		show : function() {
			$(".toolbox").hide();
			this.$el.show();
		},

		/**
		 * Increases the image size
		 * @method increaseSize
		 */
		increaseSize : function() {
			console.log("increase image");
			app.selected_component.set("size", parseInt(app.selected_component.get("size"), 10) + 20);
		},

		/**
		 * Decreases the image size
		 * @method decreaseSize
		 */
		decreaseSize : function() {
			console.log("decrease image");
			app.selected_component.set("size", parseInt(app.selected_component.get("size"), 10) - 20);
		}
	});
});

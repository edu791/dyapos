/**
 * @module Slide
 */

/**
 * Panel that shows some options for each slide like edit and delete button, scale, rotation, etc.
 * @class SlideOptionsBoxView
 * @extends Backbone.View
 */

define([], function() {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #slide-options
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("slide-options"),

		events : {
			/**
			 * Calls editSlide()
			 * @event click #btn-edit-presentation
			 */
			"click #btn-edit-presentation" : "editSlide",
			/**
			 * Calls scaleSlide()
			 * @event change #input-scale
			 */
			"change #input-scale" : "scaleSlide",
			/**
			 * Calls saveScaleSlide()
			 * @event mouseup #input-scale
			 */
			"mouseup #input-scale" : "saveScaleSlide",
			/**
			 * Calls rotateSlideZ()
			 * @event change #input-rotation-z
			 */
			"change #input-rotation-z" : "rotateSlideZ",
			/**
			 * Calls saveRotateSlideZ()
			 * @event mouseup #input-rotation-z
			 */
			"mouseup #input-rotation-z" : "saveRotateSlideZ",
			/**
			 * Calls rotateSlideX()
			 * @event change #input-rotation-x
			 */
			"change #input-rotation-x" : "rotateSlideX",
			/**
			 * Calls saveRotateSlideX()
			 * @event mouseup #input-rotation-x
			 */
			"mouseup #input-rotation-x" : "saveRotateSlideX",
			/**
			 * Calls rotateSlideY()
			 * @event change #input-rotation-y
			 */
			"change #input-rotation-y" : "rotateSlideY",
			/**
			 * Calls saveRotateSlideY()
			 * @event mouseup #input-rotation-y
			 */
			"mouseup #input-rotation-y" : "saveRotateSlideY",
			/**
			 * Calls deleteSlide()
			 * @event click #btn-delete-slide
			 */
			"click #btn-delete-slide" : "deleteSlide"
		},

		/**
		 * Goes to the edit mode on the selected slide
		 * @method editSlide
		 */
		editSlide : function() {
			app.views.navigation_mode.exitMode();
			app.views.edit_mode.enterMode();
		},

		/**
		 * Scales the slide
		 * @method scaleSlide
		 * @param {Object} event Change event
		 */
		scaleSlide : function(event) {
			var scale = event.target.value,
				style = app.clicked_slide.style[app.css_transform];

			style = style.replace(/scale\(.+?\)/g, "scale(" + scale + ")");
			app.clicked_slide.style[app.css_transform] = style;
			app.clicked_slide.dataset.scale = scale;
		},

		/**
		 * Saves the scale value
		 * @method scaleSlide
		 * @param {Object} event Mouseup event
		 */
		saveScaleSlide : function(event) {
			var scale = parseFloat(event.target.value),
				slide = document.getElementById(app.selected_slide);

			slide.dataset.scale = scale;
            app.slides.get(app.selected_slide).set("scale", scale).save();
            impress().initStep(slide);
		},

		/**
		 * Rotates the slide on the Z-axis
		 * @method rotateSlideZ
		 * @param {Object} event Change event
		 */
		rotateSlideZ : function(event) {
			var degreesZ = event.target.value,
				slide = app.clicked_slide,
				style = slide.style[app.css_transform];

			style = style.replace(/rotateZ\(.+?\)/g, "rotateZ(" + degreesZ + "deg)");
			slide.style[app.css_transform] = style;
			slide.dataset.rotateZ = degreesZ;
		},

		/**
		 * Saves the rotation on the Z-axis
		 * @method saveRotateSlideZ
		 * @param {Object} event Mouseup event
		 */
		saveRotateSlideZ : function(event) {
			var degrees = parseInt(event.target.value, 10),
				slide = document.getElementById(app.selected_slide);

			slide.dataset.rotateZ = degrees;
			app.slides.get(app.selected_slide).set("rotation_z", degrees).save();
            impress().initStep(slide);
		},

		/**
		 * Rotates the slide on the X-axis
		 * @method rotateSlideX
		 * @param {Object} event Change event
		 */
		rotateSlideX : function(event) {
			var degreesX = event.target.value,
				slide = app.clicked_slide,
				style = slide.style[app.css_transform];

			style = style.replace(/rotateX\(.+?\)/g, "rotateX(" + degreesX + "deg)");
			slide.style[app.css_transform] = style;
			slide.dataset.rotateX = degreesX;
		},

		/**
		 * Saves the rotation on the X-axis
		 * @method saveRotateSlideX
		 * @param {Object} event Mouseup event
		 */
		saveRotateSlideX : function(event) {
			var degrees = parseInt(event.target.value, 10),
				slide = document.getElementById(app.selected_slide);

			slide.dataset.rotateX = degrees;
			app.slides.get(app.selected_slide).set("rotation_x", degrees).save();
            impress().initStep(slide);
		},

		/**
		 * Rotates the slide on the Y-axis
		 * @method rotateSlideY
		 * @param {Object} event Change event
		 */
		rotateSlideY : function(event) {
			var degreesY = event.target.value,
				slide = document.getElementById(app.selected_slide),
				style = slide.style[app.css_transform];

			style = style.replace(/rotateY\(.+?\)/g, "rotateY(" + degreesY + "deg)");
			slide.style[app.css_transform] = style;
			slide.dataset.rotateY = degreesY;
		},

		/**
		 * Saves the rotation on the Y-axis
		 * @method saveRotateSlideY
		 * @param {Object} event Mouseup event
		 */
		saveRotateSlideY : function(event) {
			var degrees = parseInt(event.target.value, 10),
				slide = document.getElementById(app.selected_slide);

			slide.dataset.rotateY = degrees;
			app.slides.get(app.selected_slide).set("rotation_y", degrees).save();
            impress().initStep(slide);
		},

		/**
		 * Deletes the selected slide
		 * @method deleteSlide
		 * @param {Object} event Click event
		 */
		deleteSlide : function(event) {
			event.stopPropagation();
			app.slides.get(app.clicked_slide.id).destroy();
			this.hide();
		}
	});
});

/**
 * @module Editor
 * @main
 */

/**
 * Main view that involves the whole page.
 * It contains the main actions such as "add slide" button, etc.
 * @class EditorView
 * @extends Backbone.View
 */

define(["Slide/SlideModel"], function (SlideModel) {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: body
		 * @property el
		 * @type DOM Object
		 */
		el: document.body,

		events: {
			/**
			 * Calls addSlide()
			 * @event click #btn-add-slide
			 */
			"click #btn-add-slide": "addSlide",
			/**
			 * Calls goToNavigationEditMode()
			 * @event click #btn-navigation-mode
			 */
			"click #btn-navigation-mode": "goToNavigationEditMode",
			/**
			 * Calls toggleColorPicker()
			 * @event click #btn-slide-background-color
			 */
			"click #btn-slide-background-color": "toggleColorPicker",
			/**
			 * Calls changeSlideBackgroundColor()
			 * @event change #btn-slide-background-color
			 */
			"change #btn-slide-background-color": "changeSlideBackgroundColor",
			/**
			 * Calls editSlideNotes()
			 * @event click #btn-slide-notes
			 */
			"click #btn-slide-notes": "editSlideNotes",
			/**
			 * Calls zoomIn()
			 * @event click #btn-zoom-in
			 */
			"click #btn-zoom-in": "zoomIn",
			/**
			 * Calls zoomOut()
			 * @event click #btn-zoom-out
			 */
			"click #btn-zoom-out": "zoomOut",
			/**
			 * Calls showStyleWindow()
			 * @event click #btn-style
			 */
			"click #style-btn" : "showStyleWindow"
		},

		/**
		 * Adds a new slide to the presentation
		 * @method addSlide
		 */
		addSlide: function () {
			if (app.slides.length === 0) {
				// If it is the first slide
				app.slides.add(new SlideModel());
			} else {
				// If it isn't the first slide, calculate coordinates based on the last slide
				app.slides.add(new SlideModel({
					pos_x: parseInt(app.slides.last().get("pos_x"), 10) + 1000,
					pos_y: parseInt(app.slides.last().get("pos_y"), 10),
					number: app.slides.length
				}));
			}

			app.slides.last().save();

			// Set the last saved slide as the currently selected slide
			app.selected_slide = app.slides.last().cid;

			// Go to the new slide
			app.views.edit_mode.exitMode();
			app.views.edit_mode.enterMode();
		},

		/**
		 * Go to the navigation mode where you can manage the slide properties such as position, rotation, size, etc.
		 * In this mode you can also make zooming with the mousewheel.
		 * @method goToNavigationEditMode
		 */
		goToNavigationEditMode: function () {
			app.views.edit_mode.exitMode();
			app.views.navigation_mode.enterMode();
		},

		/**
		 * Toggles the colorpicker for the slide background color
		 * @method toggleColorPicker
		 */
		toggleColorPicker: function () {
			console.log("toggle color picker");
			$("#slide-background-color").toggle().focus();
		},

		/**
		 * Changes the slide background color from the colorpicker
		 * @method changeSlideBackgroundColor
		 */
		changeSlideBackgroundColor: function (event) {
			console.log("Change slide background color");
			var selected_color = event.target.value,
				slide = app.slides.get(app.selected_slide);
			slide.set("background_color", selected_color).save();
			slide.view.el.dataset.backgroundColor = selected_color;
			document.body.style.backgroundColor = selected_color;
			slide.mini_view.generateThumbnail();
		},

		/**
		 * Opens the slide notes editor
		 * @method editSlideNote
		 */
		editSlideNotes : function() {
			console.log("edit slide notes");
			app.views.slide_notes.$el.find("#slide-notes").val(app.slides.get(app.selected_slide).get("notes"));
			app.views.slide_notes.$el.foundation("reveal", "open");
		},

		/**
		 * Zoom in the navigation mode
		 * @method zoomIn
		 */
        zoomIn : function() {
            app.views.navigation_mode.zoomIn(); 
        },

		/**
		 * Zoom out the navigation mode
		 * @method zoomOut
		 */
        zoomOut : function() {
            app.views.navigation_mode.zoomOut();
        },

        /**
         * Show style window
         * @method showStyleWindow
         */
		showStyleWindow : function() {
			console.log("Click style button");
			app.views.theme_editor.render();
		}
	});
});

/**
 * @module Component
 * @submodule Text
 */

/**
 * Toolbox for text components
 * @class TextToolboxView
 * @extends Backbone.View
 */

define([], function() {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #toolbox-text
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("toolbox-text"),

		events : {
			/**
			 * Calls setFontSize()
			 * @event click #dropdown-font-size li
			*/
			"click #dropdown-font-size li" : "setFontSize",
			/**
			 * Calls toggleBold()
			 * @event click #bold-btn
			 */
			"click #bold-btn" : "toggleBold",
			/**
			 * Calls toggleUnderlined()
			 * @event click #underlined-btn
			 */
			"click #underlined-btn" : "toggleUnderlined",
			/**
			 * Calls toggleItalic()
			 * @event click #italic-btn
			 */
			"click #italic-btn" : "toggleItalic",
			/**
			 * Calls openLinkDialog()
			 * @event click #link-btn
			 */
			"click #link-btn" : "openLinkDialog",
			/**
			 * Calls openColorPicker()
			 * @event click #color-btn
			 */
			"click #color-btn" : "toggleColorPicker",
			/**
			 * Calls changeColor()
			 * @event change #text-color
			 */
			"change #text-color" : "changeColor"
		},

		/**
		 * Shows the view
		 * @method show
		 */
		show : function() {
			$(".toolbox").hide();
		        this.$el.find("#text-color").hide();
			this.$el.show();
		},

		/**
		 * Sets a font size
		 * @method setFontSize
		 */
		setFontSize : function(event) {
			console.log("set font size");
			var font_size = parseInt(event.target.dataset.value, 10);
			app.selected_component.set("font_size", font_size).save();
		},

		/**
		 * Toggles the text to bold
		 * @method toggleBold
		 */
		toggleBold : function() {
			console.log("toggleBold");
			if (app.selected_component.get("bold") === true) {
				app.selected_component.set("bold", false).save();
			} else {
				app.selected_component.set("bold", true).save();
			}
		},

		/**
		 * Toggles the text to underlined
		 * @method toggleUnderlined
		 */
		toggleUnderlined : function() {
			console.log("toggleUnderlined");
			if (app.selected_component.get("underlined") === true) {
				app.selected_component.set("underlined", false).save();
			} else {
				app.selected_component.set("underlined", true).save();
			}
		},

		/**
		 * Toggles the text to italic
		 * @method toggleItalic
		 */
		toggleItalic : function() {
			console.log("toggleItalic");
			if (app.selected_component.get("italic") === true) {
				app.selected_component.set("italic", false).save()
			} else {
				app.selected_component.set("italic", true).save();
			}
		},

		/**
		 * Opens a dialog form to set a link for the text component
		 * @method openLinkDialog
		 */
		openLinkDialog : function() {
			console.log("addLink");
			$("#add-link-box").foundation("reveal","open").save();
		},

		/**
		 * Opens the colorpicker view for changing the text color
		 * @method toggleColorPicker
		 */
		toggleColorPicker : function() {
			console.log("toggleColorPicker");
	                this.$el.find("#text-color").toggle().focus();
		},

		changeColor : function(event) {
		    console.log("color changed");
		    app.selected_component.set("color", event.target.value).save();
		}
	});
});

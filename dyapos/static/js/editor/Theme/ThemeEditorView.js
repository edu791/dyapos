/**
 * @module Theme
 */

/**
 * Theme editor view
 * @class ThemeEditorView
 * @extends Backbone.View
 */

define([], function() {"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #themes-window
		 * @property el
		 * @type String
		 */
		el : document.getElementById("edit-theme-window"),

		events : {
			/**
			 * Calls submitForm()
			 * @event submit #form-edit-theme
			 */
			"submit #form-edit-theme" : "submitForm",
			/**
			 * Calls onChangeBackgroundColor()
			 * @event change #id_background_color
			 */
			"change #id_background_color" : "onChangeBackgroundColor",
			/**
			 * Calls onChangeTitleFont()
			 * @event change #id_title_font
			 */
			"change #id_title_font" : "onChangeTitleFont",
			/**
			 * Calls onChangeTitleColor()
			 * @event change #id_title_color
			 */
			"change #id_title_color" : "onChangeTitleColor",
			/**
			 * Calls onChangeSubtitleFont()
			 * @event change #id_subtitle_font
			 */
			"change #id_subtitle_font" : "onChangeSubtitleFont",
			/**
			 * Calls onChangeSubtitleColor()
			 * @event change #id_subtitle_color
			 */
			"change #id_subtitle_color" : "onChangeSubtitleColor",
			/**
			 * Calls onChangeBodyFont()
			 * @event change #id_body_font
			 */
			"change #id_body_font" : "onChangeBodyFont",
			/**
			 * Calls onChangeBodyColor()
			 * @event change #id_body_color
			 */
			"change #id_body_color" : "onChangeBodyColor",
			/**
			 * Calls onChangeCustomLogo()
			 * @event change #id_custom_logo
			 */
			"change #id_custom_logo" : "onChangeCustomLogo",
			/**
			 * Calls showCSSEditor()
			 * @event click #link-css-editor
			 */
			"click #link-css-editor" : "showCSSEditor",
			/**
			 * Calls exitCSSEditor()
			 * @event click #btn-back-easy-editor
			 */
			"click #btn-back-easy-editor" : "exitCSSEditor"
		},

		/**
		 * Renders the theme editor form
		 * @method render
		 */
		render : function() {
			$.get(app.url_theme_edit + app.current_theme, $.proxy(function(output){
				this.el.innerHTML = output;

				// Init the color inputs again
				jscolor.init();
			}, this));
		},

		/**
		 * Submits the form
		 * @method submitForm
		 * @param {Object} event Submit event object
		 */
		submitForm : function(event) {
			event.preventDefault();

			var form_data = new FormData(event.target), url = event.target.action;

			// Generate a theme image preview
			html2canvas(this.el.querySelector("#theme-preview"), {
				onrendered : function(canvas) {
					// One the canvas is generated, convert it to a Blob file
					canvas.toBlob(function(blob) {
						form_data.append("image_preview", blob);

						$("#loading-screen").fadeIn(800).css("background-color", "rgba(0,0,0,0.5)");
						$.ajax({
							url : url,
							method : "POST",
							data : form_data,
							processData : false,
							contentType : false
						}).done(function(theme_id) {
							// Now that you have the ID of the last created custom theme, let's apply it
							app.views.theme_selector.set(theme_id);

							app.views.theme_selector.loadList();
						});

					}, "image/png");
				}
			});

			//Close the theme editor window
			this.$el.foundation("reveal", "close");
		},

		/**
		 * When the users changes the background color
		 * @method onChangeBackgroundColor
		 * @param {Object} event Change Event
		 */
		onChangeBackgroundColor : function(event) {
			this.el.querySelector("#theme-preview").style.backgroundColor = event.target.value;
		},

		/**
		 * When the users changes the title font
		 * @method onChangeTitleFont
		 * @param {Object} event Change Event
		 */
		onChangeTitleFont : function(event) {
			this.el.querySelector("#preview-title").style.fontFamily = event.target.options[event.target.selectedIndex].text;
		},

		/**
		 * When the users changes the title color
		 * @method onChangeTitleColor
		 * @param {Object} event Change Event
		 */
		onChangeTitleColor : function(event) {
			this.el.querySelector("#preview-title").style.color = event.target.value;
		},

		/**
		 * When the users changes the subtitle font
		 * @method onChangeSubtitleFont
		 * @param {Object} event Change Event
		 */
		onChangeSubtitleFont : function(event) {
			this.el.querySelector("#preview-subtitle").style.fontFamily = event.target.options[event.target.selectedIndex].text;
		},

		/**
		 * When the users changes the subtitle color
		 * @method onChangeSubtitleColor
		 * @param {Object} event Change Event
		 */
		onChangeSubtitleColor : function(event) {
			this.el.querySelector("#preview-subtitle").style.color = event.target.value;
		},

		/**
		 * When the users changes the body font
		 * @method onChangeBodyFont
		 * @param {Object} event Change Event
		 */
		onChangeBodyFont : function(event) {
			this.el.querySelector("#preview-body").style.fontFamily = event.target.options[event.target.selectedIndex].text;
		},

		/**
		 * When the users changes the body color
		 * @method onChangeBodyColor
		 * @param {Object} event Change Event
		 */
		onChangeBodyColor : function(event) {
			this.el.querySelector("#preview-body").style.color = event.target.value;
		},

		onChangeBtnClearCustomLogo : function(event) {
			if(event.target.checked){
				document.getElementById("preview-custom-logo").querySelector("img").style.display = "none";
			}else{
				document.getElementById("preview-custom-logo").querySelector("img").style.display = "block";
			}
		},

		/**
		 * Shows the CSS editor
		 * @method showCSSEditor
		 */
		showCSSEditor : function() {
			this.el.querySelector("#easy-editor").style.display = "none";
			this.el.querySelector("#css-editor").style.display = "block";
		},

		/**
		 * Exits from the CSS editor
		 * @method exitCSSEditor
		 */
		exitCSSEditor : function() {
			this.el.querySelector("#css-editor").style.display = "none";
			this.el.querySelector("#easy-editor").style.display = "block";
		}
	});
});

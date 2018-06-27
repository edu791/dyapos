/**
 * @module Theme
 */

/**
 * Theme selector window view
 * @class ThemeSelectorView
 * @extends Backbone.View
 */

define([], function () {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #themes-window
		 * @property el
		 * @type String
		 */
		el: document.getElementById("themes-window"),

		events: {
			/**
			 * Calls onClickTheme
			 * @event click .theme-link
			 */
			"click .theme-link": "onClickTheme",
			/**
			 * Calls deleteTheme
			 * @event click .btn-delete-theme
			 */
			"click .btn-delete-theme": "deleteTheme",
		},

		/**
		 * Runs when the class is instantiated
		 * @method initialize
		 */
		initialize: function () {
			this.loadList();
		},

		/**
		 * Loads the theme list from server
		 * @method loadList
		 */
		loadList: function () {
			var url = app.url_theme_list,
				template_themes = document.getElementById("template-theme").innerHTML,
				template_custom_themes = document.getElementById("template-custom-theme").innerHTML,
				view;

			// Send an Ajax request to get the theme list
			$.post(url, $.proxy(function (data) {
				view = Mustache.render(template_themes, JSON.parse(data));
				document.getElementById("themes-list").innerHTML = view;
				view = Mustache.render(template_custom_themes, JSON.parse(data));
				document.getElementById("custom-themes-list").innerHTML = view;
				this.showAsSelected(app.current_theme);
				$("#loading-screen").fadeOut(800);
			}, this));
		},

		/**
		 * Set the selected theme and show it
		 * @param {Object} theme_id Id of the selected theme
		 */
		set: function (theme_id) {
			console.log("theme changed");

			this.showAsSelected(theme_id);

			// Set the theme on the server side to the presentation database
			$.post(app.url_theme_set, {
				"theme_id": theme_id,
				"presentation_id": app.p_id
			}, function(theme){
				theme = JSON.parse(theme)[0];
				app.current_theme = parseInt(theme.pk, 10);
				app.theme_background_color = theme.fields.background_color;
				
				// Apply the theme style to the text adding buttons
				document.getElementById("btn-add-title").style.backgroundColor = theme.fields.background_color;
				document.getElementById("btn-add-title").style.fontFamily = theme.fields.title_font;
				document.getElementById("btn-add-title").style.color = theme.fields.title_color;
				document.getElementById("btn-add-subtitle").style.backgroundColor = theme.fields.background_color;
				document.getElementById("btn-add-subtitle").style.fontFamily = theme.fields.subtitle_font;
				document.getElementById("btn-add-subtitle").style.color = theme.fields.subtitle_color;
				document.getElementById("btn-add-body").style.backgroundColor = theme.fields.background_color;
				document.getElementById("btn-add-body").style.fontFamily = theme.fields.body_font;
				document.getElementById("btn-add-body").style.color = theme.fields.body_color;

				// Get the CSS Stylesheet
				$.post(app.url_theme_get_css + theme_id, function(css) {
					document.getElementById("theme-style").innerHTML = css;
				
					// Update thumbnails according to the new selected theme
					app.slides.each(function (slide) {
						slide.mini_view.generateThumbnail();
					});
				});
			});
		},

		/**
		 * When the user clicks on a theme from the theme selector window
		 * @param {Object} event Click event
		 */
		onClickTheme: function (event) {
			this.set(event.currentTarget.dataset.themeId);

			//Close the theme selector window
			$("#themes-window").foundation("reveal", "close");
		},

		/**
		 * Deletes a custom theme
		 * @param {Object} event Click event
		 */
		deleteTheme: function(event) {
			event.preventDefault();
			var theme_id = parseInt(_.last(event.currentTarget.href.split("/")), 10);

			// If the theme is already used
			if(theme_id === app.current_theme){
				// Set the default theme
				this.set(1);
			}

			$.get(event.currentTarget.href, this.loadList);
			$("#themes-window").foundation("reveal", "close");
		},

		/**
		 * Shows the current theme as selected on the theme list
		 * @param {int} theme_id Id of the theme to show as selected
		 */
		showAsSelected: function(theme_id) {
			$(".theme-item").removeClass("selected");
			$(".theme-link[data-theme-id='" + theme_id + "']").parent().addClass("selected");
		}
	});
});

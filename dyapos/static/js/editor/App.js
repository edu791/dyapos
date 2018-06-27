/**
 * @module Editor
 */

/**
 * This class stores global variables inside a namespace called "app".
 * It also runs some statements to prepare the app before starting.
 * @class App
 * @static
 */

define(["Slide/SlideModel",
		"Component/ComponentModel",
		"Component/Image/ImageUploadFormView",
		"Component/Video/VideoUploadFormView",
		"Theme/ThemeEditorView",
		"Theme/ThemeSelectorView",
		"Collaborative/ChatWindowView",
		"Component/Text/AddLinkWindowView",
		"Component/NewComponentBoxView",
		"Slide/SlideOptionsBoxView",
		"EditorView",
		"Slide/SlidesListView",
		"Slide/SlideMiniView",
		"Slide/SlidesMapView",
		"Slide/SlideNotesView",
		"Component/Text/TextToolboxView",
		"Component/Image/ImageToolboxView",
		"Component/Video/VideoToolboxView",
		"Mode/EditModeView",
		"Mode/NavigationModeView"],
	function (SlideModel, ComponentModel, ImageUploadFormView, VideoUploadFormView, ThemeEditorView, ThemeSelectorView, ChatWindowView, AddLinkWindowView, NewComponentBoxView, SlideOptionsBoxView, EditorView, SlidesListView, SlideMiniView, SlidesMapView, SlideNotesView, TextToolboxView, ImageToolboxView, VideoToolboxView, EditModeView, NavigationModeView) {
		"use strict";

		Mustache.tags = ["[[", "]]"];

		/**
		 * Returns the value of a CSS transform property from a DOM element
		 * @method getTransformValue
		 * @param {Object} element DOM element
		 * @param {String} property Item from the transform CSS property, example: rotateZ
		 */
		app.getTransformValue = function (element, property) {
			var values = element.style[app.css_transform].split(")"),
				key, val, prop;

			for (key in values) {
				if (values.hasOwnProperty(key)) {
					val = values[key];
					prop = val.split("(");
					if (prop[0].trim() === property) {
						return parseFloat(prop[1]);
					}
				}
			}
			return false;
		};

		/**
		 * Transforms a translate3D property value from a transform CSS into an array
		 * @method translate3DToArray
		 * @param {Object} value translate3D value from transform CSS property
		 */
		app.translate3DToArray = function (value) {
			value = value.toString();
			var pattern = /([0-9-]+)+(?![3d]\()/gi;
			return value.match(pattern);
		};

		/**
		 * Get the supported CSS property from a given array according to the web browser.
		 * <br>Example: app.getSupportedCSSProp(["webkitTransform", "MozTransform", "OTransform"]) will return MozTransform if you're using Firefox'
		 * @method getSupportedCSSProp
		 * @param {Array} proparray
		 */
		app.getSupportedCSSProp = function (proparray) {
			var root = document.documentElement,
				i;

			//reference root element of document
			for (i = 0; i < proparray.length; i = i + 1) { //loop through possible properties
				if (proparray[i] in root.style) { //if property exists on element (value will be string, empty string if not set)
					return proparray[i];
				}
			}
		};

		/**
		 * Runs an infinite loop every 5 seconds wheres saves all the presentation data on the Browser's Local Storage as JSON
		 * @method saveAllToLocalStorage
		 */
		app.saveAllToLocalStorage = function () {
			setTimeout(function () {
				localStorage.slides = JSON.stringify(app.slides.toJSON());
				app.saveAllToLocalStorage();
			}, 5000);
		};

		/**
		 * Deselects all the components and sets the variable app.selected_component as null
		 * @method deselectAllComponents
		 */
		app.deselectAllComponents = function () {
			$(".component").removeClass("selected-component hoverable");
			$(".toolbox, .component-options, .btn-resize-image").hide();
			app.selected_component = null;
		};

		/**
		 * Name for the transform CSS property according to the browser and its prefix
		 * @attribute css_transform
		 * @type String
		 */
		app.css_transform = app.getSupportedCSSProp(["webkitTransform", "MozTransform", "OTransform"]);
		/**
		 * Name for the transition CSS property according to the browser and its prefix
		 * @attribute css_transform
		 * @type String
		 */
		app.css_transition = app.getSupportedCSSProp(["webkitTransition", "MozTransition", "OTransition"]);

		/**
		 * Set of variables for Navigation mode
		 * @attribute nav
		 * @type Object
		 */
		app.nav = {
			map: document.getElementById("impress").children[0],
			transform_style: null,
			map_trans3d: null,
			slide_trans3d: null,
			last_x_: null,
			last_y: null
		};

		/**
		 * CID of the selected slide
		 * @attribute selected_slide
		 * @type String
		 */
		app.selected_slide = null;

		/**
		 * Model of the selected component
		 * @attribute selected_component
		 * @type Object (ComponentModel)
		 */
		app.selected_component = null;

		/**
		 * Indicates whether the last change was made from server or not
		 * @attribute updated_from_server
		 * @type boolean
		 */
		app.updated_from_server = false;

		app.slide_clicked_point = {
			top : 50,
			left : 50
		};

		//Connect to socket.io
		socket = io.connect(app.nodejs_url);

		socket.emit("collaborator_connect", {
			presentation_id: app.p_id,
			user_data: {
				"first_name": app.user_first_name,
				"last_name": app.user_last_name,
				"username": app.user_username
			}
		});

		/**
		 * Collection of slide objects
		 * @attribute SlideCollection
		 * @type Object (Backbone.Collection)
		 */
		app.SlideCollection = Backbone.Collection.extend({
			model: SlideModel,
			url: "slides",
			getComponent: function (cid) {
				for (var i = 0; i < app.slides.length; i = i + 1) {
					if (app.slides.models[i].get("components").get(cid) !== undefined) {
						return app.slides.models[i].get("components").get(cid);
					}
				}

				// In case it's not found
				return undefined;
			},
			getComponentsWhere: function (values) {
				var results = [],
					result, i, j;

				for (i = 0; i < app.slides.length; i = i + 1) {
					result = app.slides.models[i].get("components").where(values);
					if (result.length > 0) {
						for (j = 0; j < result.length; j = j + 1) {
							results.push(result[j]);
						}
					}
				}
				return results;
			}
		});

		/**
		 * Collection of component objects
		 * @attribute ComponentCollection
		 * @type Object (Backbone.Collection)
		 */
		app.ComponentCollection = Backbone.Collection.extend({
			model: ComponentModel,
			url: "components"
		});

		/**
		 * Instance of SlideCollection where to save all the slides
		 * @attribute slides
		 * @type Object (SlideCollection)
		 */
		app.slides = new app.SlideCollection();

		/**
		 * Instantiate Backbone.View objects and load data
		 * @event Document ready
		 */
		$(document).ready(function () {
			impress().init();

			app.views = {};
			app.views.editor = new EditorView();
			app.views.image_upload_form = new ImageUploadFormView();
			app.views.video_upload_form = new VideoUploadFormView();
			app.views.chat_window = new ChatWindowView();
			app.views.add_link_window = new AddLinkWindowView();
			app.views.new_component_box = new NewComponentBoxView();
			app.views.slide_options_box = new SlideOptionsBoxView();
			app.views.text_toolbox = new TextToolboxView();
			app.views.image_toolbox = new ImageToolboxView();
			app.views.video_toolbox = new VideoToolboxView();
			app.views.slides_map = new SlidesMapView({
				collection: app.slides
			});
			app.views.slides_list = new SlidesListView({
				collection: app.slides
			});
			app.views.edit_mode = new EditModeView();
			app.views.navigation_mode = new NavigationModeView();
			app.views.theme_selector = new ThemeSelectorView();
			app.views.theme_editor = new ThemeEditorView();
			app.views.slide_notes = new SlideNotesView();

			// Load the slides from server
			app.slides.sync("read", app.slides, {
				success: function (data) {
					//When the data has arriven
					//If presentation doesn't have any slides (first time opened)
					if (data.length === 0) {
						//Insert first slide
						app.slides.add(new SlideModel());
						app.slides.last().save();
					} else {
						app.slides.reset(data);
					}
					$("#loading-screen").fadeOut(800);
				}
			});
		});
	});

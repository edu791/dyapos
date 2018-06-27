/**
 * @module Component
 */

/**
 * Basic structure for a componenent View
 * @class ComponentView
 * @extends Backbone.View
 */

define(["Component/Text/TextView",
		"Component/Image/ImageView",
		"Component/Video/VideoView"], function(TextCompView, ImageCompView, VideoCompView) {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Tag name: li
		 * @property tagName
		 * @type String
		 */
		tagName : "div",

		/**
		 * Class name: slide-mini
		 * @property className
		 * @type String
		 */
		className : "component hoverable",

		events : {
			/**
			 * Calls clickComponent()
			 * @event click
			 */
			"click" : "clickComponent",
			/**
			 * Calls dragStopComponent()
			 * @event dragstop
			 */
			"dragstop" : "dragStopComponent",
			/**
			 * Calls deleteComponent()
			 * @event click .btn-delete-component
			 */
			"click .btn-delete-component" : "deleteComponent"
		},

		/**
		 * Template for the view
		 * @property template
		 * @type String
		 */
		template : document.getElementById("template-component").innerHTML,

		/**
		 * Extra attributes for the view
		 * @property attributes
		 * @type Object
		 */
		attributes : function() {
			return {
				id : this.model.cid,
				style : "position: absolute;top: " + this.model.get("pos_y") + "px;" + "left: " + this.model.get("pos_x") + "px;"
			};
		},

		/**
		 * Runs when the class is instantiated
		 * @method initialize
		 */
		initialize : function() {
			// When the component es destroyed
			this.model.on("destroy", this.remove, this);

			this.$el.draggable({
				handle : ".btn-move-component"
			});

			// Hack: Add a reverse view relationship to the model, so that way you can access to the view object from the model
			this.model.view = this;
		},

		/**
		 * Renders the view
		 * @method render
		 */
		render : function() {
			var comp_view;

			this.$el.append(this.template);

			switch(this.model.get("type")) {
				case "text" :
					comp_view = new TextCompView({
						model : this.model
					});
					break;
				case "image" :
					comp_view = new ImageCompView({
						model : this.model
					});
					break;
				case "video" :
					comp_view = new VideoCompView({
						model : this.model
					});
					break;
			}
			this.$el.append(comp_view.render().el);

			return this;
		},

		/**
		 * When the user clicks a component
		 * @method clickComponent
		 * @param {Object} event Click event
		 */
		clickComponent : function(event) {
			event.stopPropagation();
			console.log("click component");

			app.deselectAllComponents();
			this.$el.find(".component-options").show();
			app.selected_component = this.model;
			this.$el.addClass("selected-component");

			// Show the toolbox according to the component type
			switch(this.model.get("type")){
				case "text": app.views.text_toolbox.show();
							break;
				case "image": app.views.image_toolbox.show();
							break;
				case "video": app.views.video_toolbox.show();
							break;
			}

			// this.$el.draggable({
				// handle : ".btn-move-component"
			// });
		},

		/**
		 * When the user stops dragging a component
		 * @method dragStopComponent
		 * @param {Object} event
		 * @param {Object} ui
		 */
		dragStopComponent : function(event, ui) {
			console.log("Change position");

			// Save the new position on the model
			this.model.set({
				"pos_x" : ui.position.left,
				"pos_y" : ui.position.top
			});
			this.model.save();
		},

		/**
		 * Removes a component
		 * @method deleteComponent
		 * @param {Object} event Click event
		 */
		deleteComponent : function(event) {
			event.stopPropagation();
			console.log("remove component");
			app.selected_component = null;
			this.model.destroy();
		}
	});
});

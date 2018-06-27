/**
 * @module Component
 * @submodule Image
 */

/**
 * Image view
 * @class ImageView
 * @extends Backbone.View
 */

define([], function() {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Tag name: div
		 * @property tagName
		 * @type String
		 */
		tagName : "div",

		/**
		 * Class name: image component-preview
		 * @property className
		 * @type String
		 */
		className : "image component-preview",

		/**
		 * Template: #template-image-component
		 * @property template
		 * @type String
		 */
		template : document.getElementById("template-image-component").innerHTML,

		events : {
			/**
			 * Calls showImageResizer()
			 * @event click img
			 */
			"click img" : "showImageResizer",
			/**
			 * Calls onMousedownResizer()
			 * @event mousedown .btn-image-resizer
			 */
			"mousedown .btn-image-resizer" : "onMousedownResizer",
		},

		/**
		 * Extra attributes for the view
		 * @attribute attributes
		 * @type Object
		 */
		attributes : function() {
			var style = "",
				attr_name,
				value;

			for (attr_name in this.model.attributes) {
				if (this.model.attributes.hasOwnProperty(attr_name)) {
					value = this.model.attributes[attr_name];
					switch(attr_name) {
						case "size":
							style += "width:" + value + "px;";
							break;
					}
				}
			}

			return {
				"style" : style
			};
		},

		resizer_last_x : null,

		/**
		 * Runs when the class is instantiated
		 * @method initialize
		 */
		initialize : function() {
			this.model.on("change", function() {
				this.render();

				// Updates its tag attributes (css)
				this.$el.attr(this.attributes());
			}, this);
		},

		/**
		 * Renders the view
		 * @method render
		 * @return View object
		 */
		render : function() {
			var template = Mustache.render(this.template, this.model.toJSON());

			this.$el.html(template);
			return this;
		},

		/**
		 * Shows the image resizer button
		 * @method showImageResizer
		 */
		showImageResizer : function(){
			console.log("show image resizer");
			this.el.querySelector(".btn-image-resizer").style.display = "block";
		},

		/**
		 * When the user performs a mousedown event on the image resizer
		 * @method onMousedownResizer
		 * @param {Object} event Mousedown event
		 */
		onMousedownResizer : function(event) {
			console.log("mousedown image resizer");
			this.resizer_last_x = event.clientX;
            $(document).on("mousemove", $.proxy(this.onMoveResizer, this));
            $(document).on("mouseup", $.proxy(this.onMouseupResizer, this));
		},


		/**
		 * When the user performs a mousemove event after click down on the image resizer
		 * @method onMoveResizer
		 * @param {Object} event Mousemove event
		 */
		onMoveResizer : function(event){
			event.preventDefault();
			console.log("onmove resizer");

			// Get the difference from last position of X to this position
			var deltaX = this.resizer_last_x - event.clientX,
				current_width = parseInt(this.el.style.width.replace("px",""), 10);

			this.el.style.width = current_width + (deltaX > 0 ? -4 : 4) + "px";
            this.resizer_last_x = event.clientX;
		},


		/**
		 * When the user performs a mouseup event after dragging the image resizer
		 * @method onMouseupResizer
		 * @param {Object} event Mouseup event
		 */
		onMouseupResizer : function(event){
			event.preventDefault();
			console.log("onmouseup resizer");
            $(document).off("mousemove", this.onMoveResizer);
            $(document).off("mouseup", this.onMouseupResizer);
            this.model.set("size", parseInt(this.el.style.width.replace("px",""), 10));
            $(".btn-image-resizer").show();
		}
	});
});

/**
 * @module Component
 * @submodule Text
 */

/**
 * Text view
 * @class TextView
 * @extends Backbone.View
 */

define([], function() {"use strict";
	return Backbone.View.extend({
		/**
		 * Tag name: div
		 * @property tagName
		 * @type String
		 */
		tagName : "div",

		/**
		 * Template: #template-text-component
		 * @property template
		 * @type String
		 */
		template : document.getElementById("template-text-component").innerHTML,

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
						case "bold":
							if (value === true) {
								style += "font-weight:bold;";
							}
							break;
						case "italic":
							if (value === true) {
								style += "font-style:italic;";
							}
							break;
						case "underlined":
							if (value === true) {
								style += "text-decoration:underline;";
							}
							break;
						case "color":
							style += "color:" + value + ";";
							break;
						case "font_size":
							style += "font-size:" + value + "px;";
							break;
					}
				}
			}

			return {
				"style" : style,
				"class" : "component-preview text " + this.model.get("text_type")
			};
		},

		events : {
			/**
			 * Calls exitTextEditor
			 * @event blur .text-content
			 */
			"blur .text-content" : "exitTextEditor"
		},

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
		 * Exits from the text editor.
		 * It also saves the changed text on the model
		 * @method exitTextEditor
		 */
		exitTextEditor : function() {
			console.log("Exit text editor");
			var new_text = this.el.querySelector(".text-content");

			// If the text has a link
			if(this.model.get("link") !== null){
				new_text = new_text.querySelector("a");
			}

			new_text = new_text.innerHTML.trim();

			if(new_text.replace(/(<([^>]+)>)/ig, "") === ""){
				// If the text is void, delete the component
				this.model.destroy();
			}else{
				if (this.model.get("content") !== new_text) {
					// If the text is different from the last one, save it
					console.log("text changed");
					this.model.set("content", new_text);
					this.model.save();
				}
			}
		},

	});
});

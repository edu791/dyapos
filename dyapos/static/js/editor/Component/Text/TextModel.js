/**
 * @module Component
 * @submodule Text
 */

/**
 * Text model
 * @class TextModel
 * @extends ComponentModel
 */

define(["Component/ComponentModel"], function(ComponentModel) {
	"use strict";
	var model = ComponentModel.extend({
		/**
		 * Default attributes
		 * @attribute defaults
		 * @type Object
		 */
		defaults : {
			type : "text",
			text_type : null,
			content : null,
			font_size : null,
			color : null,
			bold : false,
			italic : false,
			underlined : false,
			link: null
		}
	});
	_.extend(model.prototype.defaults, ComponentModel.prototype.defaults);

	return model;

});

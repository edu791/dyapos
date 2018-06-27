/**
 * @module Component
 * @submodule Image
 */

/**
 * Image model
 * @class ImageModel
 * @extends ComponentModel
 */

define(["Component/ComponentModel"], function(ComponentModel) {
	"use strict";
	var model = ComponentModel.extend({
		/**
		 * Default attributes for the model
		 * @attribute defaults
		 * @type Object
		 */
		defaults : {
			type : "image",
			url : null,
			size : 400 //Default 500px
		}
	});
	_.extend(model.prototype.defaults, ComponentModel.prototype.defaults);

	return model;

});

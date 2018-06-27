/**
 * @module Slide
 */

/**
 * Slide model
 * @class SlideModel
 * @extends Backbone.RelationalModel
 */

define(["Component/ComponentModel"], function(ComponentModel) {
	"use strict";
	return Backbone.RelationalModel.extend({
		/**
		 * Array of objects that define the model with other models
		 * @property relations
		 * @type Array
		 */
		relations : [{
			type : Backbone.HasMany,
			key : "components",
			relatedModel : ComponentModel, // I referenced it by an object instead of a string because of a Require.js problem
			collectionType : "app.ComponentCollection",
			reverseRelation : {
				key : "slide",
				includeInJSON : "_id"
			}
		}],

		/**
		 * Default values when creating the model
		 * @property defaults
		 * @type Objects
		 */
		defaults : {
			pos_x : 0,
			pos_y : 0,
			rotation_x : 0,
			rotation_y : 0,
			rotation_z : 0,
			scale : 1,
			number : 0,
            background_color : null,
            notes : null
		},

		/**
		 * @property urlRoot
		 * @type String
		 */
		urlRoot : "slide",

		/**
		 * Represents the name of the ID attribute
		 * @property idAttribute
		 * @type String
		 */
		idAttribute : "_id"
	});

});

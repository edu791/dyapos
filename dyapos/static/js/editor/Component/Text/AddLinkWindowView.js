/**
 * @module Component
 * @submodule Text
 */

/**
 * Form for adding a link to a text component
 * @class AddLinkWindowView
 * @extends Backbone.View
 */

define([], function() {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #add-link-box
		 * @property el
		 * @type DOM Object
		 */
		el : document.getElementById("add-link-box"),

		events : {
			/**
			 * Calls addLink()
			 * @event click #btn-add-text-link
			 */
			"click #btn-add-text-link" : "addLink"
		},

		/**
		 * Adds a link to a text component
		 * @method addLink
		 */
		addLink : function() {
			var link = this.el.querySelector("#text-link").value;
			link = link.replace(/http[s]?:\/\//, "");

			app.selected_component.set("link", link).save();
			$("#add-link-box").foundation("reveal", "close");
		}
	});
});

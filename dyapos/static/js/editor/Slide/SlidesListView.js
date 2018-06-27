/**
 * @module Slide
 */

/**
 * List view of all the created slides, they are shown as thumbnails
 * @class SlidesListView
 * @extends Backbone.View
 */

define(["Slide/SlideMiniView"], function (SlideMiniView) {
	"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #slides-list
		 * @property el
		 * @type DOM Object
		 */
		el: document.getElementById("slides-list"),

		/**
		 * Runs when the class is instantiated
		 * @method initialize
		 */
		initialize: function () {
			// When a new slide is added to the collection, calls appendSlideMini()
			this.collection.on("add", function () {
				this.appendSlideMini(this.collection.last());
			}, this);

			this.collection.on("reset", function () {
				this.render();
			}, this);

			// Set this view as sortable
			$(this.el).sortable({
				distance: 20,
				stop: function () {
					// When stopping the sortable event, change the slide number
					$("#slides-list > .slide-mini").each(function (index) {
						app.slides.get(this.model.cid).set("number", index);
					});
				}
			});

			// // Load thumbnails for every slide
			// setTimeout(function() {
			// app.slides.each(function(slide) {
			// slide.mini_view.generateThumbnail();
			// });
			// }, 3000);
		},

		/**
		 * Renders the view
		 * @method render
		 */
		render: function () {
			this.$el.empty();
			for (var i = 0; i < this.collection.length; i = i + 1) {
				// Append every slide found in the collection as a SlideMiniView
				this.appendSlideMini(this.collection.at(i));
			}

			return this;
		},

		/**
		 * Appends a new SlideMiniView to this view
		 * @param {Object} slide_model Model object of the slide to append
		 */
		appendSlideMini: function (slide_model) {
			var slide_mini = new SlideMiniView({
				model: slide_model
			});
			this.$el.append(slide_mini.render().$el);
			slide_model.mini_view.generateThumbnail();
		}
	});
});
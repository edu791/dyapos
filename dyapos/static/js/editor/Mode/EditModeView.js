/**
 * Controls the different modes within the editor, like edit, navigation and preview mode.
 * Every mode has different event listeners and user interface.
 * @module Mode
 * @main
 */

/**
 * Edit mode view for slides. Here you can add components to the slides.
 * @class EditModeView
 * @extends Backbone.View
 */

define([], function () {
    "use strict";
    return Backbone.View.extend({
        /**
         * Element: body
         * @property el
         * @type DOM Object
         */
        el: document.body,

        /**
         * Enters to this mode. Here the events are defined and the user interface is prepared
         * @method enterMode
         */
        enterMode: function () {
            $("#btn-navigation-mode, #btn-slide-background-color, #btn-slide-notes").show();
            app.views.new_component_box.$el.show();
            $(".component").addClass("hoverable");
            $("body").removeClass("non-selectable-text");
            $(".step").removeClass("hoverable borderless selected");
            // if ($(".component").draggable("option", "disabled") === true) {
            // $(".component").draggable("enable");
            // }

            // Delegate events to each SlideView object
            app.slides.each(function (slide) {
                slide.view.delegateEvents();

                // Delegate events to each ComponentView object within this slide
                slide.get("components").each(function (component) {
                    component.view.delegateEvents();
                });
            });

            // Set all divs class="text-content" as editable
            $(".text-content").attr("contenteditable", true);

            impress().goto(app.selected_slide);
        },

        /**
         * It's the oppossite of enterMode()
         * @method enterMode
         */
        exitMode: function () {
            app.deselectAllComponents();
            app.views.new_component_box.$el.hide();
            // if ($(".component").draggable("option", "disabled") === false) {
            // $(".component").draggable("disable");
            // }

            // Undelegate events to each SlideView object
            app.slides.each(function (slide) {
                slide.view.undelegateEvents();

                // Undelegate events to each ComponentView object within this slide
                slide.get("components").each(function (component) {
                    component.view.undelegateEvents();
                });
            });

            // Set all divs class="text-content" as non-editable
            $(".text-content").attr("contenteditable", false);
        }
    });
});
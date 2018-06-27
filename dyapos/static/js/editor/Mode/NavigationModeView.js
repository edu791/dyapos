/**
 * @module Mode
 */

/**
 * Navigation mode view for slides. Here you can navigate through slides, apply zooming, edit position, scale and rotate slides.
 * @class NavigationModeView
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
            var map_style = app.nav.map.style[app.css_transform];

            $("body").addClass("non-selectable-text");
            $(".step").addClass("hoverable");
            $("#slides > .step").addClass("active");
            $("#" + app.selected_slide).addClass("selected-slide");
            $("#btn-navigation-mode, #btn-slide-background-color, #btn-slide-notes").hide();
            $("#btn-zoom-in, #btn-zoom-out").show();

            // Center rotation to 0 degrees if rotated
            map_style = map_style.replace(/rotateZ\(.+?\)/g, "rotateZ(0deg)");
            map_style = map_style.replace(/rotateX\(.+?\)/g, "rotateX(0deg)");
            map_style = map_style.replace(/rotateY\(.+?\)/g, "rotateY(0deg)");
            app.nav.map.style[app.css_transform] = map_style;

            // Zoomout to 0.6
            document.getElementById("impress").style.transition = "all 300ms ease-in-out 50ms";
            document.getElementById("impress").style[app.css_transition] = "all 300ms ease-in-out 50ms";
            document.getElementById("impress").style[app.css_transform] = "scale(0.4)";

            this.delegateEvents({
                "click .step": "onClickSlide",
                "mousedown .step": "onMousedownSlide",
                "mousedown": "onMousedownMap",
                //"mousewheel": "onMouseWheel",
                //"DOMMouseScroll": "onMouseWheel2" //For Firefox
            });

            $("body").addClass("grid");
            app.slides.each(function(slide){
                slide.view.showNumber();
            });
        },

        /**
         * It's the oppossite of enterMode()
         * @method enterMode
         */
        exitMode: function () {
            app.views.slide_options_box.$el.hide();
            $("#btn-zoom-in, #btn-zoom-out").hide();
            $("body").removeClass("grid");
            $(".slide-number-icon").remove();

            this.undelegateEvents();
        },

        /**
         * When the user clicks on a slide
         * @method onClickSlide
         * @param {Object} event Click Event
         */
        onClickSlide: function (event) {
            console.log("event: slide click");
            app.selected_slide = event.target.id;
            $("#" + app.selected_slide).addClass("selected");
            app.views.slide_options_box.$el.show();

            // Adjust the inputs according to the slide data
            document.getElementById("input-scale").value = app.slides.get(app.selected_slide).get("scale");
            document.getElementById("input-rotation-z").value = app.slides.get(app.selected_slide).get("rotation_z");
            document.getElementById("input-rotation-x").value = app.slides.get(app.selected_slide).get("rotation_x");
            document.getElementById("input-rotation-y").value = app.slides.get(app.selected_slide).get("rotation_y");
        },

        /**
         * When the user keeps the mouse click down on a slide
         * @method onMousedownSlide
         * @param {Object} event Mousedown event
         */
        onMousedownSlide: function (event) {
            event.stopPropagation();
            if (event.target.classList[0] === "step") {
                $(".step").removeClass("selected");
                app.clicked_slide = event.target;
                app.clicked_slide.classList.add("selected");
                console.log("mousedown on slide");
                app.nav.last_x = event.clientX;
                app.nav.last_y = event.clientY;
                app.nav.transform_style = event.target.style[app.css_transform];
                app.nav.slide_trans3d = event.target.style[app.css_transform].split("translate3d");
                app.nav.slide_trans3d = app.nav.slide_trans3d[app.nav.slide_trans3d.length - 1];
                app.nav.slide_trans3d = app.translate3DToArray(app.nav.slide_trans3d);

                $(document).on("mousemove", this.onMoveSlide);
                $(document).on("mouseup", this.onMouseupSlide);
            }
        },

        /**
         * When the user moves the  mouse on a slide (while mousedown event is started)
         * @method onMoveSlide
         * @param {Object} event Mousedown event
         */
        onMoveSlide: function (event) {
            event.stopPropagation();
            var movement = 7,
                // Get the difference from last position to this position
                deltaX = app.nav.last_x - event.clientX,
                deltaY = app.nav.last_y - event.clientY;

            // Check which direction had the highest amplitude and then figure out direction by checking if the value is greater or less than zero

            if (deltaX > 0) {
                // If the movement is to left
                app.nav.slide_trans3d[0] = parseInt(app.nav.slide_trans3d[0], 10) - movement;
            } else if (deltaX < 0) {
                // If the movement is to right
                app.nav.slide_trans3d[0] = parseInt(app.nav.slide_trans3d[0], 10) + movement;
            }

            if (deltaY > 0) {
                // If the movement is to up
                app.nav.slide_trans3d[1] = parseInt(app.nav.slide_trans3d[1], 10) - movement;
            } else if (deltaY < 0) {
                // If the movement is to down
                app.nav.slide_trans3d[1] = parseInt(app.nav.slide_trans3d[1], 10) + movement;
            }

            app.nav.last_x = event.clientX;
            app.nav.last_y = event.clientY;

            // Apply movement to CSS style
            app.nav.transform_style = app.nav.transform_style.replace(/translate3d\(.+?\)/g, "translate3d(" + app.nav.slide_trans3d[0] + "px," + app.nav.slide_trans3d[1] + "px,0px)");
            app.clicked_slide.style[app.css_transform] = app.nav.transform_style;
        },

        /**
         * When the user releases the mouse button on a slide (while mousedown event is started)
         * @method onMouseupSlide
         * @param {Object} event Mouseup event
         */
        onMouseupSlide: function (event) {
            event.stopPropagation();
            console.log("mouseup slide");
            app.clicked_slide.dataset.x = app.nav.slide_trans3d[0];
            app.clicked_slide.dataset.y = app.nav.slide_trans3d[1];

            app.slides.get(app.clicked_slide.id).set({
                "pos_x": app.clicked_slide.dataset.x,
                "pos_y": app.clicked_slide.dataset.y
            }).save();

            impress().initStep(app.clicked_slide);

            $(document).off("mousemove", this.onMoveSlide);
            $(document).off("mouseup", this.onMouseupSlide);
        },

        /**
         * When the user keeps the mouse click down on the map
         * @method onMousedownMap
         * @param {Object} event Mousedown event
         */
        onMousedownMap: function (event) {
            event.stopPropagation();
            if (event.target.isEqualNode(document.body)) {
                console.log("mousedown on map");

                app.nav.last_x = event.clientX;
                app.nav.last_y = event.clientY;
                app.nav.map = document.getElementById("impress").children[0];
                app.nav.transform_style = app.nav.map.style[app.css_transform];
                app.nav.map_trans3d = app.nav.map.style[app.css_transform].split("translate3d");
                app.nav.map_trans3d = app.nav.map_trans3d[app.nav.map_trans3d.length - 1];
                app.nav.map_trans3d = app.translate3DToArray(app.nav.map_trans3d);

                // Remove transition animation for freely move on the map
                // (transition will be set again when call impress().goto())
                app.nav.map.style.transition = null;
                app.nav.map.style[app.css_transition] = null;

                $(document).on("mousemove", this.onMoveMap);
                $(document).on("mouseup", this.onMouseupMap);
            }
        },

        /**
         * When the user moves the  mouse on the map (while mousedown event is started)
         * @method onMoveMap
         * @param {Object} event Mousedown event
         */
        onMoveMap: function (event) {
            event.stopPropagation();
            var movement = 10,
                // Get the difference from last position to this position
                deltaX = app.nav.last_x - event.clientX,
                deltaY = app.nav.last_y - event.clientY;

            // Check which direction had the highest amplitude and then figure out direction by checking if the value is greater or less than zero
            if (deltaX > 0) {
                // If the movement is to left
                app.nav.map_trans3d[0] = parseInt(app.nav.map_trans3d[0], 10) - movement;
            } else if (deltaX < 0) {
                // If the movement is to right
                app.nav.map_trans3d[0] = parseInt(app.nav.map_trans3d[0], 10) + movement;
            }

            if (deltaY > 0) {
                // If the movement is to up
                app.nav.map_trans3d[1] = parseInt(app.nav.map_trans3d[1], 10) - movement;
            } else if (deltaY < 0) {
                // If the movement is to down
                app.nav.map_trans3d[1] = parseInt(app.nav.map_trans3d[1], 10) + movement;
            }

            app.nav.last_x = event.clientX;
            app.nav.last_y = event.clientY;

            // Apply move to CSS style
            app.nav.transform_style = app.nav.transform_style.replace(/translate3d\(.+?\)/g, "translate3d(" + app.nav.map_trans3d[0] + "px," + app.nav.map_trans3d[1] + "px,0px)");
            app.nav.map.style[app.css_transform] = app.nav.transform_style;
        },

        /**
         * When the user releases the mouse button on the map (while mousedown event is started)
         * @method onMouseupMap
         * @param {Object} event Mouseup event
         */
        onMouseupMap: function (event) {
            event.stopPropagation();
            console.log("event: mouseup map");
            $(document).off("mousemove", this.onMoveMap);
            $(document).off("mouseup", this.onMouseupMap);
        },

        /**
         * When the user moves the mouse wheel
         * @method onMouseWheel
         * @param {Object} event Mousewheel event
         */
        //onMouseWheel: function (event) {
            //event.stopPropagation();
            //console.log("event: onmousewheel");
            //console.log(event);
            //if (event.originalEvent.wheelDelta === 120) {
                //this.zoomIn();
            //}
            //if (event.originalEvent.wheelDelta === -120) {
                //this.zoomOut();
            //}
        //},

        /**
         * When the user moves the mouse wheel (For Mozilla)
         * @method onMouseWheel2
         * @param {Object} event Mousewheel event
         */
        //onMouseWheel2: function (event) {
            //console.log("event: onmousewheel");
            //console.log(event);
            //if (event.originalEvent.detail < 0) {
                //this.zoomIn();
            //}
            //if (event.originalEvent.detail > 0) {
                //this.zoomOut();
            //}
        //},

        /**
         * Zooms out the map
         * @method zoomOut
         */
        zoomOut: function () {
            var currentZoom,
                newZoom;

            // Decrease a little the transition time, for freely moving on the map
            document.getElementById("impress").style.transition = "all 300ms ease-in-out 50ms";
            document.getElementById("impress").style[app.css_transition] = "all 300ms ease-in-out 50ms";

            currentZoom = app.getTransformValue(document.getElementById("impress"), "scale");
            newZoom = currentZoom - 0.1;
            document.getElementById("impress").style[app.css_transform] = "scale(" + newZoom + ")";
        },

        /**
         * Zooms in the map
         * @method zoomIn
         */
        zoomIn: function () {
            var currentZoom,
                newZoom;

            // Decrease a little the transition time, for freely moving on the map
            document.getElementById("impress").style.transition = "all 300ms ease-in-out 50ms";
            document.getElementById("impress").style[app.css_transition] = "all 300ms ease-in-out 50ms";

            currentZoom = app.getTransformValue(document.getElementById("impress"), "scale");
            newZoom = currentZoom + 0.1;
            document.getElementById("impress").style[app.css_transform] = "scale(" + newZoom + ")";
        }
    });
});

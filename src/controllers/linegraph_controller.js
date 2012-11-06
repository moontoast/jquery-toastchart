$.toastchart = $.toastchart || {};
$.toastchart.controller = $.toastchart.controller || {};
$.toastchart.controller.linegraph = (function () {

    var hoverOn = false, allowHover = true, controller = {

        /**
         * @function
         * @param {Object} nullArea
         * @param {Int} series
         * @param {Object} data
         */
        drawShadedNullArea: function (nullArea, series, data) {
            var local = {
                ctx: data.$shadedCanvas[0].getContext('2d')
            };
            local.ctx.beginPath();
            local.ctx.fillStyle = $.toastchart.helper.getShadedColor(data.series[series].color, 0.2);
            local.ctx.moveTo(nullArea.start.left, data.style.height - data.style.padding.bottom);
            local.ctx.lineTo(nullArea.start.left, nullArea.start.top);
            local.ctx.lineTo(nullArea.end.left, nullArea.end.top);
            local.ctx.lineTo(nullArea.end.left, data.style.height - data.style.padding.bottom);
            local.ctx.fill();
            local.ctx.closePath();
            local.ctx.fillStyle = data.series[series].color;
        },

        /**
         * @function
         * @param {Object} nullArea
         * @param {Int} series
         * @param {Object} data
         */
        drawLinedNullArea: function (nullArea, series, data) {
            var local = {
                ctx: data.$shadedCanvas[0].getContext('2d')
            };
            local.ctx.beginPath();
            local.ctx.strokeStyle = data.series[series].strokeStyle;
            local.ctx.lineWidth = data.series[series].lineWidth / 2;
            local.ctx.dashedLine(nullArea.start.left, nullArea.start.top, nullArea.end.left, nullArea.end.top, 10);
            local.ctx.stroke();
            local.ctx.closePath();
        },

        /**
         * @function
         * @param {Object} data
         */
        drawShadedGraph: function (data) {

            // Local Variables
            var local = {
                ctx: data.$shadedCanvas[0].getContext('2d'),
                nullArea: {}
            };

            // Loop over all of the lines
            for (i = 0; i < data.points.length; i++) {

                // If the series is not hidden, render it
                if (!data.series[i].hidden) {

                    // Set beginPath to true.  If  this is set to true, we assume that the path is currently closed and we will need to create a new one
                    local.beginPath = true;
                    local.ctx.fillStyle = data.series[i].color;

                    // Loop over the points inside the lines
                    for (j = 0; j < data.points[i].length; j++) {

                        // If the point value is null or undefined, it is treated differently
                        if (data.points[i][j].y === null || data.points[i][j].y === undefined) {

                            // If the path is opened we will need to do some work to close it
                            if (!(local.beginPath)) {

                                // If the value is null rather than undefined, we will use more opacity rather than totally not showing the shaded area entirely
                                if (data.points[i][j].y === null) {
                                    local.nullArea.start = data.points[i][j - 1];
                                }

                                // Finish the line and close the path
                                local.ctx.lineTo(parseInt(data.points[i][j - 1].left + data.style.padding.left), data.style.height - data.style.padding.bottom);
                                local.ctx.moveTo(0 + parseInt(data.points[i][j - 1].left + data.style.padding.left), data.style.height - data.style.padding.bottom);
                                local.ctx.fill();
                                local.ctx.closePath();

                                // If no path has begun yet but we are looking at a null value, set the start value
                            } else if (j === 0 && data.points[i][j].y === null) {
                                local.nullArea.start = data.points[i][j];
                            }

                            /// Set beginPath to true.  If  this is set to true, we assume that the path is currently closed and we will need to create a new one
                            local.beginPath = true;


                            // If the data is not null or undefined, and the path is not begun yet
                        } else if (local.beginPath) {

                            // Fill in the null area from data that was null
                            if (local.nullArea.start) {
                                local.nullArea.end = data.points[i][j];
                                if (local.nullArea.end.index) {
                                    controller.drawShadedNullArea(local.nullArea, i, data);
                                }
                                local.nullArea = {};
                            }

                            // Begin the path
                            local.ctx.beginPath();
                            local.ctx.moveTo(0 + parseInt(data.points[i][j].left + data.style.padding.left), data.style.height - data.style.padding.bottom);
                            local.beginPath = false;
                        }

                        // Draw the line
                        local.ctx.lineTo(parseInt(data.points[i][j].left), parseInt(data.points[i][j].top));
                    }

                    // Fill in the null area from data that was null
                    if (local.nullArea.start) {
                        local.nullArea.end = data.points[i][data.points[i].length - 1];
                        controller.drawShadedNullArea(local.nullArea, i, data);

                        // If the last data is not null
                    } else if (!local.beginPath) {
                        local.ctx.lineTo(data.style.width - data.style.padding.right, data.style.height - data.style.padding.bottom);
                        local.ctx.moveTo(0 + data.style.padding.left, data.style.height - data.style.padding.bottom);
                        local.ctx.fill();
                    }

                    // Close the line and the path
                    local.ctx.closePath();

                }

                // Reset the null area
                local.nullArea = {};

            }
        },

        /**
         * @function
         * @param {Object} data
         */
        drawLineGraph: function (data) {

            // Local variables
            var local = {
                ctx: data.$lineCanvas[0].getContext('2d'),
                nullArea: {}
            };

            // Loop over all of the lines
            for (i = 0; i < data.points.length; i++) {

                // If the line is not hidden, render it
                if (!data.series[i].hidden) {

                    // Set the stroke style
                    local.ctx.strokeStyle = data.series[i].strokeStyle;
                    local.ctx.lineWidth = data.series[i].lineWidth;

                    // Set beginPath to true so that we know to begin drawing in a new path
                    local.beginPath = true;

                    // Loop over all of the points in the lines
                    for (j = 0; j < data.points[i].length; j++) {

                        // If the point is null or undefined, handle it differently
                        if (data.points[i][j].y === null || data.points[i][j].y === undefined) {

                            // If the path has not been begun yet
                            if (!(local.beginPath)) {

                                // Set the stroke
                                local.ctx.stroke();

                                // If the point is null rather than undefined, start the null area for the dotted line 
                                if (data.points[i][j].y === null) {
                                    local.nullArea.start = data.points[i][j - 1];
                                    local.ctx.closePath();
                                }

                                // If no path has begun yet but we are looking at a null value, set the start value
                            } else if (j === 0 && data.points[i][j].y === null) {
                                local.nullArea.start = data.points[i][j];
                            }

                            // Set beginPath to true so we know to start on a new path
                            local.beginPath = true;

                            // If beginPath is set to true, begin a new path
                        } else if (local.beginPath) {

                            // If the the nullArea has been started, finish it and draw the null area.  Then, reset the nullArea to a blank object for the next time a null point shows up
                            if (local.nullArea.start) {
                                local.nullArea.end = data.points[i][j];
                                if (local.nullArea.end.index) {
                                    controller.drawLinedNullArea(local.nullArea, i, data);
                                }
                                local.nullArea = {};
                            }

                            // Begin the path and then set beginPath to false so we know we already have a path going on
                            local.ctx.beginPath();
                            if (parseInt(data.points[i][j].left + data.style.padding.left) === 0) {
                                local.ctx.moveTo(parseInt(data.points[i][j].left + data.style.padding.left), parseInt(data.points[i][j].top + data.style.padding.top));
                            }
                            local.beginPath = false;

                        }

                        // If there is an unresolved null area
                        if (local.nullArea.start && j === data.points[i].length - 1) {
                            local.nullArea.end = data.points[i][data.points[i].length - 1];
                            controller.drawLinedNullArea(local.nullArea, i, data);

                            // Draw the line
                        } else {
                            local.ctx.lineTo(parseInt(data.points[i][j].left), parseInt(data.points[i][j].top));
                        }

                    }

                    // If there is not an unresolved null area, make it a stroke
                    if (!local.nullArea.start) {
                        local.ctx.stroke();
                        local.nullArea = {};
                    }

                    // Close the path.  The line is done!
                    local.ctx.closePath();

                }

                // Reset the null area
                local.nullArea = {};

            }
        },

        tap: function (m, el, data) {

            // The radius of area that can be moused over for a point
            var radius = 10, point = null, canoffset = $(el).offset(), x, y;

            x = m.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
            y = m.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

            // Loop over the points to see if there is a match being moused over
            for (var i = 0; i < data.points.length; i++) {
                for (var j = 0; j < data.points[i].length; j++) {
                    if (
                            (y > parseInt(data.points[i][j].top - radius)) &&
                            (y <= parseInt(data.points[i][j].top + radius)) &&
                            (x  >= parseInt(data.points[i][j].left - radius)) &&
                            (x <= parseInt(data.points[i][j].left + radius)) &&
                            !data.series[i].hidden &&
                            allowHover
                    ) {
                        point = data.points[i][j];
                    }
                }
            }

            // If there is a match being moused over and it wasn't already being show
            if (point && !hoverOn) {
                controller.highlightOn(point, data);
                hoverOn = true;

                // Fire the hoverOn function
                if (typeof data.series[point.series].hoverOn === 'function') {
                    data.series[point.series].hoverOn(point, data);
                }

                // If there is no point being moused over
            } else if (!point) {
                controller.highlightOff(data);
                hoverOn = false;

            }

        },

        /*
         * @function
         * @param {Object} m
         * @param {Object} el
         * @param {Object} data
         */
        mouseMove: function (m, el, data) {

            // The radius of area that can be moused over for a point
            var radius = 10, point = null, canoffset = $(el).offset(), x, y;

            x = m.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
            y = m.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

            // Loop over the points to see if there is a match being moused over
            for (var i = 0; i < data.points.length; i++) {
                for (var j = 0; j < data.points[i].length; j++) {
                    if (
                            (y > parseInt(data.points[i][j].top - radius)) &&
                            (y <= parseInt(data.points[i][j].top + radius)) &&
                            (x  >= parseInt(data.points[i][j].left - radius)) &&
                            (x <= parseInt(data.points[i][j].left + radius)) &&
                            !data.series[i].hidden &&
                            allowHover
                        ) {
                        point = data.points[i][j];
                    }
                }
            }

            // If there is a match being moused over and it wasn't already being show
            if (point && !hoverOn) {
                controller.highlightOn(point, data);
                hoverOn = true;

                // Fire the hoverOn function
                if (typeof data.series[point.series].hoverOn === 'function') {
                    data.series[point.series].hoverOn(point, data);
                }

                // If there is no point being moused over
            } else if (!point) {
                controller.highlightOff(data);
                hoverOn = false;

                // Fire the hoverOff function
                if (typeof data.hoverOff === 'function') {
                    data.hoverOff(data);
                }

            }

        },

        highlightOn: function (point, data) {
            var local = {
                ctx: data.$pointCanvas[0].getContext('2d')
            };
            if (data.series[point.series].color) {
                local.ctx.fillStyle = data.series[point.series].color;
                local.ctx.beginPath();
                local.ctx.arc(point.left, point.top, 7, 0, Math.PI*2, true);
                local.ctx.closePath();
                local.ctx.fill();
            }
            data.$this.addClass('hover-on');
        },

        highlightOff: function (data) {
            var local = {
                ctx: data.$pointCanvas[0].getContext('2d')
            };
            local.ctx.clearRect(0,0, 10000, 10000);
            data.$this.removeClass('hover-on');
        },

        /**
         * @function
         * @param {Object} data
         */
        disableHighlight: function (data) {
            allowHover = false;
        },

        /**
         * @function
         * @param {Object} data
         */
        enableHighlight: function (data) {
            allowHover = true;
        },

        /**
         * @function
         * @param {Object} data
         */
        render: function (data) {
            var local = {
                height: data.style.height,
                width: data.style.width
            };
            data.$lineCanvas = $('<canvas class="toastchart-canvas" height="' + (local.height - data.style.padding.bottom) + 'px" width="' + (local.width - data.style.padding.right) + 'px" />');
            data.$pointCanvas = $('<canvas class="toastchart-canvas" height="' + (local.height - data.style.padding.bottom) + 'px" width="' + (local.width - data.style.padding.right) + 'px" />');
            data.$shadedCanvas = $('<canvas class="toastchart-canvas" height="' + (local.height - data.style.padding.bottom) + 'px" width="' + (local.width - data.style.padding.right)  + 'px" />');
            data.$canvasOverlay = $('<div class="toastchart-canvas toastchard-canvasoverlay" height="' + (local.height - data.style.padding.bottom) + 'px" width="' + (local.width - data.style.padding.right)  + 'px" />');
            data.$canvasOverlay.css({
                height: (local.height - data.style.padding.bottom),
                width: (local.width - data.style.padding.right)
            });
            data.$canvas.append(data.$canvasOverlay);
            data.$canvas.append(data.$lineCanvas);
            data.$canvas.append(data.$shadedCanvas);
            data.$canvas.append(data.$pointCanvas);
            controller.drawLineGraph(data);
            controller.drawShadedGraph(data);
            data.$canvasOverlay.unbind('mousemove').bind('mousemove', function (m) {
                controller.mouseMove(m, this, data);
            });
            data.$canvasOverlay.unbind('click').bind('click', function (m) {
                controller.tap(m, this, data);
            });
        },

        /**
         * @function
         */
        init: (function () {

            $('body').bind('toastchart-init', function (event, data) {
                controller.render(data);
            });

            $('body').bind('toastchart-highlight-disable', function (event, data) {
                controller.disableHighlight();
            });

            $('body').bind('toastchart-highlight-enable', function (event, data) {
                controller.enableHighlight();
            });

        }())

    };

    return controller;

}());

$.toastchart = $.toastchart || {};
$.toastchart.controller.grid = (function (){

    var controller = {

        /**
         * @function
         * @param {Object} data
         */
        drawXAxis: function (data) {

            // Local variables
            var local = {
                tickPoints: $.toastchart.helper.getXTickPoints(data),
                ctx: data.$grid[0].getContext('2d')
            };

            // Style options
            local.ctx.strokeStyle = data.axis.x.color;
            local.ctx.lineWidth = data.axis.x.lineWidth;

            // Loop over the tick points
            for (var i = 0; i < local.tickPoints.length; i++) {

                // Special styling for dashed lines
                if (data.axis.x.lineType === 'dashed') {
                    local.ctx.dashedLine(local.tickPoints[i].x, 0, local.tickPoints[i].x, data.style.height, data.axis.x.lineSpacing);

                    // Standard line
                } else {
                    local.ctx.solidLine(local.tickPoints[i].x, 0, local.tickPoints[i].x, data.style.height);
                }

            }

        },

        /**
         * @function
         * @param {Object} data
         */
        drawYAxis: function (data) {

            // Local variables
            var local = {
                tickPoints: $.toastchart.helper.getYTickPoints(data),
                ctx: data.$grid[0].getContext('2d')
            };

            // Style options
            local.ctx.strokeStyle = data.axis.y.color;
            local.ctx.lineWidth = data.axis.y.lineWidth;

            // Loop over the tick points
            for (var i = 0; i < local.tickPoints.length; i++) {

                // Special styling for dashed lines
                if (data.axis.y.lineType === 'dashed') {
                    local.ctx.dashedLine(0, local.tickPoints[i].y, data.style.width, local.tickPoints[i].y, data.axis.y.lineSpacing);

                    // Standard line
                } else {
                    local.ctx.solidLine(0, local.tickPoints[i].y, data.style.width, local.tickPoints[i].y);
                }

            }

        },

        /**
         * @function
         * @param {Object} data
         */
        render: function (data) {
            var local = {
                height: data.style.height - 2,
                width: data.style.width - 2
            };
            data.$grid = $('<canvas class="toastchart-canvas toastchart-grid" height="' + local.height + 'px" width="' + local.width + 'px" />');
            data.$canvas.append(data.$grid);
            controller.drawXAxis(data);
            controller.drawYAxis(data);
        },

        /**
         * @function
         */
        init: (function () {

            $('body').bind('toastchart-init', function (event, data) {
                controller.render(data);
            });

        }())

    };

    return controller;

}());

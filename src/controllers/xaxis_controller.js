$.toastchart = $.toastchart || {};
$.toastchart.controller = $.toastchart.controller || {};
$.toastchart.controller.xaxis = (function (){

    var controller = {

        /**
         * @function
         * @param {Object} data
         */
        draw: function (data) {

            var local = {
                tickPoints: $.toastchart.helper.getXTickPoints(data)
            };

            // Ticks for individual days
            for (var i = 0; i < data.data.x[0].length; i++) {
                local.tick = '';
                if (typeof data.axis.x.tickRenderer === 'function') {
                    local.tick = data.axis.x.tickRenderer(i, data);
                }
                local.$div = $('<div class="toastchart-xlegend-day" />');
                local.$div.css({
                    left: i * data.axis.x.distance
                });
                local.$div.html(local.tick);
                data.$xaxis.append(local.$div);
            }

            for (var i = 0; i < local.tickPoints.length; i++) {

                if (typeof data.axis.x.renderer === 'function') {
                    local.tickPoints[i].number = data.axis.x.renderer(local.tickPoints[i], data);
                } else if (data.axis.x.tickInterval && data.axis.x.tickInterval === 'month') {
                    local.tickPoints[i].number = $.toastchart.helper.getMonth(local.tickPoints[i].number);
                }

                local.$div = $('<div class="toastchart-xlegend">');
                local.$div.css({
                    left: local.tickPoints[i].x
                });
                local.$div.html(local.tickPoints[i].number);
                data.$xaxis.append(local.$div);

            }

        },

        /**
         * @function
         * @param {Object} data
         */
        render: function (data) {
            var local = {
                $xaxis: $('<div class="toastchart-xaxis" />')
            };
            data.$xaxis = $('<div class="toastchart-xaxis-inner" />');
            local.$xaxis.css({
                left: data.style.margin.left
            });
            local.$xaxis.append(data.$xaxis);
            data.$this.append(local.$xaxis);
            controller.draw(data);
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

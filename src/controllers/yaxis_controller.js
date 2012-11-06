$.toastchart = $.toastchart || {};
$.toastchart.controller = $.toastchart.controller || {};
$.toastchart.controller.yaxis = (function () {

    var controller = {

        /**
         * @function
         * @param {Object} data
         */
        draw: function (data) {

            var local = {
                tickPoints: $.toastchart.helper.getYTickPoints(data)
            };

            for (var i = 0; i < local.tickPoints.length; i++) {

                if (typeof data.axis.y.renderer === 'function') {
                    local.tickPoints[i].number = data.axis.y.renderer(local.tickPoints[i], data);
                } else if (data.axis.y.tickInterval && data.axis.y.tickInterval === 'month') {
                    local.tickPoints[i].number = $.toastchart.helper.getMonth(local.tickPoints[i].number);
                }

                local.$div = $('<div class="toastchart-ylegend">');
                local.$div.css({
                    top: local.tickPoints[i].y
                });
                local.$div.html(local.tickPoints[i].number);
                data.$yaxis.append(local.$div);

            }

        },

        /**
         * @function
         */
        render: function (data) {
            var local = {
                $yaxis: $('<div class="toastchart-yaxis" />')
            };
            local.$yaxis.css({
                top: data.style.margin.top
            });
            data.$yaxis = $('<div class="toastchart-yaxis-inner" />');
            local.$yaxis.append(data.$yaxis);
            data.$this.append(local.$yaxis);
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

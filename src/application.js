/**
 * @author Tyson Cadenhead | tysoncadenheadAtGmailDotCom | tysonlloydcadenhead.com
 * @description This is a charting library using the HTML5 canvas
 * @copyright Copyright (c) 2012 Moontoast, Inc.
 * @license http://alphabase.moontoast.com/licenses/bsd-3-clause.txt BSD 3-Clause License
 *
 * BUILDING THIS PROJECT:
 * This requires node and r.js to build. From the src/ directory, run:
 *
 *   node /path/to/r.js -o name=application out=../jquery-toastchart.js
 *
 */
require([
    'config/main',
    'helpers/canvas',
    'helpers/math',
    'controllers/xaxis_controller',
    'controllers/yaxis_controller',
    'controllers/grid_controller',
    'controllers/linegraph_controller'
], function () {

    $.fn.toastchart = function (options) {

        var defaultColors = ['51, 102, 255', '102, 51, 255', '204, 51, 255', '255, 51, 204', '255, 51, 102', '255, 102, 51', '255, 204, 51', '204, 255, 51', '102, 255, 51', '51, 255, 102', '51, 255, 204', '51, 204, 255'];

        // The chart
        options.$this = $(this).addClass('toastchart');
        options.$chart = $(this).append('<div class="toastchart-graph" />').find('.toastchart-graph');
        options.$canvas = $('<div class="toastchart-canvases" />');
        if (!options.$this.width()) {
            options.$this.css({
                width: '100%'
            });
        }
        if (options.$this.height() < 50) {
            options.$this.css({
                height: '100%'
            });
        }

        // Default options
        options.style = options.style || {};
        options.style.margin = options.style.margin || {};
        options.style.margin.top = options.style.margin.top || 0;
        options.style.margin.bottom = options.style.margin.bottom || 30;
        options.style.margin.left = options.style.margin.left || 45;
        options.style.margin.right = options.style.margin.right || 35;
        options.style.padding = options.style.padding || {};
        options.style.padding.top = options.style.padding.top || 0;
        options.style.padding.bottom = options.style.padding.bottom || 0;
        options.style.padding.left = options.style.padding.left || 0;
        options.style.padding.right = options.style.padding.right || 0;
        options.style.height = options.style.height || $(this).height() - options.style.margin.top - options.style.margin.bottom;
        options.style.width = options.style.width || $(this).width() - options.style.margin.left- options.style.margin.right;

        $(document).ready(function () {

            // Extend the X and Y axis
            options.axis = options.axis || {};

            // X Axis
            options.axis.x = $.extend({
                type: (typeof $.toastchart.helper.getFirstValue(options, 'x') === 'object') ? 'date' : 'number',
                color: '#000',
                lineWidth: 1,
                legendColor: '#333',
                font: '9pt Arial',
                space: 35,
                tickInterval: (typeof $.toastchart.helper.getFirstValue(options, 'x') === 'object') ? 'month' : undefined
            }, options.axis.x);

            // Y Axis
            options.axis.y = $.extend({
                type: (typeof $.toastchart.helper.getFirstValue(options, 'y') === 'object') ? 'date' : 'number',
                ticks: 25,
                color: '#000',
                lineWidth: 1,
                lineSpacing: 3,
                lineType: 'dashed',
                legendColor: '#333',
                font: '9pt Arial',
                tickInterval: (typeof $.toastchart.helper.getFirstValue(options, 'y') === 'object') ? 'month' : null
            }, options.axis.y);

            // Calculate the end and start
            options = $.toastchart.helper.calculateStartAndEnd(options);

            // Calculate the X and Y axis
            options.axis.y = $.extend(options.axis.y, $.toastchart.helper.getYAxis(options));
            options.axis.x = $.extend(options.axis.x, $.toastchart.helper.getXAxis(options));

            // Default Series Handlers
            options.series = options.series || [];
            for (var i = 0; i < options.data.y.length; i++) {
                options.series[i] = $.extend({
                    color: 'rgba(' + defaultColors[i] + ', 0.4)',
                    name: '',
                    strokeStyle: 'rgba(' + defaultColors[i] + ', 0.9)',
                    lineWidth: 4,
                    hidden: false
                }, options.series[i]);
            }

            // Get the graph points
            options.points = $.toastchart.helper.getGraphPoints(options);

            // The CSS for the chart
            options.$chart.css({
                height: options.style.height - 2,
                width: options.style.width - 2,
                left: options.style.margin.left,
                top: options.style.margin.top
            });
            options.$chart.append(options.$canvas);

            // Public Methods
            options.disableHighlight = function () {
                $('body').trigger('toastchart-highlight-disable');
            };
            options.enableHighlight = function () {
                $('body').trigger('toastchart-highlight-enable');
            };

            // Trigger the init event
            $('body').trigger('toastchart-init', options);

            // Fire off the updated event
            if (options.updated && typeof options.updated === 'function') {
                options.updated(options);
            }

        });

        // Return the options
        return options;

    };

    // Trigger the ready event
    $('body').trigger('toastchart-ready');

});

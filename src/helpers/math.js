$.toastchart = $.toastchart || {};
$.toastchart.helper = $.extend($.toastchart.helper, {

    /**
     * @function
     */
    getMonth: function(m) {
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[m];
    },

    /**
     * @function
     * @param {Array} arr
     */
    getHighestNumber: function (arr) {
        var max = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    },

    /**
     * @function
     * @param {Object} params An object of search params
     */
    max: function (params) {
        var max = 0, type = 'number', number;
        for (i = 0; i < params.length; i++) {
            if (params[i] && params[i].getTime) {
                type = 'date';
                number = params[i].getTime();
            } else {
                number = params[i];
            }
            if (max < number) {
                max = number;
            }
        }
        if (type === 'date') {
            max = new Date(max);
        }
        return max;
    },

    /**
     * @function
     * @param {Object} params An object of search params
     */
    min: function (params) {
        var min = null, type = 'number', number;
        for (i = 0; i < params.length; i++) {
            if (params[i] && params[i].getTime) {
                type = 'date';
                number = params[i].getTime();
            } else {
                number = params[i];
            }
            if (min > number || min === null || min === undefined) {
                min = number;
            }
        }
        if (type === 'date') {
            min = new Date(min);
        }
        return min;
    },

    /**
     * @function
     * @param {Object} params An object of search params
     */
    mergeArrays: function (arr) {
        var newArr = arr[0];
        for (i = 1; i < arr.length; i++) {
            newArr = newArr.concat(arr[i]);
        }
        return newArr;
    },

    /**
     * @function
     * @param {Date} a
     * @param {Date} b
     */
    compareDates: function (a, b) {
        if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() == b.getDate()) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * @function
     * @param {Object / Int} start
     * @param {Object / Int} end
     */
    getDifference: function (start, end) {
        // Date
        if (start && typeof start === 'object') {
            return Math.round(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            // Number
        } else {
            return end - start;
        }
    },

    /**
     * @function
     * @param {Object} obj
     */
    getYAxis: function (obj) {
        var local = {
            min: $.toastchart.helper.min($.toastchart.helper.mergeArrays(obj.data.y)),
            max: $.toastchart.helper.max($.toastchart.helper.mergeArrays(obj.data.y))
        };
        if (local.min === local.max) {
            local.max = 2000;
        }
        local.difference = $.toastchart.helper.getDifference(local.min, local.max);
        local.distance = (obj.style.height - obj.style.padding.top - obj.style.padding.bottom) / local.difference;
        return local;
    },

    /**
     * @function
     * @param {Object} obj
     */
    getXAxis: function (obj) {
        var local = {
            min: $.toastchart.helper.min($.toastchart.helper.mergeArrays(obj.data.x)),
            max: $.toastchart.helper.max($.toastchart.helper.mergeArrays(obj.data.x))
        };
        local.difference = $.toastchart.helper.getDifference(local.min, local.max);
        local.distance = (obj.style.width - obj.style.padding.left - obj.style.padding.right) / local.difference;
        return local;
    },

    /**
     * @function
     * @param {Object} point
     * @param {Object} obj
     */
    getPointY: function (point, obj) {

        // Local variables
        var local = {
            verticalSpace: obj.ignoreAxisSpacing || 0,
            y: point.y
        };

        // Ignoring the axis requires some additional work
        if (obj.ignoreAxis) {
            local.max = $.toastchart.helper.getHighestNumber(point.series);

            // If the axis is not ignored, the max is shared between lines
        } else {
            local.max = obj.axis.y.max;
        }

        // More params are set
        local.min = obj.min || 0;

        // If the point is null, we'll need to estimate it based on the valid points before and after it
        if (local.y === null) {

            // These will be defined.... just wait and see
            local.pointStart = null;
            local.pointEnd = null;

            // Get the pointEnd
            for (var i = point.lineIndex; i < obj.data.y[point.seriesIndex].length; i++) {
                if (local.pointEnd === null && obj.data.y[point.seriesIndex][i] !== null && obj.data.y[point.seriesIndex][i] !== undefined) {
                    local.pointEnd = obj.data.y[point.seriesIndex][i];
                    local.pointEndIndex = i;
                }
            }

            // Get the pointStart
            for (var i = point.lineIndex; i > 0; i--) {
                if (local.pointStart === null && obj.data.y[point.seriesIndex][i] !== null && obj.data.y[point.seriesIndex][i] !== undefined) {
                    local.pointStart = obj.data.y[point.seriesIndex][i];
                    local.pointStartIndex = i;
                }
            }

            local.nullPointDifference =  (local.pointEnd - local.pointStart) / parseInt(local.pointEndIndex - local.pointStartIndex);
            local.nullPointY = local.pointStart - (local.nullPointDifference * (local.pointStartIndex - point.lineIndex));
            local.point = $.toastchart.helper.getDifference(local.nullPointY, local.max);

            // If we have a real number, just estimate the point
        } else {
            if (obj.ignoreAxis) {
                var multiplyY = 0.6 + (0.1 *  point.seriesIndex);
                local.y = local.y * multiplyY;
            }
            local.point = $.toastchart.helper.getDifference(local.y, local.max);
        }

        // Get the difference and distance
        local.difference = $.toastchart.helper.getDifference(local.min, local.max);
        local.distance = (obj.style.height - obj.style.padding.top - obj.style.padding.bottom) / local.difference;

        return (local.point * local.distance);

    },

    /**
     * @function
     * @param {Object} point
     * @param {Object} obj
     */
    getPointX: function (point, obj) {

        var local = {
            point: $.toastchart.helper.getDifference(obj.axis.x.min, point.x)
        };
        return local.point * obj.axis.x.distance;

    },

    /**
     * @function
     * @param {Object} point
     * @param {Object} data
     */
    getYPixlePoint: function (point, data) {
        return parseInt((data.style.height - data.style.padding.bottom - point) / data.axis.y.distance);
    },

    /**
     * @function
     * @param {Object} data
     */
    getYTickPoints: function (data) {

        var ticksArr = [], currentMonth = null, totalMax;

        if (data.axis.y.tickInterval) {

            if (data.axis.y.tickInterval === 'month') {
                for (var i = 0; i < data.data.y[0].length; i++) {
                    if (currentMonth !== data.data.y[0][i].getMonth()) {
                        ticksArr.push({
                            y: $.toastchart.helper.getPointY({
                                y: data.data.x[0][i],
                                seriesIndex: i,
                                lineIndex: 0
                            }, data),
                            number: data.data.y[0][i].getMonth()
                        });
                        currentMonth = data.data.y[0][i].getMonth();
                    }
                }
            } else {
                // TODO: Write logic for number-based tickInterval
            }

        } else {

            for (var i = 0; i < data.axis.y.ticks; i++) {
                ticksArr.push({
                    y: (data.style.height / data.axis.y.ticks) * i,
                    number: $.toastchart.helper.getYPixlePoint((data.style.height / data.axis.y.ticks) * i, data)
                });
            }

        }

        return ticksArr;

    },

    /**
     * @function
     * @param {Object} data
     */
    calculateStartAndEnd: function (data) {

        var end, difference;

        if (data.axis.x.type && data.axis.x.type === 'date') {
            for (var j = 0; j < data.data.x.length; j++) {

                end = data.data.x[j].length - 1;

                // If the end is farther out than the last date in the array
                if (data.axis.x.end && data.axis.x.end > data.data.x[j][end]) {
                    difference = $.toastchart.helper.getDifference(data.axis.x.end, data.data.x[j][end]);
                    for (var i = 0; i <= difference; i++) {
                        var date = new Date();
                        date.setFullYear(data.data.x[j][end].getFullYear());
                        date.setMonth(data.data.x[j][end].getMonth());
                        date.setDate(data.data.x[j][end].getDate() + i);
                        data.data.x[j][end+ i] = date;
                    }
                }
            }
        }

        return data;

    },

    /**
     * @function
     * @param {Object} data
     */
    getXTickPoints: function (data) {

        var ticksArr = [], currentMonth = null;

        if (data.axis.x.tickInterval) {

            if (data.axis.x.tickInterval === 'month') {

                // Loop over the dates
                for (var i = 0; i < data.data.x[0].length; i++) {
                    if (currentMonth !== data.data.x[0][i].getMonth()) {
                        ticksArr.push({
                            x: $.toastchart.helper.getPointX({
                                    x: data.data.x[0][i]
                                }, data),
                                number: data.data.x[0][i].getMonth()
                        });
                        currentMonth = data.data.x[0][i].getMonth();
                    }
                }
            } else {
                // TODO: Write logic for number-based tickInterval
            }

        } else {
            // TODO: Write logic for number of ticks specified in data.axis.x.ticks. IE: data.axis.x.ticks = 10;
        }

        return ticksArr;

    },

    /**
     * @function
     * @param {Object}
     */
    getFirstValue: function (data, axis) {

        // The variable to return
        var rtn;

        // If the first y value is not null or undefined, return it
        if (data.data[axis][0][0]) {
            rtn = data.data[axis][0][0];

            // Otherwise, loop over the values to get the first one with a value
        } else {

            // Loop over the lines
            for (var i = 0; i < data.data[axis].length && !rtn; i++) {

                // Loop over the points
                for (var j = 0; j < data.data[axis][i].length && !rtn; j++) {

                    // Set the return variable if the point is defined and the variable is not set yet
                    if (!rtn && (data.data[axis][i][j] || data.data[axis][i][j] === 0)) {
                        rtn = data.data[axis][i][j];
                    }

                }

            }

        }

        // Return the Y value
        return rtn;

    },

    /**
     * @function
     * @param {String} color
     * @param {Float} shaded
     */
    getShadedColor: function (color, shade) {
        color = color.split(',');
        color[3] = shade + ' )';
        return String(color);
    },

    /**
     * @function
     * @param {Object} data
     */
    getGraphPoints: function (data) {
        var points = [];
        for (var i = 0; i < data.data.x.length; i++) {
            points.push([]);
            for (var j = 0; j < data.data.x[i].length; j++) {
                points[i].push({
                    value: data.data.y[i][j],
                    series: i,
                    index: j,
                    x: data.data.x[i][j],
                    y: data.data.y[i][j],
                    top: parseInt($.toastchart.helper.getPointY({
                        y: data.data.y[i][j],
                        series: data.data.y[i],
                        lineIndex: j,
                        seriesIndex: i
                    }, data) + data.style.padding.top),
                    left: parseInt($.toastchart.helper.getPointX({
                        x: data.data.x[i][j]
                    }, data) + data.style.padding.left)
                });
            }
        }
        return points;
    }

});

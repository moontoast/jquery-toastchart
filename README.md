# jquery-toastchart

jQuery ToastChart is a line-graph charting library that is designed to show all types of data using the [HTML5 canvas element](http://en.wikipedia.org/wiki/Canvas_element).  While it was originally created for [Moontoast](http://moontoast.com/) to highlight our ever-expanding analytics, we feel that it is a valuable and flexible tool that should be shared with the community.

<p align="center">
    <a href="http://moonbasealpha.s3.amazonaws.com/projects/jquery-toastchart/toastchart1.jpg"><img src="http://moonbasealpha.s3.amazonaws.com/projects/jquery-toastchart/toastchart1.jpg" alt="ToastChart - Figure 1" title="ToastChart - Figure 1" width="600"/></a>
</p>

<p align="center">
    <a href="http://moonbasealpha.s3.amazonaws.com/projects/jquery-toastchart/toastchart2.jpg"><img src="http://moonbasealpha.s3.amazonaws.com/projects/jquery-toastchart/toastchart2.jpg" alt="ToastChart - Figure 2" title="ToastChart - Figure 2" width="300"/></a>
    <a href="http://moonbasealpha.s3.amazonaws.com/projects/jquery-toastchart/toastchart3.jpg"><img src="http://moonbasealpha.s3.amazonaws.com/projects/jquery-toastchart/toastchart3.jpg" alt="ToastChart - Figure 3" title="ToastChart - Figure 3" width="300"/></a>
</p>


## Examples
* [Basic](http://htmlpreview.github.com/?https://github.com/tysoncadenhead/jquery-toastchart/blob/master/examples/basic.html)
* [Advanced](http://htmlpreview.github.com/?https://github.com/tysoncadenhead/jquery-toastchart/blob/master/examples/advanced.html)
* [Dark Theme](http://htmlpreview.github.com/?https://github.com/tysoncadenhead/jquery-toastchart/blob/master/examples/dark-theme.html)
* [Pink Theme](http://htmlpreview.github.com/?https://github.com/tysoncadenhead/jquery-toastchart/blob/master/examples/pink-theme.html)
* [Line Theme](http://htmlpreview.github.com/?https://github.com/tysoncadenhead/jquery-toastchart/blob/master/examples/line-theme.html)


## Installation

The only hard dependencies of ToastChart are [jQuery](http://jquery.com/) and [RequireJS](http://requirejs.org/).

A Basic setup would look something like this:

```javascript
$('body').bind('toastchart-ready', function () {
    $('#my_graph').toastchart({
        data: data
    });
});
```

Make sure you wrap the `toastchart` method in the `toastchart-ready` event listener so that it doesn't try to render too early.

For a full HTML example of how the setup should look, look under `examples/basic.html`.

For more advanced setup, look at `examples/advanced.html`.


## API

All of these config options can be passed into `toastchart` as an object:


### data {Object}

_Required._  
The data that will be rendered to the graph.  This can include:

* **x** {Array}  
The data for the "x" axis.  Each line on the graph should be an array with the values as items in the array.

* **y** {Array}  
The data for the "y" axis.  Each line on the graph should be an array with the values as items in the array.


### axis {Object}

This configures the style and functionality of the x and y axis, which may include:


##### **x** {Object}

The x axis configuration, which has the following properties:

* **type** {String}  
The type to expect for the items in the "x" array.  This can be "date" or "number".

* **start** {Date or Int}  
If you don't want to display all of the data passed in to the chart, you can specify a date or number for the x axis to start at

* **end** {Date or Int}  
A date or number that the graph will end at

* **color** {String}  
The color for the lines in the axis

* **lineWidth** {Int}  
The width of the horizontal lines overlaying the graph

* **lineType** {String}  
The type of line to render.  This can be "solid" or "dashed".

* **legendColor** {String}  
The font color to use for the legends under the chart

* **font** {String}  
The font to use for the lengends under the chart (ie: "9pt Arial")

* **space** {Int}  
The space to put between each x axis line

* **tickInterval** {String / Int}  
How often to display the lines and legends on the x axis.  If the x axis is using dates, valid values are "day", "week", "month" and "year".  If the x axis is using numbers, you can use a number as a delimeter.

* **renderer** {Function} (x)  
A renderer function to render the legend. The x line is passed in.  This method expects you to return a string with your own markup.  For example:  

        renderer: function (n) {
            return '<div class="month-tickmark"></div><div>Hi!</div>';
        }


* **tickRenderer** {Function} (x, data)  
This renderer is called everytime a tickmark is reached.  The x line and data object are passed in.  This method expects you to return a string with your own markup.  For example:  

        tickRenderer: function (n, data) {
            return ':' + n;
        }


##### y {Object}

The y axis configuration, which has the following properties:

* **type** {String}  
The type to expect for the items in the "y" array.  This can be "date" or "number". 

* **renderer** {Function} (y)  
A renderer function to render the legend. The y line is passed in.  This method expects you to return a string with your own markup.

* **ticks** {Int}  
The number of y axis lines to overlay on top of the graph

* **color** {String}  
The color for the lines in the axis

* **tickInterval** {String / Int}  
How often to display the lines and legends on the y axis.  If the y axis is using dates, valid values are "day", "week", "month" and "year".  If the x axis is using numbers, you can use a number as a delimetrer.

* **lineWidth** {Int}  
The width of the horizontal lines overlaying the graph

* **lineType** {String}  
The type of line to render.  This can be "solid" or "dashed".

* **legendColor** {String}  
The font color to use for the legends under the chart

* **lineSpacing** {Int}  
The space to put between each y axis line

* **font** {String}  
The font to use for the lengends under the chart (ie: "9pt Arial")

* **min** {Date or Int}  
The lowest point of data the chart will display

* **max** {Date or Int}  
The highest point of data the chart will display


### series {Array}

Each individual series that is rendered to the chart can individually be configured with this array.  The index of the series will be applied to the "x" data of the same index.  The series items may each include:

* **color** {String}  
The color to apply to the line fill.  This can be a hex value or an alpha.

* **name** {String}  
The name of the series.

* **strokeStyle** {String}  
The color for the graph line itself

* **lineWidth** {Int}  
The width of the graph line.  Defaults to 2.

* **hidden** {Boolean}  
If this is false, the series will not be visible

* **hoverOn** {Function} (point, graph)  
This event is fire when the user hovers over a point on the series line.  The point that is hovered over and the graph object are both passed into this method.


### style {Object}

Style to be applied to the entire graph

* **margin** {Object}  
This is the margin that will be applied inside of the graph element but outside of the graph itself.
    * **top** {Int}
    * **left** {Int}
    * **right** {Int}
    * **top** {Int}
* **padding** {Object}  
This is the padding that will be applied inside the graph itself.
    * **top** {Int}
    * **left** {Int}
    * **right** {Int}
    * **top** {Int}


### ignoreAxis {Boolean}

If this is set to true, all of the series top points will touch the top of the graph regardless of their value.


### ignoreAxisSpacing {Int}

The amount of spacing to put between each series peak if ignoreAxis is set to true.  This keeps the peaks from overlaying eachother and becoming illegible.


### showPoints {Boolean}

If this is set to true, the dots for each point will be visible


### hoverOff {Function} (data)

This method fires when the user navigates off of a graph point


### updated {Function} (options)

This method is fired when the chart has finished updating


## Building the Project

This requires node and r.js to build. From the `src/` directory, run:

```
node /path/to/r.js -o name=application out=../jquery-toastchart.js
```


## License

Copyright (c) 2012, Moontoast, LLC  
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of Moontoast, LLC nor the names of its contributors may
  be used to endorse or promote products derived from this software without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

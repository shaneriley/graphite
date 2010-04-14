Cherry Pie - A Simple Pie Chart Library
================================

Usage
----------
Cherry Pie uses the jQuery library. Any version from 1.2.6 and up SHOULD work, however only the included version (1.4.2) has been tested.

Cherry Pie assumes the entire canvas is to be used for the pie chart, and will determine width and height by either CSS or HTML attributes.

To create a new pie chart, create a new instance of Cherry Pie and pass in either a DOM element or jQuery object. This is necessary for each canvas element, and if a collection of elements is passed only the first will be used. To construct a new pie chart:

`var draw = new CherryPie(element, colors)`

Cherry Pie will generate random pairs of complimentary colors for you or you can pass in an optional array of your own colors as a second argument.

Once you've created a new Cherry Pie canvas, there are two methods available. The first performs the actual drawing of the pie chart. To draw the chart, you must pass in an array of your data to be rendered.

`draw.pie(data)`

The second method creates the legend color swatches. Currently, you need to pass in a table as a jQuery object for this to work. A span with the class of indicator is prepended to the first td of each tr. Each span is given the background color of the corresponding pie slice.

`draw.legend($table)`

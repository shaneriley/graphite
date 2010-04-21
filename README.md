Cherry Pie - A Simple Chart Library
================================

Usage
----------
Cherry Pie is meant to be a bare-bones chart library that will take a set of data and an array of colors and draw either a pie or bar chart based on them. Legend icons can be optionally output within any table in the DOM. Cherry Pie uses the jQuery library. Any version from 1.2.6 and up SHOULD work, however only the included version (1.4.2) has been tested.

To create a new chart, create a new instance of Cherry Pie and pass in either a DOM element or jQuery object. This is necessary for each canvas element, and if a collection of elements is passed only the first will be used. To construct a new pie chart:

`var draw = new CherryPie(element, options)`

Options is an object that includes an array of hex colors, horizontal and vertical padding for bar charts. An exmple of the options object with all possible options:

`var options = {
  colors: ["#006666", "#cccc00", "#009999", "#336699", "#d8dee6"],
  barPaddingX: 40,
  barPaddingY: 40
};`

When drawing a pie chart, Cherry Pie assumes the entire canvas is to be used for the pie chart, and will determine width and height by either CSS or HTML attributes.

To draw the pie chart, you must pass in an array of your data to be rendered.

`draw.pie(data)`

To draw a bar chart, the same array is passed in to the bar method.

`draw.bar(data)`

The legend method creates the legend color swatches. Currently, you need to pass in a table as a jQuery object for this to work. A span with the class of indicator is prepended to the first td of each tr. Each span is given the background color of the corresponding pie slice. Note that you will either need to create your own CSS to style the spans or copy it from the examples.

`draw.legend($table)`

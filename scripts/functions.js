$(function() {
  var $canvas = $("canvas");
  var $table = $("table");
  var colors = ["#336699", "#cccc00", "#d8dee6", "#009999", "#006666"];
  var draw = new CherryPie($canvas, colors);
  var data = [];

  // Load your data into an array
  $table.find("tr").each(function(i) {
    if ($("td:last", this).length) {
      data.push(parseInt($("td:last", this).text(), 10));
    }
  });
  draw.pie(data);
  draw.legend($table);
});
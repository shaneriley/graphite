$(function() {
  var $canvas = $("canvas");
  var $table = $("table");
  var colors = ["#006666", "#cccc00", "#009999", "#d8dee6", "#336699"];
  var draw = new CherryPie($canvas);
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
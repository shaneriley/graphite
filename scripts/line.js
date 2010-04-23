$(function() {
  var $canvas = $("canvas");
  var $table = $("table");
  var options = {
    colors: ["#006666", "#cccc00", "#009999", "#336699", "#d8dee6"],
    barPaddingX: 40,
    barPaddingY: 40,
    connectingLineColor: "#333333",
    order: "desc"
  };
  var draw = new CherryPie($canvas, options);
  var data = [];

  // Load your data into an array
  $table.find("tr").each(function(i) {
    if ($("td:last", this).length) {
      data.push(parseInt($("td:last", this).text(), 10));
    }
  });
  draw.line(data);
  draw.legend($table);
});
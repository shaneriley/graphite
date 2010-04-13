$(function() {
  var canvas = document.getElementsByTagName("canvas")[0];
  var $canvas = $(canvas);
  var $table = $("table");
  canvas.width = $canvas.width();
  canvas.height = $canvas.height();

  function Draw(canvas) {
    var r = canvas.getContext("2d");
    var opts = arguments[1] || {};
    this.defaults = {
      fillColor: opts.fillColor || [
        "#006666", "#cccc00", "#009999", "#d8dee6", "#336699"
      ]
    };
    this.degToRad = function(i) {
      return (Math.PI / 180) * i;
    };
    this.radToDeg = function(i) {
      return i * (180 / Math.PI);
    };
    this.pie = function(data) {
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = (canvas.width > canvas.height) ? canvas.height / 2 : canvas.width / 2;
      var startRad = this.degToRad(270);
      var endRad, total = 0;
      for (var entry in data) {
        total += data[entry];
      }
      for (var i = 0, len = data.length; i < len; i++) {
        endRad = startRad + this.degToRad((data[i] / total) * 360);
        r.beginPath();
        r.arc(x, y, radius, startRad, endRad, false);
        r.fillStyle = this.defaults.fillColor[i % this.defaults.fillColor.length];
        r.lineTo(x, y);
        r.closePath();
        r.fill();
        startRad = endRad;
      }
    };
    this.legend = function($table) {
      var e;
      var j = 0;
      var colors = this.defaults.fillColor;
      $table.find("tr").each(function(i) {
        if ($("td", this).length) {
          e = $("<span></span>").addClass("legend");
          e.css("backgroundColor", colors[j]);
          $("td:first", $(this)).prepend(e);
          j++;
        }
      });
    };
  };

  var draw = new Draw(canvas);
  var data = [];
  $table.find("tr").each(function(i) {
    i--;
    if ($("td:last", this).length) {
      data[i] = parseInt($("td:last", this).text(), 10);
    }
  });
  draw.pie(data);
  draw.legend($table);
});
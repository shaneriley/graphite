function Graphite(canvas) {
  canvas = canvas.length ? canvas[0] : canvas;
  canvas.width = $(canvas).width();
  canvas.height = $(canvas).height();
  var r = canvas.getContext("2d");
  var opts = arguments[1] || null;
  this.defaults = {
    fillColor: opts.colors || [],
    barPaddingX: opts.barPaddingX || 40,
    barPaddingY: opts.barPaddingY || 40,
    connectingLineColor: opts.connectingLineColor || "#000000",
    order: opts.order || ""
  };
  var originalData = [];
  var mappedColors = [];

  this.degToRad = function(i) {
    return (Math.PI / 180) * i;
  };

  this.radToDeg = function(i) {
    return i * (180 / Math.PI);
  };

  this.pie = function(data) {
    originalData = data.slice(0);
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var radius = (canvas.width > canvas.height) ? canvas.height / 2 : canvas.width / 2;
    var startRad = this.degToRad(270);
    var endRad, total = 0, color;
    if (!this.defaults.fillColor.length) {
      this.defaults.fillColor = this.generateColors(data.length);
    }
    for (var entry in data) {
      total += data[entry];
    }
    for (var i = 0, len = data.length; i < len; i++) {
      color = this.defaults.fillColor[i % this.defaults.fillColor.length];
      endRad = startRad + this.degToRad((data[i] / total) * 360);
      r.beginPath();
      r.arc(x, y, radius, startRad, endRad, false);
      r.fillStyle = color;
      mappedColors[data[i]] = color;
      r.lineTo(x, y);
      r.closePath();
      r.fill();
      startRad = endRad;
    }
  };

  this.legend = function($table) {
    var e, j = 0;
    var colors = this.defaults.fillColor;
    $table.find("tr").each(function(i) {
      if ($("td", this).length) {
        e = $("<span></span>").addClass("legend");
        e.css("backgroundColor", mappedColors[originalData[j]]);
        $("td:first", $(this)).prepend(e);
        j++;
      }
    });
  };

  this.bar = function(data) {
    originalData = data.slice(0);
    var total = 0, average = 0, increment, y_end, color;
    var x_start = this.defaults.barPaddingX + .5;
    var y_start = canvas.height - this.defaults.barPaddingY;
    var bar_width = (canvas.width - (this.defaults.barPaddingX * 2)) / data.length;
    var order = this.defaults.order.toLowerCase();
    for (var entry in data) {
      total += data[entry];
    }
    if (order) {
      if (order === "asc" || order === "ascend" || order === "ascending") {
        data.sort(function(a,b) {
          return a - b;
        });
      }
      else if (order === "desc" || order === "descend" || order === "descending") {
        data.sort(function(a,b) {
          return b - a;
        });
      }
    }
    var sorted = data.slice(0);
    sorted.sort(function(a,b) {
      return b - a;
    });
    increment = (canvas.height - (this.defaults.barPaddingY * 2)) / sorted[0];
    this.drawAxes();
    this.barLabels(sorted[0], 4);
    for (var entry in data) {
      color = this.defaults.fillColor[entry % this.defaults.fillColor.length];
      y_end = (data[entry] * increment);
      r.beginPath();
      r.strokeStyle = "#222222";
      r.strokeRect(x_start, y_start, bar_width, -y_end);
      r.fillStyle = color;
      mappedColors[data[entry]] = color;
      r.fillRect(x_start, y_start, bar_width, -y_end);
      x_start += bar_width;
    }
    average = total / data.length;
    var avg_y = (canvas.height - this.defaults.barPaddingY) - (average * increment);
    this.drawAverage(avg_y);
  };

  this.barLabels = function(max, steps) {
    var height = canvas.height - this.defaults.barPaddingY * 2;
    var increment = height / steps;
    var label = max / steps;
    var x_max = canvas.width - this.defaults.barPaddingX;
    r.beginPath();
    r.strokeStyle = "#cccccc";
    r.textBaseline = "middle"
    r.font = "normal 12px Arial, Helvetica, sans-serif";
    r.textAlign = "right";
    var y_pos = this.defaults.barPaddingY + height;
    for (var i = 0; i <= steps; i++) {
      r.fillText(label * i, this.defaults.barPaddingX - 5, y_pos);
      r.moveTo(this.defaults.barPaddingX - 2, y_pos + .5);
      r.lineTo(x_max, y_pos + .5);
      r.stroke();
      y_pos -= increment;
    }
  };

  this.drawAverage = function(avg_y) {
    if (avg_y % 1 === 0) {
      avg_y += .5;
    }
    r.beginPath();
    r.strokeStyle = "#ff0000";
    r.moveTo(this.defaults.barPaddingX + .5, avg_y);
    r.lineTo((canvas.width - this.defaults.barPaddingX), avg_y);
    r.stroke();
    r.beginPath();
    r.fillStyle = "#000000";
    r.font = "normal 11px Arial, Helvetica, sans-serif"
    r.textAlign = "left";
    r.fillText("Avg.", (canvas.width - (this.defaults.barPaddingX - 2)), avg_y);
  };

  this.drawAxes = function() {
    var x = this.defaults.barPaddingX + .5;
    var y = canvas.height - (this.defaults.barPaddingY - .5);
    var width = canvas.width - (this.defaults.barPaddingX - .5);
    var height = this.defaults.barPaddingY + .5;
    r.beginPath();
    r.strokeStyle = "#000000";
    r.moveTo(width, y);
    r.lineTo(x, y);
    r.lineTo(x, height);
    r.stroke();
  };

  this.drawGrid = function() {
    var x_space = arguments[0] || 20;
    var y_space = arguments[1] || 20;
    var x_length = canvas.height - this.defaults.barPaddingX;
    var y_length = canvas.width - this.defaults.barPaddingY;
    r.strokeStyle = "#e0e0e0";
    r.beginPath();
    for (var i = this.defaults.barPaddingX, j = x_length - y_space; i <= j; i += y_space) {
      r.moveTo(this.defaults.barPaddingX, (i + .5));
      r.lineTo(y_length, (i + .5));
    }
    r.stroke();
    r.beginPath();
    for (var i = this.defaults.barPaddingY + x_space, j = y_length; i <= j; i += x_space) {
      r.moveTo((i + .5), this.defaults.barPaddingY + .5);
      r.lineTo((i + .5), x_length);
    }
    r.stroke();
  };

  this.line = function(data) {
    originalData = data.slice(0);
    var total = 0, average = 0, increment, y_start, y_end, color;
    var x_start = this.defaults.barPaddingX + .5;
    var bar_width = (canvas.width - (this.defaults.barPaddingX * 2)) / data.length;
    var y_length = canvas.height - this.defaults.barPaddingY;
    var order = this.defaults.order.toLowerCase();
    for (var entry in data) {
      total += data[entry];
    }
    if (order) {
      if (order === "asc" || order === "ascend" || order === "ascending") {
        data.sort(function(a,b) {
          return a - b;
        });
      }
      else if (order === "desc" || order === "descend" || order === "descending") {
        data.sort(function(a,b) {
          return b - a;
        });
      }
    }
    var sorted = data.slice(0);
    sorted.sort(function(a,b) {
      return b - a;
    });
    increment = (canvas.height - (this.defaults.barPaddingY * 2)) / sorted[0];
    this.barLabels(sorted[0], 4);
    this.drawAxes();
    y_end = y_length - (data[0] * increment);
    for (var i = 0, len = data.length; i < len; i++) {
      r.beginPath();
      r.strokeStyle = this.defaults.connectingLineColor;
      r.moveTo(x_start, y_end);
      x_start += bar_width;
      y_start = y_end;
      y_end = y_length - (data[i + 1] * increment);
      r.lineTo(x_start, y_end);
      r.stroke();
      r.closePath();
    }
    x_start = this.defaults.barPaddingX + .5;
    y_end = y_length - (data[0] * increment);
    for (var i = 0, len = data.length; i < len; i++) {
      color = this.defaults.fillColor[i % this.defaults.fillColor.length];
      r.beginPath();
      r.fillStyle = color;
      mappedColors[data[i]] = color;
      this.circle(x_start, y_end, 5);
      r.fill();
      r.closePath();
      x_start += bar_width;
      y_end = y_length - (data[i + 1] * increment);
    }
    average = total / data.length;
    var avg_y = (canvas.height - this.defaults.barPaddingY) - (average * increment);
    this.drawAverage(avg_y);
  };

  this.circle = function(x, y, radius) {
    r.arc(x, y, radius, 0, Math.PI * 3, false);
  };
}
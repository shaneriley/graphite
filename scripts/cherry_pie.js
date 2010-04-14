function CherryPie(canvas) {
  canvas = canvas.length ? canvas[0] : canvas;
  canvas.width = $(canvas).width();
  canvas.height = $(canvas).height();
  var r = canvas.getContext("2d");
  var opts = arguments[1] || null;
  this.defaults = {
    fillColor: opts || []
  };
  this.degToRad = function(i) {
    return (Math.PI / 180) * i;
  };
  this.radToDeg = function(i) {
    return i * (180 / Math.PI);
  };
  this.pie = function(data) {
    this.data = data;
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var radius = (canvas.width > canvas.height) ? canvas.height / 2 : canvas.width / 2;
    var startRad = this.degToRad(270);
    var endRad, total = 0;
    if (!this.defaults.fillColor.length) {
      this.defaults.fillColor = this.generateColors(data.length);
    }
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
  this.hexToHsl = function(color) {
    var h, s;
    var r = parseInt(color.substring(1, 3), 16) / 255;
    var g = parseInt(color.substring(3, 5), 16) / 255;
    var b = parseInt(color.substring(5, 7), 16) / 255;
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var del_Max = max - min;
    var l = (max + min) / 2;
    var q = function(n) {
      return (((max - n) / 6) + (del_Max / 2)) / del_Max;
    };

    if (del_Max === 0) {
      h = 0;
      s = 0;
    }
    else {
      s = (l < 0.5) ? del_Max / (max + min) : del_Max / (2 - max - min);
      var del_R = q(r);
      var del_G = q(g);
      var del_B = q(b);
      if (r === max) { h = del_B - del_G; }
      else if (g === max) { h = (1 / 3) + del_R - del_B; }
      else if (b === max) { h = (2 / 3) + del_G - del_R; }

      if (h < 0) { h += 1; }
      if (h > 1) { h -= 1; }
    }
    var hsl = {
      hue: h,
      sat: s,
      lum: l
    };
    return hsl;
  };
  this.hslToHex = function(hsl) {
    var h = hsl.hue;
    var s = hsl.sat;
    var l = hsl.lum;
    var r, g, b, var_1, var_2;
    var toHex = function(n) {
      n = Math.round(n).toString(16);
      if (n.length == 1) n = "0" + n;
      return n;
    };
    if (s === 0) {
      r = l * 255;
      g = l * 255;
      b = l * 255;
    }
    else {
      var_2 = (l < 0.5) ? l * (1 + s) : (l + s) - (s * l);
      var_1 = 2 * l - var_2;
      r = 255 * this.hueToRgb(var_1, var_2, h + (1 / 3));
      g = 255 * this.hueToRgb(var_1, var_2, h);
      b = 255 * this.hueToRgb(var_1, var_2, h - (1 / 3));
    }
    r = toHex(r);
    g = toHex(g);
    b = toHex(b);
    var hex = "#" + r + g + b;
    return hex;
  };
  this.hueToRgb = function(v1, v2, vH)
  {
    if (vH < 0) { vH += 1; }
    if (vH > 1) { vH -= 1; }
    if ((6 * vH) < 1) { return (v1 + (v2 - v1) * 6 * vH); }
    if ((2 * vH) < 1) { return v2; }
    if ((3 * vH) < 2) { return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6); }
    return v1;
  };
  this.complimentaryColor = function(original) {
    var hsl = this.hexToHsl(original);
    hsl.hue = hsl.hue * 360;
    (hsl.hue < 180) ? hsl.hue = (hsl.hue + 180) / 360 : (hsl.hue - 180) / 360;
    return this.hslToHex(hsl);
  };
  this.generateColors = function(quantity) {
    var colors = [], color;
    var randomColor = function() {
      var hex = "#", n;
      for (var i = 1; i < 4; i++) {
        n = Math.floor(Math.random() * 256).toString(16);
        if (n.length == 1) { n = "0" + n; }
        hex += n;
      }
      if (hex === "#ffffff") { randomColor(); }
      return hex;
    };
    for (var i = 0; i <= quantity - 1; i++) {
      color = (i % 2 === 0) ? randomColor() : this.complimentaryColor(colors[i - 1]);
      colors.push(color);
    }
    return colors;
  };
}
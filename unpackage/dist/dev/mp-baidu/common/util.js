"use strict";
function formatTime(time) {
  if (typeof time !== "number" || time < 0) {
    return time;
  }
  var hour = parseInt(time / 3600);
  time = time % 3600;
  var minute = parseInt(time / 60);
  time = time % 60;
  var second = time;
  return [hour, minute, second].map(function(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
  }).join(":");
}
function formatLocation(longitude, latitude) {
  if (typeof longitude === "string" && typeof latitude === "string") {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
  }
  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);
  return {
    longitude: longitude.toString().split("."),
    latitude: latitude.toString().split(".")
  };
}
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};
function dateFormat(time) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1e3;
  } else if (("" + time).indexOf("-") > 0 || ("" + time).indexOf("/") > 0) {
    return time;
  }
  const d = new Date(time);
  return d.format("yyyy-MM-dd");
}
var util = {
  dateFormat,
  formatTime,
  formatLocation
};
exports.util = util;

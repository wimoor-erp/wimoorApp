"use strict";
var common_request = require("../../../common/request.js");
function getMaterialInfo(data) {
  return common_request.request({ url: "/erp/api/v1/material/getMaterialInfo", method: "GET", "data": data });
}
var materialApi = {
  getMaterialInfo
};
exports.materialApi = materialApi;

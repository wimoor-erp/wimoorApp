"use strict";
const utils_request = require("../../../utils/request.js");
function getMaterialInfo(data) {
  return utils_request.base({ url: "/erp/api/v1/material/getMaterialInfo", method: "GET", "data": data });
}
const materialApi = {
  getMaterialInfo
};
exports.materialApi = materialApi;

"use strict";
var common_request = require("../../../common/request.js");
function list(data) {
  return common_request.request({ url: "/erp/api/v1/purchase_form/list", method: "GET", "data": data });
}
function getRecdetail(data) {
  return common_request.request({ url: "/erp/api/v1/purchase_form/getRecdetail", method: "GET", "data": data });
}
function catchLogisticsInfo(data) {
  return common_request.request({ url: "/erp/api/v1/purchase_form/catchLogisticsInfo", method: "GET", "data": data });
}
function rec(data) {
  return common_request.request({ url: "/erp/api/v1/purchase_form/rec", method: "GET", "data": data });
}
var purchaseApi = {
  list,
  getRecdetail,
  catchLogisticsInfo,
  rec
};
exports.purchaseApi = purchaseApi;

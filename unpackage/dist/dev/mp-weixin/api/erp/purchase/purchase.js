"use strict";
const utils_request = require("../../../utils/request.js");
function list(data) {
  return utils_request.base({ url: "/erp/api/v1/purchase_form/list", method: "GET", "data": data });
}
function getRecdetail(data) {
  return utils_request.base({ url: "/erp/api/v1/purchase_form/getRecdetail", method: "GET", "data": data });
}
function catchLogisticsInfo(data) {
  return utils_request.base({ url: "/erp/api/v1/purchase_form/catchLogisticsInfo", method: "GET", "data": data });
}
function rec(data) {
  return utils_request.base({ url: "/erp/api/v1/purchase_form/rec", method: "GET", "data": data });
}
function clearRec(data) {
  return utils_request.base({ url: "/erp/api/v1/purchase_form/clearRec", method: "GET", "data": data });
}
const purchaseApi = {
  list,
  getRecdetail,
  catchLogisticsInfo,
  rec,
  clearRec
};
exports.purchaseApi = purchaseApi;

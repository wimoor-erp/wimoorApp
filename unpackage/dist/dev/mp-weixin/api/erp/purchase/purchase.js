"use strict";
const utils_request = require("../../../utils/request.js");
function list(data) {
  return utils_request.base.post("/erp/api/v1/purchase_form/list", data);
}
function getRecdetail(data) {
  return utils_request.base.get("/erp/api/v1/purchase_form/getRecdetail", { params: data });
}
function clearRecAll(data) {
  return utils_request.base.get("/erp/api/v1/purchase_form/clearRecAll", { params: data });
}
function catchLogisticsInfo(data) {
  return utils_request.base({ url: "/erp/api/v1/purchase/alibaba/entry/alibabainfo/catchLogisticsInfo", method: "GET", "data": data });
}
function rec(data) {
  return utils_request.base.post("/erp/api/v1/purchase_form/rec", data);
}
const purchaseApi = {
  list,
  getRecdetail,
  catchLogisticsInfo,
  rec,
  clearRecAll
};
exports.purchaseApi = purchaseApi;

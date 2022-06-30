"use strict";
var common_request = require("../../../common/request.js");
const getQuotainfo = (shipmentid) => {
  return common_request.request({ url: "/erp/api/v1/shipForm/quotainfo/" + shipmentid, method: "GET" });
};
function subShelfInventory(data) {
  return common_request.request({ url: "/erp/api/v1/warehoue/shelfInventory/sub", method: "POST", "data": data });
}
function getShipFromList(data) {
  return common_request.request({ url: "/erp/api/v1/shipForm/list", method: "POST", "data": data });
}
var quotaApi = {
  getQuotainfo,
  subShelfInventory,
  getShipFromList
};
exports.quotaApi = quotaApi;

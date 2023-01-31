"use strict";
const utils_request = require("../../../utils/request.js");
const getQuotainfo = (shipmentid) => {
  return utils_request.base({ url: "/erp/api/v1/shipForm/quotainfo/" + shipmentid, method: "GET" });
};
function subShelfInventory(data) {
  return utils_request.base({ url: "/erp/api/v1/warehoue/shelfInventory/sub", method: "POST", "data": data });
}
function getShipFromList(data) {
  return utils_request.base({ url: "/erp/api/v1/shipForm/list", method: "POST", "data": data });
}
const quotaApi = {
  getQuotainfo,
  subShelfInventory,
  getShipFromList
};
exports.quotaApi = quotaApi;

"use strict";
var common_request = require("../../../common/request.js");
const getShelfList = (data) => {
  return common_request.request({ url: "/erp/api/v1/warehoue/shelfInventory/getShelfList", method: "POST", "data": data });
};
const getShelfInventoryList = (data) => {
  return common_request.request({ url: "/erp/api/v1/warehoue/shelfInventory/getShelfInventoryList", method: "POST", "data": data });
};
const getShelfInfo = (data) => {
  return common_request.request({ url: "/erp/api/v1/warehouse/shelf/getShelfInfo", method: "GET", "data": data });
};
const invAdd = (data) => {
  return common_request.request({ url: "/erp/api/v1/warehoue/shelfInventory/add", method: "POST", "data": data });
};
const invSub = (data) => {
  return common_request.request({ url: "/erp/api/v1/warehoue/shelfInventory/sub", method: "POST", "data": data });
};
var warehouseApi = { getShelfList, getShelfInventoryList, getShelfInfo, invAdd, invSub };
exports.warehouseApi = warehouseApi;

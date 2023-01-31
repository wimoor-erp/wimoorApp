"use strict";
const utils_request = require("../../../utils/request.js");
const getShelfList = (data) => {
  return utils_request.base({ url: "/erp/api/v1/warehoue/shelfInventory/getShelfList", method: "POST", "data": data });
};
const getShelfInventoryList = (data) => {
  return utils_request.base({ url: "/erp/api/v1/warehoue/shelfInventory/getShelfInventoryList", method: "POST", "data": data });
};
const shelfInventoryOptRecord = (data) => {
  return utils_request.base({ url: "/erp/api/v1/warehouse/shelfInventoryOptRecord", method: "GET", "data": data });
};
const getShelfInfo = (data) => {
  return utils_request.base({ url: "/erp/api/v1/warehouse/shelf/getShelfInfo", method: "GET", "data": data });
};
const invAdd = (data) => {
  return utils_request.base({ url: "/erp/api/v1/warehoue/shelfInventory/add", method: "POST", "data": data });
};
const invSub = (data) => {
  return utils_request.base({ url: "/erp/api/v1/warehoue/shelfInventory/sub", method: "POST", "data": data });
};
function getWarehouseList(data) {
  return utils_request.base.get("/erp/api/v1/warehouse/list", { params: data });
}
function getWarehouseUseable() {
  return utils_request.base.get("/erp/api/v1/warehouse/getlist", { params: { "ftype": "self_usable" } });
}
function getWarehouseUnUseable() {
  return utils_request.base.get("/erp/api/v1/warehouse/getlist", { params: { "ftype": "self_unusable" } });
}
function getWarehouseTest() {
  return utils_request.base.get("/erp/api/v1/warehouse/getlist", { params: { "ftype": "self_test" } });
}
function getSelfWarehouseById(data) {
  return utils_request.base.get("/erp/api/v1/warehouse/getSelfWarehouseById", { params: data });
}
function getWarehouseNameList(data) {
  return utils_request.base.get("/erp/api/v1/warehouse/getNamelist", { params: data });
}
const warehouseApi = {
  getShelfList,
  getShelfInventoryList,
  getShelfInfo,
  invAdd,
  invSub,
  getWarehouseList,
  getWarehouseUseable,
  getWarehouseUnUseable,
  getWarehouseTest,
  getSelfWarehouseById,
  getWarehouseNameList,
  shelfInventoryOptRecord
};
exports.warehouseApi = warehouseApi;

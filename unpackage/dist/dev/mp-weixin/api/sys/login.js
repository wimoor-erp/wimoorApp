"use strict";
const utils_request = require("../../utils/request.js");
const loginWechat = (data) => {
  return utils_request.base({ url: "/auth/loginWechat", method: "GET", "data": data });
};
const getOpenUserlist = (data) => {
  return utils_request.base({ url: "/auth/getOpenUserlist", method: "GET", "data": data });
};
const unbindWechat = (data) => {
  return utils_request.base({ url: "/admin/api/v1/users/unbindWechat", method: "GET", "data": data });
};
const verifyWechatApp = (data) => {
  return utils_request.base({ url: "/auth/verifyWechatApp", method: "GET", "data": data });
};
const changeLoginWechatApp = (data) => {
  return utils_request.base({ url: "/auth/changeLoginWechatApp", method: "GET", "data": data });
};
const getAppType = () => {
  var appType = "app";
  appType = "app";
  return appType;
};
const loginApi = { loginWechat, getOpenUserlist, unbindWechat, verifyWechatApp, changeLoginWechatApp, getAppType };
exports.loginApi = loginApi;

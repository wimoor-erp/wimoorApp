"use strict";
var common_request = require("../../common/request.js");
const loginWechat = (data) => {
  return common_request.request({ url: "/auth/loginWechat", method: "GET", "data": data });
};
const getOpenUserlist = (data) => {
  return common_request.request({ url: "/auth/getOpenUserlist", method: "GET", "data": data });
};
const unbindWechat = (data) => {
  return common_request.request({ url: "/admin/api/v1/users/unbindWechat", method: "GET", "data": data });
};
const verifyWechatApp = (data) => {
  return common_request.request({ url: "/auth/verifyWechatApp", method: "GET", "data": data });
};
const changeLoginWechatApp = (data) => {
  return common_request.request({ url: "/auth/changeLoginWechatApp", method: "GET", "data": data });
};
var loginApi = { loginWechat, getOpenUserlist, unbindWechat, verifyWechatApp, changeLoginWechatApp };
exports.loginApi = loginApi;

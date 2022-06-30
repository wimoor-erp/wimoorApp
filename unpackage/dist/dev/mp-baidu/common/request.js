"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var common_vendor = require("./vendor.js");
function request(options = { url: "", method: "GET", data: {}, header: {} }) {
  return new Promise((reslove, reject) => {
    common_vendor.index.request({
      url: "https://api.wimoor.com" + options.url,
      method: options.method,
      header: __spreadValues({
        "content-type": "application/json",
        "JSessionId": common_vendor.index.getStorageSync("JSessionId")
      }, options.header),
      data: options.data,
      success: (res) => {
        if (res.data && res.data.code == "201") {
          reslove(res.data.data);
        } else if (res.data && res.data.code == "B0001") {
          common_vendor.index.showToast({
            title: res.data.msg,
            duration: 2e3,
            icon: "none"
          });
        } else if (res.data && res.data.code == "401") {
          common_vendor.index.clearStorageSync();
          common_vendor.index.navigateTo({
            url: "/pages/sys/validate/index"
          });
        } else if (res.statusCode == "500" && res.data.status == "500") {
          common_vendor.index.showToast({
            title: "\u7CFB\u7EDF\u51FA\u9519\u4E86,\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\uFF01",
            duration: 2e3,
            icon: "none"
          });
        } else if (res.status == "500") {
          common_vendor.index.showToast({
            title: "\u7CFB\u7EDF\u65E0\u6CD5\u6B63\u5E38\u8BF7\u6C42,\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\uFF01",
            duration: 2e3,
            icon: "none"
          });
        } else if (res.statusCode == "400") {
          common_vendor.index.showToast({
            title: "\u7CFB\u7EDF\u51FA\u9519\u4E86,\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\uFF01",
            duration: 2e3,
            icon: "none"
          });
        } else {
          if (options.url != "/auth/verifyWechatApp") {
            common_vendor.index.navigateTo({
              url: "/pages/sys/validate/index"
            });
          }
          reslove(res.data);
        }
      },
      fail: (parmas) => {
        common_vendor.index.showToast({
          title: "\u7CFB\u7EDF\u51FA\u9519\u4E86,\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\uFF01",
          duration: 2e3,
          icon: "none"
        });
      }
    });
  });
}
exports.request = request;

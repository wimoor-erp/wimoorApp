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
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
var store_index = require("./store/index.js");
var common_request = require("./common/request.js");
if (!Math) {
  "./pages/tabBar/erp/erp.js";
  "./pages/tabBar/menu/menu.js";
  "./pages/tabBar/about/about.js";
  "./pages/tabBar/charts/charts.js";
  "./pages/erp/ship/ship.js";
  "./pages/erp/ship/quota/index.js";
  "./pages/erp/purchase/purchase.js";
  "./pages/erp/material/material.js";
  "./pages/erp/purchase/receive.js";
  "./pages/erp/warehouse/inventory/shelf/addstock.js";
  "./pages/erp/warehouse/inventory/shelf/outstock.js";
  "./pages/erp/warehouse/inventory/addshelf.js";
  "./pages/sys/validate/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  globalData: {
    test: ""
  },
  methods: __spreadValues({}, common_vendor.mapMutations(["setUniverifyErrorMsg", "setUniverifyLogin"]))
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/App.vue"]]);
function createApp() {
  App.$request = common_request.request;
  const app = common_vendor.createSSRApp(App);
  app.use(store_index.store);
  app.config.globalProperties.$adpid = "1111111111";
  app.config.globalProperties.$backgroundAudioData = {
    playing: false,
    playTime: 0,
    formatedPlayTime: "00:00:00"
  };
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;

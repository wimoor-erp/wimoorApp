"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const utils_request = require("./utils/request.js");
if (!Math) {
  "./pages/tabBar/main/index.js";
  "./pages/tabBar/menu/menu.js";
  "./pages/tabBar/about/about.js";
  "./pages/tabBar/charts/charts.js";
  "./pages/erp/ship/base/list.js";
  "./pages/erp/ship/quota/index.js";
  "./pages/erp/purchase/purchase.js";
  "./pages/erp/material/material.js";
  "./pages/erp/purchase/receive.js";
  "./pages/erp/warehouse/inventory/shelf/addstock.js";
  "./pages/erp/warehouse/inventory/shelf/outstock.js";
  "./pages/erp/warehouse/inventory/shelf/result.js";
  "./pages/erp/warehouse/inventory/shelf/index.js";
  "./pages/erp/warehouse/shelf/index.js";
  "./pages/erp/warehouse/inventory/shelf/skulist.js";
  "./pages/amazon/order/today/list.js";
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
  methods: {
    ...common_vendor.mapMutations(["setUniverifyErrorMsg", "setUniverifyLogin"])
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/App.vue"]]);
function createApp() {
  App.$request = utils_request.base;
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

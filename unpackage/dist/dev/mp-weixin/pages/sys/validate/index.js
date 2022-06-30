"use strict";
var common_vendor = require("../../../common/vendor.js");
var api_sys_login = require("../../../api/sys/login.js");
require("../../../common/request.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      ftype: ""
    };
  },
  onLoad(event) {
    const payload = event.ftype || event.payload;
    try {
      this.ftype = decodeURIComponent(payload);
    } catch (error) {
      this.ftype = "";
    }
  },
  methods: {
    userValid() {
      let self = this;
      var data = { openid: common_vendor.index.getStorageSync("openid"), email: self.username, password: self.password };
      data.jsessionid = common_vendor.index.getStorageSync("JSessionId");
      api_sys_login.loginApi.verifyWechatApp(data).then((data2) => {
        if (data2) {
          let jsid = data2.jsessionid;
          common_vendor.index.setStorageSync("JSessionId", jsid);
          common_vendor.index.setStorageSync("currentuser", data2.currentuser);
          common_vendor.index.switchTab({
            url: "/pages/tabBar/erp/erp"
          });
        } else {
          common_vendor.index.showToast({
            icon: "none",
            title: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u8D26\u53F7\u6216\u5BC6\u7801\uFF01",
            duration: 2e3
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.userValid && $options.userValid(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/sys/validate/index.vue"]]);
wx.createPage(MiniProgramPage);

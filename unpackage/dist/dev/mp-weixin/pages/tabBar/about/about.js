"use strict";
var common_vendor = require("../../../common/vendor.js");
var api_sys_login = require("../../../api/sys/login.js");
require("../../../common/request.js");
const _sfc_main = {
  data() {
    return {
      placeholderStyle: "color:#757575;font-size:14px",
      styles: {
        color: "#000",
        borderColor: "#747474"
      },
      type: "center",
      tableData: [],
      curuser: { account: "" }
    };
  },
  onShow() {
    this.getOpenUserlist();
  },
  methods: {
    getOpenUserlist() {
      var self = this;
      api_sys_login.loginApi.getOpenUserlist({ "openid": common_vendor.index.getStorageSync("openid") }).then((data) => {
        self.tableData = data;
        self.curuser = common_vendor.index.getStorageSync("currentuser");
      });
    },
    unbindAccount(account) {
      let self = this;
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u89E3\u7ED1\u540E\u9700\u91CD\u65B0\u7ED1\u5B9A,\u786E\u8BA4\u89E3\u9664\u5417\uFF1F",
        success: function(ress) {
          if (ress.confirm) {
            api_sys_login.loginApi.unbindWechat({
              "ftype": "app",
              "account": account,
              "openid": common_vendor.index.getStorageSync("openid")
            }).then((data) => {
              if (data.isOk == true) {
                common_vendor.index.showToast({
                  title: data.msg,
                  icon: "none",
                  duration: 2e3
                });
                if (self.curuser.account == account) {
                  self.tableData = [];
                  self.getOpenUserlist();
                  common_vendor.index.removeStorageSync("currentuser");
                  common_vendor.index.removeStorageSync("JSessionId");
                  common_vendor.index.navigateTo({
                    url: "/pages/sys/validate/index"
                  });
                } else {
                  self.tableData = [];
                  self.getOpenUserlist();
                }
              } else {
                common_vendor.index.showToast({
                  title: data.msg,
                  icon: "none",
                  duration: 2e3
                });
              }
            });
          }
        }
      });
    },
    changeAccount(account) {
      let self = this;
      var jsid = common_vendor.index.getStorageSync("JSessionId");
      var openid = common_vendor.index.getStorageSync("openid");
      api_sys_login.loginApi.changeLoginWechatApp({ "openid": openid, "account": account, "jsessionid": jsid }).then((data) => {
        if (data) {
          common_vendor.index.showToast({
            icon: "none",
            duration: 2e3,
            title: "\u5207\u6362\u8D26\u53F7\u6210\u529F\uFF01"
          });
          common_vendor.index.setStorageSync("currentuser", data.currentuser);
          self.curuser = data.currentuser;
          self.getOpenUserlist();
        }
      });
    },
    goValidatePage() {
      var datas = "app";
      common_vendor.index.navigateTo({
        url: "/pages/sys/validate/index?ftype=" + datas
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.curuser.account
  }, $data.curuser.account ? {
    b: common_vendor.t($data.curuser.account)
  } : {}, {
    c: common_vendor.p({
      align: "center"
    }),
    d: common_vendor.p({
      align: "center"
    }),
    e: $data.tableData.length > 0
  }, $data.tableData.length > 0 ? {
    f: common_vendor.f($data.tableData, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.account),
        b: "a9414ecc-5-" + i0 + "," + ("a9414ecc-4-" + i0),
        c: common_vendor.o(($event) => $options.unbindAccount(item.account)),
        d: $data.curuser.account != item.account
      }, $data.curuser.account != item.account ? {
        e: common_vendor.o(($event) => $options.changeAccount(item.account))
      } : {}, {
        f: "a9414ecc-6-" + i0 + "," + ("a9414ecc-4-" + i0),
        g: index,
        h: "a9414ecc-4-" + i0 + ",a9414ecc-0"
      });
    }),
    g: common_vendor.p({
      align: "center"
    }),
    h: common_vendor.p({
      align: "center"
    })
  } : {}, {
    i: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    }),
    j: common_vendor.o(($event) => $options.goValidatePage())
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/tabBar/about/about.nvue"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_sys_login = require("../../../api/sys/login.js");
const store_index = require("../../../store/index.js");
require("../../../utils/request.js");
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
      var openid = store_index.store.state.openid;
      api_sys_login.loginApi.getOpenUserlist({ "openid": openid, appType: api_sys_login.loginApi.getAppType() }).then((data) => {
        self.tableData = data;
        self.curuser = store_index.store.state.currentUser;
      });
    },
    unbindAccount(account) {
      let self = this;
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u89E3\u7ED1\u540E\u9700\u91CD\u65B0\u7ED1\u5B9A,\u786E\u8BA4\u89E3\u9664\u5417\uFF1F",
        success: function(ress) {
          if (ress.confirm) {
            var openid = store_index.store.state.openid;
            api_sys_login.loginApi.unbindWechat({
              "appType": api_sys_login.loginApi.getAppType(),
              "account": account,
              "openid": openid
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
                  store_index.store.commit("setSessionid", null);
                  store_index.store.commit("setCurrentUser", null);
                  store_index.store.commit("setUserList", null);
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
      var openid = this.$store.state.openid;
      var sessionid = this.$store.state.sessionid;
      api_sys_login.loginApi.changeLoginWechatApp({
        "openid": openid,
        "account": account,
        "jsessionid": sessionid,
        "appType": api_sys_login.loginApi.getAppType()
      }).then((data) => {
        if (data) {
          common_vendor.index.showToast({
            icon: "none",
            duration: 2e3,
            title: "\u5207\u6362\u8D26\u53F7\u6210\u529F\uFF01"
          });
          store_index.store.commit("setSessionid", sessionid);
          store_index.store.commit("setCurrentUser", data.currentuser);
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
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_card2)();
}
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_list_item + _easycom_uni_list + _easycom_uni_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.curuser.account
  }, $data.curuser.account ? {
    b: common_vendor.t($data.curuser.account)
  } : {}, {
    c: $data.tableData.length > 0
  }, $data.tableData.length > 0 ? {
    d: common_vendor.f($data.tableData, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.account),
        b: common_vendor.o(($event) => $options.unbindAccount(item.account)),
        c: $data.curuser.account != item.account
      }, $data.curuser.account != item.account ? {
        d: common_vendor.o(($event) => $options.changeAccount(item.account))
      } : {}, {
        e: index,
        f: "a9414ecc-3-" + i0 + ",a9414ecc-1"
      });
    }),
    e: common_vendor.p({
      width: _ctx.nvueWidth
    })
  } : {}, {
    f: common_vendor.o(($event) => $options.goValidatePage())
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/tabBar/about/about.nvue"]]);
wx.createPage(MiniProgramPage);

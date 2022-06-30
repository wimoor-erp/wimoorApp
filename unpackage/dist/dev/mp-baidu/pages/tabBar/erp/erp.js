"use strict";
var common_vendor = require("../../../common/vendor.js");
var api_sys_login = require("../../../api/sys/login.js");
require("../../../common/request.js");
const _sfc_main = {
  props: {
    hasLeftWin: {
      type: Boolean
    },
    leftWinActive: {
      type: String
    }
  },
  data() {
    return {
      list: [
        {
          id: "inventory",
          name: "\u5E93\u5B58\u7BA1\u7406",
          open: false,
          pages: [{
            name: "\u4ED3\u5E93\u7BA1\u7406",
            url: "/pages/erp/warehouse/warehouse"
          }]
        },
        {
          pages: [{
            name: "\u5546\u54C1\u8865\u8D27",
            url: "/pages/erp/ship/ship"
          }, {
            name: "\u5546\u54C1\u91C7\u8D2D",
            url: "/pages/erp/purchase/purchase"
          }, {
            name: "\u4EA7\u54C1\u7BA1\u7406",
            url: "/pages/erp/material/material"
          }]
        }
      ]
    };
  },
  onShareAppMessage() {
    return {
      title: "\u6B22\u8FCE\u4F53\u9A8Cwimoor\u79FB\u52A8\u7AEF",
      path: "/pages/tabBar/erp/erp"
    };
  },
  onLoad() {
    this.validateUser();
  },
  onNavigationBarButtonTap(e) {
    common_vendor.index.navigateTo({
      url: "/pages/about/about"
    });
  },
  methods: {
    scanCode() {
      common_vendor.index.scanCode({
        success: function(res) {
          if (res.result) {
            let url = res.result;
            if (url.indexOf("wxwarehouseshelf/") > 0) {
              let id = res.result.split("wxwarehouseshelf/")[1];
              let detail = {
                shelfid: id
              };
              common_vendor.index.navigateTo({
                "url": "/pages/erp/warehouse/inventory/addshelf?detailDate=" + encodeURIComponent(JSON.stringify(detail))
              });
            } else if (url.indexOf("wxsc/") > 0) {
              let shipmentid = res.result.split("wxsc/")[1];
              common_vendor.index.navigateTo({
                "url": "/pages/erp/ship/quota/index?shipmentid=" + shipmentid
              });
            }
          }
        }
      });
    },
    validateUser() {
      common_vendor.index.login({
        success(res) {
          if (res.code) {
            api_sys_login.loginApi.loginWechat({
              code: res.code
            }).then((data) => {
              if (data && data.status != "isfail") {
                let jsid = data.jsessionid;
                let currentuser = data.currentuser;
                common_vendor.index.setStorageSync("JSessionId", jsid);
                common_vendor.index.setStorageSync("currentuser", currentuser);
                common_vendor.index.setStorageSync("userlist", data.userlist);
                common_vendor.index.setStorageSync("openid", data.openid);
              } else {
                if (data.openid) {
                  common_vendor.index.setStorageSync("openid", data.openid);
                  common_vendor.index.setStorageSync("JSessionId", data.jsessionid);
                  common_vendor.index.navigateTo({
                    url: "../../sys/validate/index"
                  });
                } else {
                  common_vendor.index.showToast({
                    title: "\u5FAE\u4FE1\u8D26\u53F7\u5F02\u5E38!!!",
                    icon: "none",
                    duration: 2e3
                  });
                }
              }
            });
          } else {
            common_vendor.index.showToast({
              title: "\u767B\u5F55\u5931\u8D25\uFF01" + res.errMsg,
              icon: "none",
              duration: 2e3
            });
          }
        }
      });
    },
    triggerCollapse(e, id) {
      if (!this.list[e].pages) {
        this.goDetailPage("", this.list[e].url);
        return;
      }
      for (var i = 0; i < this.list.length; ++i) {
        if (e === i) {
          this.list[i].open = !this.list[i].open;
        } else {
          this.list[i].open = false;
        }
      }
    },
    goDetailPage(url) {
      common_vendor.index.navigateTo({
        "url": url
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.hasLeftWin
  }, !$props.hasLeftWin ? {
    b: {
      "click": common_vendor.o($options.scanCode)
    },
    c: common_vendor.p({
      color: "#ffa400",
      type: "scan",
      size: "34"
    }),
    d: common_vendor.o((...args) => $options.scanCode && $options.scanCode(...args)),
    e: common_vendor.p({
      color: "#00aaff",
      type: "list",
      size: "34"
    }),
    f: common_vendor.p({
      color: "#ff5500",
      type: "upload",
      size: "34"
    })
  } : {}, {
    g: {
      "click": common_vendor.o(($event) => $options.goDetailPage("/pages/erp/purchase/purchase"))
    },
    h: common_vendor.p({
      type: "shop",
      size: "34",
      color: "#0000ff"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/tabBar/erp/erp.nvue"]]);
_sfc_main.__runtimeHooks = 2;
swan.createPage(MiniProgramPage);

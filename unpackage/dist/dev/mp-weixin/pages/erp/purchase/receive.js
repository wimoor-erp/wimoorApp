"use strict";
var common_vendor = require("../../../common/vendor.js");
var api_erp_purchase_purchase = require("../../../api/erp/purchase/purchase.js");
require("../../../common/request.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      data: {},
      htmlNodes: [],
      entry: {},
      needamount: 0,
      placeholderStyle: "color:#ffa400;font-size:14px",
      styles: {
        color: "#ffa400",
        borderColor: "#ffa400"
      },
      reclist: [],
      orderData: [],
      LogResult: [],
      traceResult: [],
      deliveredTime: 0,
      iptamount: 0,
      ipt: false
    };
  },
  onLoad(event) {
    const payload = event.detailDate || event.payload;
    try {
      this.data = JSON.parse(decodeURIComponent(payload));
    } catch (error) {
      this.data = JSON.parse(payload);
    }
    this.loadRecDetail();
  },
  methods: {
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str));
        }
      }
      return fmt;
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
    loadRecDetail() {
      if (this.data.entryid) {
        api_erp_purchase_purchase.purchaseApi.getRecdetail({
          id: this.data.entryid,
          ftype: "rec"
        }).then((data) => {
          if (data && data.entry) {
            this.entry = data.entry;
            this.needamount = data.entry.amount - data.entry.totalin;
            this.reclist = data.receivelist;
            this.iptamount = this.needamount;
            if (this.data.alibaba_orderid != null && this.data.alibaba_orderid != void 0 && this.data.alibaba_orderid != "" && this.data.alibaba_orderid != "undefined") {
              this.loadEntryLogist();
            }
          }
        });
      }
    },
    numberFuc(value) {
      if (value == void 0 || value == null || value == "") {
        return "--";
      } else {
        return value;
      }
    },
    amountFunc(value1, value2, status) {
      if (value1 - value2 <= 0 || status == 1) {
        return "\u5F85\u6536\u8D27\u7269\u6570:0";
      } else {
        return "\u5F85\u6536\u8D27\u7269\u6570:" + this.needamount;
      }
    },
    input(e) {
      this.iptamount = parseInt(e);
    },
    loadEntryLogist() {
      api_erp_purchase_purchase.purchaseApi.catchLogisticsInfo({
        alibabaAuthid: this.data.alibaba_auth,
        alibabaOrderid: this.data.alibaba_orderid,
        purchaseEntryid: this.data.entryid
      }).then((data) => {
        let orderData = JSON.parse(data.orderResult);
        let LogResult = JSON.parse(data.LogisticsResult);
        let traceResult = JSON.parse(data.TraceResult);
        let deliveredTime = 0;
        if (orderData != null && orderData != "" && orderData != "undefined" && orderData != "undefined") {
          if (orderData.result.nativeLogistics.logisticsItems != null && orderData.result.nativeLogistics.logisticsItems.length > 0) {
            deliveredTime = orderData.result.nativeLogistics.logisticsItems[0].deliveredTime;
          }
          this.orderData = orderData.result;
          this.LogResult = LogResult.result;
          this.traceResult = traceResult.logisticsTrace;
          this.deliveredTime = deliveredTime;
        }
      });
    },
    dateFuc(value) {
      if (value != null && value != void 0 && value != "" && value > 0) {
        let date = new Date(value);
        return this.formatDate(date, "yyyy-MM-dd hh:mm:ss");
      } else {
        return "--";
      }
    },
    bindsubmitTap() {
      if (this.iptamount > 0) {
        api_erp_purchase_purchase.purchaseApi.rec({
          status: "0",
          entryid: this.data.entryid,
          amount: this.iptamount,
          warehouse: this.data.warehouseid,
          ftype: "in",
          recid: ""
        }).then((data) => {
          this.ipt = true;
          common_vendor.index.showToast({
            title: "\u64CD\u4F5C\u6210\u529F\uFF01",
            icon: "none",
            duration: 2e3
          });
          this.loadRecDetail();
        });
      } else {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u6570\u91CF\uFF01",
          icon: "none",
          duration: 2e3
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  _easycom_uni_easyinput2();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.data.sku),
    b: common_vendor.t($data.data.warehousename),
    c: common_vendor.t($options.amountFunc($data.entry.amount, $data.entry.totalin, $data.entry.inwhstatus)),
    d: common_vendor.t($options.numberFuc($data.entry.totalin)),
    e: common_vendor.t($options.numberFuc($data.entry.totalre)),
    f: $data.entry.inwhstatus != 1
  }, $data.entry.inwhstatus != 1 ? {
    g: common_vendor.o($options.input),
    h: common_vendor.o(($event) => $data.iptamount = $event),
    i: common_vendor.p({
      type: "number",
      disabled: $data.ipt,
      styles: $data.styles,
      placeholderStyle: $data.placeholderStyle,
      placeholder: "\u8BF7\u8F93\u5165\u64CD\u4F5C\u7684\u6570\u91CF",
      modelValue: $data.iptamount
    }),
    j: $data.ipt,
    k: common_vendor.o((...args) => $options.bindsubmitTap && $options.bindsubmitTap(...args))
  } : {}, {
    l: $data.reclist != null && $data.reclist.length > 0 && $data.reclist != void 0
  }, $data.reclist != null && $data.reclist.length > 0 && $data.reclist != void 0 ? {
    m: common_vendor.f($data.reclist, (value, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(value.operator),
        b: value.ftype == "in"
      }, value.ftype == "in" ? {} : {}, {
        c: value.ftype == "out"
      }, value.ftype == "out" ? {} : {}, {
        d: value.ftype == "clear"
      }, value.ftype == "clear" ? {} : {}, {
        e: common_vendor.t(value.warehousename),
        f: value.ftype == "in"
      }, value.ftype == "in" ? {
        g: common_vendor.t(value.amount)
      } : {}, {
        h: value.ftype == "out"
      }, value.ftype == "out" ? {
        i: common_vendor.t(value.amount)
      } : {}, {
        j: value.ftype == "clear"
      }, value.ftype == "clear" ? {
        k: common_vendor.t(value.amount)
      } : {}, {
        l: common_vendor.t($options.dateFuc(value.opttime)),
        m: common_vendor.t(value.remark),
        n: index
      });
    })
  } : {}, {
    n: $data.data.alibaba_orderid != "undefined" && $data.data.alibaba_orderid != "" && $data.data.alibaba_orderid != null && $data.data.alibaba_orderid != void 0
  }, $data.data.alibaba_orderid != "undefined" && $data.data.alibaba_orderid != "" && $data.data.alibaba_orderid != null && $data.data.alibaba_orderid != void 0 ? common_vendor.e({
    o: $data.LogResult != null && $data.LogResult != "" && $data.LogResult != "undefined" && $data.LogResult != "undefined" && $data.LogResult.length > 0
  }, $data.LogResult != null && $data.LogResult != "" && $data.LogResult != "undefined" && $data.LogResult != "undefined" && $data.LogResult.length > 0 ? {
    p: common_vendor.f($data.LogResult, (value, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(value.logisticsId),
        b: common_vendor.t(value.logisticsCompanyName),
        c: common_vendor.t(value.logisticsBillNo)
      }, $data.traceResult != null && $data.traceResult.length > 0 ? {
        d: common_vendor.f($data.traceResult, (trace, index2, i1) => {
          return common_vendor.e({
            a: value.logisticsId == trace.logisticsId && trace.logisticsSteps != null && trace.logisticsSteps.length > 0
          }, value.logisticsId == trace.logisticsId && trace.logisticsSteps != null && trace.logisticsSteps.length > 0 ? {
            b: common_vendor.f(trace.logisticsSteps, (logs, index3, i2) => {
              return {
                a: common_vendor.t($options.dateFuc(logs["acceptTime"] ? logs.acceptTime : "")),
                b: common_vendor.t(logs.remark),
                c: index3
              };
            })
          } : {}, {
            c: index2
          });
        })
      } : {}, {
        e: common_vendor.t(value.logisticsCompanyName),
        f: value.sendGoods != null && value.sendGoods.length > 0
      }, value.sendGoods != null && value.sendGoods.length > 0 ? {
        g: common_vendor.f(value.sendGoods, (good, index2, i1) => {
          return {
            a: common_vendor.f($data.orderData.productItems, (product, index3, i2) => {
              return common_vendor.e({
                a: product.name == good.goodName
              }, product.name == good.goodName ? {
                b: product.productImgUrl[0],
                c: common_vendor.t(good.goodName),
                d: common_vendor.t(good.quantity),
                e: common_vendor.t(good.unit)
              } : {}, {
                f: index3
              });
            }),
            b: index2
          };
        })
      } : {}, {
        h: index
      });
    }),
    q: common_vendor.t($options.dateFuc($data.deliveredTime)),
    r: $data.traceResult != null && $data.traceResult.length > 0
  } : {}) : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/purchase/receive.vue"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_erp_purchase_purchase = require("../../../api/erp/purchase/purchase.js");
require("../../../utils/request.js");
require("../../../store/index.js");
const WarehousePick = () => "./components/warehousepick.js";
const _sfc_main = {
  components: {
    WarehousePick
  },
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
      ipt: false,
      warehouseid: ""
    };
  },
  onLoad(event) {
    const payload = event.detailData || event.payload;
    try {
      this.data = JSON.parse(decodeURIComponent(payload));
    } catch (error) {
      this.data = JSON.parse(payload);
    }
    if (this.data) {
      this.warehouseid = this.data.warehouseid;
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
    suppliernameFuc(value) {
      if (value == void 0 || value == null || value == "") {
        return "--";
      } else {
        return value;
      }
    },
    paystatusFuc(value) {
      if (value == "1" || value == 1) {
        return "\u5DF2\u4ED8\u6B3E";
      } else {
        return "\u672A\u4ED8\u6B3E";
      }
    },
    deliverydateFuc(value) {
      if (value != null && value != void 0 && value != "") {
        return value.split(" ")[0];
      } else {
        return "--";
      }
    },
    statusFuc(value) {
      if (value == 0 || value == "0") {
        return "\u5DF2\u9000\u56DE";
      } else if (value == 1 || value == "1") {
        return "\u5F85\u5BA1\u6838";
      } else if (value == 2 || value == "2") {
        return "\u6267\u884C\u4E2D";
      } else if (value == 3 || value == "3") {
        return "\u5DF2\u5B8C\u6210";
      }
    },
    dialogToggle() {
      this.$refs.alertDialog.open();
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
    warehouseChange(warehouseid) {
      this.warehouseid = warehouseid;
    },
    loadRecDetail() {
      if (this.data.id) {
        api_erp_purchase_purchase.purchaseApi.getRecdetail({
          id: this.data.id,
          ftype: "rec"
        }).then((data) => {
          if (data && data.entry) {
            this.entry = data.entry;
            this.needamount = data.entry.amount - data.entry.totalin;
            this.reclist = data.receivelist;
            if (this.reclist) {
              this.reclist.forEach((item) => {
                item.sumin = 0;
                if (item.shelfInvRecordList) {
                  item.shelfInvRecordList.forEach((reitem) => {
                    if (reitem.opt == 1) {
                      item.sumin = item.sumin + reitem.quantity;
                    } else {
                      item.sumin = item.sumin - reitem.quantity;
                    }
                  });
                }
              });
            }
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
        return "\u5F85\u6536\u8D27:0";
      } else {
        return "\u5F85\u6536\u8D27:" + this.needamount;
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
        var status = "0";
        if (this.needamount <= this.iptamount) {
          status = "1";
        }
        api_erp_purchase_purchase.purchaseApi.rec({
          status,
          entryid: this.data.id,
          amount: this.iptamount,
          warehouse: this.warehouseid,
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
    },
    clearRec() {
      var entryid = this.data.id;
      api_erp_purchase_purchase.purchaseApi.clearRec({ "entryid": entryid }).then((data) => {
        common_vendor.index.showToast({
          title: "\u64CD\u4F5C\u6210\u529F\uFF01",
          icon: "none",
          duration: 2e3
        });
        this.ipt = false;
        this.loadRecDetail();
      });
    },
    goHuoJia(value, data) {
      value.materialid = data.materialid;
      value.opttype = "purchase";
      common_vendor.index.navigateTo({
        "url": "/pages/erp/warehouse/shelf/index?detailData=" + encodeURIComponent(JSON.stringify(value))
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _component_WarehousePick = common_vendor.resolveComponent("WarehousePick");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_card2 + _component_WarehousePick + _easycom_uni_easyinput2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_card + _easycom_uni_easyinput + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.data.amount),
    b: common_vendor.t($data.data.warehousename),
    c: common_vendor.t($options.deliverydateFuc($data.data.deliverydate)),
    d: common_vendor.t($options.paystatusFuc($data.data.paystatus)),
    e: common_vendor.t($data.data.number),
    f: common_vendor.t($data.data.creatorname),
    g: common_vendor.t($data.data.createdate),
    h: common_vendor.p({
      title: $data.data.sku,
      ["sub-title"]: $options.suppliernameFuc($data.data.suppliername),
      extra: $options.statusFuc($data.data.auditstatus),
      thumbnail: $data.data.image
    }),
    i: common_vendor.o($options.warehouseChange),
    j: common_vendor.p({
      warehouseid: $data.data.warehouseid
    }),
    k: common_vendor.t($options.amountFunc($data.entry.amount, $data.entry.totalin, $data.entry.inwhstatus)),
    l: common_vendor.t($options.numberFuc($data.entry.totalin)),
    m: common_vendor.t($options.numberFuc($data.entry.totalre)),
    n: $data.entry.inwhstatus != 1
  }, $data.entry.inwhstatus != 1 ? {
    o: common_vendor.o($options.input),
    p: common_vendor.o(($event) => $data.iptamount = $event),
    q: common_vendor.p({
      type: "number",
      disabled: $data.ipt,
      styles: $data.styles,
      placeholderStyle: $data.placeholderStyle,
      placeholder: "\u8BF7\u8F93\u5165\u64CD\u4F5C\u7684\u6570\u91CF",
      modelValue: $data.iptamount
    }),
    r: $data.ipt,
    s: common_vendor.o((...args) => $options.bindsubmitTap && $options.bindsubmitTap(...args))
  } : {}, {
    t: common_vendor.o($options.clearRec),
    v: common_vendor.o(_ctx.dialogClose),
    w: common_vendor.p({
      type: "warn",
      cancelText: "\u5173\u95ED",
      confirmText: "\u540C\u610F",
      title: "\u901A\u77E5",
      content: "\u60A8\u786E\u5B9A\u8981\u64A4\u9500\u6240\u6709\u5165\u5E93\u5417\uFF1F"
    }),
    x: common_vendor.sr("alertDialog", "ec5cc86a-5,ec5cc86a-4"),
    y: common_vendor.p({
      type: "dialog"
    }),
    z: common_vendor.o((...args) => $options.dialogToggle && $options.dialogToggle(...args)),
    A: $data.reclist != null && $data.reclist.length > 0 && $data.reclist != void 0
  }, $data.reclist != null && $data.reclist.length > 0 && $data.reclist != void 0 ? {
    B: common_vendor.f($data.reclist, (value, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(value.operator),
        b: value.ftype == "in"
      }, value.ftype == "in" ? {} : {}, {
        c: value.ftype == "out"
      }, value.ftype == "out" ? {} : {}, {
        d: value.ftype == "clear"
      }, value.ftype == "clear" ? {} : {}, {
        e: value.ftype == "in"
      }, value.ftype == "in" ? {
        f: common_vendor.o(($event) => $options.goHuoJia(value, $data.data))
      } : {}, {
        g: value.ftype == "in"
      }, value.ftype == "in" ? {
        h: common_vendor.t(value.amount)
      } : {}, {
        i: value.ftype == "out"
      }, value.ftype == "out" ? {
        j: common_vendor.t(value.amount)
      } : {}, {
        k: value.ftype == "clear"
      }, value.ftype == "clear" ? {
        l: common_vendor.t(value.amount)
      } : {}, {
        m: common_vendor.t(value.warehousename),
        n: common_vendor.t($options.dateFuc(value.opttime)),
        o: common_vendor.t(value.remark),
        p: value.shelfInvRecordList && value.shelfInvRecordList.length > 0
      }, value.shelfInvRecordList && value.shelfInvRecordList.length > 0 ? {
        q: common_vendor.t(value.sumin),
        r: "ec5cc86a-9-" + i0 + "," + ("ec5cc86a-8-" + i0),
        s: common_vendor.p({
          align: "left",
          width: "150"
        }),
        t: "ec5cc86a-10-" + i0 + "," + ("ec5cc86a-8-" + i0),
        v: common_vendor.p({
          align: "left",
          width: "100"
        }),
        w: "ec5cc86a-8-" + i0 + "," + ("ec5cc86a-7-" + i0),
        x: common_vendor.f(value.shelfInvRecordList, (recItem, index2, i1) => {
          return common_vendor.e({
            a: common_vendor.t(recItem.shelfname),
            b: common_vendor.t(recItem.opttime),
            c: "ec5cc86a-12-" + i0 + "-" + i1 + "," + ("ec5cc86a-11-" + i0 + "-" + i1),
            d: recItem.opt == 0
          }, recItem.opt == 0 ? {} : recItem.opt == 1 ? {} : {}, {
            e: recItem.opt == 1,
            f: common_vendor.t(recItem.quantity),
            g: "ec5cc86a-13-" + i0 + "-" + i1 + "," + ("ec5cc86a-11-" + i0 + "-" + i1),
            h: index2,
            i: "ec5cc86a-11-" + i0 + "-" + i1 + "," + ("ec5cc86a-7-" + i0)
          });
        }),
        y: "ec5cc86a-7-" + i0 + ",ec5cc86a-4",
        z: common_vendor.p({
          border: true,
          emptyText: "\u6682\u65E0\u64CD\u4F5C\u8BB0\u5F55"
        })
      } : {}, {
        A: index
      });
    })
  } : {}, {
    C: $data.data.alibaba_orderid != "undefined" && $data.data.alibaba_orderid != "" && $data.data.alibaba_orderid != null && $data.data.alibaba_orderid != void 0
  }, $data.data.alibaba_orderid != "undefined" && $data.data.alibaba_orderid != "" && $data.data.alibaba_orderid != null && $data.data.alibaba_orderid != void 0 ? common_vendor.e({
    D: $data.LogResult != null && $data.LogResult != "" && $data.LogResult != "undefined" && $data.LogResult != "undefined" && $data.LogResult.length > 0
  }, $data.LogResult != null && $data.LogResult != "" && $data.LogResult != "undefined" && $data.LogResult != "undefined" && $data.LogResult.length > 0 ? {
    E: common_vendor.f($data.LogResult, (value, index, i0) => {
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
    F: common_vendor.t($options.dateFuc($data.deliveredTime)),
    G: $data.traceResult != null && $data.traceResult.length > 0
  } : {}) : {}, {
    H: common_vendor.p({
      title: "\u7269\u6D41\u8BB0\u5F55"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/purchase/receive.vue"]]);
wx.createPage(MiniProgramPage);

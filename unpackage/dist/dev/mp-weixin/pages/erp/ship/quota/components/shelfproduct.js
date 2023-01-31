"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const api_erp_ship_quotaApi = require("../../../../../api/erp/ship/quotaApi.js");
require("../../../../../utils/request.js");
require("../../../../../store/index.js");
const _sfc_main = {
  props: ["item", "itemid", "isAssemblyItem", "warehouseid"],
  components: {},
  data() {
    return {
      current: -1,
      offShelfNum: -1,
      shelfListData: [],
      shipmentid: "",
      createdate: "-",
      auditime: "-",
      shelfid: "",
      active: 2,
      warehouseList: [{
        title: "\u6682\u65E0\u6570\u636E",
        desc: "\u53D1\u8D27\u4ED3\u5E93"
      }, {
        title: "\u6682\u65E0\u6570\u636E",
        desc: "\u76EE\u7684\u4ED3\u5E93"
      }],
      productListData: [],
      quotaoderData: {},
      sumin: 0
    };
  },
  onLoad(query) {
    this.offShelfNum = -1;
  },
  methods: {
    getChecked(index, list) {
      if (this.current == -1) {
        list.forEach((item, mindex) => {
          if (item.quantity > 0) {
            this.current = mindex;
            this.shelfid = item.shelfid;
          }
        });
        if (this.current == -1) {
          this.current = 0;
          this.shelfid = list[0].shelfid;
        }
      }
      return this.current == index;
    },
    goMaterialInfoPage(item) {
      if (this.$props.isAssemblyItem == true) {
        common_vendor.index.navigateTo({ url: "../../material/material?materialid=" + item.mainmid });
      } else {
        common_vendor.index.navigateTo({ url: "../../material/material?materialid=" + item.materialid });
      }
    },
    needshow(list) {
      if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          if (list[i] && list[i].quantity > 0) {
            return true;
          }
        }
      }
      return false;
    },
    getoffShelfNum(val, arr, type) {
      let num = 0;
      let value = val;
      if (this.$props.item.shelfInvRecordList) {
        var sum = 0;
        this.$props.item.shelfInvRecordList.forEach((item) => {
          if (item.opt == 0) {
            sum = sum + parseInt(item.quantity);
          } else {
            sum = sum - +parseInt(item.quantity);
          }
        });
        this.sumin = sum;
        if (sum) {
          value = value - sum;
        }
      }
      arr.forEach((item, index) => {
        if (this.current == index) {
          if (value <= parseInt(item.quantity)) {
            num = value;
          } else {
            num = parseInt(item.quantity);
          }
        }
      });
      if (this.offShelfNum == -1 || type == "change") {
        this.offShelfNum = num;
      }
      return num;
    },
    goHuoJia(materialid) {
      var detail = { "materialid": materialid, "warehouseid": "" };
      detail.warehouseid = this.$props.warehouseid;
      detail.formid = this.$props.itemid;
      detail.formtype = "outstockform";
      detail.opttype = "outstockform";
      let node = this.$props.item;
      var amount = 0;
      if (this.$props.isAssemblyItem == true) {
        amount = this.getoffShelfNum(node.subamount, this.$props.item.shelfInvList, "change");
      } else {
        amount = this.getoffShelfNum(node.quantity, this.$props.item.shelfInvList, "change");
      }
      if (amount < 0) {
        detail.amount = amount * -1;
      }
      var detailUrl = encodeURIComponent(JSON.stringify(detail));
      common_vendor.index.navigateTo({
        "url": "/pages/erp/warehouse/shelf/index?detailData=" + detailUrl
      });
    },
    getshelfid(val, a) {
      return val;
    },
    maxShelfNum(shelfList) {
      let num = 0;
      shelfList.forEach((item, index) => {
        if (this.current == index) {
          if (item.quantity) {
            num = parseInt(item.quantity);
          } else {
            num = 0;
          }
        }
      });
      return num;
    },
    subShelfNum(shelfList) {
      let arr = [];
      let obj = {};
      let node = shelfList[this.current];
      obj.materialid = node.materialid;
      obj.shelfid = node.shelfid;
      obj.formid = this.$props.itemid;
      obj.formtype = "outstockform";
      obj.quantity = this.offShelfNum;
      obj.opt = 0;
      arr.push(obj);
      let that = this;
      api_erp_ship_quotaApi.quotaApi.subShelfInventory(arr).then((data) => {
        common_vendor.index.showToast({
          title: "\u4E0B\u67B6\u6210\u529F\uFF01",
          icon: "none",
          duration: 2e3
        });
        let node2 = shelfList[that.current];
        node2.quantity = node2.quantity - that.offShelfNum;
        var record = { opttime: "", shelfname: "", quantity: "" };
        record.opttime = new Date().format("yyyy-MM-dd hh:mm:ss");
        record.shelfname = node2.shelfname;
        record.quantity = that.offShelfNum;
        record.opt = 0;
        if (that.$props.item.shelfInvRecordList) {
          that.$props.item.shelfInvRecordList.push(record);
        } else {
          that.$props.item.shelfInvRecordList = [record];
        }
      });
    },
    offshelfValChange(e) {
      this.offShelfNum = e.detail.value;
    },
    radioChange(val) {
      this.current = val.detail.value;
      let node = this.$props.item.shelfInvList[this.current];
      this.getoffShelfNum(node.quantity, this.$props.item.shelfInvList, "change");
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
const _easycom_uni_th = () => "../../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.item.image
  }, $props.item.image ? {
    b: common_vendor.o(($event) => $options.goMaterialInfoPage($props.item)),
    c: $props.item.image
  } : {
    d: common_vendor.o(($event) => $options.goMaterialInfoPage($props.item))
  }, {
    e: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    f: common_vendor.t($props.item.name)
  } : {
    g: common_vendor.t($props.item.mname)
  }, {
    h: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    i: common_vendor.t($props.item.sku),
    j: common_vendor.o(($event) => $options.goHuoJia($props.item.materialid))
  } : {
    k: common_vendor.t($props.item.sku),
    l: common_vendor.o(($event) => $options.goHuoJia($props.item.submid))
  }, {
    m: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    n: common_vendor.t($props.item.sellersku)
  } : {}, {
    o: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    p: common_vendor.t($props.item.fnsku)
  } : {}, {
    q: common_vendor.t($props.item.boxnum),
    r: $props.item.boxlength
  }, $props.item.boxlength ? {
    s: common_vendor.t($props.item.boxlength),
    t: common_vendor.t($props.item.boxwidth),
    v: common_vendor.t($props.item.boxheight)
  } : {}, {
    w: $props.item.boxweight
  }, $props.item.boxweight ? {
    x: common_vendor.t($props.item.boxweight)
  } : {}, {
    y: $options.needshow($props.item.shelfInvList)
  }, $options.needshow($props.item.shelfInvList) ? {
    z: common_vendor.p({
      align: "left",
      width: "10"
    }),
    A: common_vendor.p({
      align: "left",
      width: "190"
    }),
    B: common_vendor.p({
      align: "left",
      width: "50"
    }),
    C: common_vendor.f($props.item.shelfInvList, (shelfInvList, index, i0) => {
      return {
        a: index,
        b: $options.getChecked(index, $props.item.shelfInvList),
        c: "6f0f3faa-6-" + i0 + "," + ("6f0f3faa-5-" + i0),
        d: common_vendor.t(shelfInvList.shelfname),
        e: "6f0f3faa-7-" + i0 + "," + ("6f0f3faa-5-" + i0),
        f: common_vendor.t(shelfInvList.quantity),
        g: "6f0f3faa-8-" + i0 + "," + ("6f0f3faa-5-" + i0),
        h: index,
        i: "6f0f3faa-5-" + i0 + ",6f0f3faa-0"
      };
    }),
    D: common_vendor.p({
      border: true,
      emptyText: "\u6682\u65E0\u6570\u636E"
    }),
    E: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args))
  } : {}, {
    F: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    G: common_vendor.t($props.item.quantity)
  } : {}, {
    H: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {} : {}, {
    I: $props.isAssemblyItem == true
  }, $props.isAssemblyItem == true ? {
    J: common_vendor.t($props.item.subamount)
  } : {}, {
    K: $props.isAssemblyItem == true
  }, $props.isAssemblyItem == true ? {} : {}, {
    L: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    M: common_vendor.t($props.item.invquantity)
  } : {
    N: common_vendor.t($props.item.fulfillable)
  }, {
    O: $options.needshow($props.item.shelfInvList)
  }, $options.needshow($props.item.shelfInvList) ? common_vendor.e({
    P: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    Q: common_vendor.o((...args) => $options.offshelfValChange && $options.offshelfValChange(...args)),
    R: $options.getoffShelfNum($props.item.quantity, $props.item.shelfInvList)
  } : {
    S: common_vendor.o((...args) => $options.offshelfValChange && $options.offshelfValChange(...args)),
    T: $options.getoffShelfNum($props.item.subamount, $props.item.shelfInvList)
  }, {
    U: common_vendor.o(() => $options.subShelfNum($props.item.shelfInvList))
  }) : {}, {
    V: $props.item.shelfInvRecordList
  }, $props.item.shelfInvRecordList ? {
    W: common_vendor.t($data.sumin),
    X: common_vendor.p({
      align: "left",
      width: "150"
    }),
    Y: common_vendor.p({
      align: "left",
      width: "100"
    }),
    Z: common_vendor.f($props.item.shelfInvRecordList, (recItem, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(recItem.shelfname),
        b: common_vendor.t(recItem.opttime),
        c: "6f0f3faa-14-" + i0 + "," + ("6f0f3faa-13-" + i0),
        d: recItem.opt == 0
      }, recItem.opt == 0 ? {} : {}, {
        e: common_vendor.t(recItem.quantity),
        f: "6f0f3faa-15-" + i0 + "," + ("6f0f3faa-13-" + i0),
        g: index,
        h: "6f0f3faa-13-" + i0 + ",6f0f3faa-9"
      });
    }),
    aa: common_vendor.p({
      border: true,
      emptyText: "\u6682\u65E0\u64CD\u4F5C\u8BB0\u5F55"
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/ship/quota/components/shelfproduct.vue"]]);
wx.createComponent(Component);

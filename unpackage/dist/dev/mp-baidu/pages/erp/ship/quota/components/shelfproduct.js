"use strict";
var common_vendor = require("../../../../../common/vendor.js");
var api_erp_ship_quotaApi = require("../../../../../api/erp/ship/quotaApi.js");
require("../../../../../common/request.js");
const _sfc_main = {
  props: ["item", "isAssemblyItem"],
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
      quotaoderData: {}
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
    goMaterialInfoPage(mid) {
      common_vendor.index.navigateTo({
        url: "../../material/material?materialid=" + mid
      });
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
    getoffShelfNum(val, arr) {
      let num = 0;
      arr.forEach((item, index) => {
        if (this.current == index) {
          if (val <= parseInt(item.quantity)) {
            num = val;
            return;
          } else {
            num = parseInt(item.quantity);
          }
        }
      });
      if (this.offShelfNum == -1) {
        this.offShelfNum = num;
      }
      console.log("getoffShelfNum", this.offShelfNum, num);
      return num;
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
      });
    },
    offshelfValChange(val) {
      this.offShelfNum = val;
    },
    radioChange(val) {
      this.current = val.detail.value;
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_number_box2)();
}
const _easycom_uni_th = () => "../../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_number_box = () => "../../../../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_number_box)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.goMaterialInfoPage($props.item.materialid)),
    b: $props.item.image,
    c: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    d: common_vendor.t($props.item.name)
  } : {
    e: common_vendor.t($props.item.mname)
  }, {
    f: common_vendor.t($props.item.sku),
    g: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    h: common_vendor.t($props.item.sellersku)
  } : {}, {
    i: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    j: common_vendor.t($props.item.fnsku)
  } : {}, {
    k: common_vendor.t($props.item.boxnum),
    l: $props.item.boxlength
  }, $props.item.boxlength ? {
    m: common_vendor.t($props.item.boxlength),
    n: common_vendor.t($props.item.boxwidth),
    o: common_vendor.t($props.item.boxheight)
  } : {}, {
    p: $props.item.boxweight
  }, $props.item.boxweight ? {
    q: common_vendor.t($props.item.boxweight)
  } : {}, {
    r: $options.needshow($props.item.shelfInvList)
  }, $options.needshow($props.item.shelfInvList) ? {
    s: common_vendor.p({
      align: "left",
      width: "10"
    }),
    t: common_vendor.p({
      align: "left",
      width: "190"
    }),
    v: common_vendor.p({
      align: "left",
      width: "50"
    }),
    w: common_vendor.f($props.item.shelfInvList, (shelfInvList, index, i0) => {
      return {
        a: index,
        b: index,
        c: $options.getChecked(index, $props.item.shelfInvList),
        d: "6f0f3faa-6-" + i0 + "," + ("6f0f3faa-5-" + i0),
        e: common_vendor.t(shelfInvList.shelfname),
        f: "6f0f3faa-7-" + i0 + "," + ("6f0f3faa-5-" + i0),
        g: common_vendor.t(shelfInvList.quantity),
        h: "6f0f3faa-8-" + i0 + "," + ("6f0f3faa-5-" + i0),
        i: "6f0f3faa-5-" + i0 + ",6f0f3faa-0"
      };
    }),
    x: common_vendor.p({
      border: true,
      emptyText: "\u6682\u65E0\u6570\u636E"
    }),
    y: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args))
  } : {}, {
    z: common_vendor.t($props.item.quantity),
    A: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {} : {}, {
    B: $props.isAssemblyItem == false
  }, $props.isAssemblyItem == false ? {
    C: common_vendor.t($props.item.invquantity)
  } : {
    D: common_vendor.t($props.item.fulfillable)
  }, {
    E: $options.needshow($props.item.shelfInvList)
  }, $options.needshow($props.item.shelfInvList) ? {
    F: {
      "change": common_vendor.o($options.offshelfValChange)
    },
    G: common_vendor.p({
      min: 0,
      max: $options.maxShelfNum($props.item.shelfInvList),
      value: $options.getoffShelfNum($props.item.quantity, $props.item.shelfInvList)
    }),
    H: common_vendor.o(() => $options.subShelfNum($props.item.shelfInvList))
  } : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/ship/quota/components/shelfproduct.vue"]]);
swan.createComponent(Component);

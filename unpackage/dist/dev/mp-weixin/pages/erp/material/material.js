"use strict";
const api_erp_material_material = require("../../../api/erp/material/material.js");
const common_vendor = require("../../../common/vendor.js");
require("../../../utils/request.js");
require("../../../store/index.js");
const _sfc_main = {
  data() {
    return {
      mid: "",
      material: {},
      itemDim: {},
      pkgDim: {},
      boxDim: {},
      customs: {},
      tabs: {
        baseinfo: { isactive: true, activeclass: "active" },
        purchaseinfo: { isactive: false, activeclass: "" },
        custominfo: { isactive: false, activeclass: "" }
      },
      stepWisePrice: [],
      consumableList: [],
      assemblyList: [],
      supplierList: []
    };
  },
  onLoad(event) {
    const payload = event.materialid || event.payload;
    try {
      this.mid = decodeURIComponent(payload);
    } catch (error) {
      this.mid = "";
    }
    this.getlist();
  },
  onShow() {
    this.getlist();
  },
  methods: {
    booleanFuc(value) {
      if (value == true || value == 1 || value == "1") {
        return "\u662F";
      } else {
        return "\u5426";
      }
    },
    changeType(type) {
      this.tabs.baseinfo.isactive = false;
      this.tabs.baseinfo.activeclass = "";
      this.tabs.purchaseinfo.isactive = false;
      this.tabs.purchaseinfo.activeclass = "";
      this.tabs.custominfo.isactive = false;
      this.tabs.custominfo.activeclass = "";
      if (type == "baseinfo") {
        this.tabs.baseinfo.isactive = true;
        this.tabs.baseinfo.activeclass = "active";
      }
      if (type == "purchaseinfo") {
        this.tabs.purchaseinfo.isactive = true;
        this.tabs.purchaseinfo.activeclass = "active";
      }
      if (type == "custominfo") {
        this.tabs.custominfo.isactive = true;
        this.tabs.custominfo.activeclass = "active";
      }
    },
    valueFormatter(value) {
      if (value != void 0 && value != null && value != "") {
        return value;
      } else {
        return "--";
      }
    },
    dateFuc(value) {
      if (value != null && value != void 0 && value != "" && value > 0) {
        let date = new Date(value);
        return this.formatDate(date, "yyyy-MM-dd");
      } else {
        return "--";
      }
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
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
    getlist() {
      let self = this;
      if (self.mid != "") {
        api_erp_material_material.materialApi.getMaterialInfo({ id: self.mid }).then((data) => {
          if (data) {
            var datas = data;
            if (datas.material && datas.material != null) {
              self.material = datas.material;
            }
            if (datas.itemDim && datas.itemDim != null) {
              self.itemDim = datas.itemDim;
            }
            if (datas.pkgDim && datas.pkgDim != null) {
              self.pkgDim = datas.pkgDim;
            }
            if (datas.boxDim && datas.boxDim != null) {
              self.boxDim = datas.boxDim;
            }
            if (datas.customs && datas.customs != null) {
              self.customs = datas.customs;
            }
            if (datas.stepWisePrice && datas.stepWisePrice != null && datas.stepWisePrice.length > 0) {
              self.stepWisePrice = datas.stepWisePrice;
            }
            if (datas.consumableList && datas.consumableList != null && datas.consumableList.length > 0) {
              self.consumableList = datas.consumableList;
            }
            if (datas.assemblyList && datas.assemblyList != null && datas.assemblyList.length > 0) {
              self.assemblyList = datas.assemblyList;
            }
            if (datas.supplierList && datas.supplierList != null && datas.supplierList.length > 0) {
              self.supplierList = datas.supplierList;
            }
          }
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  (_easycom_uni_card2 + _easycom_uni_td2 + _easycom_uni_tr2 + _easycom_uni_table2 + _easycom_uni_th2)();
}
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
if (!Math) {
  (_easycom_uni_card + _easycom_uni_td + _easycom_uni_tr + _easycom_uni_table + _easycom_uni_th)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.material.image,
    b: common_vendor.t($data.material.name),
    c: common_vendor.t($data.material.sku),
    d: $data.material.brand
  }, $data.material.brand ? {
    e: common_vendor.t($data.material.brand)
  } : {}, {
    f: $data.material.category
  }, $data.material.category ? {
    g: common_vendor.t($data.material.category)
  } : {}, {
    h: $data.material.issfg == "0"
  }, $data.material.issfg == "0" ? {} : {}, {
    i: $data.material.issfg == "1"
  }, $data.material.issfg == "1" ? {} : {}, {
    j: $data.material.issfg == "2"
  }, $data.material.issfg == "2" ? {} : {}, {
    k: common_vendor.n($data.tabs.baseinfo.activeclass),
    l: common_vendor.o(($event) => $options.changeType("baseinfo")),
    m: common_vendor.n($data.tabs.purchaseinfo.activeclass),
    n: common_vendor.o(($event) => $options.changeType("purchaseinfo")),
    o: common_vendor.n($data.tabs.custominfo.activeclass),
    p: common_vendor.o(($event) => $options.changeType("custominfo")),
    q: common_vendor.p({
      isFull: true
    }),
    r: $data.tabs.baseinfo.isactive
  }, $data.tabs.baseinfo.isactive ? common_vendor.e({
    s: common_vendor.t($options.valueFormatter($data.itemDim.length)),
    t: common_vendor.t($options.valueFormatter($data.itemDim.width)),
    v: common_vendor.t($options.valueFormatter($data.itemDim.height)),
    w: common_vendor.t($options.valueFormatter($data.itemDim.weight)),
    x: common_vendor.t($options.valueFormatter($data.pkgDim.length)),
    y: common_vendor.t($options.valueFormatter($data.pkgDim.width)),
    z: common_vendor.t($options.valueFormatter($data.pkgDim.height)),
    A: common_vendor.t($options.valueFormatter($data.pkgDim.weight)),
    B: common_vendor.t($options.valueFormatter($data.boxDim.length)),
    C: common_vendor.t($options.valueFormatter($data.boxDim.width)),
    D: common_vendor.t($options.valueFormatter($data.boxDim.height)),
    E: common_vendor.t($options.valueFormatter($data.boxDim.weight)),
    F: common_vendor.p({
      border: true
    }),
    G: common_vendor.p({
      isFull: true,
      title: "\u89C4\u683C\u5C3A\u5BF8\u91CD\u91CF"
    }),
    H: common_vendor.t($data.material.specification),
    I: common_vendor.t($data.material.boxnum),
    J: common_vendor.t($data.material.ownername),
    K: common_vendor.t($options.dateFuc($data.material.effectivedate)),
    L: common_vendor.t($data.material.vatrate),
    M: common_vendor.t($data.material.operator),
    N: common_vendor.t($options.dateFuc($data.material.opttime)),
    O: common_vendor.t($data.material.creator),
    P: common_vendor.t($options.dateFuc($data.material.createdate)),
    Q: common_vendor.p({
      isFull: true,
      title: "\u5176\u4ED6\u4FE1\u606F"
    }),
    R: common_vendor.t($data.material.remark),
    S: common_vendor.p({
      isFull: true,
      title: "\u5907\u6CE8"
    }),
    T: common_vendor.t($data.material.name),
    U: common_vendor.p({
      isFull: true,
      title: "\u5168\u90E8\u540D\u79F0"
    }),
    V: common_vendor.f($data.consumableList, (item, index, i0) => {
      return {
        a: item.image,
        b: "57c41409-36-" + i0 + "," + ("57c41409-35-" + i0),
        c: common_vendor.t(item.sku),
        d: common_vendor.t(item.amount),
        e: common_vendor.t(item.name),
        f: "57c41409-37-" + i0 + "," + ("57c41409-35-" + i0),
        g: index,
        h: "57c41409-35-" + i0 + ",57c41409-31"
      };
    }),
    W: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    }),
    X: common_vendor.p({
      isFull: true,
      title: "\u8017\u6750\u4FE1\u606F"
    }),
    Y: $data.material.issfg == "1"
  }, $data.material.issfg == "1" ? {
    Z: common_vendor.f($data.assemblyList, (item, index, i0) => {
      return {
        a: item.image,
        b: "57c41409-44-" + i0 + "," + ("57c41409-43-" + i0),
        c: common_vendor.t(item.sku),
        d: common_vendor.t(item.subnumber),
        e: common_vendor.t(item.fulfillable),
        f: common_vendor.t(item.subprice),
        g: "57c41409-45-" + i0 + "," + ("57c41409-43-" + i0),
        h: index,
        i: "57c41409-43-" + i0 + ",57c41409-39"
      };
    }),
    aa: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    }),
    ab: common_vendor.p({
      isFull: true,
      title: "\u5B50SKU\u5217\u8868"
    })
  } : {}) : {}, {
    ac: $data.tabs.purchaseinfo.isactive
  }, $data.tabs.purchaseinfo.isactive ? {
    ad: common_vendor.t($data.material.supplier),
    ae: common_vendor.t($data.material.delivery_cycle),
    af: common_vendor.t($data.material.other_cost),
    ag: common_vendor.t($data.material.badrate),
    ah: common_vendor.t($data.material.productCode),
    ai: common_vendor.t($data.material.purchaseUrl),
    aj: common_vendor.f($data.stepWisePrice, (item, index, i0) => {
      return {
        a: common_vendor.t(item.price),
        b: "57c41409-52-" + i0 + "," + ("57c41409-51-" + i0),
        c: common_vendor.t(item.amount),
        d: "57c41409-53-" + i0 + "," + ("57c41409-51-" + i0),
        e: index,
        f: "57c41409-51-" + i0 + ",57c41409-47"
      };
    }),
    ak: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    }),
    al: common_vendor.p({
      isFull: true,
      title: "\u91C7\u8D2D\u4FE1\u606F"
    })
  } : {}, {
    am: $data.tabs.custominfo.isactive
  }, $data.tabs.custominfo.isactive ? {
    an: common_vendor.t($data.customs.nameEn),
    ao: common_vendor.t($data.customs.nameCn),
    ap: common_vendor.t($data.customs.unitprice),
    aq: common_vendor.t($data.customs.material),
    ar: common_vendor.t($data.customs.model),
    as: common_vendor.t($data.customs.customsCode),
    at: common_vendor.t($data.customs.materialUse),
    av: common_vendor.t($data.customs.brand),
    aw: common_vendor.t($data.customs.addfee),
    ax: common_vendor.t($options.booleanFuc($data.customs.iselectricity)),
    ay: common_vendor.t($options.booleanFuc($data.customs.isdanger)),
    az: common_vendor.p({
      isFull: true,
      title: "\u6D77\u5173\u4FE1\u606F"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/material/material.vue"]]);
wx.createPage(MiniProgramPage);

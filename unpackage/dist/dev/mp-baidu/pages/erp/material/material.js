"use strict";
var api_erp_material_material = require("../../../api/erp/material/material.js");
var common_vendor = require("../../../common/vendor.js");
require("../../../common/request.js");
const _sfc_main = {
  data() {
    return {
      mid: "",
      material: {},
      itemDim: {},
      pkgDim: {},
      boxDim: {},
      customs: {},
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
  methods: {
    booleanFuc(value) {
      if (value == true || value == 1 || value == "1") {
        return "\u662F";
      } else {
        return "\u5426";
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
              console.log(datas.material);
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
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_icons2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.material.image,
    b: common_vendor.t($data.material.sku),
    c: common_vendor.p({
      color: $data.material.color,
      type: "smallcircle-filled",
      size: "14"
    }),
    d: common_vendor.t($data.material.name),
    e: common_vendor.t($data.material.brand),
    f: common_vendor.t($data.material.specification),
    g: common_vendor.t($data.material.category),
    h: common_vendor.t($data.material.remark),
    i: common_vendor.t($data.material.ownername),
    j: common_vendor.t($options.dateFuc($data.material.effectivedate)),
    k: common_vendor.t($options.valueFormatter($data.itemDim.length)),
    l: common_vendor.t($options.valueFormatter($data.itemDim.width)),
    m: common_vendor.t($options.valueFormatter($data.itemDim.height)),
    n: common_vendor.t($options.valueFormatter($data.itemDim.weight)),
    o: common_vendor.t($options.valueFormatter($data.pkgDim.length)),
    p: common_vendor.t($options.valueFormatter($data.pkgDim.width)),
    q: common_vendor.t($options.valueFormatter($data.pkgDim.height)),
    r: common_vendor.t($options.valueFormatter($data.pkgDim.weight)),
    s: common_vendor.t($data.material.boxnum),
    t: common_vendor.t($options.valueFormatter($data.pkgDim.length)),
    v: common_vendor.t($options.valueFormatter($data.pkgDim.width)),
    w: common_vendor.t($options.valueFormatter($data.pkgDim.height)),
    x: common_vendor.t($options.valueFormatter($data.pkgDim.weight)),
    y: common_vendor.t($data.material.vatrate),
    z: common_vendor.t($data.material.operator),
    A: common_vendor.t($options.dateFuc($data.material.opttime)),
    B: common_vendor.t($data.material.creator),
    C: common_vendor.t($options.dateFuc($data.material.createdate)),
    D: $data.material.issfg == "0"
  }, $data.material.issfg == "0" ? {} : {}, {
    E: $data.material.issfg == "1"
  }, $data.material.issfg == "1" ? {} : {}, {
    F: $data.material.issfg == "2"
  }, $data.material.issfg == "2" ? {} : {}, {
    G: $data.material.issfg == "1"
  }, $data.material.issfg == "1" ? {
    H: common_vendor.f($data.assemblyList, (item, index, i0) => {
      return {
        a: index,
        b: item.image,
        c: "57c41409-6-" + i0 + "," + ("57c41409-5-" + i0),
        d: common_vendor.t(item.sku),
        e: common_vendor.t(item.subnumber),
        f: common_vendor.t(item.fulfillable),
        g: common_vendor.t(item.subprice),
        h: "57c41409-7-" + i0 + "," + ("57c41409-5-" + i0),
        i: "57c41409-5-" + i0 + ",57c41409-1"
      };
    }),
    I: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    })
  } : {}, {
    J: common_vendor.t($data.material.supplier),
    K: common_vendor.t($data.material.delivery_cycle),
    L: common_vendor.t($data.material.other_cost),
    M: common_vendor.t($data.material.badrate),
    N: common_vendor.t($data.material.productCode),
    O: common_vendor.t($data.material.purchaseUrl),
    P: common_vendor.f($data.stepWisePrice, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t(item.price),
        c: "57c41409-13-" + i0 + "," + ("57c41409-12-" + i0),
        d: common_vendor.t(item.amount),
        e: "57c41409-14-" + i0 + "," + ("57c41409-12-" + i0),
        f: "57c41409-12-" + i0 + ",57c41409-8"
      };
    }),
    Q: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    }),
    R: common_vendor.f($data.consumableList, (item, index, i0) => {
      return {
        a: index,
        b: item.image,
        c: "57c41409-20-" + i0 + "," + ("57c41409-19-" + i0),
        d: common_vendor.t(item.sku),
        e: common_vendor.t(item.amount),
        f: common_vendor.t(item.name),
        g: "57c41409-21-" + i0 + "," + ("57c41409-19-" + i0),
        h: "57c41409-19-" + i0 + ",57c41409-15"
      };
    }),
    S: common_vendor.p({
      border: true,
      stripe: true,
      emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
    }),
    T: common_vendor.t($data.customs.nameEn),
    U: common_vendor.t($data.customs.nameCn),
    V: common_vendor.t($data.customs.unitprice),
    W: common_vendor.t($data.customs.material),
    X: common_vendor.t($data.customs.model),
    Y: common_vendor.t($data.customs.customsCode),
    Z: common_vendor.t($data.customs.materialUse),
    aa: common_vendor.t($data.customs.brand),
    ab: common_vendor.t($data.customs.addfee),
    ac: common_vendor.t($options.booleanFuc($data.customs.iselectricity)),
    ad: common_vendor.t($options.booleanFuc($data.customs.isdanger))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/material/material.vue"]]);
swan.createPage(MiniProgramPage);

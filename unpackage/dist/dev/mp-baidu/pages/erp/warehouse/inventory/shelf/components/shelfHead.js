"use strict";
var api_erp_warehouse_warehouseApi = require("../../../../../../api/erp/warehouse/warehouseApi.js");
var common_vendor = require("../../../../../../common/vendor.js");
require("../../../../../../common/request.js");
const _sfc_main = {
  props: ["shelfid"],
  data() {
    return {
      data: {
        startname: "",
        usesize: "",
        expnumber: "",
        length: "",
        width: "",
        height: "",
        numbername: "",
        summary: { warehousename: "", skunum: "" }
      }
    };
  },
  onLoad(query) {
  },
  methods: {
    getInfo(shelfid) {
      let that = this;
      api_erp_warehouse_warehouseApi.warehouseApi.getShelfInfo({ "shelfid": shelfid }).then((data) => {
        if (data) {
          that.data = data;
          if (data.summary && data.summary.warehousename) {
            that.data.startname = data.summary.warehousename.substr(0, 1);
          }
          that.data.numbername = data.number + "" + data.name;
          that.$emit("onload", data);
        } else {
          that.$emit("onload", {});
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.data.startname),
    b: common_vendor.t($data.data.summary.warehousename),
    c: common_vendor.t($data.data.numbername),
    d: common_vendor.t($data.data.length),
    e: common_vendor.t($data.data.width),
    f: common_vendor.t($data.data.height),
    g: common_vendor.t($data.data.summary.skunum),
    h: common_vendor.t($data.data.usesize),
    i: common_vendor.t($data.data.expnumber)
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/components/shelfHead.vue"]]);
swan.createComponent(Component);

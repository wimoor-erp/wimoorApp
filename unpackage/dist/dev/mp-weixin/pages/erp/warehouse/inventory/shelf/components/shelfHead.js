"use strict";
const api_erp_warehouse_warehouseApi = require("../../../../../../api/erp/warehouse/warehouseApi.js");
const common_vendor = require("../../../../../../common/vendor.js");
require("../../../../../../utils/request.js");
require("../../../../../../store/index.js");
const UniIcons = () => "../../../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _sfc_main = {
  props: ["shelfid"],
  components: {
    UniIcons
  },
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
      },
      addressnum: "",
      shelftreepath: "",
      shelfid: ""
    };
  },
  onLoad(query) {
  },
  methods: {
    getInfo(addressnum, shelftreepath, shelfid) {
      if (!shelfid) {
        this.shelfid = "";
      } else {
        this.shelfid = shelfid;
      }
      this.addressnum = addressnum;
      this.shelftreepath = shelftreepath;
      this.loadData();
    },
    loadData() {
      let that = this;
      api_erp_warehouse_warehouseApi.warehouseApi.getShelfInfo({
        "shelfid": this.shelfid,
        "addressnum": this.addressnum,
        "shelftreepath": this.shelftreepath
      }).then((data) => {
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
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.data.startname),
    b: common_vendor.t($data.data.summary.warehousename),
    c: common_vendor.t($data.data.numbername),
    d: common_vendor.t($data.data.length),
    e: common_vendor.t($data.data.width),
    f: common_vendor.t($data.data.height),
    g: common_vendor.o($options.loadData),
    h: common_vendor.p({
      type: "loop",
      color: "#5e6d82",
      size: "24"
    }),
    i: common_vendor.t($data.data.summary.skunum),
    j: common_vendor.t($data.data.usesize),
    k: $data.data.summary.quantity
  }, $data.data.summary.quantity ? {
    l: common_vendor.t($data.data.summary.quantity)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/components/shelfHead.vue"]]);
wx.createComponent(Component);

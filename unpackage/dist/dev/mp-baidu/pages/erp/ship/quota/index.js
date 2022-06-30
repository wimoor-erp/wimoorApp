"use strict";
var common_util = require("../../../../common/util.js");
var api_erp_ship_quotaApi = require("../../../../api/erp/ship/quotaApi.js");
var common_vendor = require("../../../../common/vendor.js");
require("../../../../common/request.js");
const ShelfProduct = () => "./components/shelfproduct.js";
const _sfc_main = {
  components: {
    ShelfProduct
  },
  data() {
    return {
      shipmentid: "",
      createdate: "-",
      auditime: "-",
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
    if (query.q) {
      const q = decodeURIComponent(query.q);
      parseInt(query.scancode_time);
      if (q) {
        this.shipmentid = q.split("wxsc/")[1];
      }
    } else {
      try {
        this.shipmentid = query.shipmentid;
      } catch (error) {
      }
    }
    this.getquotaData();
  },
  methods: {
    getquotaData: function() {
      this.productListData = [];
      api_erp_ship_quotaApi.quotaApi.getQuotainfo(this.shipmentid).then((data) => {
        if (data) {
          this.quotaoderData = data;
          this.shipmentid = data.shipmentid;
          this.createdate = "\u521B\u5EFA\u4E8E" + data.createdate;
          this.auditime = common_util.util.dateFormat(data.auditime) + "\u5BA1\u6838";
          this.warehouseList[0].title = data.warehouse;
          this.warehouseList[1].title = data.groupname + "-" + data.country + "(" + data.center + ")";
          this.productListData = data.itemList;
          console.log(data.itemList);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_steps2 = common_vendor.resolveComponent("uni-steps");
  const _component_uni_section = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_ShelfProduct = common_vendor.resolveComponent("ShelfProduct");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_easycom_uni_steps2 + _component_uni_section + _easycom_uni_card2 + _easycom_uni_icons2 + _component_ShelfProduct + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_uni_steps = () => "../../../../uni_modules/uni-steps/components/uni-steps/uni-steps.js";
const _easycom_uni_card = () => "../../../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_icons = () => "../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_collapse_item = () => "../../../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_uni_steps + _easycom_uni_card + _easycom_uni_icons + _easycom_uni_collapse_item + _easycom_uni_collapse)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      options: $data.warehouseList,
      ["active-color"]: "#007AFF",
      active: $data.active,
      direction: "column"
    }),
    b: common_vendor.p({
      padding: true
    }),
    c: common_vendor.t($data.quotaoderData.skuamount),
    d: common_vendor.t($data.quotaoderData.sumQuantity),
    e: common_vendor.p({
      title: $data.shipmentid,
      ["sub-title"]: $data.createdate,
      extra: $data.auditime,
      margin: "8px"
    }),
    f: common_vendor.p({
      type: "line"
    }),
    g: common_vendor.p({
      type: "compose",
      size: "16"
    }),
    h: common_vendor.t($data.quotaoderData.remark),
    i: common_vendor.p({
      margin: "8px"
    }),
    j: common_vendor.f($data.productListData, (item, k0, i0) => {
      return common_vendor.e({
        a: "1be8c59e-7-" + i0 + "," + ("1be8c59e-6-" + i0),
        b: common_vendor.p({
          item,
          isAssemblyItem: false
        }),
        c: item.issfg == 1 && item.assemblyList.length > 0
      }, item.issfg == 1 && item.assemblyList.length > 0 ? {
        d: common_vendor.f(item.assemblyList, (subproData, k1, i1) => {
          return {
            a: "1be8c59e-10-" + i0 + "-" + i1 + "," + ("1be8c59e-9-" + i0),
            b: common_vendor.p({
              item: subproData,
              isAssemblyItem: true
            })
          };
        }),
        e: _ctx.index,
        f: {
          "afterSave": common_vendor.o($options.getquotaData)
        },
        g: "1be8c59e-9-" + i0 + "," + ("1be8c59e-8-" + i0),
        h: common_vendor.p({
          title: "\u5B50\u4EA7\u54C1",
          border: "false"
        })
      } : {}, {
        i: "1be8c59e-8-" + i0 + "," + ("1be8c59e-6-" + i0),
        j: "1be8c59e-6-" + i0
      });
    }),
    k: _ctx.index,
    l: {
      "afterSave": common_vendor.o($options.getquotaData)
    },
    m: common_vendor.p({
      margin: "8px",
      padding: "0px 8px"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/ship/quota/index.vue"]]);
swan.createPage(MiniProgramPage);

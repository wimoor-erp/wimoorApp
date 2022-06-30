"use strict";
var common_vendor = require("../../../../common/vendor.js");
const ShelfHead = () => "./shelf/components/shelfHead.js";
const _sfc_main = {
  data() {
    return {
      shelfid: "",
      data: {}
    };
  },
  components: {
    ShelfHead
  },
  onLoad(query) {
    if (query.q) {
      console.log("\u5916\u90E8\u626B\u7801\u6A21\u5F0F");
      const q = decodeURIComponent(query.q);
      parseInt(query.scancode_time);
      if (q) {
        this.shelfid = q.split("shelf/")[1];
      }
    } else {
      console.log("\u5185\u90E8\u626B\u7801\u6A21\u5F0F");
      const payload = query.detailDate || query.payload;
      try {
        this.data = JSON.parse(decodeURIComponent(payload));
        this.shelfid = this.data.shelfid;
      } catch (error) {
      }
    }
    this.$refs.myhead.getInfo(this.shelfid);
  },
  methods: {
    openAddUrl() {
      let detail = {
        shelfid: this.shelfid,
        ftype: "add"
      };
      common_vendor.index.navigateTo({
        url: "./shelf/addstock?detailDate=" + encodeURIComponent(JSON.stringify(detail))
      });
    },
    openSubUrl() {
      let detail = {
        shelfid: this.shelfid,
        ftype: "sub"
      };
      common_vendor.index.navigateTo({
        url: "./shelf/outstock?detailDate=" + encodeURIComponent(JSON.stringify(detail))
      });
    }
  }
};
if (!Array) {
  const _component_ShelfHead = common_vendor.resolveComponent("ShelfHead");
  _component_ShelfHead();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("myhead", "8403c484-0"),
    b: common_vendor.p({
      shelfid: $data.shelfid
    }),
    c: common_vendor.o((...args) => $options.openAddUrl && $options.openAddUrl(...args)),
    d: common_vendor.o((...args) => $options.openSubUrl && $options.openSubUrl(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/addshelf.vue"]]);
swan.createPage(MiniProgramPage);

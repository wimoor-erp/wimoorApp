"use strict";
var common_vendor = require("../../../../../common/vendor.js");
const ShelfHead = () => "./components/shelfHead.js";
const InvList = () => "./components/invList.js";
const _sfc_main = {
  components: {
    ShelfHead,
    InvList
  },
  data() {
    return {
      search: "",
      placeholderStyle: "color:#dedede;font-size:14px",
      styles: {
        color: "#000",
        borderColor: "#eee"
      },
      shelfid: "",
      warehouseid: "",
      isall: true
    };
  },
  onLoad(event) {
    if (event) {
      const payload = event.detailDate || event.payload;
      try {
        let data = JSON.parse(decodeURIComponent(payload));
        this.shelfid = data.shelfid;
        this.$refs.myhead.getInfo(this.shelfid);
      } catch (error) {
      }
    }
  },
  methods: {
    infoLoad(head) {
      this.warehouseid = head.warehouseid;
      this.refreshTable();
    },
    refreshTable() {
      this.$nextTick(() => {
        this.$refs.invlist.refreshList(this.warehouseid, this.shelfid, this.search);
      });
    },
    afterSubmit() {
      this.$refs.myhead.getInfo(this.shelfid);
    },
    input(e) {
      this.search = e;
      this.refreshTable();
    }
  }
};
if (!Array) {
  const _component_ShelfHead = common_vendor.resolveComponent("ShelfHead");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _component_InvList = common_vendor.resolveComponent("InvList");
  (_component_ShelfHead + _easycom_uni_easyinput2 + _component_InvList)();
}
const _easycom_uni_easyinput = () => "../../../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("myhead", "76099abc-0"),
    b: common_vendor.o($options.infoLoad),
    c: common_vendor.p({
      shelfid: $data.shelfid
    }),
    d: common_vendor.o($options.input),
    e: common_vendor.o(($event) => $data.search = $event),
    f: common_vendor.p({
      type: "text",
      styles: $data.styles,
      placeholderStyle: $data.placeholderStyle,
      placeholder: "\u8BF7\u8F93\u5165SKU",
      modelValue: $data.search
    }),
    g: common_vendor.sr("invlist", "76099abc-2"),
    h: common_vendor.o(($event) => $options.afterSubmit()),
    i: common_vendor.p({
      editable: true
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/outstock.vue"]]);
wx.createPage(MiniProgramPage);

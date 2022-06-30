"use strict";
var common_vendor = require("../../../../../common/vendor.js");
const ShelfHead = () => "./components/shelfHead.js";
const InvList = () => "./components/invList.js";
const WhsList = () => "./components/whsList.js";
const _sfc_main = {
  components: {
    ShelfHead,
    WhsList,
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
      tabclassAct: "flex-item text-center activetab",
      tabclassNor: "flex-item text-center",
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
      if (this.tabclassAct == "flex-item text-center activetab") {
        this.$nextTick(() => {
          this.$refs.whslist.refreshList(this.warehouseid, this.shelfid, this.search);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.invlist.refreshList(this.warehouseid, this.shelfid, this.search);
        });
      }
    },
    changeINV() {
      this.tabclassAct = "flex-item text-center";
      this.tabclassNor = "flex-item text-center activetab";
      this.isall = false;
      this.refreshTable();
    },
    changeWH() {
      this.tabclassNor = "flex-item text-center";
      this.tabclassAct = "flex-item text-center activetab";
      this.isall = true;
      this.refreshTable();
    },
    afterSubmit() {
      this.tabclassAct = "flex-item text-center";
      this.tabclassNor = "flex-item text-center activetab";
      this.isall = false;
      console.log("afterSubmit");
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
  const _component_WhsList = common_vendor.resolveComponent("WhsList");
  const _component_InvList = common_vendor.resolveComponent("InvList");
  (_component_ShelfHead + _easycom_uni_easyinput2 + _component_WhsList + _component_InvList)();
}
const _easycom_uni_easyinput = () => "../../../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("myhead", "317d36af-0"),
    b: {
      "onload": common_vendor.o($options.infoLoad)
    },
    c: common_vendor.p({
      shelfid: $data.shelfid
    }),
    d: {
      "updateModelValue": common_vendor.o(($event) => $data.search = $event),
      "input": common_vendor.o($options.input)
    },
    e: common_vendor.p({
      type: "text",
      styles: $data.styles,
      placeholderStyle: $data.placeholderStyle,
      placeholder: "\u8BF7\u8F93\u5165SKU",
      modelValue: $data.search
    }),
    f: common_vendor.n($data.tabclassAct),
    g: common_vendor.o((...args) => $options.changeWH && $options.changeWH(...args)),
    h: common_vendor.n($data.tabclassNor),
    i: common_vendor.o((...args) => $options.changeINV && $options.changeINV(...args)),
    j: $data.isall
  }, $data.isall ? {
    k: common_vendor.sr("whslist", "317d36af-2"),
    l: {
      "submit": common_vendor.o($options.afterSubmit)
    }
  } : {}, {
    m: !$data.isall
  }, !$data.isall ? {
    n: common_vendor.sr("invlist", "317d36af-3"),
    o: common_vendor.p({
      editable: false
    })
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/addstock.vue"]]);
swan.createPage(MiniProgramPage);

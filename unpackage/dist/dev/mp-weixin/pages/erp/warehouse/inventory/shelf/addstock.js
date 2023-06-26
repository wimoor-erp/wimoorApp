"use strict";
const common_vendor = require("../../../../../common/vendor.js");
require("../../../../../utils/request.js");
require("../../../../../store/index.js");
const ShelfHead = () => "./components/shelfHead.js";
const WhsList = () => "./components/whsList.js";
const _sfc_main = {
  components: {
    ShelfHead,
    WhsList
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
      formid: "",
      opttype: "",
      addressnum: "",
      shelftreepath: "",
      addressid: "",
      amount: "",
      isall: true,
      data: {},
      materialid: ""
    };
  },
  onLoad(event) {
    if (event) {
      const payload = event.detailData || event.payload;
      try {
        let data2 = JSON.parse(decodeURIComponent(payload));
        this.data = data2;
        this.addressnum = data2.addressnum;
        this.shelftreepath = data2.shelftreepath;
        this.materialid = data2.materialid;
        this.shelfid = this.data.shelfid;
        this.amount = this.data.amount;
        this.formid = this.data.formid;
        this.opttype = this.data.opttype;
      } catch (error) {
        this.data = JSON.parse(payload);
        this.addressnum = this.data.addressnum;
        this.shelftreepath = this.data.shelftreepath;
        this.shelfid = this.data.shelfid;
        this.materialid = data.materialid;
        this.amount = this.data.amount;
        this.formid = this.data.formid;
        this.opttype = this.data.opttype;
      }
    }
  },
  onShow() {
    this.$refs.myhead.getInfo(this.addressnum, this.shelftreepath, this.shelfid);
  },
  methods: {
    infoLoad(head) {
      this.addressid = head.addressid;
      this.shelfid = head.id;
      this.refreshTable();
    },
    refreshTable() {
      this.$nextTick(() => {
        this.$refs.whslist.refreshList(
          this.addressid,
          this.shelfid,
          this.search,
          this.materialid,
          this.amount,
          this.formid,
          this.opttype
        );
      });
    },
    afterSubmit(formid) {
      let detail = {
        addressnum: this.addressnum,
        shelftreepath: this.shelftreepath,
        ftype: "add",
        materialid: this.data.materialid,
        shelfid: this.shelfid,
        amount: this.amount,
        formid,
        formtype: this.opttype
      };
      common_vendor.index.navigateTo({
        url: "./result?detailData=" + encodeURIComponent(JSON.stringify(detail))
      });
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
  (_component_ShelfHead + _easycom_uni_easyinput2 + _component_WhsList)();
}
const _easycom_uni_easyinput = () => "../../../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("myhead", "317d36af-0"),
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
    g: common_vendor.sr("whslist", "317d36af-2"),
    h: common_vendor.o($options.afterSubmit)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/addstock.vue"]]);
wx.createPage(MiniProgramPage);

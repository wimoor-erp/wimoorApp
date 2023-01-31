"use strict";
const common_vendor = require("../../../../../common/vendor.js");
require("../../../../../utils/request.js");
require("../../../../../store/index.js");
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
      addressnum: "",
      shelftreepath: "",
      placeholderStyle: "color:#dedede;font-size:14px",
      styles: {
        color: "#000",
        borderColor: "#eee"
      },
      shelfid: "",
      addressid: "",
      materialid: "",
      amount: "",
      isall: true
    };
  },
  onLoad(event) {
    if (event) {
      const payload = event.detailData || event.payload;
      try {
        let data = JSON.parse(decodeURIComponent(payload));
        this.addressnum = data.addressnum;
        this.shelftreepath = data.shelftreepath;
        this.materialid = data.materialid;
        this.shelfid = data.shelfid;
        this.amount = data.amount;
        this.$refs.myhead.getInfo(this.addressnum, this.shelftreepath);
      } catch (error) {
        let data = payload;
        this.addressnum = data.addressnum;
        this.shelftreepath = data.shelftreepath;
        this.materialid = data.materialid;
        this.shelfid = data.shelfid;
        this.amount = data.amount;
        this.$refs.myhead.getInfo(this.addressnum, this.shelftreepath);
      }
    }
  },
  methods: {
    infoLoad(head) {
      this.addressid = head.addressid;
      this.shelfid = head.id;
      this.refreshTable();
    },
    refreshTable() {
      this.$nextTick(() => {
        this.$refs.invlist.refreshList(this.addressid, this.shelfid, this.search, this.materialid, this.amount);
      });
    },
    afterSubmit(formid) {
      let detail = {
        addressnum: this.addressnum,
        shelftreepath: this.shelftreepath,
        ftype: "sub",
        materialid: this.materialid,
        shelfid: this.shelfid,
        amount: this.amount,
        "formid": formid,
        "formtype": this.opttype
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
    h: common_vendor.o($options.afterSubmit),
    i: common_vendor.p({
      editable: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/outstock.vue"]]);
wx.createPage(MiniProgramPage);

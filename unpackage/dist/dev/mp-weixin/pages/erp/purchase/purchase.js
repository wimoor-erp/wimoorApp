"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_erp_purchase_purchase = require("../../../api/erp/purchase/purchase.js");
require("../../../utils/request.js");
require("../../../store/index.js");
const SearchHeader = () => "../../../components/searchheader/base.js";
const Warehouse = () => "../../../components/header/warehouse.js";
const Status = () => "./components/status.js";
const DatePicker = () => "../../../components/header/datepicker.js";
const _sfc_main = {
  components: { Warehouse, SearchHeader, Status, DatePicker },
  data() {
    return {
      search: "",
      placeholderStyle: "color:#ffa400;font-size:14px",
      styles: {
        color: "#ffa400",
        borderColor: "#ffa400"
      },
      listData: [],
      last_id: "",
      reload: false,
      auditstatus: "4",
      warehouse: "",
      datetype: "createdate",
      fromDate: "",
      toDate: "",
      status: "more",
      contentText: {
        contentdown: "\u4E0A\u62C9\u52A0\u8F7D\u66F4\u591A",
        contentrefresh: "\u52A0\u8F7D\u4E2D",
        contentnomore: "\u6CA1\u6709\u66F4\u591A"
      },
      ftype: "sku",
      offset: 1,
      index: 0,
      items: ["SKU", "\u8BA2\u5355\u53F7", "\u8FD0\u5355\u53F7"],
      values: ["sku", "order", "logistics"]
    };
  },
  onShow() {
    this.getList();
  },
  onPullDownRefresh() {
    this.reload = true;
    this.last_id = "";
    this.getList();
  },
  onReachBottom() {
    this.status = "more";
    this.getList();
  },
  methods: {
    searchOrder(order) {
      this.listData = [];
      this.offset = 1;
      this.reload = true;
      this.search = order;
      this.index = 1;
      this.ftype = "order";
      this.getList();
    },
    warehouseChange(val) {
      this.warehouse = val;
    },
    doHandlerQuery() {
      this.$refs["searchheaderRef"].closeDrawer();
      this.searchOrder(this.search);
    },
    statusChange(val) {
      this.auditstatus = val;
    },
    suppliernameFuc(value) {
      if (value == void 0 || value == null || value == "") {
        return "--";
      } else {
        return value;
      }
    },
    paystatusFuc(value) {
      if (value == "1" || value == 1) {
        return "\u5DF2\u4ED8\u6B3E";
      } else {
        return "\u672A\u4ED8\u6B3E";
      }
    },
    deliverydateFuc(value) {
      if (value != null && value != void 0 && value != "") {
        return value.split(" ")[0];
      } else {
        return "--";
      }
    },
    startChange(start) {
      this.fromDate = start;
    },
    endChange(end) {
      this.toDate = end + " 23:59:59";
    },
    statusFuc(value) {
      if (value == 0 || value == "0") {
        return "\u5DF2\u9000\u56DE";
      } else if (value == 1 || value == "1") {
        return "\u5F85\u5BA1\u6838";
      } else if (value == 2 || value == "2") {
        return "\u6267\u884C\u4E2D";
      } else if (value == 3 || value == "3") {
        return "\u5DF2\u5B8C\u6210";
      }
    },
    refreshtab() {
      this.offset = 1;
      this.search = "";
      this.ftype = "sku";
      this.index = 0;
      this.reload = true;
      this.getList();
    },
    scanHandler() {
      var self = this;
      common_vendor.index.scanCode({
        success: function(res) {
          if (res.result) {
            self.listData = [];
            self.offset = 1;
            self.index = 2;
            self.ftype = "logistics";
            self.reload = true;
            self.search = res.result;
            self.getList();
          }
        }
      });
    },
    onchange(e) {
      this.index = e.detail.value;
      this.ftype = this.values[this.index];
      this.listData = [];
      this.offset = 1;
      this.reload = true;
      this.getList();
    },
    input(e) {
      this.listData = [];
      this.offset = 1;
      this.reload = true;
      this.search = e;
      this.getList();
    },
    getList() {
      if (this.last_id) {
        this.status = "loading";
      }
      if (this.auditstatus == "4") {
        this.toDate = "";
      }
      api_erp_purchase_purchase.purchaseApi.list({
        sort: "sku",
        order: "desc",
        currentpage: this.offset,
        pagesize: 10,
        auditstatus: this.auditstatus,
        ftype: this.ftype,
        datetype: "createdate",
        search: this.search,
        toDate: this.toDate,
        fromDate: this.fromDate,
        warehouse: this.warehouse,
        minid: this.last_id
      }).then((data) => {
        if (data && data.records && data.records.length > 0) {
          let list = data.records;
          if (list.length > 0) {
            this.listData = this.reload ? list : this.listData.concat(list);
            this.last_id = list[list.length - 1].id;
            this.reload = false;
            if (list.length < 10) {
              this.status = "nomore";
            }
            this.offset = this.offset + 1;
          } else {
            this.status = "nomore";
            this.reload = false;
          }
        } else {
          this.status = "nomore";
          this.reload = false;
        }
      });
    },
    goMaterialInfoPage(mid) {
      common_vendor.index.navigateTo({
        url: "../material/material?materialid=" + mid
      });
    },
    goDetail: function(row) {
      common_vendor.index.navigateTo({
        url: "./receive?detailData=" + encodeURIComponent(JSON.stringify(row))
      });
    },
    aderror(e) {
    }
  }
};
if (!Array) {
  const _component_Warehouse = common_vendor.resolveComponent("Warehouse");
  const _component_Status = common_vendor.resolveComponent("Status");
  const _component_DatePicker = common_vendor.resolveComponent("DatePicker");
  const _component_SearchHeader = common_vendor.resolveComponent("SearchHeader");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_component_Warehouse + _component_Status + _component_DatePicker + _component_SearchHeader + _easycom_uni_easyinput2 + _easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.warehouseChange),
    b: common_vendor.o($options.statusChange),
    c: common_vendor.o($options.startChange),
    d: common_vendor.p({
      title: "\u5F00\u59CB\u65E5\u671F",
      days: 30
    }),
    e: common_vendor.o($options.endChange),
    f: common_vendor.p({
      title: "\u7ED3\u675F\u65E5\u671F",
      days: 0
    }),
    g: common_vendor.o((...args) => $options.doHandlerQuery && $options.doHandlerQuery(...args)),
    h: common_vendor.sr("searchheaderRef", "7314a949-0"),
    i: common_vendor.t($data.items[$data.index]),
    j: common_vendor.o((...args) => $options.onchange && $options.onchange(...args)),
    k: $data.index,
    l: $data.items,
    m: common_vendor.o($options.refreshtab),
    n: common_vendor.o($options.input),
    o: common_vendor.o(($event) => $data.search = $event),
    p: common_vendor.p({
      styles: $data.styles,
      placeholderStyle: $data.placeholderStyle,
      suffixIcon: "loop",
      placeholder: "\u8BF7\u8F93\u5165\u5185\u5BB9\u81EA\u52A8\u67E5\u8BE2",
      modelValue: $data.search
    }),
    q: common_vendor.o($options.scanHandler),
    r: common_vendor.p({
      color: "#FFA400",
      type: "scan",
      size: "28"
    }),
    s: common_vendor.f($data.listData, (value, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.goMaterialInfoPage(value.materialid)),
        b: value.image,
        c: common_vendor.t(value.sku),
        d: value.issfg == "1"
      }, value.issfg == "1" ? {} : {}, {
        e: common_vendor.t(value.amount),
        f: common_vendor.t($options.statusFuc(value.auditstatus)),
        g: common_vendor.t($options.deliverydateFuc(value.deliverydate)),
        h: common_vendor.t($options.paystatusFuc(value.paystatus)),
        i: common_vendor.t($options.suppliernameFuc(value.suppliername)),
        j: common_vendor.t(value.number),
        k: "7314a949-7-" + i0,
        l: common_vendor.o(($event) => $options.searchOrder(value.number)),
        m: common_vendor.t(value.creatorname),
        n: common_vendor.t(value.createdate),
        o: common_vendor.o(($event) => $options.goDetail(value)),
        p: index
      });
    }),
    t: common_vendor.p({
      color: "#787878",
      type: "search",
      size: "12"
    }),
    v: common_vendor.p({
      status: $data.status,
      ["icon-size"]: 16,
      ["content-text"]: $data.contentText
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/purchase/purchase.vue"]]);
wx.createPage(MiniProgramPage);

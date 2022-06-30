"use strict";
var common_vendor = require("../../../../../../common/vendor.js");
var api_erp_warehouse_warehouseApi = require("../../../../../../api/erp/warehouse/warehouseApi.js");
require("../../../../../../common/request.js");
const _sfc_main = {
  props: ["editable"],
  data() {
    return {
      materials: [],
      checkalldisable: true,
      warehouseid: "",
      search: "",
      isall: true,
      numbers: 1,
      loading: false,
      listData: [],
      status: "more",
      contentText: {
        contentdown: "\u4E0A\u62C9\u52A0\u8F7D\u66F4\u591A",
        contentrefresh: "\u52A0\u8F7D\u4E2D",
        contentnomore: "\u6CA1\u6709\u66F4\u591A"
      },
      pageSize: 10,
      pageCurrent: 1,
      total: 0,
      shelfid: "",
      checknums: 0,
      checkallstatus: false
    };
  },
  onLoad(event) {
  },
  onPullDownRefresh() {
    this.reload = true;
    this.last_id = "";
    this.status = "more";
    this.getList();
  },
  onReachBottom() {
    this.reload = false;
    this.getList();
  },
  methods: {
    goMaterialInfoPage(mid) {
      common_vendor.index.navigateTo({
        url: "../../../material/material?materialid=" + mid
      });
    },
    refreshList(warehouseid, shelfid, search) {
      this.warehouseid = warehouseid;
      this.shelfid = shelfid;
      this.listData = [];
      this.status = "more";
      this.reload = true;
      if (search) {
        this.search = search;
      } else {
        this.search = "";
      }
      this.pageCurrent = 1;
      this.getList();
    },
    skuFunc(value) {
      if (value && value.length > 20) {
        return value.substr(0, 20) + "...";
      } else {
        if (value == void 0 || value == "" || value == null) {
          return "--";
        } else {
          return value;
        }
      }
    },
    nameFunc(value) {
      if (value && value.length > 15) {
        return value.substr(0, 15) + "...";
      } else {
        if (value == void 0 || value == "" || value == null) {
          return "--";
        } else {
          return value;
        }
      }
    },
    checkall(e, v) {
      if (this.checkalldisable == true) {
        common_vendor.index.showToast({
          title: "\u8BF7\u62C9\u5230\u5E95\u90E8\u624D\u80FD\u5168\u9009\uFF01",
          icon: "none",
          duration: 2e3
        });
      } else {
        if (e.detail.value[0] == "all") {
          this.checkallstatus = true;
        } else {
          this.checkallstatus = false;
        }
        if (this.listData) {
          if (this.checkallstatus == true) {
            this.materials = [];
            this.listData.forEach((item) => {
              item.checkstatus = true;
              this.materials.push(item.materialid);
            });
            this.checknums = this.materials.length;
          } else {
            this.materials = [];
            this.listData.forEach((item) => {
              item.checkstatus = false;
            });
            this.checknums = this.materials.length;
          }
        }
      }
    },
    checkboxChange: function(e) {
      var values = e.detail.value;
      this.materials = values;
      this.checknums = this.materials.length;
      if (this.checknums != this.listData.length) {
        this.checkallstatus = false;
      } else {
        this.checkallstatus = true;
      }
      let that = this;
      this.listData.forEach((item) => {
        if (that.materials.includes(item.materialid)) {
          if (item.checkstatus == false)
            item.checkstatus = true;
        } else {
          if (item.checkstatus == true)
            item.checkstatus = false;
        }
      });
    },
    getList() {
      this.total = 0;
      if (this.status == "nomore") {
        return;
      }
      if (this.status == "more") {
        this.status = "loading";
      }
      var data = {
        search: this.search,
        shelfid: this.shelfid,
        warehouseid: this.warehouseid,
        allchildren: "false",
        pagesize: this.pageSize,
        currentpage: this.pageCurrent
      };
      api_erp_warehouse_warehouseApi.warehouseApi.getShelfInventoryList(data).then((data2) => {
        if (data2.records) {
          let list = data2.records;
          if (list.length > 0) {
            list.forEach((item) => {
              item.checkstatus = false;
            });
            this.listData = this.reload ? list : this.listData.concat(list);
            if (this.pageCurrent >= data2.total / 10) {
              this.status = "nomore";
              this.reload = false;
              this.checkalldisable = false;
            } else {
              this.pageCurrent = this.pageCurrent + 1;
              this.reload = false;
              this.status = "more";
            }
            return;
          }
        }
        this.reload = false;
        this.status = "nomore";
        this.checkalldisable = false;
      });
    },
    inputNumber(value) {
    },
    submit() {
      var that = this;
      if (that.materials.length > 0) {
        var list = [];
        that.listData.forEach(function(item, index) {
          if (that.materials.includes(item.materialid)) {
            var row = {};
            row.materialid = item.materialid;
            row.quantity = item.amount;
            row.opt = 0;
            row.shelfid = that.shelfid;
            list.push(row);
          }
        });
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u786E\u8BA4\u662F\u5426\u64CD\u4F5C?",
          success: function(res) {
            if (res.confirm) {
              api_erp_warehouse_warehouseApi.warehouseApi.invSub(list).then((data) => {
                that.checknums = 0;
                that.checkalldisable = true;
                that.$emit("submit", list);
                common_vendor.index.showToast({
                  title: "\u4E0B\u67B6\u6210\u529F",
                  icon: "none",
                  duration: 3e3
                });
              });
            } else if (res.cancel)
              ;
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u4EA7\u54C1",
          icon: "none",
          duration: 2e3
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.listData, (value, index, i0) => {
      return common_vendor.e({
        a: index
      }, $props.editable ? {
        b: value.materialid,
        c: value.checkstatus
      } : {}, {
        d: common_vendor.o(($event) => $options.goMaterialInfoPage(value.materialid)),
        e: value.image,
        f: common_vendor.t($options.nameFunc(value.name)),
        g: common_vendor.t($options.skuFunc(value.sku)),
        h: common_vendor.t(value.quantity)
      }, $props.editable ? {
        i: value.amount,
        j: value.amount,
        k: common_vendor.o(($event) => value.amount = $event.detail.value)
      } : {});
    }),
    b: $props.editable,
    c: $props.editable,
    d: common_vendor.o((...args) => $options.checkboxChange && $options.checkboxChange(...args)),
    e: common_vendor.p({
      status: $data.status,
      ["icon-size"]: 16,
      ["content-text"]: $data.contentText
    }),
    f: $props.editable
  }, $props.editable ? {
    g: $data.checkalldisable,
    h: $data.checkallstatus,
    i: common_vendor.o((...args) => $options.checkall && $options.checkall(...args)),
    j: common_vendor.t($data.checknums),
    k: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  } : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/components/invList.vue"]]);
swan.createComponent(Component);

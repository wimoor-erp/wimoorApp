"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const api_erp_warehouse_warehouseApi = require("../../../../../../api/erp/warehouse/warehouseApi.js");
require("../../../../../../utils/request.js");
require("../../../../../../store/index.js");
if (!Math) {
  GlobalTable();
}
const GlobalTable = () => "../../../../../../components/globaltable/checktable.js";
const _sfc_main = {
  __name: "invList",
  props: {
    editable: false
  },
  emits: ["submit"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const globalTableRef = common_vendor.ref(GlobalTable);
    const state = common_vendor.reactive({
      queryParam: {},
      tableOption: { key: "materialid", submitTitle: "\u4E0B\u67B6" },
      tableData: { records: [], total: 0 }
    });
    const { tableData, queryParam, tableOption } = common_vendor.toRefs(state);
    const { editable } = common_vendor.toRefs(props);
    function goMaterialInfoPage(mid) {
      common_vendor.index.navigateTo({
        url: "../../../material/material?materialid=" + mid
      });
    }
    function refreshList(addressid, shelfid, search, materialid) {
      state.queryParam = {
        search: "",
        shelfid: "",
        addressid,
        allchildren: "false",
        materialid: "",
        searchtype: "sku",
        order: "desc",
        sort: "quantity"
      };
      state.queryParam.shelfid = shelfid;
      state.queryParam.materialid = materialid;
      if (search) {
        state.queryParam.search = search;
      } else {
        state.queryParam.search = "";
        state.queryParam.searchtype = null;
      }
      queryHandler();
    }
    function skuFunc(value) {
      if (value == void 0 || value == "" || value == null) {
        return "--";
      } else {
        return value;
      }
    }
    function nameFunc(value) {
      if (value == void 0 || value == "" || value == null) {
        return "--";
      } else {
        return value;
      }
    }
    function inputChange(row) {
      if (row.amount && row.amount != row.quantity) {
        globalTableRef.value.checkByKey(row.materialid);
      } else if (!row.amount) {
        row.amount = row.quantity;
      }
    }
    function inputFocus(row) {
      if (!row.amount) {
        row.amount = "";
      }
    }
    function submit(rows) {
      var list = [];
      rows.forEach(function(item, index) {
        if (item && item.amount) {
          var row = {};
          row.materialid = item.materialid;
          row.quantity = item.amount;
          row.opt = 1;
          row.formtype = "direct";
          row.shelfid = state.queryParam.shelfid;
          list.push(row);
        }
      });
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u8BF7\u786E\u8BA4\u662F\u5426\u64CD\u4F5C?",
        success: function(res) {
          if (res.confirm) {
            api_erp_warehouse_warehouseApi.warehouseApi.invSub(list).then((data) => {
              common_vendor.index.showToast({
                title: "\u4E0B\u67B6\u6210\u529F",
                icon: "none",
                duration: 3e3
              });
              emit("submit", data);
            });
          }
        }
      });
    }
    function queryHandler() {
      globalTableRef.value.loadTable(state.queryParam);
    }
    function loadTable(param) {
      api_erp_warehouse_warehouseApi.warehouseApi.getShelfInventoryList(param).then((data) => {
        if (data) {
          if (data.records) {
            data.records.forEach((item) => {
              item.amount = item.quantity;
            });
            state.tableData.records = data.records;
            state.tableData.total = data.total;
          }
        } else {
          state.tableData.records = [];
          state.tableData.total = 0;
        }
      });
    }
    expose({
      refreshList
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.w(({
          row
        }, s0, i0) => {
          return common_vendor.e({
            a: common_vendor.o(($event) => goMaterialInfoPage(row.materialid)),
            b: row.image,
            c: common_vendor.t(nameFunc(row.name)),
            d: common_vendor.t(skuFunc(row.sku)),
            e: common_vendor.t(row.quantity)
          }, common_vendor.unref(editable) ? {
            f: row.amount,
            g: common_vendor.o(($event) => inputFocus(row)),
            h: common_vendor.o(($event) => inputChange(row)),
            i: row.amount,
            j: common_vendor.o(common_vendor.m(($event) => row.amount = $event.detail.value, {
              number: true
            }))
          } : {}, {
            k: i0,
            l: s0
          });
        }, {
          name: "d",
          path: "a",
          vueId: "0efdaed0-0"
        }),
        b: common_vendor.unref(editable),
        c: common_vendor.sr(globalTableRef, "0efdaed0-0", {
          "k": "globalTableRef"
        }),
        d: common_vendor.o(submit),
        e: common_vendor.o(loadTable),
        f: common_vendor.p({
          option: common_vendor.unref(tableOption),
          tableData: common_vendor.unref(tableData)
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/components/invList.vue"]]);
wx.createComponent(Component);

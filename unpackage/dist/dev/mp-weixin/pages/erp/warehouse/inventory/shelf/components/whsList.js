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
  __name: "whsList",
  emits: ["submit"],
  setup(__props, { expose, emit }) {
    const globalTableRef = common_vendor.ref(GlobalTable);
    const state = common_vendor.reactive({
      queryParam: {},
      tableOption: { key: "id", submitTitle: "\u4E0A\u67B6" },
      tableData: { records: [], total: 0 },
      optamount: ""
    });
    const { tableData, queryParam, tableOption } = common_vendor.toRefs(state);
    function goMaterialInfoPage(mid) {
      common_vendor.index.navigateTo({
        url: "../../../material/material?materialid=" + mid
      });
    }
    function refreshList(addressid, shelfid, search, materialid, amount, formid, formtype) {
      state.queryParam = {
        search: "",
        shelfid: "",
        addressid: "",
        allchildren: "false",
        materialid: "",
        searchtype: "sku"
      };
      state.queryParam.addressid = addressid;
      state.queryParam.shelfid = shelfid;
      state.queryParam.materialid = materialid;
      state.queryParam.formid = formid;
      state.queryParam.formtype = formtype;
      state.optamount = amount;
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
      if (row.amount && row.amount != row.fulfillable) {
        globalTableRef.value.checkByKey(row.id);
      } else if (!row.amount) {
        row.amount = row.fulfillable;
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
        var row = {};
        if (item && item.amount) {
          row.materialid = item.id;
          row.quantity = item.amount;
          row.opt = 1;
          row.formtype = "direct";
          row.shelfid = state.queryParam.shelfid;
          if (state.queryParam.materialid) {
            if (state.queryParam.formid) {
              row.formid = state.queryParam.formid;
            }
            if (state.queryParam.formtype) {
              row.formtype = state.queryParam.formtype;
            }
          }
          list.push(row);
        }
      });
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u8BF7\u786E\u8BA4\u662F\u5426\u64CD\u4F5C?",
        success: function(res) {
          if (res.confirm) {
            api_erp_warehouse_warehouseApi.warehouseApi.invAdd(list).then((data) => {
              common_vendor.index.showToast({
                title: "\u4E0A\u67B6\u6210\u529F",
                icon: "none",
                duration: 3e3
              });
              emit("submit", data);
            });
          } else if (res.cancel)
            ;
        }
      });
    }
    function queryHandler() {
      globalTableRef.value.loadTable(state.queryParam);
    }
    function loadTable(param) {
      api_erp_warehouse_warehouseApi.warehouseApi.getShelfList(param).then((data) => {
        if (data) {
          if (data.records) {
            data.records.forEach((item) => {
              if (state.queryParam.materialid && state.optamount) {
                item.amount = state.optamount;
              } else {
                item.amount = item.quantity;
              }
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
          return {
            a: common_vendor.o(($event) => goMaterialInfoPage(row.id)),
            b: row.image,
            c: common_vendor.t(nameFunc(row.name)),
            d: common_vendor.t(skuFunc(row.sku)),
            e: common_vendor.t(row.quantity),
            f: row.amount,
            g: common_vendor.o(($event) => inputFocus(row)),
            h: common_vendor.o(($event) => inputChange(row)),
            i: row.amount,
            j: common_vendor.o(common_vendor.m(($event) => row.amount = $event.detail.value, {
              number: true
            })),
            k: i0,
            l: s0
          };
        }, {
          name: "d",
          path: "a",
          vueId: "860cfcbe-0"
        }),
        b: common_vendor.sr(globalTableRef, "860cfcbe-0", {
          "k": "globalTableRef"
        }),
        c: common_vendor.o(submit),
        d: common_vendor.o(loadTable),
        e: common_vendor.p({
          option: common_vendor.unref(tableOption),
          submitTitle: "\u4E0A\u67B6",
          tableData: common_vendor.unref(tableData)
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/pages/erp/warehouse/inventory/shelf/components/whsList.vue"]]);
wx.createComponent(Component);

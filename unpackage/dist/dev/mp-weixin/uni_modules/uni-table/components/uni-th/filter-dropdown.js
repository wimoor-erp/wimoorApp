"use strict";
var common_vendor = require("../../../../common/vendor.js");
const checkBox = () => "../uni-tr/table-checkbox.js";
const resource = {
  "reset": "\u91CD\u7F6E",
  "search": "\u641C\u7D22",
  "submit": "\u786E\u5B9A",
  "filter": "\u7B5B\u9009",
  "gt": "\u5927\u4E8E\u7B49\u4E8E",
  "lt": "\u5C0F\u4E8E\u7B49\u4E8E",
  "date": "\u65E5\u671F\u8303\u56F4"
};
const DropdownType = {
  Select: "select",
  Search: "search",
  Range: "range",
  Date: "date",
  Timestamp: "timestamp"
};
const _sfc_main = {
  name: "FilterDropdown",
  emits: ["change"],
  components: {
    checkBox
  },
  options: {
    virtualHost: true
  },
  props: {
    filterType: {
      type: String,
      default: DropdownType.Select
    },
    filterData: {
      type: Array,
      default() {
        return [];
      }
    },
    mode: {
      type: String,
      default: "default"
    },
    map: {
      type: Object,
      default() {
        return {
          text: "text",
          value: "value"
        };
      }
    }
  },
  computed: {
    canReset() {
      if (this.isSearch) {
        return this.filterValue.length > 0;
      }
      if (this.isSelect) {
        return this.checkedValues.length > 0;
      }
      if (this.isRange) {
        return this.gtValue.length > 0 && this.ltValue.length > 0;
      }
      if (this.isDate) {
        return this.dateSelect.length > 0;
      }
      return false;
    },
    isSelect() {
      return this.filterType === DropdownType.Select;
    },
    isSearch() {
      return this.filterType === DropdownType.Search;
    },
    isRange() {
      return this.filterType === DropdownType.Range;
    },
    isDate() {
      return this.filterType === DropdownType.Date || this.filterType === DropdownType.Timestamp;
    }
  },
  watch: {
    filters(newVal) {
      this._copyFilters();
    },
    indeterminate(newVal) {
      this.isIndeterminate = newVal;
    }
  },
  data() {
    return {
      resource,
      enabled: true,
      isOpened: false,
      dataList: [],
      filterValue: "",
      checkedValues: [],
      gtValue: "",
      ltValue: "",
      dateRange: [],
      dateSelect: []
    };
  },
  created() {
    this._copyFilters();
  },
  methods: {
    _copyFilters() {
      let dl = JSON.parse(JSON.stringify(this.filterData));
      for (let i = 0; i < dl.length; i++) {
        if (dl[i].checked === void 0) {
          dl[i].checked = false;
        }
      }
      this.dataList = dl;
    },
    openPopup() {
      this.isOpened = true;
      if (this.isDate) {
        this.$nextTick(() => {
          if (!this.dateRange.length) {
            this.resetDate();
          }
          this.$refs.datetimepicker.show();
        });
      }
    },
    closePopup() {
      this.isOpened = false;
    },
    handleClose(e) {
      this.closePopup();
    },
    resetDate() {
      let date = new Date();
      let dateText = date.toISOString().split("T")[0];
      this.dateRange = [dateText + " 0:00:00", dateText + " 23:59:59"];
    },
    onDropdown(e) {
      this.openPopup();
    },
    onItemClick(e, index) {
      let items = this.dataList;
      let listItem = items[index];
      if (listItem.checked === void 0) {
        items[index].checked = true;
      } else {
        items[index].checked = !listItem.checked;
      }
      let checkvalues = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.checked) {
          checkvalues.push(item.value);
        }
      }
      this.checkedValues = checkvalues;
    },
    datetimechange(e) {
      this.closePopup();
      this.dateRange = e;
      this.dateSelect = e;
      this.$emit("change", {
        filterType: this.filterType,
        filter: e
      });
    },
    timepickerclose(e) {
      this.closePopup();
    },
    handleSelectSubmit() {
      this.closePopup();
      this.$emit("change", {
        filterType: this.filterType,
        filter: this.checkedValues
      });
    },
    handleSelectReset() {
      if (!this.canReset) {
        return;
      }
      var items = this.dataList;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        this.$set(item, "checked", false);
      }
      this.checkedValues = [];
      this.handleSelectSubmit();
    },
    handleSearchSubmit() {
      this.closePopup();
      this.$emit("change", {
        filterType: this.filterType,
        filter: this.filterValue
      });
    },
    handleSearchReset() {
      if (!this.canReset) {
        return;
      }
      this.filterValue = "";
      this.handleSearchSubmit();
    },
    handleRangeSubmit(isReset) {
      this.closePopup();
      this.$emit("change", {
        filterType: this.filterType,
        filter: isReset === true ? [] : [parseInt(this.gtValue), parseInt(this.ltValue)]
      });
    },
    handleRangeReset() {
      if (!this.canReset) {
        return;
      }
      this.gtValue = "";
      this.ltValue = "";
      this.handleRangeSubmit(true);
    }
  }
};
if (!Array) {
  const _component_check_box = common_vendor.resolveComponent("check-box");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_component_check_box + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_datetime_picker = () => "../../../uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  _easycom_uni_datetime_picker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isSelect || $options.isRange
  }, $options.isSelect || $options.isRange ? {
    b: $options.canReset ? 1 : ""
  } : {}, {
    c: $options.isSearch
  }, $options.isSearch ? {
    d: $options.canReset ? 1 : ""
  } : {}, {
    e: $options.isDate
  }, $options.isDate ? {
    f: $options.canReset ? 1 : ""
  } : {}, {
    g: common_vendor.o((...args) => $options.onDropdown && $options.onDropdown(...args)),
    h: $data.isOpened
  }, $data.isOpened ? {
    i: common_vendor.o((...args) => $options.handleClose && $options.handleClose(...args))
  } : {}, {
    j: $data.isOpened
  }, $data.isOpened ? common_vendor.e({
    k: $options.isSelect
  }, $options.isSelect ? {
    l: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: "4ad8393d-0-" + i0,
        b: common_vendor.p({
          checked: item.checked
        }),
        c: common_vendor.t(item[$props.map.text]),
        d: common_vendor.s(item.styleIconText),
        e: index,
        f: common_vendor.o(($event) => $options.onItemClick($event, index))
      };
    })
  } : {}, {
    m: $options.isSelect
  }, $options.isSelect ? {
    n: common_vendor.t($data.resource.reset),
    o: !$options.canReset ? 1 : "",
    p: common_vendor.o((...args) => $options.handleSelectReset && $options.handleSelectReset(...args)),
    q: common_vendor.t($data.resource.submit),
    r: common_vendor.o((...args) => $options.handleSelectSubmit && $options.handleSelectSubmit(...args))
  } : {}, {
    s: $options.isSearch
  }, $options.isSearch ? {
    t: $data.filterValue,
    v: common_vendor.o(($event) => $data.filterValue = $event.detail.value)
  } : {}, {
    w: $options.isSearch
  }, $options.isSearch ? {
    x: common_vendor.t($data.resource.search),
    y: common_vendor.o((...args) => $options.handleSearchSubmit && $options.handleSearchSubmit(...args)),
    z: common_vendor.t($data.resource.reset),
    A: !$options.canReset ? 1 : "",
    B: common_vendor.o((...args) => $options.handleSearchReset && $options.handleSearchReset(...args))
  } : {}, {
    C: $options.isRange
  }, $options.isRange ? {
    D: common_vendor.t($data.resource.gt),
    E: $data.gtValue,
    F: common_vendor.o(($event) => $data.gtValue = $event.detail.value),
    G: common_vendor.t($data.resource.lt),
    H: $data.ltValue,
    I: common_vendor.o(($event) => $data.ltValue = $event.detail.value)
  } : {}, {
    J: $options.isRange
  }, $options.isRange ? {
    K: common_vendor.t($data.resource.reset),
    L: !$options.canReset ? 1 : "",
    M: common_vendor.o((...args) => $options.handleRangeReset && $options.handleRangeReset(...args)),
    N: common_vendor.t($data.resource.submit),
    O: common_vendor.o((...args) => $options.handleRangeSubmit && $options.handleRangeSubmit(...args))
  } : {}, {
    P: $options.isDate
  }, $options.isDate ? {
    Q: common_vendor.sr("datetimepicker", "4ad8393d-1"),
    R: common_vendor.o($options.datetimechange),
    S: common_vendor.o($options.timepickerclose),
    T: common_vendor.p({
      value: $data.dateRange,
      type: "datetimerange",
      ["return-type"]: "timestamp"
    })
  } : {}, {
    U: common_vendor.o(() => {
    })
  }) : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-table/components/uni-th/filter-dropdown.vue"]]);
wx.createComponent(Component);

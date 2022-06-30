"use strict";
var common_vendor = require("../../../../common/vendor.js");
const dropdown = () => "./filter-dropdown.js";
const _sfc_main = {
  name: "uniTh",
  options: {
    virtualHost: true
  },
  components: {
    dropdown
  },
  emits: ["sort-change", "filter-change"],
  props: {
    width: {
      type: [String, Number],
      default: ""
    },
    align: {
      type: String,
      default: "left"
    },
    rowspan: {
      type: [Number, String],
      default: 1
    },
    colspan: {
      type: [Number, String],
      default: 1
    },
    sortable: {
      type: Boolean,
      default: false
    },
    filterType: {
      type: String,
      default: ""
    },
    filterData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      border: false,
      ascending: false,
      descending: false
    };
  },
  computed: {
    contentAlign() {
      let align = "left";
      switch (this.align) {
        case "left":
          align = "flex-start";
          break;
        case "center":
          align = "center";
          break;
        case "right":
          align = "flex-end";
          break;
      }
      return align;
    }
  },
  created() {
    this.root = this.getTable("uniTable");
    this.rootTr = this.getTable("uniTr");
    this.rootTr.minWidthUpdate(this.width ? this.width : 140);
    this.border = this.root.border;
    this.root.thChildren.push(this);
  },
  methods: {
    sort() {
      if (!this.sortable)
        return;
      this.clearOther();
      if (!this.ascending && !this.descending) {
        this.ascending = true;
        this.$emit("sort-change", { order: "ascending" });
        return;
      }
      if (this.ascending && !this.descending) {
        this.ascending = false;
        this.descending = true;
        this.$emit("sort-change", { order: "descending" });
        return;
      }
      if (!this.ascending && this.descending) {
        this.ascending = false;
        this.descending = false;
        this.$emit("sort-change", { order: null });
      }
    },
    ascendingFn() {
      this.clearOther();
      this.ascending = !this.ascending;
      this.descending = false;
      this.$emit("sort-change", { order: this.ascending ? "ascending" : null });
    },
    descendingFn() {
      this.clearOther();
      this.descending = !this.descending;
      this.ascending = false;
      this.$emit("sort-change", { order: this.descending ? "descending" : null });
    },
    clearOther() {
      this.root.thChildren.map((item) => {
        if (item !== this) {
          item.ascending = false;
          item.descending = false;
        }
        return item;
      });
    },
    ondropdown(e) {
      this.$emit("filter-change", e);
    },
    getTable(name) {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent)
          return false;
        parentName = parent.$options.name;
      }
      return parent;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.border ? 1 : "",
    b: $props.width + "px",
    c: $props.align
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-table/components/uni-th/uni-th.vue"]]);
wx.createComponent(Component);

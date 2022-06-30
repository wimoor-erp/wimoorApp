"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "UniCard",
  emits: ["click"],
  props: {
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    },
    padding: {
      type: String,
      default: "10px"
    },
    margin: {
      type: String,
      default: "15px"
    },
    spacing: {
      type: String,
      default: "0 10px"
    },
    extra: {
      type: String,
      default: ""
    },
    cover: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
      default: ""
    },
    isFull: {
      type: Boolean,
      default: false
    },
    isShadow: {
      type: Boolean,
      default: true
    },
    shadow: {
      type: String,
      default: "0px 0px 3px 1px rgba(0, 0, 0, 0.08)"
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClick(type) {
      this.$emit("click", type);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.cover
  }, $props.cover ? {
    b: common_vendor.o(($event) => $options.onClick("cover")),
    c: $props.cover
  } : {}, {
    d: $props.title || $props.extra
  }, $props.title || $props.extra ? common_vendor.e({
    e: $props.thumbnail
  }, $props.thumbnail ? {
    f: $props.thumbnail
  } : {}, {
    g: common_vendor.t($props.title),
    h: $props.title && $props.subTitle
  }, $props.title && $props.subTitle ? {
    i: common_vendor.t($props.subTitle)
  } : {}, {
    j: common_vendor.o(($event) => $options.onClick("title")),
    k: common_vendor.t($props.extra),
    l: common_vendor.o(($event) => $options.onClick("extra"))
  }) : {}, {
    m: $props.padding,
    n: common_vendor.o(($event) => $options.onClick("content")),
    o: common_vendor.o(($event) => $options.onClick("actions")),
    p: $props.isFull ? 1 : "",
    q: $props.isShadow ? 1 : "",
    r: $props.border ? 1 : "",
    s: $props.isFull ? 0 : $props.margin,
    t: $props.spacing,
    v: $props.isShadow ? $props.shadow : ""
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-card/components/uni-card/uni-card.vue"]]);
swan.createComponent(Component);

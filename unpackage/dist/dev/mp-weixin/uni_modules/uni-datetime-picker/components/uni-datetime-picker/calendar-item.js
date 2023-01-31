"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  props: {
    weeks: {
      type: Object,
      default() {
        return {};
      }
    },
    calendar: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selected: {
      type: Array,
      default: () => {
        return [];
      }
    },
    lunar: {
      type: Boolean,
      default: false
    },
    checkHover: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    choiceDate(weeks) {
      this.$emit("change", weeks);
    },
    handleMousemove(weeks) {
      this.$emit("handleMouse", weeks);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.selected && $props.weeks.extraInfo
  }, $props.selected && $props.weeks.extraInfo ? {} : {}, {
    b: common_vendor.t($props.weeks.date),
    c: $props.calendar.fullDate === $props.weeks.fullDate && ($props.calendar.userChecked || !$props.checkHover) ? 1 : "",
    d: $props.checkHover ? 1 : "",
    e: $props.weeks.beforeMultiple ? 1 : "",
    f: $props.weeks.multiple ? 1 : "",
    g: $props.weeks.afterMultiple ? 1 : "",
    h: $props.weeks.disable ? 1 : "",
    i: $props.weeks.isDay ? 1 : "",
    j: $props.weeks.disable ? 1 : "",
    k: $props.weeks.beforeMultiple ? 1 : "",
    l: $props.weeks.multiple ? 1 : "",
    m: $props.weeks.afterMultiple ? 1 : "",
    n: common_vendor.o(($event) => $options.choiceDate($props.weeks)),
    o: common_vendor.o(($event) => $options.handleMousemove($props.weeks))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-datetime-picker/components/uni-datetime-picker/calendar-item.vue"]]);
wx.createComponent(Component);

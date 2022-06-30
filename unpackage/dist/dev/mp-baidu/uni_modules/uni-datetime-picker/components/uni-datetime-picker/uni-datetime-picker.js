"use strict";
var common_vendor = require("../../../../common/vendor.js");
var uni_modules_uniDatetimePicker_components_uniDatetimePicker_i18n_index = require("./i18n/index.js");
const calendar = () => "./calendar.js";
const timePicker = () => "./time-picker.js";
const {
  t
} = common_vendor.initVueI18n(uni_modules_uniDatetimePicker_components_uniDatetimePicker_i18n_index.messages);
const _sfc_main = {
  name: "UniDatetimePicker",
  components: {
    calendar,
    timePicker
  },
  data() {
    return {
      isRange: false,
      hasTime: false,
      mobileRange: false,
      singleVal: "",
      tempSingleDate: "",
      defSingleDate: "",
      time: "",
      caleRange: {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
      },
      range: {
        startDate: "",
        endDate: ""
      },
      tempRange: {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
      },
      startMultipleStatus: {
        before: "",
        after: "",
        data: [],
        fulldate: ""
      },
      endMultipleStatus: {
        before: "",
        after: "",
        data: [],
        fulldate: ""
      },
      visible: false,
      popup: false,
      popover: null,
      isEmitValue: false,
      isPhone: false,
      isFirstShow: true
    };
  },
  props: {
    type: {
      type: String,
      default: "datetime"
    },
    value: {
      type: [String, Number, Array, Date],
      default: ""
    },
    modelValue: {
      type: [String, Number, Array, Date],
      default: ""
    },
    start: {
      type: [Number, String],
      default: ""
    },
    end: {
      type: [Number, String],
      default: ""
    },
    returnType: {
      type: String,
      default: "string"
    },
    placeholder: {
      type: String,
      default: ""
    },
    startPlaceholder: {
      type: String,
      default: ""
    },
    endPlaceholder: {
      type: String,
      default: ""
    },
    rangeSeparator: {
      type: String,
      default: "-"
    },
    border: {
      type: [Boolean],
      default: true
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    clearIcon: {
      type: [Boolean],
      default: true
    },
    hideSecond: {
      type: [Boolean],
      default: false
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal.indexOf("time") !== -1) {
          this.hasTime = true;
        } else {
          this.hasTime = false;
        }
        if (newVal.indexOf("range") !== -1) {
          this.isRange = true;
        } else {
          this.isRange = false;
        }
      }
    },
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        if (this.isEmitValue) {
          this.isEmitValue = false;
          return;
        }
        this.initPicker(newVal);
      }
    },
    modelValue: {
      immediate: true,
      handler(newVal, oldVal) {
        if (this.isEmitValue) {
          this.isEmitValue = false;
          return;
        }
        this.initPicker(newVal);
      }
    },
    start: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal)
          return;
        const {
          defDate,
          defTime
        } = this.parseDate(newVal);
        this.caleRange.startDate = defDate;
        if (this.hasTime) {
          this.caleRange.startTime = defTime;
        }
      }
    },
    end: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal)
          return;
        const {
          defDate,
          defTime
        } = this.parseDate(newVal);
        this.caleRange.endDate = defDate;
        if (this.hasTime) {
          this.caleRange.endTime = defTime;
        }
      }
    }
  },
  computed: {
    reactStartTime() {
      const activeDate = this.isRange ? this.tempRange.startDate : this.tempSingleDate;
      const res = activeDate === this.caleRange.startDate ? this.caleRange.startTime : "";
      return res;
    },
    reactEndTime() {
      const activeDate = this.isRange ? this.tempRange.endDate : this.tempSingleDate;
      const res = activeDate === this.caleRange.endDate ? this.caleRange.endTime : "";
      return res;
    },
    reactMobDefTime() {
      const times = {
        start: this.tempRange.startTime,
        end: this.tempRange.endTime
      };
      return this.isRange ? times : this.time;
    },
    mobSelectableTime() {
      return {
        start: this.caleRange.startTime,
        end: this.caleRange.endTime
      };
    },
    datePopupWidth() {
      return this.isRange ? 653 : 301;
    },
    singlePlaceholderText() {
      return this.placeholder || (this.type === "date" ? this.selectDateText : t("uni-datetime-picker.selectDateTime"));
    },
    startPlaceholderText() {
      return this.startPlaceholder || this.startDateText;
    },
    endPlaceholderText() {
      return this.endPlaceholder || this.endDateText;
    },
    selectDateText() {
      return t("uni-datetime-picker.selectDate");
    },
    selectTimeText() {
      return t("uni-datetime-picker.selectTime");
    },
    startDateText() {
      return this.startPlaceholder || t("uni-datetime-picker.startDate");
    },
    startTimeText() {
      return t("uni-datetime-picker.startTime");
    },
    endDateText() {
      return this.endPlaceholder || t("uni-datetime-picker.endDate");
    },
    endTimeText() {
      return t("uni-datetime-picker.endTime");
    },
    okText() {
      return t("uni-datetime-picker.ok");
    },
    clearText() {
      return t("uni-datetime-picker.clear");
    },
    showClearIcon() {
      const { clearIcon, disabled, singleVal, range } = this;
      const bool = clearIcon && !disabled && (singleVal || range.startDate && range.endDate);
      return bool;
    }
  },
  created() {
    this.form = this.getForm("uniForms");
    this.formItem = this.getForm("uniFormsItem");
  },
  mounted() {
    this.platform();
  },
  methods: {
    getForm(name = "uniForms") {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent)
          return false;
        parentName = parent.$options.name;
      }
      return parent;
    },
    initPicker(newVal) {
      if (!newVal || Array.isArray(newVal) && !newVal.length) {
        this.$nextTick(() => {
          this.clear(false);
        });
        return;
      }
      if (!Array.isArray(newVal) && !this.isRange) {
        const {
          defDate,
          defTime
        } = this.parseDate(newVal);
        this.singleVal = defDate;
        this.tempSingleDate = defDate;
        this.defSingleDate = defDate;
        if (this.hasTime) {
          this.singleVal = defDate + " " + defTime;
          this.time = defTime;
        }
      } else {
        const [before, after] = newVal;
        if (!before && !after)
          return;
        const defBefore = this.parseDate(before);
        const defAfter = this.parseDate(after);
        const startDate = defBefore.defDate;
        const endDate = defAfter.defDate;
        this.range.startDate = this.tempRange.startDate = startDate;
        this.range.endDate = this.tempRange.endDate = endDate;
        if (this.hasTime) {
          this.range.startDate = defBefore.defDate + " " + defBefore.defTime;
          this.range.endDate = defAfter.defDate + " " + defAfter.defTime;
          this.tempRange.startTime = defBefore.defTime;
          this.tempRange.endTime = defAfter.defTime;
        }
        const defaultRange = {
          before: defBefore.defDate,
          after: defAfter.defDate
        };
        this.startMultipleStatus = Object.assign({}, this.startMultipleStatus, defaultRange, {
          which: "right"
        });
        this.endMultipleStatus = Object.assign({}, this.endMultipleStatus, defaultRange, {
          which: "left"
        });
      }
    },
    updateLeftCale(e) {
      const left = this.$refs.left;
      left.cale.setHoverMultiple(e.after);
      left.setDate(this.$refs.left.nowDate.fullDate);
    },
    updateRightCale(e) {
      const right = this.$refs.right;
      right.cale.setHoverMultiple(e.after);
      right.setDate(this.$refs.right.nowDate.fullDate);
    },
    platform() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.isPhone = systemInfo.windowWidth <= 500;
      this.windowWidth = systemInfo.windowWidth;
    },
    show(event) {
      if (this.disabled) {
        return;
      }
      this.platform();
      if (this.isPhone) {
        this.$refs.mobile.open();
        return;
      }
      this.popover = {
        top: "10px"
      };
      const dateEditor = common_vendor.index.createSelectorQuery().in(this).select(".uni-date-editor");
      dateEditor.boundingClientRect((rect) => {
        if (this.windowWidth - rect.left < this.datePopupWidth) {
          this.popover.right = 0;
        }
      }).exec();
      setTimeout(() => {
        this.popup = !this.popup;
        if (!this.isPhone && this.isRange && this.isFirstShow) {
          this.isFirstShow = false;
          const {
            startDate,
            endDate
          } = this.range;
          if (startDate && endDate) {
            if (this.diffDate(startDate, endDate) < 30) {
              this.$refs.right.next();
            }
          } else {
            this.$refs.right.next();
            this.$refs.right.cale.lastHover = false;
          }
        }
      }, 50);
    },
    close() {
      setTimeout(() => {
        this.popup = false;
        this.$emit("maskClick", this.value);
      }, 20);
    },
    setEmit(value) {
      if (this.returnType === "timestamp" || this.returnType === "date") {
        if (!Array.isArray(value)) {
          if (!this.hasTime) {
            value = value + " 00:00:00";
          }
          value = this.createTimestamp(value);
          if (this.returnType === "date") {
            value = new Date(value);
          }
        } else {
          if (!this.hasTime) {
            value[0] = value[0] + " 00:00:00";
            value[1] = value[1] + " 00:00:00";
          }
          value[0] = this.createTimestamp(value[0]);
          value[1] = this.createTimestamp(value[1]);
          if (this.returnType === "date") {
            value[0] = new Date(value[0]);
            value[1] = new Date(value[1]);
          }
        }
      }
      this.formItem && this.formItem.setValue(value);
      this.$emit("change", value);
      this.$emit("input", value);
      this.$emit("update:modelValue", value);
      this.isEmitValue = true;
    },
    createTimestamp(date) {
      date = this.fixIosDateFormat(date);
      return Date.parse(new Date(date));
    },
    singleChange(e) {
      this.tempSingleDate = e.fulldate;
      if (this.hasTime)
        return;
      this.confirmSingleChange();
    },
    confirmSingleChange() {
      if (!this.tempSingleDate) {
        this.popup = false;
        return;
      }
      if (this.hasTime) {
        this.singleVal = this.tempSingleDate + " " + (this.time ? this.time : "00:00:00");
      } else {
        this.singleVal = this.tempSingleDate;
      }
      this.setEmit(this.singleVal);
      this.popup = false;
    },
    leftChange(e) {
      const {
        before,
        after
      } = e.range;
      this.rangeChange(before, after);
      const obj = {
        before: e.range.before,
        after: e.range.after,
        data: e.range.data,
        fulldate: e.fulldate
      };
      this.startMultipleStatus = Object.assign({}, this.startMultipleStatus, obj);
    },
    rightChange(e) {
      const {
        before,
        after
      } = e.range;
      this.rangeChange(before, after);
      const obj = {
        before: e.range.before,
        after: e.range.after,
        data: e.range.data,
        fulldate: e.fulldate
      };
      this.endMultipleStatus = Object.assign({}, this.endMultipleStatus, obj);
    },
    mobileChange(e) {
      if (this.isRange) {
        const {
          before,
          after
        } = e.range;
        this.handleStartAndEnd(before, after, true);
        if (this.hasTime) {
          const {
            startTime,
            endTime
          } = e.timeRange;
          this.tempRange.startTime = startTime;
          this.tempRange.endTime = endTime;
        }
        this.confirmRangeChange();
      } else {
        if (this.hasTime) {
          this.singleVal = e.fulldate + " " + e.time;
        } else {
          this.singleVal = e.fulldate;
        }
        this.setEmit(this.singleVal);
      }
      this.$refs.mobile.close();
    },
    rangeChange(before, after) {
      if (!(before && after))
        return;
      this.handleStartAndEnd(before, after, true);
      if (this.hasTime)
        return;
      this.confirmRangeChange();
    },
    confirmRangeChange() {
      if (!this.tempRange.startDate && !this.tempRange.endDate) {
        this.popup = false;
        return;
      }
      let start, end;
      if (!this.hasTime) {
        start = this.range.startDate = this.tempRange.startDate;
        end = this.range.endDate = this.tempRange.endDate;
      } else {
        start = this.range.startDate = this.tempRange.startDate + " " + (this.tempRange.startTime ? this.tempRange.startTime : "00:00:00");
        end = this.range.endDate = this.tempRange.endDate + " " + (this.tempRange.endTime ? this.tempRange.endTime : "00:00:00");
      }
      const displayRange = [start, end];
      this.setEmit(displayRange);
      this.popup = false;
    },
    handleStartAndEnd(before, after, temp = false) {
      if (!(before && after))
        return;
      const type = temp ? "tempRange" : "range";
      if (this.dateCompare(before, after)) {
        this[type].startDate = before;
        this[type].endDate = after;
      } else {
        this[type].startDate = after;
        this[type].endDate = before;
      }
    },
    dateCompare(startDate, endDate) {
      startDate = new Date(startDate.replace("-", "/").replace("-", "/"));
      endDate = new Date(endDate.replace("-", "/").replace("-", "/"));
      if (startDate <= endDate) {
        return true;
      } else {
        return false;
      }
    },
    diffDate(startDate, endDate) {
      startDate = new Date(startDate.replace("-", "/").replace("-", "/"));
      endDate = new Date(endDate.replace("-", "/").replace("-", "/"));
      const diff = (endDate - startDate) / (24 * 60 * 60 * 1e3);
      return Math.abs(diff);
    },
    clear(needEmit = true) {
      if (!this.isRange) {
        this.singleVal = "";
        this.tempSingleDate = "";
        this.time = "";
        if (this.isPhone) {
          this.$refs.mobile && this.$refs.mobile.clearCalender();
        } else {
          this.$refs.pcSingle && this.$refs.pcSingle.clearCalender();
        }
        if (needEmit) {
          this.formItem && this.formItem.setValue("");
          this.$emit("change", "");
          this.$emit("input", "");
          this.$emit("update:modelValue", "");
        }
      } else {
        this.range.startDate = "";
        this.range.endDate = "";
        this.tempRange.startDate = "";
        this.tempRange.startTime = "";
        this.tempRange.endDate = "";
        this.tempRange.endTime = "";
        if (this.isPhone) {
          this.$refs.mobile && this.$refs.mobile.clearCalender();
        } else {
          this.$refs.left && this.$refs.left.clearCalender();
          this.$refs.right && this.$refs.right.clearCalender();
          this.$refs.right && this.$refs.right.next();
        }
        if (needEmit) {
          this.formItem && this.formItem.setValue([]);
          this.$emit("change", []);
          this.$emit("input", []);
          this.$emit("update:modelValue", []);
        }
      }
    },
    parseDate(date) {
      date = this.fixIosDateFormat(date);
      const defVal = new Date(date);
      const year = defVal.getFullYear();
      const month = defVal.getMonth() + 1;
      const day = defVal.getDate();
      const hour = defVal.getHours();
      const minute = defVal.getMinutes();
      const second = defVal.getSeconds();
      const defDate = year + "-" + this.lessTen(month) + "-" + this.lessTen(day);
      const defTime = this.lessTen(hour) + ":" + this.lessTen(minute) + (this.hideSecond ? "" : ":" + this.lessTen(second));
      return {
        defDate,
        defTime
      };
    },
    lessTen(item) {
      return item < 10 ? "0" + item : item;
    },
    fixIosDateFormat(value) {
      if (typeof value === "string") {
        value = value.replace(/-/g, "/");
      }
      return value;
    },
    leftMonthSwitch(e) {
    },
    rightMonthSwitch(e) {
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_time_picker = common_vendor.resolveComponent("time-picker");
  const _component_calendar = common_vendor.resolveComponent("calendar");
  (_easycom_uni_icons2 + _component_time_picker + _component_calendar)();
}
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isRange
  }, !$data.isRange ? {
    b: common_vendor.p({
      type: "calendar",
      color: "#e1e1e1",
      size: "22"
    }),
    c: $options.singlePlaceholderText,
    d: $data.singleVal,
    e: common_vendor.o(($event) => $data.singleVal = $event.detail.value)
  } : {
    f: common_vendor.p({
      type: "calendar",
      color: "#e1e1e1",
      size: "22"
    }),
    g: $options.startPlaceholderText,
    h: $data.range.startDate,
    i: common_vendor.o(($event) => $data.range.startDate = $event.detail.value),
    j: common_vendor.t($props.rangeSeparator),
    k: $options.endPlaceholderText,
    l: $data.range.endDate,
    m: common_vendor.o(($event) => $data.range.endDate = $event.detail.value)
  }, {
    n: $options.showClearIcon
  }, $options.showClearIcon ? {
    o: common_vendor.p({
      type: "clear",
      color: "#e1e1e1",
      size: "18"
    }),
    p: common_vendor.o((...args) => $options.clear && $options.clear(...args))
  } : {}, {
    q: $props.disabled ? 1 : "",
    r: $props.border ? 1 : "",
    s: common_vendor.o((...args) => $options.show && $options.show(...args)),
    t: $data.popup,
    v: common_vendor.o((...args) => $options.close && $options.close(...args)),
    w: !$data.isPhone
  }, !$data.isPhone ? common_vendor.e({
    x: !$data.isRange
  }, !$data.isRange ? common_vendor.e({
    y: $data.hasTime
  }, $data.hasTime ? {
    z: $options.selectDateText,
    A: $data.tempSingleDate,
    B: common_vendor.o(($event) => $data.tempSingleDate = $event.detail.value),
    C: $options.selectTimeText,
    D: !$data.tempSingleDate,
    E: $data.time,
    F: common_vendor.o(($event) => $data.time = $event.detail.value),
    G: {
      "updateModelValue": common_vendor.o(($event) => $data.time = $event)
    },
    H: common_vendor.p({
      type: "time",
      border: false,
      disabled: !$data.tempSingleDate,
      start: $options.reactStartTime,
      end: $options.reactEndTime,
      hideSecond: $props.hideSecond,
      modelValue: $data.time
    })
  } : {}, {
    I: common_vendor.sr("pcSingle", "659dde60-4"),
    J: {
      "change": common_vendor.o($options.singleChange)
    },
    K: common_vendor.p({
      showMonth: false,
      ["start-date"]: $data.caleRange.startDate,
      ["end-date"]: $data.caleRange.endDate,
      date: $data.defSingleDate
    }),
    L: $data.hasTime
  }, $data.hasTime ? {
    M: common_vendor.t($options.okText),
    N: common_vendor.o((...args) => $options.confirmSingleChange && $options.confirmSingleChange(...args))
  } : {}, {
    O: common_vendor.s($data.popover)
  }) : common_vendor.e({
    P: $data.hasTime
  }, $data.hasTime ? {
    Q: $options.startDateText,
    R: $data.tempRange.startDate,
    S: common_vendor.o(($event) => $data.tempRange.startDate = $event.detail.value),
    T: $options.startTimeText,
    U: !$data.tempRange.startDate,
    V: $data.tempRange.startTime,
    W: common_vendor.o(($event) => $data.tempRange.startTime = $event.detail.value),
    X: {
      "updateModelValue": common_vendor.o(($event) => $data.tempRange.startTime = $event)
    },
    Y: common_vendor.p({
      type: "time",
      start: $options.reactStartTime,
      border: false,
      disabled: !$data.tempRange.startDate,
      hideSecond: $props.hideSecond,
      modelValue: $data.tempRange.startTime
    }),
    Z: common_vendor.p({
      type: "arrowthinright",
      color: "#999"
    }),
    aa: $options.endDateText,
    ab: $data.tempRange.endDate,
    ac: common_vendor.o(($event) => $data.tempRange.endDate = $event.detail.value),
    ad: $options.endTimeText,
    ae: !$data.tempRange.endDate,
    af: $data.tempRange.endTime,
    ag: common_vendor.o(($event) => $data.tempRange.endTime = $event.detail.value),
    ah: {
      "updateModelValue": common_vendor.o(($event) => $data.tempRange.endTime = $event)
    },
    ai: common_vendor.p({
      type: "time",
      end: $options.reactEndTime,
      border: false,
      disabled: !$data.tempRange.endDate,
      hideSecond: $props.hideSecond,
      modelValue: $data.tempRange.endTime
    })
  } : {}, {
    aj: common_vendor.sr("left", "659dde60-8"),
    ak: {
      "firstEnterCale": common_vendor.o($options.updateRightCale),
      "monthSwitch": common_vendor.o($options.leftMonthSwitch),
      "change": common_vendor.o($options.leftChange)
    },
    al: common_vendor.p({
      showMonth: false,
      ["start-date"]: $data.caleRange.startDate,
      ["end-date"]: $data.caleRange.endDate,
      range: true,
      pleStatus: $data.endMultipleStatus
    }),
    am: common_vendor.sr("right", "659dde60-9"),
    an: {
      "firstEnterCale": common_vendor.o($options.updateLeftCale),
      "monthSwitch": common_vendor.o($options.rightMonthSwitch),
      "change": common_vendor.o($options.rightChange)
    },
    ao: common_vendor.p({
      showMonth: false,
      ["start-date"]: $data.caleRange.startDate,
      ["end-date"]: $data.caleRange.endDate,
      range: true,
      pleStatus: $data.startMultipleStatus
    }),
    ap: $data.hasTime
  }, $data.hasTime ? {
    aq: common_vendor.t($options.clearText),
    ar: common_vendor.o((...args) => $options.clear && $options.clear(...args)),
    as: common_vendor.t($options.okText),
    at: common_vendor.o((...args) => $options.confirmRangeChange && $options.confirmRangeChange(...args))
  } : {}, {
    av: common_vendor.s($data.popover)
  }), {
    aw: $data.popup
  }) : {}, {
    ax: common_vendor.sr("mobile", "659dde60-10"),
    ay: $data.isPhone,
    az: {
      "confirm": common_vendor.o($options.mobileChange)
    },
    aA: common_vendor.p({
      clearDate: false,
      date: $data.defSingleDate,
      defTime: $options.reactMobDefTime,
      ["start-date"]: $data.caleRange.startDate,
      ["end-date"]: $data.caleRange.endDate,
      selectableTimes: $options.mobSelectableTime,
      pleStatus: $data.endMultipleStatus,
      showMonth: false,
      range: $data.isRange,
      typeHasTime: $data.hasTime,
      insert: false,
      hideSecond: $props.hideSecond
    })
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue"]]);
swan.createComponent(Component);

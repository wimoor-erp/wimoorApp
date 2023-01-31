"use strict";
const uni_modules_uniDatetimePicker_components_uniDatetimePicker_util = require("./util.js");
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniDatetimePicker_components_uniDatetimePicker_i18n_index = require("./i18n/index.js");
const calendarItem = () => "./calendar-item.js";
const timePicker = () => "./time-picker.js";
const {
  t
} = common_vendor.initVueI18n(uni_modules_uniDatetimePicker_components_uniDatetimePicker_i18n_index.messages);
const _sfc_main = {
  components: {
    calendarItem,
    timePicker
  },
  props: {
    date: {
      type: String,
      default: ""
    },
    defTime: {
      type: [String, Object],
      default: ""
    },
    selectableTimes: {
      type: [Object],
      default() {
        return {};
      }
    },
    selected: {
      type: Array,
      default() {
        return [];
      }
    },
    lunar: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: String,
      default: ""
    },
    endDate: {
      type: String,
      default: ""
    },
    range: {
      type: Boolean,
      default: false
    },
    typeHasTime: {
      type: Boolean,
      default: false
    },
    insert: {
      type: Boolean,
      default: true
    },
    showMonth: {
      type: Boolean,
      default: true
    },
    clearDate: {
      type: Boolean,
      default: true
    },
    left: {
      type: Boolean,
      default: true
    },
    right: {
      type: Boolean,
      default: true
    },
    checkHover: {
      type: Boolean,
      default: true
    },
    hideSecond: {
      type: [Boolean],
      default: false
    },
    pleStatus: {
      type: Object,
      default() {
        return {
          before: "",
          after: "",
          data: [],
          fulldate: ""
        };
      }
    }
  },
  data() {
    return {
      show: false,
      weeks: [],
      calendar: {},
      nowDate: "",
      aniMaskShow: false,
      firstEnter: true,
      time: "",
      timeRange: {
        startTime: "",
        endTime: ""
      },
      tempSingleDate: "",
      tempRange: {
        before: "",
        after: ""
      }
    };
  },
  watch: {
    date: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!this.range) {
          this.tempSingleDate = newVal;
          setTimeout(() => {
            this.init(newVal);
          }, 100);
        }
      }
    },
    defTime: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!this.range) {
          this.time = newVal;
        } else {
          this.timeRange.startTime = newVal.start;
          this.timeRange.endTime = newVal.end;
        }
      }
    },
    startDate(val) {
      this.cale.resetSatrtDate(val);
      this.cale.setDate(this.nowDate.fullDate);
      this.weeks = this.cale.weeks;
    },
    endDate(val) {
      this.cale.resetEndDate(val);
      this.cale.setDate(this.nowDate.fullDate);
      this.weeks = this.cale.weeks;
    },
    selected(newVal) {
      this.cale.setSelectInfo(this.nowDate.fullDate, newVal);
      this.weeks = this.cale.weeks;
    },
    pleStatus: {
      immediate: true,
      handler(newVal, oldVal) {
        const {
          before,
          after,
          fulldate,
          which
        } = newVal;
        this.tempRange.before = before;
        this.tempRange.after = after;
        setTimeout(() => {
          if (fulldate) {
            this.cale.setHoverMultiple(fulldate);
            if (before && after) {
              this.cale.lastHover = true;
              if (this.rangeWithinMonth(after, before))
                return;
              this.setDate(before);
            } else {
              this.cale.setMultiple(fulldate);
              this.setDate(this.nowDate.fullDate);
              this.calendar.fullDate = "";
              this.cale.lastHover = false;
            }
          } else {
            this.cale.setDefaultMultiple(before, after);
            if (which === "left") {
              this.setDate(before);
              this.weeks = this.cale.weeks;
            } else {
              this.setDate(after);
              this.weeks = this.cale.weeks;
            }
            this.cale.lastHover = true;
          }
        }, 16);
      }
    }
  },
  computed: {
    reactStartTime() {
      const activeDate = this.range ? this.tempRange.before : this.calendar.fullDate;
      const res = activeDate === this.startDate ? this.selectableTimes.start : "";
      return res;
    },
    reactEndTime() {
      const activeDate = this.range ? this.tempRange.after : this.calendar.fullDate;
      const res = activeDate === this.endDate ? this.selectableTimes.end : "";
      return res;
    },
    selectDateText() {
      return t("uni-datetime-picker.selectDate");
    },
    startDateText() {
      return this.startPlaceholder || t("uni-datetime-picker.startDate");
    },
    endDateText() {
      return this.endPlaceholder || t("uni-datetime-picker.endDate");
    },
    okText() {
      return t("uni-datetime-picker.ok");
    },
    monText() {
      return t("uni-calender.MON");
    },
    TUEText() {
      return t("uni-calender.TUE");
    },
    WEDText() {
      return t("uni-calender.WED");
    },
    THUText() {
      return t("uni-calender.THU");
    },
    FRIText() {
      return t("uni-calender.FRI");
    },
    SATText() {
      return t("uni-calender.SAT");
    },
    SUNText() {
      return t("uni-calender.SUN");
    }
  },
  created() {
    this.cale = new uni_modules_uniDatetimePicker_components_uniDatetimePicker_util.Calendar({
      selected: this.selected,
      startDate: this.startDate,
      endDate: this.endDate,
      range: this.range
    });
    this.init(this.date);
  },
  methods: {
    leaveCale() {
      this.firstEnter = true;
    },
    handleMouse(weeks) {
      if (weeks.disable)
        return;
      if (this.cale.lastHover)
        return;
      let {
        before,
        after
      } = this.cale.multipleStatus;
      if (!before)
        return;
      this.calendar = weeks;
      this.cale.setHoverMultiple(this.calendar.fullDate);
      this.weeks = this.cale.weeks;
      if (this.firstEnter) {
        this.$emit("firstEnterCale", this.cale.multipleStatus);
        this.firstEnter = false;
      }
    },
    rangeWithinMonth(A, B) {
      const [yearA, monthA] = A.split("-");
      const [yearB, monthB] = B.split("-");
      return yearA === yearB && monthA === monthB;
    },
    clean() {
      this.close();
    },
    clearCalender() {
      if (this.range) {
        this.timeRange.startTime = "";
        this.timeRange.endTime = "";
        this.tempRange.before = "";
        this.tempRange.after = "";
        this.cale.multipleStatus.before = "";
        this.cale.multipleStatus.after = "";
        this.cale.multipleStatus.data = [];
        this.cale.lastHover = false;
      } else {
        this.time = "";
        this.tempSingleDate = "";
      }
      this.calendar.fullDate = "";
      this.setDate();
    },
    bindDateChange(e) {
      const value = e.detail.value + "-1";
      this.init(value);
    },
    init(date) {
      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.calendar = this.cale.getInfo(date);
    },
    open() {
      if (this.clearDate && !this.insert) {
        this.cale.cleanMultipleStatus();
        this.init(this.date);
      }
      this.show = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.aniMaskShow = true;
        }, 50);
      });
    },
    close() {
      this.aniMaskShow = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false;
          this.$emit("close");
        }, 300);
      });
    },
    confirm() {
      this.setEmit("confirm");
      this.close();
    },
    change() {
      if (!this.insert)
        return;
      this.setEmit("change");
    },
    monthSwitch() {
      let {
        year,
        month
      } = this.nowDate;
      this.$emit("monthSwitch", {
        year,
        month: Number(month)
      });
    },
    setEmit(name) {
      let {
        year,
        month,
        date,
        fullDate,
        lunar,
        extraInfo
      } = this.calendar;
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        time: this.time,
        timeRange: this.timeRange,
        fulldate: fullDate,
        lunar,
        extraInfo: extraInfo || {}
      });
    },
    choiceDate(weeks) {
      if (weeks.disable)
        return;
      this.calendar = weeks;
      this.calendar.userChecked = true;
      this.cale.setMultiple(this.calendar.fullDate, true);
      this.weeks = this.cale.weeks;
      this.tempSingleDate = this.calendar.fullDate;
      this.tempRange.before = this.cale.multipleStatus.before;
      this.tempRange.after = this.cale.multipleStatus.after;
      this.change();
    },
    backtoday() {
      let date = this.cale.getDate(new Date()).fullDate;
      this.init(date);
      this.change();
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
    pre() {
      const preDate = this.cale.getDate(this.nowDate.fullDate, -1, "month").fullDate;
      this.setDate(preDate);
      this.monthSwitch();
    },
    next() {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, 1, "month").fullDate;
      this.setDate(nextDate);
      this.monthSwitch();
    },
    setDate(date) {
      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.cale.getInfo(date);
    }
  }
};
if (!Array) {
  const _component_calendar_item = common_vendor.resolveComponent("calendar-item");
  const _component_time_picker = common_vendor.resolveComponent("time-picker");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_calendar_item + _component_time_picker + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.insert && $data.show
  }, !$props.insert && $data.show ? {
    b: $data.aniMaskShow ? 1 : "",
    c: common_vendor.o((...args) => $options.clean && $options.clean(...args))
  } : {}, {
    d: $props.insert || $data.show
  }, $props.insert || $data.show ? common_vendor.e({
    e: $props.left
  }, $props.left ? {
    f: common_vendor.o((...args) => $options.pre && $options.pre(...args))
  } : {}, {
    g: common_vendor.t(($data.nowDate.year || "") + " \u5E74 " + ($data.nowDate.month || "") + " \u6708"),
    h: $props.date,
    i: common_vendor.o((...args) => $options.bindDateChange && $options.bindDateChange(...args)),
    j: $props.right
  }, $props.right ? {
    k: common_vendor.o((...args) => $options.next && $options.next(...args))
  } : {}, {
    l: !$props.insert
  }, !$props.insert ? {
    m: common_vendor.o((...args) => $options.clean && $options.clean(...args))
  } : {}, {
    n: !$props.insert ? 1 : "",
    o: $props.showMonth
  }, $props.showMonth ? {
    p: common_vendor.t($data.nowDate.month)
  } : {}, {
    q: common_vendor.t($options.SUNText),
    r: common_vendor.t($options.monText),
    s: common_vendor.t($options.TUEText),
    t: common_vendor.t($options.WEDText),
    v: common_vendor.t($options.THUText),
    w: common_vendor.t($options.FRIText),
    x: common_vendor.t($options.SATText),
    y: common_vendor.f($data.weeks, (item, weekIndex, i0) => {
      return {
        a: common_vendor.f(item, (weeks, weeksIndex, i1) => {
          return {
            a: "365fd21e-0-" + i0 + "-" + i1,
            b: common_vendor.p({
              weeks,
              calendar: $data.calendar,
              selected: $props.selected,
              lunar: $props.lunar,
              checkHover: $props.range
            }),
            c: weeksIndex
          };
        }),
        b: weekIndex
      };
    }),
    z: common_vendor.o($options.choiceDate),
    A: common_vendor.o($options.handleMouse),
    B: !$props.insert && !$props.range && $props.typeHasTime
  }, !$props.insert && !$props.range && $props.typeHasTime ? {
    C: common_vendor.t($data.tempSingleDate ? $data.tempSingleDate : $options.selectDateText),
    D: common_vendor.o(($event) => $data.time = $event),
    E: common_vendor.p({
      type: "time",
      start: $options.reactStartTime,
      end: $options.reactEndTime,
      disabled: !$data.tempSingleDate,
      border: false,
      ["hide-second"]: $props.hideSecond,
      modelValue: $data.time
    })
  } : {}, {
    F: !$props.insert && $props.range && $props.typeHasTime
  }, !$props.insert && $props.range && $props.typeHasTime ? {
    G: common_vendor.t($data.tempRange.before ? $data.tempRange.before : $options.startDateText),
    H: common_vendor.o(($event) => $data.timeRange.startTime = $event),
    I: common_vendor.p({
      type: "time",
      start: $options.reactStartTime,
      border: false,
      ["hide-second"]: $props.hideSecond,
      disabled: !$data.tempRange.before,
      modelValue: $data.timeRange.startTime
    }),
    J: common_vendor.p({
      type: "arrowthinright",
      color: "#999"
    }),
    K: common_vendor.t($data.tempRange.after ? $data.tempRange.after : $options.endDateText),
    L: common_vendor.o(($event) => $data.timeRange.endTime = $event),
    M: common_vendor.p({
      type: "time",
      end: $options.reactEndTime,
      border: false,
      ["hide-second"]: $props.hideSecond,
      disabled: !$data.tempRange.after,
      modelValue: $data.timeRange.endTime
    })
  } : {}, {
    N: !$props.insert
  }, !$props.insert ? {
    O: common_vendor.o((...args) => $options.confirm && $options.confirm(...args))
  } : {}, {
    P: !$props.insert ? 1 : "",
    Q: $data.aniMaskShow ? 1 : "",
    R: $data.aniMaskShow ? 1 : ""
  }) : {}, {
    S: common_vendor.o((...args) => $options.leaveCale && $options.leaveCale(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-datetime-picker/components/uni-datetime-picker/calendar.vue"]]);
wx.createComponent(Component);

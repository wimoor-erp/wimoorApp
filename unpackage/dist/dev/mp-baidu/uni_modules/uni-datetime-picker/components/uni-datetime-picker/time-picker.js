"use strict";
var common_vendor = require("../../../../common/vendor.js");
var uni_modules_uniDatetimePicker_components_uniDatetimePicker_i18n_index = require("./i18n/index.js");
const { t } = common_vendor.initVueI18n(uni_modules_uniDatetimePicker_components_uniDatetimePicker_i18n_index.messages);
const _sfc_main = {
  name: "UniDatetimePicker",
  components: {},
  data() {
    return {
      indicatorStyle: `height: 50px;`,
      visible: false,
      fixNvueBug: {},
      dateShow: true,
      timeShow: true,
      title: "\u65E5\u671F\u548C\u65F6\u95F4",
      time: "",
      year: 1920,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      startYear: 1920,
      startMonth: 1,
      startDay: 1,
      startHour: 0,
      startMinute: 0,
      startSecond: 0,
      endYear: 2120,
      endMonth: 12,
      endDay: 31,
      endHour: 23,
      endMinute: 59,
      endSecond: 59
    };
  },
  props: {
    type: {
      type: String,
      default: "datetime"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    modelValue: {
      type: [String, Number],
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
    disabled: {
      type: [Boolean, String],
      default: false
    },
    border: {
      type: [Boolean, String],
      default: true
    },
    hideSecond: {
      type: [Boolean, String],
      default: false
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.parseValue(this.fixIosDateFormat(newVal));
          this.initTime(false);
        } else {
          this.time = "";
          this.parseValue(Date.now());
        }
      },
      immediate: true
    },
    type: {
      handler(newValue) {
        if (newValue === "date") {
          this.dateShow = true;
          this.timeShow = false;
          this.title = "\u65E5\u671F";
        } else if (newValue === "time") {
          this.dateShow = false;
          this.timeShow = true;
          this.title = "\u65F6\u95F4";
        } else {
          this.dateShow = true;
          this.timeShow = true;
          this.title = "\u65E5\u671F\u548C\u65F6\u95F4";
        }
      },
      immediate: true
    },
    start: {
      handler(newVal) {
        this.parseDatetimeRange(this.fixIosDateFormat(newVal), "start");
      },
      immediate: true
    },
    end: {
      handler(newVal) {
        this.parseDatetimeRange(this.fixIosDateFormat(newVal), "end");
      },
      immediate: true
    },
    months(newVal) {
      this.checkValue("month", this.month, newVal);
    },
    days(newVal) {
      this.checkValue("day", this.day, newVal);
    },
    hours(newVal) {
      this.checkValue("hour", this.hour, newVal);
    },
    minutes(newVal) {
      this.checkValue("minute", this.minute, newVal);
    },
    seconds(newVal) {
      this.checkValue("second", this.second, newVal);
    }
  },
  computed: {
    years() {
      return this.getCurrentRange("year");
    },
    months() {
      return this.getCurrentRange("month");
    },
    days() {
      return this.getCurrentRange("day");
    },
    hours() {
      return this.getCurrentRange("hour");
    },
    minutes() {
      return this.getCurrentRange("minute");
    },
    seconds() {
      return this.getCurrentRange("second");
    },
    ymd() {
      return [this.year - this.minYear, this.month - this.minMonth, this.day - this.minDay];
    },
    hms() {
      return [this.hour - this.minHour, this.minute - this.minMinute, this.second - this.minSecond];
    },
    currentDateIsStart() {
      return this.year === this.startYear && this.month === this.startMonth && this.day === this.startDay;
    },
    currentDateIsEnd() {
      return this.year === this.endYear && this.month === this.endMonth && this.day === this.endDay;
    },
    minYear() {
      return this.startYear;
    },
    maxYear() {
      return this.endYear;
    },
    minMonth() {
      if (this.year === this.startYear) {
        return this.startMonth;
      } else {
        return 1;
      }
    },
    maxMonth() {
      if (this.year === this.endYear) {
        return this.endMonth;
      } else {
        return 12;
      }
    },
    minDay() {
      if (this.year === this.startYear && this.month === this.startMonth) {
        return this.startDay;
      } else {
        return 1;
      }
    },
    maxDay() {
      if (this.year === this.endYear && this.month === this.endMonth) {
        return this.endDay;
      } else {
        return this.daysInMonth(this.year, this.month);
      }
    },
    minHour() {
      if (this.type === "datetime") {
        if (this.currentDateIsStart) {
          return this.startHour;
        } else {
          return 0;
        }
      }
      if (this.type === "time") {
        return this.startHour;
      }
    },
    maxHour() {
      if (this.type === "datetime") {
        if (this.currentDateIsEnd) {
          return this.endHour;
        } else {
          return 23;
        }
      }
      if (this.type === "time") {
        return this.endHour;
      }
    },
    minMinute() {
      if (this.type === "datetime") {
        if (this.currentDateIsStart && this.hour === this.startHour) {
          return this.startMinute;
        } else {
          return 0;
        }
      }
      if (this.type === "time") {
        if (this.hour === this.startHour) {
          return this.startMinute;
        } else {
          return 0;
        }
      }
    },
    maxMinute() {
      if (this.type === "datetime") {
        if (this.currentDateIsEnd && this.hour === this.endHour) {
          return this.endMinute;
        } else {
          return 59;
        }
      }
      if (this.type === "time") {
        if (this.hour === this.endHour) {
          return this.endMinute;
        } else {
          return 59;
        }
      }
    },
    minSecond() {
      if (this.type === "datetime") {
        if (this.currentDateIsStart && this.hour === this.startHour && this.minute === this.startMinute) {
          return this.startSecond;
        } else {
          return 0;
        }
      }
      if (this.type === "time") {
        if (this.hour === this.startHour && this.minute === this.startMinute) {
          return this.startSecond;
        } else {
          return 0;
        }
      }
    },
    maxSecond() {
      if (this.type === "datetime") {
        if (this.currentDateIsEnd && this.hour === this.endHour && this.minute === this.endMinute) {
          return this.endSecond;
        } else {
          return 59;
        }
      }
      if (this.type === "time") {
        if (this.hour === this.endHour && this.minute === this.endMinute) {
          return this.endSecond;
        } else {
          return 59;
        }
      }
    },
    selectTimeText() {
      return t("uni-datetime-picker.selectTime");
    },
    okText() {
      return t("uni-datetime-picker.ok");
    },
    clearText() {
      return t("uni-datetime-picker.clear");
    },
    cancelText() {
      return t("uni-datetime-picker.cancel");
    }
  },
  mounted() {
  },
  methods: {
    lessThanTen(item) {
      return item < 10 ? "0" + item : item;
    },
    parseTimeType(timeString) {
      if (timeString) {
        let timeArr = timeString.split(":");
        this.hour = Number(timeArr[0]);
        this.minute = Number(timeArr[1]);
        this.second = Number(timeArr[2]);
      }
    },
    initPickerValue(datetime) {
      let defaultValue = null;
      if (datetime) {
        defaultValue = this.compareValueWithStartAndEnd(datetime, this.start, this.end);
      } else {
        defaultValue = Date.now();
        defaultValue = this.compareValueWithStartAndEnd(defaultValue, this.start, this.end);
      }
      this.parseValue(defaultValue);
    },
    compareValueWithStartAndEnd(value, start, end) {
      let winner = null;
      value = this.superTimeStamp(value);
      start = this.superTimeStamp(start);
      end = this.superTimeStamp(end);
      if (start && end) {
        if (value < start) {
          winner = new Date(start);
        } else if (value > end) {
          winner = new Date(end);
        } else {
          winner = new Date(value);
        }
      } else if (start && !end) {
        winner = start <= value ? new Date(value) : new Date(start);
      } else if (!start && end) {
        winner = value <= end ? new Date(value) : new Date(end);
      } else {
        winner = new Date(value);
      }
      return winner;
    },
    superTimeStamp(value) {
      let dateBase = "";
      if (this.type === "time" && value && typeof value === "string") {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        dateBase = year + "/" + month + "/" + day + " ";
      }
      if (Number(value) && typeof value !== NaN) {
        value = parseInt(value);
        dateBase = 0;
      }
      return this.createTimeStamp(dateBase + value);
    },
    parseValue(value) {
      if (!value) {
        return;
      }
      if (this.type === "time" && typeof value === "string") {
        this.parseTimeType(value);
      } else {
        let defaultDate = null;
        defaultDate = new Date(value);
        if (this.type !== "time") {
          this.year = defaultDate.getFullYear();
          this.month = defaultDate.getMonth() + 1;
          this.day = defaultDate.getDate();
        }
        if (this.type !== "date") {
          this.hour = defaultDate.getHours();
          this.minute = defaultDate.getMinutes();
          this.second = defaultDate.getSeconds();
        }
      }
      if (this.hideSecond) {
        this.second = 0;
      }
    },
    parseDatetimeRange(point, pointType) {
      if (!point) {
        if (pointType === "start") {
          this.startYear = 1920;
          this.startMonth = 1;
          this.startDay = 1;
          this.startHour = 0;
          this.startMinute = 0;
          this.startSecond = 0;
        }
        if (pointType === "end") {
          this.endYear = 2120;
          this.endMonth = 12;
          this.endDay = 31;
          this.endHour = 23;
          this.endMinute = 59;
          this.endSecond = 59;
        }
        return;
      }
      if (this.type === "time") {
        const pointArr = point.split(":");
        this[pointType + "Hour"] = Number(pointArr[0]);
        this[pointType + "Minute"] = Number(pointArr[1]);
        this[pointType + "Second"] = Number(pointArr[2]);
      } else {
        if (!point) {
          pointType === "start" ? this.startYear = this.year - 60 : this.endYear = this.year + 60;
          return;
        }
        if (Number(point) && Number(point) !== NaN) {
          point = parseInt(point);
        }
        const hasTime = /[0-9]:[0-9]/;
        if (this.type === "datetime" && pointType === "end" && typeof point === "string" && !hasTime.test(point)) {
          point = point + " 23:59:59";
        }
        const pointDate = new Date(point);
        this[pointType + "Year"] = pointDate.getFullYear();
        this[pointType + "Month"] = pointDate.getMonth() + 1;
        this[pointType + "Day"] = pointDate.getDate();
        if (this.type === "datetime") {
          this[pointType + "Hour"] = pointDate.getHours();
          this[pointType + "Minute"] = pointDate.getMinutes();
          this[pointType + "Second"] = pointDate.getSeconds();
        }
      }
    },
    getCurrentRange(value) {
      const range = [];
      for (let i = this["min" + this.capitalize(value)]; i <= this["max" + this.capitalize(value)]; i++) {
        range.push(i);
      }
      return range;
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    checkValue(name, value, values) {
      if (values.indexOf(value) === -1) {
        this[name] = values[0];
      }
    },
    daysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    },
    fixIosDateFormat(value) {
      if (typeof value === "string") {
        value = value.replace(/-/g, "/");
      }
      return value;
    },
    createTimeStamp(time) {
      if (!time)
        return;
      if (typeof time === "number") {
        return time;
      } else {
        time = time.replace(/-/g, "/");
        if (this.type === "date") {
          time = time + " 00:00:00";
        }
        return Date.parse(time);
      }
    },
    createDomSting() {
      const yymmdd = this.year + "-" + this.lessThanTen(this.month) + "-" + this.lessThanTen(this.day);
      let hhmmss = this.lessThanTen(this.hour) + ":" + this.lessThanTen(this.minute);
      if (!this.hideSecond) {
        hhmmss = hhmmss + ":" + this.lessThanTen(this.second);
      }
      if (this.type === "date") {
        return yymmdd;
      } else if (this.type === "time") {
        return hhmmss;
      } else {
        return yymmdd + " " + hhmmss;
      }
    },
    initTime(emit = true) {
      this.time = this.createDomSting();
      if (!emit)
        return;
      if (this.returnType === "timestamp" && this.type !== "time") {
        this.$emit("change", this.createTimeStamp(this.time));
        this.$emit("input", this.createTimeStamp(this.time));
        this.$emit("update:modelValue", this.createTimeStamp(this.time));
      } else {
        this.$emit("change", this.time);
        this.$emit("input", this.time);
        this.$emit("update:modelValue", this.time);
      }
    },
    bindDateChange(e) {
      const val = e.detail.value;
      this.year = this.years[val[0]];
      this.month = this.months[val[1]];
      this.day = this.days[val[2]];
    },
    bindTimeChange(e) {
      const val = e.detail.value;
      this.hour = this.hours[val[0]];
      this.minute = this.minutes[val[1]];
      this.second = this.seconds[val[2]];
    },
    initTimePicker() {
      if (this.disabled)
        return;
      const value = this.fixIosDateFormat(this.value);
      this.initPickerValue(value);
      this.visible = !this.visible;
    },
    tiggerTimePicker(e) {
      this.visible = !this.visible;
    },
    clearTime() {
      this.time = "";
      this.$emit("change", this.time);
      this.$emit("input", this.time);
      this.$emit("update:modelValue", this.time);
      this.tiggerTimePicker();
    },
    setTime() {
      this.initTime();
      this.tiggerTimePicker();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.time),
    b: !$data.time
  }, !$data.time ? {
    c: common_vendor.t($options.selectTimeText)
  } : {}, {
    d: $props.disabled ? 1 : "",
    e: $props.border ? 1 : "",
    f: common_vendor.o((...args) => $options.initTimePicker && $options.initTimePicker(...args)),
    g: $data.visible
  }, $data.visible ? {
    h: common_vendor.o((...args) => $options.tiggerTimePicker && $options.tiggerTimePicker(...args))
  } : {}, {
    i: $data.visible
  }, $data.visible ? common_vendor.e({
    j: common_vendor.t($options.selectTimeText),
    k: $data.dateShow
  }, $data.dateShow ? {
    l: common_vendor.f($options.years, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t($options.lessThanTen(item))
      };
    }),
    m: common_vendor.f($options.months, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t($options.lessThanTen(item))
      };
    }),
    n: common_vendor.f($options.days, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t($options.lessThanTen(item))
      };
    }),
    o: $data.indicatorStyle,
    p: $options.ymd,
    q: common_vendor.o((...args) => $options.bindDateChange && $options.bindDateChange(...args))
  } : {}, {
    r: $data.timeShow
  }, $data.timeShow ? common_vendor.e({
    s: common_vendor.f($options.hours, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t($options.lessThanTen(item))
      };
    }),
    t: common_vendor.f($options.minutes, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t($options.lessThanTen(item))
      };
    }),
    v: !$props.hideSecond
  }, !$props.hideSecond ? {
    w: common_vendor.f($options.seconds, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.t($options.lessThanTen(item))
      };
    })
  } : {}, {
    x: common_vendor.n($props.hideSecond ? "time-hide-second" : ""),
    y: $data.indicatorStyle,
    z: $options.hms,
    A: common_vendor.o((...args) => $options.bindTimeChange && $options.bindTimeChange(...args)),
    B: common_vendor.n($props.hideSecond ? "sign-center" : "sign-left"),
    C: !$props.hideSecond
  }, !$props.hideSecond ? {} : {}) : {}, {
    D: common_vendor.t($options.clearText),
    E: common_vendor.o((...args) => $options.clearTime && $options.clearTime(...args)),
    F: common_vendor.t($options.cancelText),
    G: common_vendor.o((...args) => $options.tiggerTimePicker && $options.tiggerTimePicker(...args)),
    H: common_vendor.t($options.okText),
    I: common_vendor.o((...args) => $options.setTime && $options.setTime(...args)),
    J: common_vendor.n($data.dateShow && $data.timeShow ? "" : "fix-nvue-height"),
    K: common_vendor.s($data.fixNvueBug)
  }) : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-datetime-picker/components/uni-datetime-picker/time-picker.vue"]]);
swan.createComponent(Component);

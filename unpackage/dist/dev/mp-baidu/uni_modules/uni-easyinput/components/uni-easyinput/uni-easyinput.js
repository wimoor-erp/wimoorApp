"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uni-easyinput",
  emits: ["click", "iconClick", "update:modelValue", "input", "focus", "blur", "confirm"],
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    name: String,
    value: [Number, String],
    modelValue: [Number, String],
    type: {
      type: String,
      default: "text"
    },
    clearable: {
      type: Boolean,
      default: true
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    placeholderStyle: String,
    focus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: 140
    },
    confirmType: {
      type: String,
      default: "done"
    },
    clearSize: {
      type: [Number, String],
      default: 15
    },
    inputBorder: {
      type: Boolean,
      default: true
    },
    prefixIcon: {
      type: String,
      default: ""
    },
    suffixIcon: {
      type: String,
      default: ""
    },
    trim: {
      type: [Boolean, String],
      default: true
    },
    passwordIcon: {
      type: Boolean,
      default: true
    },
    styles: {
      type: Object,
      default() {
        return {
          color: "#333",
          disableColor: "#F7F6F6",
          borderColor: "#e5e5e5"
        };
      }
    },
    errorMessage: {
      type: [String, Boolean],
      default: ""
    }
  },
  data() {
    return {
      focused: false,
      errMsg: "",
      val: "",
      showMsg: "",
      border: false,
      isFirstBorder: false,
      showClearIcon: false,
      showPassword: false
    };
  },
  computed: {
    msg() {
      return this.errorMessage || this.errMsg;
    },
    inputMaxlength() {
      return Number(this.maxlength);
    }
  },
  watch: {
    value(newVal) {
      if (this.errMsg)
        this.errMsg = "";
      this.val = newVal;
      if (this.form && this.formItem && !this.is_reset) {
        this.is_reset = false;
        this.formItem.setValue(newVal);
      }
    },
    modelValue(newVal) {
      if (this.errMsg)
        this.errMsg = "";
      this.val = newVal;
      if (this.form && this.formItem && !this.is_reset) {
        this.is_reset = false;
        this.formItem.setValue(newVal);
      }
    },
    focus(newVal) {
      this.$nextTick(() => {
        this.focused = this.focus;
      });
    }
  },
  created() {
    if (!this.value) {
      this.val = this.modelValue;
    }
    if (!this.modelValue) {
      this.val = this.value;
    }
    this.form = this.getForm("uniForms");
    this.formItem = this.getForm("uniFormsItem");
    if (this.form && this.formItem) {
      if (this.formItem.name) {
        if (!this.is_reset) {
          this.is_reset = false;
          this.formItem.setValue(this.val);
        }
        this.rename = this.formItem.name;
        this.form.inputChildrens.push(this);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.focused = this.focus;
    });
  },
  methods: {
    init() {
    },
    onClickIcon(type) {
      this.$emit("iconClick", type);
    },
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
    onEyes() {
      this.showPassword = !this.showPassword;
    },
    onInput(event) {
      let value = event.detail.value;
      if (this.trim) {
        if (typeof this.trim === "boolean" && this.trim) {
          value = this.trimStr(value);
        }
        if (typeof this.trim === "string") {
          value = this.trimStr(value, this.trim);
        }
      }
      if (this.errMsg)
        this.errMsg = "";
      this.val = value;
      this.$emit("input", value);
      this.$emit("update:modelValue", value);
    },
    onFocus(event) {
      this.$emit("focus", event);
    },
    onBlur(event) {
      event.detail.value;
      this.$emit("blur", event);
    },
    onConfirm(e) {
      this.$emit("confirm", e.detail.value);
    },
    onClear(event) {
      this.val = "";
      this.$emit("input", "");
      this.$emit("update:modelValue", "");
    },
    fieldClick() {
      this.$emit("click");
    },
    trimStr(str, pos = "both") {
      if (pos === "both") {
        return str.trim();
      } else if (pos === "left") {
        return str.trimLeft();
      } else if (pos === "right") {
        return str.trimRight();
      } else if (pos === "start") {
        return str.trimStart();
      } else if (pos === "end") {
        return str.trimEnd();
      } else if (pos === "all") {
        return str.replace(/\s+/g, "");
      } else if (pos === "none") {
        return str;
      }
      return str;
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.prefixIcon
  }, $props.prefixIcon ? {
    b: {
      "click": common_vendor.o(($event) => $options.onClickIcon("prefix"))
    },
    c: common_vendor.p({
      type: $props.prefixIcon,
      color: "#c0c4cc"
    })
  } : {}, {
    d: $props.type === "textarea"
  }, $props.type === "textarea" ? {
    e: $props.inputBorder ? 1 : "",
    f: $props.name,
    g: $data.val,
    h: $props.placeholder,
    i: $props.placeholderStyle,
    j: $props.disabled,
    k: $options.inputMaxlength,
    l: $data.focused,
    m: $props.autoHeight,
    n: common_vendor.o((...args) => $options.onInput && $options.onInput(...args)),
    o: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    p: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    q: common_vendor.o((...args) => $options.onConfirm && $options.onConfirm(...args))
  } : {
    r: $props.type === "password" ? "text" : $props.type,
    s: $props.type === "password" || $props.clearable || $props.prefixIcon ? "" : "10px",
    t: $props.prefixIcon ? "" : "10px",
    v: $props.name,
    w: $data.val,
    x: !$data.showPassword && $props.type === "password",
    y: $props.placeholder,
    z: $props.placeholderStyle,
    A: $props.disabled,
    B: $options.inputMaxlength,
    C: $data.focused,
    D: $props.confirmType,
    E: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    F: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    G: common_vendor.o((...args) => $options.onInput && $options.onInput(...args)),
    H: common_vendor.o((...args) => $options.onConfirm && $options.onConfirm(...args))
  }, {
    I: $props.type === "password" && $props.passwordIcon
  }, $props.type === "password" && $props.passwordIcon ? common_vendor.e({
    J: $data.val != ""
  }, $data.val != "" ? {
    K: $props.type === "textarea" ? 1 : "",
    L: {
      "click": common_vendor.o($options.onEyes)
    },
    M: common_vendor.p({
      type: $data.showPassword ? "eye-slash-filled" : "eye-filled",
      size: 18,
      color: "#c0c4cc"
    })
  } : {}) : $props.suffixIcon ? common_vendor.e({
    O: $props.suffixIcon
  }, $props.suffixIcon ? {
    P: {
      "click": common_vendor.o(($event) => $options.onClickIcon("suffix"))
    },
    Q: common_vendor.p({
      type: $props.suffixIcon,
      color: "#c0c4cc"
    })
  } : {}) : common_vendor.e({
    R: $props.clearable && $data.val && !$props.disabled
  }, $props.clearable && $data.val && !$props.disabled ? {
    S: $props.type === "textarea" ? 1 : "",
    T: {
      "click": common_vendor.o($options.onClear)
    },
    U: common_vendor.p({
      type: "clear",
      size: $props.clearSize,
      color: "#c0c4cc"
    })
  } : {}), {
    N: $props.suffixIcon,
    V: $props.inputBorder ? 1 : "",
    W: $props.inputBorder && $options.msg ? 1 : "",
    X: $props.type === "textarea" ? 1 : "",
    Y: $props.disabled ? 1 : "",
    Z: $props.inputBorder && $options.msg ? "#dd524d" : $props.styles.borderColor,
    aa: $props.disabled ? $props.styles.disableColor : "",
    ab: $options.msg ? 1 : "",
    ac: $props.inputBorder && $options.msg ? "#e43d33" : $props.styles.color
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-abe12412"], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue"]]);
swan.createComponent(Component);

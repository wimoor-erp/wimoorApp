"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uniCollapse",
  emits: ["change", "activeItem", "input", "update:modelValue"],
  props: {
    value: {
      type: [String, Array],
      default: ""
    },
    modelValue: {
      type: [String, Array],
      default: ""
    },
    accordion: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    dataValue() {
      let value = typeof this.value === "string" && this.value === "" || Array.isArray(this.value) && this.value.length === 0;
      let modelValue = typeof this.modelValue === "string" && this.modelValue === "" || Array.isArray(this.modelValue) && this.modelValue.length === 0;
      if (value) {
        return this.modelValue;
      }
      if (modelValue) {
        return this.value;
      }
      return this.value;
    }
  },
  watch: {
    dataValue(val) {
      this.setOpen(val);
    }
  },
  created() {
    this.childrens = [];
    this.names = [];
  },
  mounted() {
    this.$nextTick(() => {
      this.setOpen(this.dataValue);
    });
  },
  methods: {
    setOpen(val) {
      let str = typeof val === "string";
      let arr = Array.isArray(val);
      this.childrens.forEach((vm, index) => {
        if (str) {
          if (val === vm.nameSync) {
            if (!this.accordion) {
              console.warn("accordion \u5C5E\u6027\u4E3A false ,v-model \u7C7B\u578B\u5E94\u8BE5\u4E3A array");
              return;
            }
            vm.isOpen = true;
          }
        }
        if (arr) {
          val.forEach((v) => {
            if (v === vm.nameSync) {
              if (this.accordion) {
                console.warn("accordion \u5C5E\u6027\u4E3A true ,v-model \u7C7B\u578B\u5E94\u8BE5\u4E3A string");
                return;
              }
              vm.isOpen = true;
            }
          });
        }
      });
      this.emit(val);
    },
    setAccordion(self) {
      if (!this.accordion)
        return;
      this.childrens.forEach((vm, index) => {
        if (self !== vm) {
          vm.isOpen = false;
        }
      });
    },
    resize() {
      this.childrens.forEach((vm, index) => {
        vm.getCollapseHeight();
      });
    },
    onChange(isOpen, self) {
      let activeItem = [];
      if (this.accordion) {
        activeItem = isOpen ? self.nameSync : "";
      } else {
        this.childrens.forEach((vm, index) => {
          if (vm.isOpen) {
            activeItem.push(vm.nameSync);
          }
        });
      }
      this.$emit("change", activeItem);
      this.emit(activeItem);
    },
    emit(val) {
      this.$emit("input", val);
      this.$emit("update:modelValue", val);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/admin/Documents/HBuilderProjects/wimoorApp/uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue"]]);
wx.createComponent(Component);

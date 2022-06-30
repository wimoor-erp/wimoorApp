"use strict";
var common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    hasLogin: false,
    isUniverifyLogin: false,
    loginProvider: "",
    openid: null,
    testvuex: false,
    colorIndex: 0,
    colorList: ["#FF0000", "#00FF00", "#0000FF"],
    noMatchLeftWindow: true,
    active: "componentPage",
    leftWinActive: "/pages/component/view/view",
    activeOpen: "",
    menu: [],
    univerifyErrorMsg: ""
  },
  mutations: {
    login(state, provider) {
      state.hasLogin = true;
      state.loginProvider = provider;
    },
    logout(state) {
      state.hasLogin = false;
      state.openid = null;
    },
    setOpenid(state, openid) {
      state.openid = openid;
    },
    setTestTrue(state) {
      state.testvuex = true;
    },
    setTestFalse(state) {
      state.testvuex = false;
    },
    setColorIndex(state, index) {
      state.colorIndex = index;
    },
    setMatchLeftWindow(state, matchLeftWindow) {
      state.noMatchLeftWindow = !matchLeftWindow;
    },
    setActive(state, tabPage) {
      state.active = tabPage;
    },
    setLeftWinActive(state, leftWinActive) {
      state.leftWinActive = leftWinActive;
    },
    setActiveOpen(state, activeOpen) {
      state.activeOpen = activeOpen;
    },
    setMenu(state, menu) {
      state.menu = menu;
    },
    setUniverifyLogin(state, payload) {
      typeof payload !== "boolean" ? payload = !!payload : "";
      state.isUniverifyLogin = payload;
    },
    setUniverifyErrorMsg(state, payload = "") {
      state.univerifyErrorMsg = payload;
    }
  },
  getters: {
    currentColor(state) {
      return state.colorList[state.colorIndex];
    }
  },
  actions: {
    getUserOpenId: async function({
      commit,
      state
    }) {
      return await new Promise((resolve, reject) => {
        if (state.openid) {
          resolve(state.openid);
        } else {
          common_vendor.index.login({
            success: (data) => {
              commit("login");
              setTimeout(function() {
                const openid = "123456789";
                console.log("uni.request mock openid[" + openid + "]");
                commit("setOpenid", openid);
                resolve(openid);
              }, 1e3);
            },
            fail: (err) => {
              console.log("uni.login \u63A5\u53E3\u8C03\u7528\u5931\u8D25\uFF0C\u5C06\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\u5F00\u653E\u63A5\u53E3\u7B49\u670D\u52A1", err);
              reject(err);
            }
          });
        }
      });
    },
    getPhoneNumber: function({
      commit
    }, univerifyInfo) {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login",
          method: "POST",
          data: univerifyInfo,
          success: (res2) => {
            const data = res2.data;
            if (data.success) {
              resolve(data.phoneNumber);
            } else {
              reject(res2);
            }
          },
          fail: (err) => {
            reject(res);
          }
        });
      });
    }
  }
});
exports.store = store;

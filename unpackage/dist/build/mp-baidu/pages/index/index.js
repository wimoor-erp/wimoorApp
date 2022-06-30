/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: false
    },
    // 监听页面加载的生命周期函数
    onLoad() {
        this.setData({
            canIUse: swan.canIUse('button.open-type.getUserInfo')
        });
    },
    getUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
})

<template>
	自动登录中...
</template>

<script setup>
	import loginApi from '@/api/sys/login.js'
	import store from '@/store/index.js';//需要引入store
	import { reactive, toRefs,ref,onMounted } from 'vue'; 
	import {onLoad} from "@dcloudio/uni-app";
	const state=reactive({
		param: {}
	})
	const {param}=toRefs(state)
	onMounted(()=>{
		    // #ifdef MP-WEIXIN
		        autoLoginWeiXinXiaoChengXu();
			 // #endif
			 
		 	// #ifdef H5
			if(state.param.state=="feishu"){
				autoLoginFeiShuWeb()
			}
			else if(state.param.code!=null){
				autoLoginWeiXinGongZhongHao()
			}else{
				autoLoginH5();
			}
		    // #endif
	})
	onLoad((event)=>{
			state.param = event;
	})
	function autoLoginFeiShuWeb(){
		loginApi.loginWechat( {
				code: state.param.code,
				appType:"feishu"
			}).then(res => {
			var data=res&&res.data?res.data:res;
			if (data && data.status != 'isfail') {
				 store.commit('setOpenid',data.openid);
				let jsid = data.jsessionid;
				let currentuser = data.currentuser;
				 store.commit('setSessionid',jsid);
				 store.commit('setCurrentUser',currentuser);
				 store.commit('setUserList',data.userlist);
				 uni.setStorageSync("JSessionId", jsid);
				 uni.setStorageSync("currentUser",data.currentuser);
				 uni.setStorageSync("appType","feishu");
				 uni.setStorageSync("UserList",data.userlist);
				 uni.setStorageSync("openid",data.openid);
		         var  oldpath="pages/tabBar/main/index";
			    uni.switchTab({
			    			 		url:'/pages/tabBar/main/index'
			    })
			} else if(data) {
				if (data.openid) {
					store.commit('setSessionid',data.jsessionid)
					uni.navigateTo({
						url: '../../sys/validate/index?appType=feishu&sessionid='+data.jsessionid+"&openid="+data.openid+"&wxtoken="+data.accessToken+"&wxrefshtoken="+data.refreshToken
			 	    })
				} else {
					uni.showToast({
						title: '账号异常!!!',
						icon: 'none',
						duration: 2000
					})
				}
			}else{
				uni.showToast({
					title: '账号异常!!!',
					icon: 'none',
					duration: 2000
				})
			}
		});
	}
	function autoLoginWeiXinGongZhongHao(){
		 loginApi.loginWechat( {
		 		code: state.param.code,
		 		appType:"mp"
		 	}).then(res => {
		 	var data=res&&res.data?res.data:res;
		 	
		 	if (data && data.status != 'isfail') {
				 store.commit('setOpenid',data.openid);
		 		let jsid = data.jsessionid;
		 		let currentuser = data.currentuser;
		 		 store.commit('setSessionid',jsid);
		 		 store.commit('setCurrentUser',currentuser);
		 		 store.commit('setUserList',data.userlist);
				 uni.setStorageSync("JSessionId", jsid);
				 uni.setStorageSync("currentUser",currentuser);
				 uni.setStorageSync("UserList",data.userlist);
				 uni.setStorageSync("appType","mp");
				 uni.setStorageSync("openid",data.openid);
		         var  oldpath="pages/tabBar/main/index";
		 		 uni.switchTab({
		 					 		url:'/pages/tabBar/main/index'
		 		 })
		 	} else if(data) {
				 store.commit('setOpenid',data.openid);
		 		if (data.openid) {
		 			store.commit('setSessionid',data.jsessionid)
		 			uni.navigateTo({
		 				url: '../../sys/validate/index'
		 	 	    })
		 		} else {
		 			uni.showToast({
		 				title: '账号异常!!!',
		 				icon: 'none',
		 				duration: 2000
		 			})
		 		}
		 	}else{
				uni.showToast({
					title: '账号异常!!!',
					icon: 'none',
					duration: 2000
				})
			}
		 });
	}
	function autoLoginH5(){
			 var jsid=uni.getStorageSync("JSessionId");
			 if(jsid){
			 	 store.commit('setSessionid',jsid);
			 	 var currentuser= uni.getStorageSync(currentuser);
			 	 store.commit('setCurrentUser',currentuser);
				 uni.setStorage("JSessionId", jsid);
				 uni.setStorageSync("currentUser",currentuser);
			 	 uni.switchTab({
			 		url:'/pages/tabBar/main/index'
			 	 })
			 }else{
			 	uni.navigateTo({
			 		url: '../../sys/validate/index'
			 	})
			 }
	}
	function autoLoginWeiXinXiaoChengXu(){
		let that = this;
		uni.login({
		 success(res) {
		      if (res.code) {
					//发起网络请求
					loginApi.loginWechat( {  
							code: res.code,
							appType:loginApi.getAppType()
						}).then(res => {
						var data=res&&res.data?res.data:res;
						if (data && data.status != 'isfail') {
							store.commit('setOpenid',data.openid);
							uni.setStorageSync("openid",data.openid);
							let jsid = data.jsessionid;
							let currentuser = data.currentuser;
							 store.commit('setSessionid',jsid);
							 store.commit('setCurrentUser',currentuser);
							 store.commit('setUserList',data.userlist);
							 uni.setStorage("JSessionId", jsid);
							 uni.setStorageSync("currentUser",currentuser);
							 uni.setStorageSync("UserList",data.userlist);
							 uni.setStorageSync("appType","app"); 
					         var  oldpath="pages/tabBar/main/index";
							 uni.navigateBack();
						} else if(data){
							 store.commit('setOpenid',data.openid);
							if (data.openid) {
								store.commit('setSessionid',data.jsessionid)
								uni.navigateTo({
									url: '../../sys/validate/index'
						 	    })
							} else {
								uni.showToast({
									title: '账号异常!!!',
									icon: 'none',
									duration: 2000
								})
							}
						}else{
							uni.showToast({
								title: '账号异常!!!',
								icon: 'none',
								duration: 2000
							})
						}
					});
		 	} else {
					uni.showToast({
						title: '登录失败！' + res.errMsg,
						icon: 'none',
						duration: 2000
					})
				}
			}
		})
	}
</script>

<style>
</style>

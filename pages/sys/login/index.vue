<template>
	自动登录中...
</template>

<script setup>
	import { useRoute,useRouter } from 'vue-router'
	import loginApi from '@/api/sys/login.js'
	 import store from '@/store/index.js';//需要引入store
	import { reactive, toRefs,ref,onMounted } from 'vue'; 
	let router = useRouter();
	onMounted(()=>{
		 autoLogin();
	})
	function autoLogin(){
		let that = this;
		uni.login({
		 success(res) {
		      if (res.code) {
					//发起网络请求
					loginApi.loginWechat( {  
							code: res.code,
							appType:loginApi.getAppType()
						}).then(res => {
						var data=res.data?res.data:res;
						 store.commit('setOpenid',data.openid);
						if (data && data.status != 'isfail') {
							let jsid = data.jsessionid;
							let currentuser = data.currentuser;
							 store.commit('setSessionid',jsid);
							 store.commit('setCurrentUser',currentuser);
							 store.commit('setUserList',data.userlist);
					         var  oldpath="pages/tabBar/main/index";
							 uni.navigateBack();
						} else {
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

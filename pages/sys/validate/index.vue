<template>
	<form>
	  <view class="uni-flex uni-column login-box">
	<view class="flex-item flex-item-V login-input" >
		 <input class="uni-input" type="text" v-model="username" id="username" placeholder="请输入账号"/>
	</view>
	<view class="flex-item flex-item-V login-input">
		 <input class="uni-input" type="text" password="true" v-model="password" id="password" placeholder="请输入密码"/>
	</view>
	<view style="margin-top: 20px;">
		<button  @click="userValid" class="btn btn-orange">登录</button>
	</view>
	</view>
	</form>

</template>

<script>
  import loginApi from '@/api/sys/login.js'
  import store from '@/store/index.js';//需要引入store
	export default {
		data() { 
			return {
				username:'',
				password:'',
				ftype:''
			}
		},
		onLoad(event) {
			// TODO 后面把参数名替换成 payload
			const payload = event.ftype || event.payload;
			// 目前在某些平台参数会被主动 decode，暂时这样处理。
			try {
				this.ftype = decodeURIComponent(payload);
			} catch (error) {
				this.ftype = '';
			}
		},
		methods:{
			weixinValid(){
					let self=this;
					var openid=this.$store.state.openid;//uni.getStorage('openid');
					var sessionid=this.$store.state.sessionid;//uni.getStorage('JSessionId');
					var data={'openid': openid,
					          'email':self.username,
							  'password':self.password};
					data.jsessionid=sessionid;
					data.appType=loginApi.getAppType();
					loginApi.verifyWechatApp(data).then(data => {
						             if(data.code=="A0210"){
										 uni.showToast({
													icon:'none',
													title:data.msg,
													duration: 2000
										 })
									 }
									 else if(data){
											 let jsid=data.jsessionid;
											 store.commit('setSessionid',jsid);
											 //uni.setStorage("JSessionId", jsid);
											 //跳转至 成功页面
											 	 store.commit('setCurrentUser',data.currentuser);
											 //uni.setStorage("currentuser",data.currentuser);
											uni.switchTab({
												url:'/pages/tabBar/main/index'
											})
									 }else{
											 uni.showToast({
												icon:'none',
												title:'请输入正确的账号或密码！',
												duration: 2000
											 })
										}
							    });
			},
			h5Valid(){
				let self=this;
				var data={ 
				          'account':self.username,
						  'password':self.password};
			    loginApi.loginH5(data).then(data=>{
						             if(data.code=="A0210"){
										 uni.showToast({
													icon:'none',
													title:data.msg,
													duration: 2000
										 })
									 }
									 else if(data){
											 let jsid=data.session;
											 store.commit('setSessionid',jsid);
											 uni.getStorageSync("JSessionId", jsid);
											 store.commit('setCurrentUser',data);
											 uni.getStorageSync("currentuser",data.currentuser);
											 uni.switchTab({
												url:'/pages/tabBar/main/index'
											})
									 }else{
											 uni.showToast({
												icon:'none',
												title:'请输入正确的账号或密码！',
												duration: 2000
											 })
										}
							    })	
			},
			userValid(){
				// #ifdef MP-WEIXIN
				 this.weixinValid();
				 // #endif
				 // #ifdef H5
				 this.h5Valid();
				 // #endif
				
				
			}
		},
	}

</script>

<style >
.login-input .uni-input{
	margin-bottom:16px;
	border-radius:4px;
	border:1rpx solid #ddd;
}
.login-box{
	padding-top:32px;
	padding-right:32px;
	padding-left:32px;
}
</style>

<template>
	<form>
		<view  class="logo-screen-height uni-flex uni-between uni-column">
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
	<view class="uni-center">
		<text class="uni-h7" @click="mfalogin()">MFA登录</text>
	</view>
	</view>
	</form>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="MFA登录" :value="mfacode"
				placeholder="请输入验证编码!" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
</template>

<script>
  import loginApi from '@/api/sys/login.js'
  import userApi from '@/api/sys/admin/userApi.js';
  import store from '@/store/index.js';//需要引入store
	export default {
		data() { 
			return {
				username:'',
				password:'',
				ftype:'',
				openid:null,
				wxtoken:'',
				wxrefshtoken:'',
				unionid:'',
				mfacode:"",
			}
		},
		onLoad(event) {
			if(event){
				this.openid=event.openid;
				this.wxtoken=event.wxtoken;
				this.wxrefshtoken=event.wxrefshtoken;
				this.unionid=event.unionid;
				this.ftype=event.appType; 
			}
		},
		methods:{
			dialogInputConfirm(){
				this.userValid();
			},
			mfalogin(){
				this.$refs.inputDialog.open();
			},
			weixinGongZhongHaoValid(){
				let self=this;
				var appType=loginApi.getAppType();
				if(this.ftype){
					appType=this.ftype;
					uni.setStorageSync("appType", appType);
				}
				var data={
						"openid": self.openid,
						"wxtoken":self.wxtoken,
						"wxrefshtoken":self.wxrefshtoken,
						"unionid":self.unionid,
						"appType":appType,
						'email':self.username,
						'password':self.password,
						'mfa':self.mfacode,
					}
				if(self.openid===''){
					data.account=self.username;
					data.appType = "website";
					userApi.openidbind(data).then(res=>{
						uni.showToast({
							icon:'none',
							title:"绑定成功",
							duration: 2000
						});
						uni.switchTab({
							url:'/pages/tabBar/main/index'
						})
					})
				}else{
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
											 uni.setStorageSync("JSessionId", jsid);
											 //跳转至 成功页面
											store.commit('setCurrentUser',data.currentuser);
										    uni.setStorageSync("currentuser",data.currentuser);
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
				}
			},
			weixinValid(){
					let self=this;
					var openid=self.$store.state.openid;//uni.getStorage('openid');
					var sessionid=self.$store.state.sessionid;//uni.getStorage('JSessionId');
					var appType=loginApi.getAppType();
					if(this.ftype){
						appType=this.ftype;
						openid=self.openid;
					}
					var data={'openid': openid,
					          'email':self.username,
							  'password':self.password};
					data.jsessionid=sessionid;
					data.appType=appType;
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
											 uni.setStorageSync("JSessionId", jsid);
											 //跳转至 成功页面
											 store.commit('setCurrentUser',data.currentuser);
											 uni.setStorageSync("currentuser",data.currentuser);
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
				var param={ 
				          'account':self.username,
						  'password':self.password,
						  'mfa':self.mfacode,
						  };
			    loginApi.loginH5(param).then(data=>{
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
											 uni.setStorageSync("JSessionId", jsid);
											 store.commit('setCurrentUser',data);
											 uni.setStorageSync("currentuser",data);
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
				 if(this.openid!=null){
					  this.weixinGongZhongHaoValid();
				 }else{
					  this.h5Valid();
				 }
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
.logo-screen-height{
	height:90vh
}
</style>

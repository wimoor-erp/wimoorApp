<template>
	<form>
	  <view class="uni-flex uni-column">
	<view class="flex-item flex-item-V" style="border-bottom: 1px solid #BBBBBB ;">
		 <input class="uni-input" type="text" v-model="username" id="username" placeholder="请输入登录账号"/>
	</view>
	<view class="flex-item flex-item-V">
		 <input class="uni-input" type="text" password="true" v-model="password" id="password" placeholder="请输入登录密码"/>
	</view>
	<view style="margin-top: 20px;">
		<button  @click="userValid" class="btn btn-orange">身份校验</button>
	</view>
	</view>
	</form>

</template>

<script>
  import loginApi from '@/api/sys/login.js'
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
			userValid(){
				let self=this;
				var data={openid: uni.getStorageSync('openid'),email:self.username,password:self.password};
				data.jsessionid=uni.getStorageSync('JSessionId');
				loginApi.verifyWechatApp(data).then(data => {
								 if(data){
										 let jsid=data.jsessionid;
										 uni.setStorageSync("JSessionId", jsid);
										 //跳转至 成功页面
										uni.setStorageSync("currentuser",data.currentuser);
										uni.switchTab({
											url:'/pages/tabBar/erp/erp'
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
	}

</script>

<style>


</style>

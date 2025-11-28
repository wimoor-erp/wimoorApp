<template>
	<mumu-get-qrcode @success='qrcodeSucess' @error="qrcodeError" ></mumu-get-qrcode>
</template>

<script setup>
	import { reactive, toRefs,ref,onMounted, nextTick } from 'vue';
	import {handleScode} from '@/hooks/erp/scodehandler/handler.js'
	// #ifdef H5
	import MumuGetQrcode from '@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue'
	// #endif
	import {onLoad} from "@dcloudio/uni-app";
	var backurl="";
	function qrcodeSucess(res){
			 handleScode(res,backurl);
	}
	function qrcodeError(res){
		       uni.showModal({
		          title: '摄像头授权失败',
		          content: '摄像头授权失败，请检测当前浏览器是否有摄像头权限。',
		          success: () => {
		            uni.navigateBack({})
					}
		          })
	}
	onLoad((event)=>{
		backurl = event.backurl;
	})
</script>
<style>
</style>
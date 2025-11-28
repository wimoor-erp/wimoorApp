<template>
	<web-view   :src="url"></web-view>
</template>

<script setup>
	import { computed, nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import {onLoad} from "@dcloudio/uni-app";
    var url=ref("");
	onLoad(params=>{
		url.value="https://print.wimoor.com?"+jsonToParam(params);
	})
	 function jsonToParam(json) {
	     return Object.keys(json).map(function(key) {
	         return key + '=' +json[key];
	     }).join('&');
	 }  
</script>

<style scoped>
	.form-box{
		padding: 0px 24px 24px 24px;
	}
	.title{
		margin-bottom:16px;
	}

    .order-wrap{
		width:calc(100vw - 48px);
		padding:24px
	}
	.cell-b-16{
		margin-bottom:16px;
	}
.cell-t-16{
	margin-top: 16px;
}
</style>
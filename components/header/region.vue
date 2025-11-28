<template>
	<picker @change="changeData" :value="index" range-key="region" :range="list">
		<view class="uni-flex uni-row-center uni-select-button">
	   <view  v-if="list.length>0">{{list[index].region}}</view>
		<text class="icon-xiala iconfont"></text>
		</view>
	</picker>
</template>

<script setup>
    import authApi from '@/api/amazon/auth/authApi.js';
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch,} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:0 }); 
	const { list,index} = toRefs(state);
	let props = defineProps({ defaultValue:{default:"全部区域"},})
	const { defaultValue } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
	    emit("changeData",state.list[event.detail.value].id);
	}
	
	function getData(id){
				authApi.getRegionByGroup({'groupid':id}).then((res)=>{
					if(props.defaultValue!="only"){
						res.push({"id":"","name":"全部","region":""})
					}
					state.list=res;
					emit("changeData",state.list[0].id);
					if(res&&res.length>0){
	        			if(props.defaultValue!="all"){
	        			    state.region = res[0].groupid;
						}else{
							state.region = "";
						}
					}
				})
	}
	 defineExpose({
	   getData,
	 })
</script>

<style>
	.opticy-bg .uni-select-button{
		background-color: rgba(255,255,255,0.2)!important;
		color:#fff;
	}
</style>
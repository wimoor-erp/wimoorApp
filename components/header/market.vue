<template>
				<picker @change="changeData" :value="index" range-key="name" :range="list">
					<view class="uni-flex uni-row-center uni-select-button">
				   <view  v-if="list.length>0">{{list[index].name}}</view>
					<text class="icon-xiala iconfont"></text>
					</view>
				</picker>
</template>

<script setup>
    import marketApi from '@/api/amazon/market/marketApi'
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch,defineProps} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],namelist:[],index:0 }); 
	const { list,namelist,index} = toRefs(state);
	let props = defineProps({ defaultValue:"全部站点" })
	const { defaultValue } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var marketplaceid=state.list[event.detail.value].marketplaceid;
	    emit("changeData",marketplaceid);
	}
	
	function handlerQuery(groupid){
		 state.lis=[];
		marketApi.getMarketByGroup({'groupid':groupid}).then((res)=>{
			state.list=res;
			if(props.defaultValue!="only"){
			   state.list.unshift({"id":"","name":"全部站点"});
			}
			state.index=0;
			emit("changeData",state.list[state.index].marketplaceid);
		});
	}
	 defineExpose({
	   handlerQuery,
	 })
</script>

<style>
	.opticy-bg .uni-select-button{
		background-color: rgba(255,255,255,0.2)!important;
		color:#fff;
	}
	.opticy-bg .icon-xiala{
		color:#fff;
		opacity: 0.8;
	} 
</style>
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
	import { onMounted, reactive, ref, toRefs,watch,} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],namelist:[],index:0 }); 
	const { list,namelist,index} = toRefs(state);
	let props = defineProps({ defaultValue:{default:"全部站点"},indexC:{default:0}})
	const { defaultValue } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var marketplaceid=state.list[event.detail.value].marketplaceid;
		var pointName=state.list[event.detail.value].pointName;
	    emit("changeData",marketplaceid,pointName);
	}
	
	function handlerQuery(groupid){
		 state.lis=[];
		marketApi.getMarketByGroup({'groupid':groupid}).then((res)=>{
			state.list=res;
			if(props.defaultValue!="only"){
			   state.list.unshift({"id":"","name":"全部站点"});
			}
			if(props.indexC!==0){
				state.index = props.indexC
			}
			emit("changeData",state.list[state.index].marketplaceid,state.list[state.index].pointName);
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
</style>
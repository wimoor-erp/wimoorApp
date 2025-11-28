<template>

	<view  class="uni-flex from-wrap">
				<picker @change="handleChangeData" :value="index" range-key="name"  :range="list">
					<view class="uni-flex uni-row-center  uni-between uni-select-form">
					<view class="picker-label" v-if="list.length>0">{{list[index].name}}</view>
					<text class="icon-xiala iconfont"></text>
					</view>
				</picker>
	</view>
</template>

<script setup>
	import warehouseApi from '@/api/erp/warehouse/warehouseApi';
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeWarehouse']);
	const state = reactive({
		list:[],
		index:0,
		shelf:null,
	    searchChecked:0,
	
	 }); 
	const {
	list,
	index,
	searchChecked,
	} = toRefs(state);
	function handleChangeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
	    emit("changeWarehouse",id);
	}
	
	function handlerQuery(type){
			warehouseApi.getWarehouseUseable().then((res)=>{
				state.list=res;
			})
	}
	function shelfChange(event){
		if(event.detail.value.length===2){
			state.shelf = event.detail.value[1].value
			emit("changeWarehouse",state.shelf);
		}
	}
	function setWarehouse(id){
		var index=0;
		if(state.list&&state.list.length>0){
			for(var i=0;i<state.list.length;i++){
				if(state.list[i].id==id){
					index=i;
					state.shelf = state.list[i];
				}
			}
		}
		state.index=index;
		emit("changeWarehouse",state.shelf);
	}
	 defineExpose({
	 	setWarehouse,
	 })
	 onShow(()=>{
		 handlerQuery();
	 })
</script>

<style >
 .uni-select-form{
	 border: 1px solid #eee;
	 border-radius: 4px;
	 padding: 10px;
	 width: 100%;
 }
 .from-wrap picker{
	 width: calc(100vw - 46px);
 }
</style>
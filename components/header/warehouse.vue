<template>
	<view class=" uni-flex">
	<uni-data-select
	v-if="isgroup"
	class="cell-r-8 maxwidth"
	        v-model="searchChecked"
	        :localdata="searchData"
			 :clear="false"
	        @change="changeType"
	      ></uni-data-select>
	
				<picker @change="handleChangeData" :value="index" range-key="name"  :range="list">
					<view class="uni-flex uni-row-center  uni-between uni-select-button">
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
	const emit = defineEmits(['changeData']);
	const props = defineProps({defaultId:false,isgroup:false})
	const {isgroup,defaultId}=toRefs(props)
	const state = reactive({list:[],index:0,
	 searchData: [
	   { value: 0, text: "本地仓" },
	   { value: 1, text: "海外仓" },
	 ],
	 searchChecked:0,
	 }); 
	const { list,index,
	searchData,
	searchChecked,
	} = toRefs(state);
	function handleChangeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
	    emit("changeData",id);
	}
	
	function handlerQuery(type){
		if(type==="oversea"){
			  warehouseApi.getOversaWarehouseUseable().then(res=>{
				  state.list = res
				  state.list.unshift({"id":"","name":"全部仓库"});
				  emit("changeData",state.list[state.index].id,"oversea_usable");
			  })
		}else{
			warehouseApi.getWarehouseUseable().then((res)=>{
				state.list=res;
				if(!props.defaultId){
					state.list.unshift({"id":"","name":"全部仓库"});
				}
				emit("changeData",state.list[state.index].id);
			})
		}
	
	}
	function changeType(val){
		if(val===0){
			handlerQuery("local")
		}else{
			handlerQuery("oversea")
		}
	}
	 onShow(()=>{
		 handlerQuery();
	 })
</script>

<style>
	.maxwidth{
		max-width:90px;
		min-width: 80px;
	}
</style>
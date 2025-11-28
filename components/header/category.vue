<template>
				<picker @change="handleChangeData" :value="index" range-key="name"  :range="list">
					<view class="uni-flex uni-row-center  uni-between uni-select-button">
					<view class="picker-label" v-if="list.length>0">{{list[index].name}}</view>
					<text class="icon-xiala iconfont"></text>
					</view>
				</picker>
</template>

<script setup>
	import materialApi from '@/api/erp/material/materialApi.js';
	import categoryApi from '@/api/erp/material/categoryApi.js';
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[{"id":"","name":"全部分类"}],index:0 });
	 const props=defineProps({
		 type:'',
	 })
	const { list,index} = toRefs(state);
	function handleChangeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
	    emit("changeData",id);
	}
	
	function handlerQuery(){
		if(props.type){
			categoryApi.getcategoryType({"type":props.type}).then(res=>{
				res.unshift({"id":"","name":"全部分类"})
				if(res && res.length>0){
					state.list=res;
				}
			})
		}else{
			materialApi.getCategory().then((res)=>{
				res.unshift({"id":"","name":"全部分类"})
				if(res && res.length>0){
					state.list=res;
				}
			});
		}
	}
	
	 onShow(()=>{
		 handlerQuery();
	 })
</script>

<style>
</style>
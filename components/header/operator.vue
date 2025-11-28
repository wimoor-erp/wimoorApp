<template>
				<picker @change="handleChangeData" :value="index" range-key="name"  :range="list">
					<view class="uni-flex uni-row-center  uni-between uni-select-button">
					<view class="picker-label" v-if="list.length>0">{{list[index].name}}</view>
					<text class="icon-xiala iconfont"></text>
					</view>
				</picker>
</template>

<script setup>
	import userApi from '@/api/sys/admin/userApi.js';
	import materialApi from '@/api/erp/material/materialApi.js';
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[{"id":"","name":"操作人"}],index:0 }); 
	const { list,index} = toRefs(state);
	function handleChangeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
	    emit("changeData",id);
	}
	const props=defineProps({operator:''})
	function handlerQuery(){
		if(props.operator==='product'){
			materialApi.getOwnerList().then(res=>{
				if(res){
					res = res.filter(item=>item!==null)
					state.list = res;
					state.list.unshift({"id":"","name":"负责人"});
					emit("changeData",state.list[state.index].id);
				}
			})
		}else{
		userApi.findOwnerAll().then((res)=>{
			state.list=res;
			if(props.operator==='owner'){
				state.list.unshift({"id":"","name":"负责人"});
			}else{
				state.list.unshift({"id":"","name":"操作人"});
			}
			emit("changeData",state.list[state.index].id);
		});	
		}
	}
	
	 onShow(()=>{
		 handlerQuery();
	 })
</script>

<style>
</style>
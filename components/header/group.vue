<template>
	<view class="uni-list">
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				店铺
			</view>
			<view class="uni-list-cell-db">
				<picker @change="changeData" :value="index" range-key="name" :range="list">
					<view class="uni-input" v-if="list.length>0">{{list[index].name}}</view>
				</picker>
			</view>
		</view>
	</view>
</template>

<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch,defineProps} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],namelist:[],index:0 }); 
	const { list,namelist,index} = toRefs(state);
	let props = defineProps({ defaultValue:"" });
	const { defaultValue } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var groupid=state.list[state.index].id;
	    emit("changeData",groupid);
	}
	function handlerQuery(){
		groupApi.getAmazonGroup().then((res)=>{
			state.list=res;
			if(props.defaultValue!="only"){
			   state.list.unshift({"id":"","name":"全部"});
			}
			emit("changeData",state.list[state.index].id);
		});
	}
	onShow(()=>{
		handlerQuery();
	})
</script>

<style>
</style>
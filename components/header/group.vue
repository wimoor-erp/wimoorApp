<template>
			<picker class="m-r-8" @change="changeData" :value="index"  range-key="name" :range="list">
				<view class="uni-text-picker-w" :class="stylegray">
					<text v-if="list.length>0">{{list[index].name}}</text>
					<text class="icon-xiala iconfont"></text>
				</view>
			</picker>
</template>

<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch,defineProps} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],namelist:[],index:0 }); 
	const { list,namelist,index} = toRefs(state);
	let props = defineProps({ defaultValue:"",stylegray:"" });
	const { defaultValue,stylegray } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var groupid=state.list[state.index].id;
	    emit("changeData",groupid);
	}
	function handlerQuery(){
		console.log(11111)
		groupApi.getAmazonGroup().then((res)=>{
			state.list=res;
			if(props.defaultValue!="only"){
			   state.list.unshift({"id":"","name":"全部店铺"});
			}
			emit("changeData",state.list[state.index].id);
		});
	}
	onMounted(()=>{
		handlerQuery();
	})
</script>

<style>
       .stylegray{
		padding:8px;
		min-width:78px;
	    background:#f1f1f1;
	    border-radius:4px;
	    font-size:14px;
		}
		.opticy-bg .uni-text-picker-w{
			background-color: rgba(255,255,255,0.2)!important;
			color:#fff;
		}
		.opticy-bg .icon-xiala{
			color:#fff;
			opacity: 0.8;
		} 
</style>
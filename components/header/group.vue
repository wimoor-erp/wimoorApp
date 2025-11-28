<template>
			<picker class="m-r-8 " @change="changeData" :value="index"  range-key="name" :range="list">
				<view class="uni-flex uni-row-center uni-select-button" :class="stylegray">
					<text v-if="list.length>0">{{list[index].name}}</text>
					<text class="icon-xiala iconfont"></text>
				</view>
			</picker>
</template>
<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch,} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],namelist:[],index:0 }); 
	const { list,namelist,index} = toRefs(state);
	const props = defineProps({ defaultValue:"",stylegray:"" ,indexC:{default:0}});
	const { defaultValue,stylegray,indexC } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var groupid=state.list[state.index].id;
	    emit("changeData",groupid);
	}
	function handlerQuery(){
		groupApi.getAmazonGroup().then((res)=>{
			state.list=res;
			if(props.defaultValue!="only"){
			   state.list.unshift({"id":"","name":"全部店铺"});
			}
			if(props.indexC!==0){
				state.index =1
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
		min-width:78px;
	    background:#f1f1f1;
	    border-radius:4px;
		border-color:#f1f1f1!important;
	    font-size:14px;
		}
	.opticy-bg .uni-select-button{
		background-color: rgba(255,255,255,0.2)!important;
		color:#fff;
	}
</style>
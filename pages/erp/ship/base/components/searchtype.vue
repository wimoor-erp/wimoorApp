<template>
	<view class="uni-flex uni-row-center">
		<picker @change="changeData" :value="index" range-key="title" :range="list">
			<view class="uni-flex uni-row-center uni-select-button select-border">
			<view  v-if="list.length>0">{{list[index].title}}</view>
			<text class="icon-xiala iconfont"></text>
			</view>
		</picker>
		<view class="cell-l-8 flex-1">
		<uni-easyinput  @input="onKeyInput"  :placeholder="list[index].title" />
		</view>
	</view>
</template>

<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:0 }); 
	const { list,index} = toRefs(state);
	const param={type:"sku",search:""};
	state.list =[{
				title:'SKU',
				name:"sku"
				},{
				title:'货件编码',
				name:"number"
				},{
				title:'货件名称',
				name:"formnumber"
				},{
				title:'备注',
				name:"remark"
				}];
	function changeData(event){
		state.index=event.detail.value;
		var name=state.list[state.index].name;
		param.type=name;
	    emit("changeData",param);
	}
   function onKeyInput(event){
	   var inputValue = event.target.value;
	   param.search=inputValue;
	   emit("changeData",param);
   }
 onMounted(()=>{
 	 emit("changeData",param);
 })
</script>

<style>
	.select-border{
		background-color: #fff;
		border: 1px solid rgba(0,0,0,0.1);
	}
	.flex-1{
		flex: 1;
	}
</style>
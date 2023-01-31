<template>
	<view class="uni-list">
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				搜索类型
			</view>
			<view class="uni-list-cell-db">
				<picker @change="changeData" :value="index" range-key="title" :range="list">
					<view class="uni-input" v-if="list.length>0">{{list[index].title}}</view>
				</picker>
			</view>
		</view>
	</view>
	<view class="uni-list">
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				搜索内容
			</view>
			<view class="uni-list-cell-db">
			      <input class="uni-input" @input="onKeyInput" focus :placeholder="list[index].title" />
			</view>
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
</style>
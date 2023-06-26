<template>
	<view class="uni-list">
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				订单状态
			</view>
			<view class="uni-list-cell-db">
				<picker @change="changeData" :value="index" range-key="title" :range="list">
					<view class="uni-input" v-if="list.length>0">{{list[index].title}}</view>
				</picker>
			</view>
		</view>
	</view>
</template>

<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:1 }); 
	const { list,index} = toRefs(state);
	state.list =[{ 
				title:'处理中',
				name:"4"
				},{
				title:'未审核',
				name:"1"
				},{
				title:'已完成',
				name:"3"
				},{
				title:'已驳回',
				name:"0"
				},{
				title:'未收货已超期',
				name:"10"
				},{
				title:'付款完成',
				name:"11" 
				},{
				title:'收货完成',
				name:"12" 
				},{
				title:'未付款未收货',
				name:"8"
				},{
				title:'已付款未收货', 
				name:"9"
				},{
				title:'已付款',
				name:"5"
				},{
				title:'全部单据',
				name:"all"
				}
				];
	 function handleClick(value){
					return value;
				}
	function changeData(event){
		state.index=event.detail.value;
		var name=state.list[state.index].name;
		var obj=handleClick(name);
	    emit("changeData",obj);
	}
	onMounted(()=>{
		 emit("changeData",handleClick("4"));
	})
</script>

<style>
</style>
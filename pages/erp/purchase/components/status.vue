<template>
	<picker @change="changeData" :value="index" range-key="title" :range="list">
		<view class="uni-flex uni-row-center uni-select-button">
		<view  v-if="list.length>0">{{list[index].title}}</view>
		<text class="icon-xiala iconfont"></text>
		</view>
	</picker>
</template>

<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeState']);
	const state = reactive({list:[],index:0 }); 
	const { list,index} = toRefs(state);
	const props = defineProps({
		isall:false,
	})
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
	    emit("changeState",obj);
	}
	onMounted(()=>{
		if(props.isall){
		     state.index=10;
		}else{
			emit("changeState",handleClick("4"));
		}
	})
</script>

<style>
</style>
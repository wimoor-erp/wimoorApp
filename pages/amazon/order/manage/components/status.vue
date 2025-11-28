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
	const emit = defineEmits(['statusChange']);
	const state = reactive({list:[
		{
					title:'全部状态',
					value:null
					},{
					title:'Shipped',
					value:"Shipped"
					},{
					title:'UnShipped',
					value:"UnShipped"
					},{
					title:'Pending',
					value:"Pending"
					},{
					title:'CanCelled',
					value:"CanCelled"
					},
	             ],
	index:0,
	}
	); 
	
	const { list,index} = toRefs(state);
	function changeData(event){
		state.index=event.detail.value;
		var value=state.list[state.index].value;
	    emit("statusChange",value);
	}
	onMounted(()=>{
		
	})
</script>

<style>
</style>
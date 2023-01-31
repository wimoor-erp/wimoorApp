<template>
	<view class="uni-list">
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				仓库
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
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:0 }); 
	const { list,index} = toRefs(state);
	function changeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
	    emit("changeData",id);
	}
	
	function handlerQuery(){
		 warehouseApi.getWarehouseUseable().then((res)=>{
			state.list=res;
		    state.list.unshift({"id":"","name":"全部"});
			emit("changeData",state.list[state.index].id);
		});
	}
	 onMounted(()=>{
		 handlerQuery();
	 })
</script>

<style>
</style>
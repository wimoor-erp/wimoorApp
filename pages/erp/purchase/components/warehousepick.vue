<template>
		<view class="uni-list ">
			 <view  >
			 	入库仓库:<text style="float:right" class="light-font">默认使用正品仓</text>
			 </view>
			 <view class="uni-list-cell-db">
			 	<picker @change="changeData" :value="index" range-key="name" :range="list">
			 		<view class="uni-input" v-if="list.length>0&&index>0">{{list[index].name}}</view>
					<view class="uni-input" v-else>未找到</view>
			 	</picker>
			 </view>
		</view>
</template>

<script setup>
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:-1}); 
	const { list,index} = toRefs(state);
	let props = defineProps({
		warehouseid:""
	 })
	const { warehouseid } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
		emit("changeData",id);
	}
	function handlerQuery(){
		state.list=[];
		 warehouseApi.getWarehouseUseable().then((res)=>{
			if(res){
			    state.list=res;
				res.forEach((item,index)=>{
					if(props.warehouseid==item.id){
						state.index=index;
					}
				  })
				};
			  emit("changeData",props.warehouseid );
		});
	}
	 onMounted(()=>{
		 handlerQuery();
	 })
</script>

<style>
</style>
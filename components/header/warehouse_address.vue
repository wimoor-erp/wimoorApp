<template>
	<scroll-view class="scroll-view_H" scroll-x="true" >
	<UniSegmentedControl class="tab-left" :current="current" :values="items" style-type="text"
		active-color="#ff6700" @clickItem="changeData" />
	</scroll-view>
</template>

<script setup>
	import warehouseAddressApi from '@/api/erp/warehouse/warehouseAddressApi'
	import UniSegmentedControl from '@/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	import {onShow} from "@dcloudio/uni-app";
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:0 ,items:[]}); 
	const { list,index,items} = toRefs(state);
	function changeData(event){
	    emit("changeData",state.list[event.currentIndex].id);
	}
	
	function handlerQuery(){
		state.items=[];
		 warehouseAddressApi.listWarehouseAddress().then((res)=>{
			state.list=res.records;
			res.records.forEach((a)=>{
				state.items.push(a.name)
			})
			emit("changeData",state.list[state.index].id);
		});
	}
	 onShow(()=>{
		 handlerQuery();
	 })
</script>

<style>

</style>
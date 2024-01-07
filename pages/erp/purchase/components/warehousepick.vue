<template>
			 	<picker @change="changeData" :value="index" range-key="name" class="uni-flex-item" :range="list">
					<view style="display: flex;align-items: center;justify-content: space-between;">
			 		<view class="uni-forms-line " v-if="list.length>0&&index>=0">{{list[index].name}}-正品仓</view>
					<view class="uni-h6" v-else>请选择仓库</view>
					<uni-icons color="#999"  type="forward" size="16"></uni-icons>
					</view>
			 	</picker>
</template>

<script setup>
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:-1}); 
	const { list,index} = toRefs(state);
	let props = defineProps({
		warehouseid:"",
		warehousename:'',
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
			  if(state.index==-1&&res.length>0){
				  props.warehouseid=res[0].id;
				  state.index=0;
				  emit("changeData",props.warehouseid );
			  }else{
			    emit("changeData",props.warehouseid );
			  }
		});
	}
	function selectDefaultWarehouse(){
		state.list.forEach((item,i)=>{
			if(item.name===props.warehousename){
			state.index = i	
			}
		})
	}
	 onMounted(()=>{
		 handlerQuery();
		 selectDefaultWarehouse()
	 })
</script>

<style>
	.uni-forms-line{
		line-height:44px;
		color:#333;
	}
</style>
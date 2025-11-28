<template>
	<view  v-if="isSelectShelf">
	<uni-data-picker 
	class="maxwidth"
	 :map="{text:'name',value:'id'}"
	 :clear-icon="false"	
	 popup-title="请选择" :localdata="dataTree" v-model="shelf"
	 @change="shelfChange" >
	</uni-data-picker>
	</view>	
	<view v-else class=" uni-flex">
	<uni-data-select
	v-if="isgroup"
	class="cell-r-8 maxwidth"
	        v-model="searchChecked"
	        :localdata="searchData"
			 :clear="false"
	        @change="changeType"
	      ></uni-data-select>
	
				<picker @change="handleChangeData" :value="index" range-key="name"  :range="list">
					<view class="uni-flex uni-row-center  uni-between uni-select-button">
					<view class="picker-label" v-if="list.length>0">{{list[index].name}}</view>
					<text class="icon-xiala iconfont"></text>
					</view>
				</picker>
	</view>
</template>

<script setup>
	import warehouseApi from '@/api/erp/warehouse/warehouseApi';
	import {onShow} from "@dcloudio/uni-app";
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const props = defineProps({defaultId:false,isgroup:false,isSelectShelf:false,})
	const {isgroup,defaultId,isSelectShelf}=toRefs(props)
	const state = reactive({list:[],index:0,
	 searchData: [
	   { value: 0, text: "本地仓" },
	   { value: 1, text: "海外仓" },
	 ],
	 searchChecked:0,
	 shelf:'',
	 dataTree:[],
	 }); 
	const { list,index,
	searchData,shelf,dataTree,
	searchChecked,
	} = toRefs(state);
	function handleChangeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
	    emit("changeData",id);
	}
	
	function handlerQuery(type){
		if(type==="oversea"){
			  warehouseApi.getOversaWarehouseUseable().then(res=>{
				  state.list = res
				  state.list.unshift({"id":"","name":"全部仓库"});
				  emit("changeData",state.list[state.index].id,"oversea_usable");
			  })
		}else{
			warehouseApi.getWarehouseUseable().then((res)=>{
				state.list=res;
				if(!props.defaultId){
					state.list.unshift({"id":"","name":"全部仓库"});
				}
				emit("changeData",state.list[state.index].id);
			})
		}
	   if(props.isSelectShelf){
		  warehouseApi.getWarehouseList().then(function(res){
		  	res.push({name:"全部仓库",id:"#",children:[{name:"全部仓位",id:""}]});
		  	state.dataTree = res;
		  	if(res&& res.length>0){
		  		state.shelf=res[0].children[0].id;
		  	}
		  })
	   }
	}
	function shelfChange(event){
		if(event.detail.value.length===2){
			state.shelf = event.detail.value[1].value
			emit("changeData",state.shelf);
		}
	}
	
	function changeType(val){
		if(val===0){
			handlerQuery("local")
		}else{
			handlerQuery("oversea")
		}
	}
	 onShow(()=>{
		 handlerQuery();
	 })
</script>

<style>
	.maxwidth{
		max-width:90px;
		min-width: 80px;
	}
</style>
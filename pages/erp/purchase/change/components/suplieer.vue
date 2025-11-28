<template>
	<uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popup-content" >
				<view class="uni-flex uni-row-center uni-between cell-b-16">
					<text class="uni-h5 font-bold">选择供应商</text>
					<uni-icons
					 @click="hanldeClose"
					 type="closeempty" size="16"></uni-icons>
				</view>	
				<view class="cell-t-8">
					<uni-easyinput    placeholder="搜索供应商名称或编码" @input="searchInput"></uni-easyinput>
					</view>
				<scroll-view  scroll-y="true" class="scroll-Y">
			<view >
				<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
					<template v-slot:default="{row}"> 
				      <view class="suplieer-item"  @click="selectSuplieer(row)">
			              <view>{{row.name}}</view>
			              <view class="uni-h6">编码:{{row.number}}</view>
					  </view>	
					</template>
					</GlobalTable>	
			</view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import GlobalTable from "@/components/globaltable/index.vue";
	import customerApi from '@/api/erp/material/customerApi.js';
	import util from '@/utils/util';
	const popup =ref();
	const globalTableRef = ref();
	const emit = defineEmits(['getSuplieer']);
	const state= reactive({
	   params:{
		   search:"",
	   },
	  tableData:{records:[],total:0},
	})
	const{
		items,
		params,
		tableData,
	}=toRefs(state)
	function show(){
		popup.value.open("bottom");
		nextTick(()=>{
			handleQurey()
		})
	}
	const searchInput=util.debounce(function(e){
	      state.params.search = e
		  handleQurey()
	}, 500)	
	function hanldeClose(){
		popup.value.close();
	}
   function loadTable(data){
   	 customerApi.list(data).then((res)=>{
   		state.tableData.records = res.records
   		state.tableData.total =res.total
   	 })
   	 
   }
	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
   function selectSuplieer(row){
	   emit("getSuplieer",row);
	   hanldeClose()
   }
   
   
	defineExpose({
		show,
	})
	onMounted(()=>{
		
	})
</script>

<style scoped>
   .popup-content{
	   padding:12px;
   }
   .suplieer-item{
	   padding-top:8px;
	   padding-bottom:8px;
	   border-bottom:1px solid #eee;
   }
</style>
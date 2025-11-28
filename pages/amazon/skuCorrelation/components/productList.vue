<template>
	<uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popoup-header uni-flex uni-row-center uni-between">
			<text class="uni-h5 text-black font-bold">选择绑定的产品</text>
			<uni-icons
			 @click="closePop"
			 type="closeempty" size="20"></uni-icons>
		</view>
		<view class="popoup-body">
			<scroll-view
			scroll-y="true"
			class="scroll-y"
			>
			<uni-easyinput suffixIcon="search" v-model="searchKeywords"
			 placeholder="搜索ASIN或平台SKU" @input="handleInput">
			</uni-easyinput>
			<GlobalTable ref="globalTableRef" :option="tableOption"  
			 :tableData="tableData" @submit="submit" @loadTable="loadTable">
				<template v-slot:default="{row}"  > 
				  <view class="uni-list-product">
				  	<image v-if="row.image" :src="row.image" ></image>
				  	<image v-else src="/static/empty/noimage40.png" ></image>
				  	<view class=" uni-flex-item">
				  		<view class="uni-h4">{{row.sku}}
				  		</view>
				  		<view class="uni-h6 text-omit-1">{{row.name}}</view>
				  	</view>
				  	<view class="uni-right">
				  		<view class=" uni-h5">{{row.fulfillable}}</view>
				  		<text class="uni-h6">库存</text>
				  	</view>
				  </view>
				</template>
			</GlobalTable>
			</scroll-view>
		</view>
		<view class="popoup-footer"></view>
	</uni-popup>	
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,nextTick} from 'vue';
	import GlobalTable from "@/components/globaltable/checktable.vue";
	import materialApi from '@/api/erp/material/materialApi.js';
	import util from '@/utils/util.js';
	const popup=ref();
	const globalTableRef=ref();
	const emit = defineEmits(['submit']);
	  const state=reactive({
		  tableData:{records:[],total:0},
		   tableOption:{key:"id",submitTitle:"绑定"},
		   queryParam:{},
	  });
	  const {tableData,tableOption,queryParam} = toRefs(state);
		function openPop(type){
			popup.value.open(type);
			nextTick(()=>{
				handleQuery();
			})
		}
		function closePop(){
			popup.value.close()
		}
		 defineExpose({
			  openPop,closePop,
		   })
	function loadTable(param){
		   param.mtype="product";
			materialApi.getMaterialList(param).then((data) => { 
					state.tableData.records=data.records;
					state.tableData.total=data.total; 	
			});
	 }
	function handleQuery(){
		globalTableRef.value.loadTable(state.queryParam);
	}
	
	function submit(){
		//
	}
</script>

<style scoped>
	.popoup-header,.popoup-body{
		padding:8px 16px 8px 16px;
	}
	.scroll-y{
		height: calc(100vh - 200px);
	}
</style>
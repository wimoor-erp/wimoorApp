<template>
	<view class="uni-flex uni-header uni-row-center">
		<Warehouse class="cell-r-8" @changeData="warehouseChange"></Warehouse>
		<Datepicker @changedate="changedate" :unlimited='unlimited' style="width:260px"  :clearIcon="false" :iswidth="false" :days="0" />
	</view>
	 <view class="uni-flex uni-header ">
		 <view class="uni-flex-item">
		 		 <uni-easyinput  v-model="searchKeywords" placeholder="请输入单据编码或SKU" @input="handleInput">
		 		 </uni-easyinput>
		 </view>
		 <uni-button @click="doHandlequery" class="btn-default cell-l-8">查询</uni-button>
	 </view>
	 <GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
	 	<template v-slot:default="{row}"> 
	 	    <uni-card
			 :title="row.number"
			  :extra="row.opttime"
			  class="n-shadow" margin="8px 16px" >
			  <view class="uni-flex uni-column  cell-list">
				  <view><text>出库仓库</text>{{row.wtoname}}</view>
				  <view><text>申请人</text>{{row.creator}}</view>
				  <view><text>备注</text>{{row.remark}}</view>
			  </view>
				<view class=' uni-right'>
					<button  type="primary" @click="goDetails(row)" size="mini">详情</button>
				</view>
	 		</uni-card>
	 	</template>
	 </GlobalTable>
</template>

<script setup>
	import Datepicker from "@/components/header/datepicker.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import outApi from '@/api/erp/inventory/outApi.js';
	import {onMounted, reactive, toRefs,ref}from"vue"
	const globalTableRef =ref()
	const state=reactive({
	tableData:{records:[],total:0},
	params:{
		warehouseid:'',
	},
	searchKeywords:'',
	})
	const {
		tableData,
		params,
		searchKeywords,
	}=toRefs(state)
	function doHandlequery(){
		state.params.search=state.searchKeywords
		handleQuery()
	}
	function handleQuery(){
		globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
		outApi.list(params).then((res)=>{
			state.tableData.records = res.records;
			state.tableData.total =res.total;
		})
	}
	function changedate(date){
				if(date){
					state.params.fromDate = date[0];
					state.params.toDate = date[1]+" 23:59:59";
				}
		handleQuery()
	}
	function warehouseChange(val){
	   if(val){
		   state.params.warehouseid=val
		   handleQuery()
	   }
	}
	
	function goDetails(row){
		uni.navigateTo({
			url:'./components/details?id='+ encodeURIComponent(JSON.stringify(row.id)),
		});
	}
</script>

<style scoped>
	.uni-header{
		margin:8px 16px;
	}
.cell-list text{
	font-size:14px;
	color:#999;
	width:100px;
	display: inline-block;
}
.cell-list{
	color:#333;
	margin-bottom: 16px;
}
.cell-list view{
	margin-top:4px;
	margin-bottom:4px;
}
</style>
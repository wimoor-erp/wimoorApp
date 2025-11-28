<template>
	<view class="white-bg">
	<view class="uni-flex cell-b-8  uni-row-center">
		<Warehouse class="cell-r-8 " @changeData="warehouseChange"></Warehouse>
		<view class="light-datePicker">
		<Datepicker
		 @changedate="changedate" :unlimited='unlimited' style="width:260px "  :clearIcon="false" :iswidth="false" :days="0" />
		 </view>
	</view>
	 <view class="uni-flex  ">
		 <view class="uni-flex-item">
		 		 <uni-easyinput  v-model="searchKeywords" placeholder="请输入单据编码或SKU" @input="handleInput">
		 		 </uni-easyinput>
		 </view>
		 <button @click="doHandlequery" class="btn-default cell-l-8">查询</button>
	 </view>
	 </view>
	 <GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
	 	<template v-slot:default="{row}"> 
	 	    <uni-card
			 :title="row.number"
			  :extra="row.opttime"
			  class="n-shadow" margin="8px 12px" >
			  <view class="uni-flex uni-column  cell-list">
				  <view><text>入库仓库</text>{{row.wname}}</view>
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
	import inApi from '@/api/erp/inventory/inApi.js';
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
		inApi.list(params).then((res)=>{
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
	.white-bg{
		background-color:#fff;
		padding:8px 12px;
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
	margin-top:8px;
	margin-bottom:8px;
}

</style>
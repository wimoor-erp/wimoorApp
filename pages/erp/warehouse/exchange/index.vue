<template>
	<view class="c-herder-wrap  ">
		<view class=" cell-b-8">
				 <uni-easyinput  v-model="searchKeywords" placeholder="请输入单据编码或SKU" @input="handleInput">
				 </uni-easyinput>
		</view>
		<Datepicker @changedate="changedate" :unlimited='unlimited'  :clearIcon="false" :iswidth="false" :days="0" />
	</view>	
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}" > 
		    <uni-card class="n-shadow" margin="8px " >
				<template v-slot:title >
					<view class="uni-list order-c-warp ">
						<view class="uni-between uni-flex">
						<view class="uni-h6">单据编码: {{row.number}}</view>
						<view>
						<text class="uni-h6">调动数量：</text><text class="font-bold text-orange">{{row.amount}}</text>
						</view>
						</view>
					</view>
				</template>	
				<view class="c-pro-wrap">
					<view class="c-text-wrap uni-flex-item">
						<view class=" uni-flex uni-row-center uni-between cell-b-16">
						     <view>
								 <text class="uni-h4">{{row.sku_from}}</text>
								 <view class="uni-h7">调出SKU</view>
							 </view>
						     <view class="uni-right">
								 <text class="uni-h4">{{row.sku_to}}</text>
								 <view class="uni-h7">调入SKU</view>
							 </view>
						</view>
						
						<view class="uni-h6 cell-t-8">操作仓库：{{row.warehouse}}</view>
						<view class="uni-h6 cell-t-8">操作人：{{row.creator}}</view>
						<view class="uni-h6 cell-t-8 cell-b-8">备注：{{row.remark}}</view>
						
					</view>
				</view>
				<view class="order-footer-wrap">
					<view class="uni-h6  ">{{row.opttime}}</view>
					<view class="uni-right">
					<button type="primary" @click="handleDetails(row)" size="mini">详情</button>
					</view>
				</view>
			</uni-card>
		</template>
	</GlobalTable>
	
</template>

<script setup>
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import changeApi from '@/api/erp/inventory/changeApi.js';
    import { reactive, toRefs,ref } from "vue";
	import util from '@/utils/util';
import { onMounted } from "vue";
const globalTableRef =ref()
	const state=reactive({
		params:{
			    fromDate:util.getCurrentSevenDay()[0],
				toDate:util.getCurrentSevenDay()[1]+" "+'23:59:59',
				searchtype:'sku',
				sort:'opttime',
				warehouseid:'',
				},
		searchKeywords:'',
		tableData:{records:[],total:0},
	})
	const{
		tableData,
		params,
		searchKeywords,
	}=toRefs(state)
	
	const handleInput=util.debounce(function(e){
	      state.params.search=e
	   handleQurey()
	}, 500)	
	
   	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
		changeApi.list(params).then(res=>{
			if(res.records){
				state.tableData.records=res.records;
				state.tableData.total=res.total;
			}
		})
	}
	function handleDetails(row){
		uni.navigateTo({
			url:'./components/details?id='+ encodeURIComponent(JSON.stringify(row.id)),
		});
	}
	
	function changedate(date){
			if(date){
				state.params.fromDate = date[0];
				state.params.toDate = date[1]+'23:59:59';
			}
		handleQurey()	
	}
	
</script>

<style>
	.form-box{
		padding:16px;
	}
	.cell-b-16{
		padding-bottom:16px;
	}
</style>
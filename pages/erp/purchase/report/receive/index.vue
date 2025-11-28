<template>
	<view class="c-herder-wrap  ">
		<view class="search-group cell-b-8">
				 <uni-data-select
				         v-model="searchChecked"
				         :localdata="searchData"
				 		 :clear="false"
				         @change="changeType"
				       ></uni-data-select>
				 <uni-easyinput  v-model="searchKeywords" placeholder="请输入内容" @input="handleInput">
				 </uni-easyinput>
		</view>
	<view class="uni-between uni-row-center uni-flex">
	 <view class="uni-flex">
		<Warehouse class="cell-r-8" @changeData="warehouseChange"></Warehouse>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex ">
	   <view class="form-box">
	   <uni-forms ref="baseForm" >
			<uni-forms-item label="日期范围"  >
				<Datepicker @changedate="changedate" :unlimited='unlimited'  :clearIcon="true" :iswidth="false" :days="0" />
			</uni-forms-item>
		</uni-forms>
		<button class="searchbtn" type="primary" @click="dohandleQurey">查询</button>
		</view>
	</SearchHeader>  	
	</view>	

	</view>	
	<view class="summaryWrap uni-flex uni-between">
		<view>{{params.fromDate}} ~
		<view>{{params.toDate}}</view>
		</view>
		<view class="uni-right">
		<view class="uni-data ">
			{{util.numberFormat(summary)}}
		</view>
		<text class="font-small">入库数量总计</text>
		</view>
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}" > 
		    <uni-card class="n-shadow" margin="8px 12px" >
				<template v-slot:title >
					<view class="uni-list order-c-warp ">
						<view class="uni-between uni-flex ">
						<view class="uni-h6">单据编码: {{row.number}}</view>
					  <view class="uni-h6 ">操作人：{{row.name}}</view>
						</view>
					</view>
				</template>	
				<view class="c-pro-wrap">
					<view>
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else  src="/static/empty/noimage40.png" ></image>
					</view>
					<view class="c-text-wrap">
						<view class="uni-h4 uni-flex uni-row-center">
						  <text class="cell-r-8">{{row.sku}}</text>
						</view>
						<view class="uni-h6 text-omit-1 cell-b-16">{{row.mname}}</view>
						<uni-row >
							<uni-col :span="8">
								<view class=" text-orange">{{row.amount}}</view>
								<text class="uni-h6 cell-t-8">入库数量</text>
							</uni-col>
							<uni-col :span="8">
								<view class=" ">{{row.purchases}}</view>
								<text class="uni-h6 cell-t-8">采购数量</text>
							</uni-col>
							<uni-col :span="8">
								<view class="uni-h7">￥<text class="">{{row.purchaseprice}}</text></view>
								<text class="uni-h6 cell-t-8">采购金额</text>
							</uni-col>
						</uni-row>
					</view>
				</view>
				<view class="uni-flex uni-column">
					<view class="uni-h6 cell-t-8 uni-flex uni-between"><text>入库仓</text>
					<text class="text-black">{{row.wname}}</text>
					</view>
					<view class="uni-h6 cell-t-8 uni-flex uni-between"><text>入库时间</text>
					<text class="text-black">{{util.dateFormat(row.opttime)}}</text>
					</view>
					<view class="uni-h6 cell-t-8 uni-flex uni-between"><text>审核时间</text>
					<text class="text-black">{{util.dateFormat(row.audittime)}}</text>
					</view>
					<view class="uni-h6 cell-t-8 uni-flex uni-between"><text>预计到货日期</text>
					<text class="text-black">{{util.dateFormat(row.deliverydate)}}</text>
					</view>
					<view class="uni-h6 cell-t-8 uni-flex uni-between"><text>供应商</text>
					<text class="text-black">{{row.cname}}</text>
					</view>
					<view class="uni-h6 cell-t-8 uni-flex uni-between"><text>备注</text>
					<text class="text-black">{{row.remark}}</text>
					</view>
				</view>
			</uni-card>
		</template>
	</GlobalTable>

</template>

<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import storagedetailApi from '@/api/erp/purchase/receive/storagedetailApi.js';
    import { reactive, toRefs,ref } from "vue";
	import util from '@/utils/util';
import { onMounted } from "vue";
const globalTableRef =ref()
const searchheaderRef =ref()
	const state=reactive({
		searchData: [
		  { value: 0, text: "SKU" },
		  { value: 1, text: "单据编码" },
		],
		searchChecked:0,
		summary:"",
		params:{
			    fromDate:util.getCurrentSevenDay()[0],
				toDate:util.getCurrentSevenDay()[1]+" "+'23:59:59',
				searchtype:'sku',
				sort:'opttime',
				warehouseid:'',
				},
		searchKeywords:'',
		tableData:{records:[],total:0},
		skuData:{},
	})
	const{
		summary,
		tableData,
		searchData,
		searchChecked,
		params,
		searchKeywords,
		skuData,
	}=toRefs(state)
	
    function changeType(e){
			if(e===0){
				state.params.searchtype='sku'
			}else if(e===1){
				state.params.searchtype='number'
			}
	    }
	const handleInput=util.debounce(function(e){
			state.params.sku=e
	      state.params.search=e
	   handleQurey()
	}, 500)	
	
   	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
	storagedetailApi.getReceiveReport(params).then(res=>{
		if(res){
			state.tableData.records = res
			state.tableData.total= res.total
			state.summary = res[0].totalamount
		}
	})
	}
	function warehouseChange(e){
		state.params.warehouseid =e
		handleQurey()
	}
	function changedate(date){
			if(date){
				state.params.fromDate = date[0];
				state.params.toDate = date[1]+" "+'23:59:59';
			}
	}
	function dohandleQurey(){
		handleQurey()
		searchheaderRef.value.closePop()
	}
	
</script>

<style scoped>
	.order-c-warp .uni-flex{
		margin-right:12px;
		margin-left:12px;
	}
	.cell-b-16{
		margin-bottom:16px;
	}
	.font-small{
		font-size:24rpx;
	}
	.form-box{
		padding:16px;
	}
	.summaryWrap{
		margin-top:8px;
		margin-right:8px;
		margin-left: 8px;
		background-color: #ff7315;
		border-radius:6px;
		color:#fff;
		padding:16px;
	}
	.summaryWrap .uni-data{
		color:#fff;
		margin-bottom:4px;
		font-size:36rpx;
	}
	.cell-b-16{
		padding-bottom:16px;
	}
	.c-text-wrap{
	  flex-grow: 1;
	}
	.c-pro-wrap{
		margin-bottom:16px;
	}
</style>
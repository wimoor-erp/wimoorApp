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
		<view class="cell-r-8">
		<picker @change="payTypeChange" :value="index" range-key="name"  :range="payList">
			<view class="uni-flex uni-row-center  uni-between uni-select-button">
			<view class="picker-label" v-if="payList.length>0">{{payList[index].name}}</view>
			<text class="icon-xiala iconfont"></text>
			</view>
		</picker>
		</view>
		<picker @change="feeTypeChange" :value="feeIndex" range-key="name"  :range="feeList">
			<view class="uni-flex uni-row-center  uni-between uni-select-button">
			<view class="picker-label" v-if="feeList.length>0">{{feeList[feeIndex].name}}</view>
			<text class="icon-xiala iconfont"></text>
			</view>
		</picker>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex ">
	   <view class="form-box">
	   <uni-forms ref="baseForm"  label-position="top">
			<uni-forms-item label="供应商"  >
			<Supplier  @change="supplierChange"/>	
			</uni-forms-item>
			<uni-forms-item label="日期范围"  >
				<uni-data-checkbox mode="tag"
				 @change="dataChange"
				 v-model="dateCheck" :localdata="DateType"></uni-data-checkbox>
				<Datepicker @changedate="changedate" :unlimited='unlimited'
				:dateLength="30"
				:clearIcon="true" :iswidth="false" :days="0" />
			</uni-forms-item>
		</uni-forms>
		<button class="searchbtn" type="primary" @click="dohandleQurey">查询</button>
		</view>
	</SearchHeader>  	
	</view>	
	</view>	
	<view >
	<view class="summaryWrap  uni-flex uni-between">
		<view>
			<view>{{params.fromDate}} ~</view>
			<view>{{params.toDate}}</view>
		</view>
		<view class="uni-right">
		<view class="uni-data ">
			<text class="font-small">￥</text>{{util.numberFormat(summary)}}
		</view>
		<text class="font-small">付款金额总计</text>
		</view>
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}" > 
		<uni-card class="n-shadow"
		margin="8px 12px"
		>
		<template v-slot:title>
			<view class="uni-flex uni-between c-herder-wrap">
				<view class="uni-h6">订单号：{{row.number}}</view>
				<text
				class="text-green"
				 v-if="row.paystatus===1">已付款</text>	
				<text  
				class="text-gray"
				v-if="row.paystatus===0">未付款</text>
			</view>
		</template>
		<view class="uni-list-product cell-b-16">
			<image v-if="row.image" :src="row.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			<view class=" uni-flex-item">
				<view class="uni-h4">{{row.sku}}</view>
				<view class="uni-h6 text-omit-1">{{row.mname}}</view>
			</view>
			<view class="uni-right">
				<view class=" uni-h5">{{row.orderprice}}</view>
				<text class="uni-h6">采购金额</text>
			</view>
		</view>
		<view class="uni-right cell-b-16">
			<view class="light-font">
				<text class="cell-r-16">采购数量 {{row.purchases}}</text>
				<text class="cell-r-16">已付金额 {{row.totalpay}}</text>
				<text >付款金额 <text class="uni-h5">{{row.payprice}}</text></text>
			</view>
		</view>
		<view class="uni-flex uni-between ">
			<view class="text-light">入库仓</view>
			<view >{{row.wname}}</view>
		</view>
		<view class="uni-flex uni-between cell-t-8">
			<view class="text-light">操作人</view>
			<view >{{row.name}}</view>
		</view>
		<view class="uni-flex uni-between cell-t-8">
			<view class="text-light">供应商</view>
			<view >{{row.cname}}</view>
		</view>
		<view class="uni-flex uni-between cell-t-8">
			<view class="text-light">费用类型</view>
			<view >{{row.fee_type}}</view>
		</view>
		<view class="uni-flex uni-between cell-t-8">
			<view class="text-light">付款方式</view>
			<view >{{row.payment_method}}</view>
		</view>
		<view class="uni-flex uni-between cell-t-8">
			<view class="text-light">付款时间</view>
			<view >{{row.opttime}}</view>
		</view>
		<view class="uni-flex uni-between cell-t-8">
			<view class="text-light">备注</view>
			<view >{{row.remark}}</view>
		</view>
		</uni-card>
		</template>
	</GlobalTable>
			</view>
</template>

<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import Supplier from "@/components/header/supplier.vue";
    import faccountApi from '@/api/erp/finances/faccountApi.js';
	import listApi from '@/api/erp/purchase/form/listApi.js';
    import { reactive, toRefs,ref } from "vue";
	import util from '@/utils/util.js';
import { onMounted } from "vue";
const globalTableRef =ref()
const searchheaderRef =ref()
	const state=reactive({
		searchData: [
		  { value: 0, text: "SKU" },
		  { value: 1, text: "单据编码" },
		],
		DateType:[
			  { value: 'paydate', text: "付款日期" },
			  { value: 'recdate', text: "确认收货日期" },
			  { value: 'countdate', text: "账单日" },
		],
		dateCheck:"paydate",
		payList:[],
		feeList:[],
		feeIndex:0,
		index:0,
		searchChecked:0,
		summary:"",
		params:{
			    fromDate:util.getCurrentMonth()[0],
				toDate:util.getCurrentMonth()[1]+" "+'23:59:59',
				searchtype:'sku',
				sort:'opttime',
				warehouseid:'',
				},
		searchKeywords:'',
		tableData:{records:[],total:0},
		skuData:{},
	})
	const{
		dateCheck,
		summary,
		tableData,
		searchData,
		searchChecked,
		params,
		searchKeywords,
		skuData,
		payList,
		index,
		feeIndex,
		feeList,
		DateType,
	}=toRefs(state)
	
    function changeType(e){
			if(e===0){
				state.params.searchtype='sku'
			}else if(e===1){
				state.params.searchtype='number'
			}
	    }
	const payTypeChange = (e)=>{
		state.params.paymethod = state.payList[e.detail.value].id
		state.index = e.detail.value
		handleQurey()
	}
	const feeTypeChange = (e)=>{
		state.params.projectid = state.feeList[e?.detail.value].id
		state.feeIndex = e.detail.value
		handleQurey()
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
	  listApi.getPaymentReport(params).then(res=>{
		  if(res){
	  				 state.tableData.records=res.records;
	  				 state.tableData.total=res.total;
					 }
					 if(params.currentpage==1){
							 if(res.total>0){
								  state.summary=res.records[0].totalpayprice;
							 }else{
								 state.summary=0;
							 }
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
	
   const loadPaymentMethod =  function (){
   	faccountApi.getPaymentMethod().then((res)=>{
   		if(res && res.length>0){
   			res.unshift({"id":"","name":"全部支付方式"});
   			state.payList=res;
   		}else{
   				state.payList=[];
   			}
   	});
   }	
   const loadFeeType = ()=>{
	   faccountApi.getProject().then((res)=>{
	   	    res.unshift({"id":"","name":"费用类型"});
	   	if(res && res.length>0){
	   		state.feeList=res;
	   	}else{
	   			state.feeList=[];
	   		}
	   });
   }
   
 const supplierChange=(e)=>{
	 state.params.supplierid = e
 }
 
 const dataChange=(e)=>{
	 state.params.supplierid =e.detail.value
 }
   onMounted(()=>{
	   loadPaymentMethod();
	   loadFeeType();
   })
</script>

<style scoped>
	.cell-r-16{
		margin-right:16px;
	}
	.font-small{
		font-size:24rpx;
	}
	.form-box{
		padding:16px;
	}
	.summaryWrap{
		padding-top:8px;
		margin:8px 12px;
	
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
		margin-bottom:16px;
	}
	.c-text-wrap{
	  flex-grow: 1;
	}
	.white-bg{
		background-color:#fff;
	}

	
	.text-black{
		line-height:1.7em;
	}
</style>
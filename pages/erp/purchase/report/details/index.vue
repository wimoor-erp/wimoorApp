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
			<view class="uni-flex button-height">
					<Warehouse class="cell-r-8" @changeData="warehouseChange"></Warehouse>
					<view class="form-box">
					<Datepicker @changedate="changedate" :unlimited='unlimited' :dateLength="30"
					:clearIcon="false" :iswidth="false" :days="0" />
					</view>
		    </view>
		</view>
	</view>
	<view >
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
					 v-if="row.inwhstatus===1">已付款</text>	
					<text  
					class="uni-h6"
					v-else>未付款</text>
				</view>
			</template>
			<view class="uni-list-product cell-b-16">
				<image v-if="row.image" :src="row.image" ></image>
				<image v-else src="/static/empty/noimage40.png" ></image>
				<view class=" uni-flex-item">
					<view class="uni-h4">{{row.sku}}</view>
					<view class="uni-h6 text-omit-1">{{row.name}}</view>
				</view>
				<view class="uni-right">
					<view class=" uni-h5">￥{{row.itemprice}}</view>
					<text class="uni-h6">采购单价</text>
				</view>
			</view>
			<view class="uni-right cell-b-16">
				<view class="light-font">
					<text class="cell-r-16">采购数量 {{row.amount}}</text>
					<text class="cell-r-16">已付金额 {{row.totalpay}}</text>
					<text >采购金额 <text class="uni-h5">{{row.orderprice}}</text></text>
				</view>
			</view>
			<view class="uni-flex uni-between ">
				<view class="text-light">入库仓</view>
				<view >{{row.wname}}</view>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">供应商</view>
				<view >{{row.supplier}}</view>
			</view>
			<view class="uni-flex uni-between cell-t-8" v-if="row.orderprice>=row.totalpay&&row.paystatus==0">
				<view class="text-light">待付款</view>
				<view >
					￥{{row.orderprice-row.totalpay}}
				</view>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">运费</view>
				<text v-if="row.shipfee">{{row.shipfee}}</text><text v-else>-</text>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">下单日期</view>
				<view >{{util.dateFormat(row.createdate)}}</view>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">预估重量</view>
				<view >{{row.weight}}kg</view>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">入库数量</view>
				<view >{{row.totalin}}</view>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">其他费用</view>
			<text v-if="row.otherfee">{{row.otherfee}}</text>
			<text v-else>-</text>
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">预计到货日期</view>
             {{util.dateFormat(row.deliverydate)}}
			</view>
			<view class="uni-flex uni-between cell-t-8">
				<view class="text-light">备注</view>
				<view >{{row.skuRemark}}</view>
			</view>
			</uni-card>
			</template>
		</GlobalTable>
	</view>	
</template>

<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import listApi from '@/api/erp/purchase/form/listApi.js';
	import { reactive, toRefs,ref, onMounted } from "vue";
	import util from '@/utils/util.js';
	const globalTableRef = ref()
	const state=reactive({
		params:{
            fromDate:util.getCurrentMonth()[0],
			toDate:util.getCurrentMonth()[1]+" "+'23:59:59',
			sort:"createdate",
			ftype:'sku',
			
		},
		searchData: [
		  { value: 0, text: "SKU" },
		  { value: 1, text: "单据编码" },
		],
		searchChecked:0,
		tableData:{records:[],total:0},
	})
	const{
		params,
		searchData,
		searchChecked,
		tableData,
	}=toRefs(state)
	
	
	const warehouseChange =(e)=>{
		state.params.warehouseid =e
		handleQurey()
	}
	
	const changedate = (date)=>{
		if(date){
			state.params.fromDate = date[0];
			state.params.toDate = date[1]+" "+'23:59:59';
		}
		handleQurey()
	}
	
	const changeType = (e)=>{
		if(e===0){
			state.params.ftype='sku'
		}else if(e===1){
			state.params.ftype='number'
		}
	}
	const handleQurey = ()=>{
		globalTableRef.value.loadTable(state.params)
	}
	
	const loadTable =(params)=>{
	   listApi.getPayRecSumReport(params).then(res=>{
		     if(res){
	  				 state.tableData.records=res.records;
	  				 state.tableData.total=res.total;
				}
	  	})
	}
	
	const handleInput=util.debounce(function(e){
	      state.params.search=e
	      handleQurey()
	}, 500)	
	
	onMounted(()=>{
	})
</script>

<style scoped>
.cell-r-16{
	margin-right: 16px;
}
.cell-b-16{
	margin-bottom: 16px;
}
</style>
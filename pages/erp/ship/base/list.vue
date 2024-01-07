<template>
	<uni-card class="n-shadow" is-full>
		<view class="uni-flex uni-between">
		<view class="uni-flex">
	<Group @changeData="groupChange" :stylegray="stylegray"></Group>
	<Market class="cell-r-8"  ref="marketRef" @changeData="marketChange" :groupid="param.groupid"></Market>
	<Status @changeData="statusChange"></Status>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex">
			 	<view class="form-box">
					<uni-forms ref="baseForm" >
						<uni-forms-item label="发货仓库"  >
							<Warehouse  @changeData="warehouseChange"></Warehouse>
						</uni-forms-item>
						<uni-forms-item label="日期范围"  >
							<Datepicker @changedate="changedate"  :clearIcon="true" :iswidth="false" :days="0" />
						</uni-forms-item>
						<uni-forms-item label="搜索"  >
							<SearchType @changeData="searchChange"></SearchType>
						</uni-forms-item>
					</uni-forms>
					   <button class="searchbtn" type="primary" @click="doHandlerQuery">查询</button>
				</view>
	</SearchHeader>
	</view>
	</uni-card>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		    <uni-card class="n-shadow" margin="8px 16px">
				<template v-slot:title>
					<view class="border-bottom">
						<view class="cell-16 uni-flex uni-between uni-row-center ">
					<view class="uni-flex-item">
						<view><text class="uni-h5 font-bold">{{row.name}}</text></view>
						<view><text class="uni-h6">货件编码: {{row.shipmentid}}</text></view>
						</view>
						<button size="mini" type="primary" @click="goPeiHuoPage(row)" >配货</button>
						</view>
					</view>
				</template>
				<view class="uni-flex uni-between cell-t-8 ">
					<view class="uni-center">
						<text class="text-orange font-bold">{{row.skuamount}}</text><view class="uni-h6">SKU个数</view>
					</view>
					<view  class="uni-center">
						 <text class="text-orange font-bold">{{row.sumshipped}}</text><view class="uni-h6">发货数量</view>
					</view>
					<view  class="uni-center cell-b-8">
						 <text class="text-orange font-bold">{{row.sumrec}}</text><view class="uni-h6">已收货</view>
					</view>
				</view>
				<view class=" cell-t-8">
				<view class="uni-flex uni-between uni-h6 cell-t-8">店铺仓库<text class="text-black">{{row.groupname}}-{{row.country}}-{{row.centerId}}</text></view>
				<view class="uni-flex uni-between uni-h6 cell-t-8">
					 创建日期<text class="text-black">
					 <uni-dateformat :date="row.createdate"></uni-dateformat></text>  
				</view>
				<view class="uni-flex uni-between uni-h6 cell-t-8" v-if="row.arrivalTime"> 
				    预计到货日期<text class="text-black">
					<uni-dateformat :date="row.arrivalTime"></uni-dateformat></text>  
				</view>
				<view class="uni-flex uni-between uni-h6 cell-t-8">货件状态<text class="text-black">{{row.shipmentstatus}}</text>
				</view>
				<view class="uni-flex uni-between uni-h6 cell-t-8">物流公司
				<text class="text-black">
				<text v-if="row.company">{{row.company}}</text>
				<text v-else>-</text>
				</text>
				</view>
				<view class="uni-flex uni-between uni-h6 cell-t-8 cell-b-8">物流渠道<text class="text-black">{{row.channame}}-{{row.transtypename}}</text></view>
				</view>
			</uni-card>
		</template>
	</GlobalTable>

</template>

<script setup>
	import {  reactive, ref, toRefs,getCurrentInstance } from 'vue';
	import { onShow } from "@dcloudio/uni-app"
	import GlobalTable from "@/components/globaltable/index.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import Datepicker from "@/components/header/datepicker.vue"
	import Status from "./components/status.vue"
	import SearchType from "./components/searchtype.vue"
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js'
    const searchheaderRef=ref(SearchHeader);
	const globalTableRef=ref(GlobalTable);
	const marketRef=ref(Market);
	const instance=getCurrentInstance();
	const state = reactive({stylegray:'stylegray',tableData:{records:[],total:0},param:{groupid:"",marketplaceid:""}});
	const {tableData,param,stylegray} = toRefs(state);	
	function handlerQuery(){
		setTimeout(function(){
			instance.proxy.$refs["globalTableRef"].loadTable(state.param);
		},300);
	}
	function loadTable(param){
		if(param.auditstatus==7){
			param.fromdate=''; 
			param.enddate='';
		}
		shipmenthandlingApi.getshipList(param).then(res=>{
			if(res&&res.records){
				state.tableData.records=res.records;
				state.tableData.total=res.total;
			}else{
				state.tableData.records=[];
				state.tableData.total=res.total;
			}
		})
	}
	function groupChange(groupid){
		state.param.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(groupid);
		handlerQuery()
	}
	function marketChange(marketplaceid){
		state.param.marketplaceid=marketplaceid;
		handlerQuery()
	}
	function warehouseChange(warehouseid){
		state.param.warehouseid=warehouseid;
	}
	function changedate(dates){
		state.param.fromdate=dates[0];
		state.param.enddate=dates[1]+" 23:59:59";
	}
	function statusChange(status){
		state.param.auditstatus=status.orderStatus;
		state.param.hasexceptionnum=status.hasexceptionnum;
		handlerQuery()
	}
	function searchChange(search){
		state.param.searchtype=search.type;
		state.param.search=search.search;
	}
	function doHandlerQuery(){
		instance.proxy.$refs["searchheaderRef"].closePop();
		handlerQuery();
	}
	function goPeiHuoPage(row){
		uni.navigateTo({
			"url": '/pages/erp/ship/quota/index?shipmentid=' +row.shipmentid
		});
	}
	onShow(()=>{
		handlerQuery();
	})
	 
</script>

<style>
	.form-box{
		padding:24px 16px;
	}
	.cell-16{
		padding:12px 0px;
	}
	.border-bottom{
		border-bottom:1px solid #eee;
	}
</style>

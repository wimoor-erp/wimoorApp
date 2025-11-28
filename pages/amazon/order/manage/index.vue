<template>
	<view class="header-wrap"> 
		<view class="search-group ">
				 <uni-data-select
				         v-model="params.searchtype"
				         :localdata="searchData"
				 		 :clear="false"
				         @change="changeType"
				       ></uni-data-select>
				 <uni-easyinput suffixIcon="search" v-model="searchKeywords" placeholder="精确查找" @input="handleInput">
				 </uni-easyinput>
		</view>
		
	<view class="uni-flex uni-between cell-t-8">
		<view class="uni-flex">
	<Group @changeData="groupChange" :stylegray="stylegray" defaultValue="only"></Group>
	<Market class="cell-r-8"  ref="marketRef" @changeData="marketChange" :groupid="params.groupid"  defaultValue="only"></Market>
	<Status @statusChange="statusChange"></Status>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex">
			 	<view class="form-box">
					<uni-forms ref="baseForm" >
						<uni-forms-item label="客户类型"  >
							<uni-data-checkbox mode="tag"
							 @change="customerChange"
							 v-model="params.isbusiness" :localdata="customerType"></uni-data-checkbox>
						</uni-forms-item>
						<uni-forms-item label="发货方式"  >
							<uni-data-checkbox
							 @change="shipChange"
							 mode="tag" v-model="params.channel" :localdata="shipType"></uni-data-checkbox>
						</uni-forms-item>
						<uni-forms-item label="日期范围"  >
							<Datepicker @changedate="changedate"  :clearIcon="true" :iswidth="false" :days="0" />
						</uni-forms-item>
					</uni-forms>
					   <button class="searchbtn" type="primary" @click="dohandlerQuery">查询</button>
				</view>
	</SearchHeader>
	</view>	
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
		    <uni-card class="n-shadow" margin="8px 12px">
				<template v-slot:title>
				     <view class="uni-order-header uni-flex uni-between">
						
				     	<view><text class="uni-h6">订单号 {{row.orderid}}</text></view>
				     	<text class="uni-h6  " >{{row.orderstatus}}</text>
				     </view>
				</template>
				<view class="uni-list-product">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
					</view>
					<view class="uni-right">
						<view class=" uni-h5">{{row.itemprice}}</view>
						<text class="uni-h6">售价</text>
					</view>
				</view>
		        <view class="uni-flex  uni-between uni-row-bottom cell-t-8">
					<text class="uni-h6">{{util.dateFormat(row.buydate)}}</text>
					<view class="uni-flex uni-row-bottom" >
					<text class="uni-h6 cell-r-16">售出{{row.quantity}}件</text>
					<text class="uni-h6">合计
					</text>
					<text class="big-font"> {{row.orderprice}}</text>
					</view>
				</view>
					<view class="uni-right uni-divider-line">
					<button
					 @click="handleDetails(row)"
					 size="mini" type="primary">订单详情</button>
					</view>
			</uni-card>
		</template>
	</GlobalTable>
	<DetailsPopup :row="rowData" @getCustomer="getCustomer" :order="orderData" ref="popupRef"/>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Status from"./components/status.vue";
	import DetailsPopup from"./components/detailsPopup.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
    import orderListApi from '@/api/amazon/order/orderListApi.js';
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const searchheaderRef =ref();
	const popupRef=ref(null)
	const marketRef  =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		 rowData:{},
		 orderData:{},
		stylegray:'stylegray',
		params:{
			dataType:'1',
			groupid:"",
			startDate:util.getCurrentDefineDay(0,1)[0],
			endDate:util.getCurrentDefineDay(0,1)[1],
			channel:null,
			color:null,
			isbusiness:null,
			pointname:'',
			searchtype:"sku",
			sort:'buydate',
			status:null,
		},
		orderParams:{
			
		},
		searchData:[
			{text:'SKU',value:'sku'},
			{text:'ASIN',value:'asin'},
			{text:'订单号',value:'number'},
		],
		customerType:[
			{text:'个人',value:"false",},
			{text:'企业',value:"true",},
			],
		shipType:[
			{text:'FBA',value:"Amazon",},
			{text:'FBM',value:"Merchant",},
			],
		searchKeywords:'',
	})
	const{
		params,
		orderParams,
		stylegray,
		searchData,
		searchKeywords,
		customerType,
		shipType,
		tableData,
		rowData,
		orderData,
	}=toRefs(state)

	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
		
	}
	function marketChange(marketplaceid,pointName){
		state.params.pointname=pointName;
		handlerQuery()
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}
	function changeType(e){
		state.params.searchtype =e
	}
	function loadTable(params){
		if(state.params.dataType==='1'){
			orderListApi.getOrderList(params).then(data=>{
				if(data&&data.records){
					state.tableData.records=data.records;
					state.tableData.total=data.total; 
				}else{
					state.tableData.records=[];
					state.tableData.total=0; 
				}
			})
		}else{
			orderListApi.getOrderInvoinceList(params).then((data)=>{
				    if(data&&data.records){
						state.tableData.records=data.records;
						state.tableData.total=data.total; 
					}else{
						state.tableData.records=[];
						state.tableData.total=0; 
					}
			})
		}
	}

	
	function loadOrderDetails(){
		orderListApi.showOrderDetail(state.orderParams).then(res=>{
			if(res){
				state.rowData = res[0]
			}
		})
	}
	function handleDetails(row){
		popupRef.value.openPop('left')
		state.orderData = row;
		state.orderParams.purchaseDate = util.dateFormat(row.buydate);
		state.orderParams.orderid = row.orderid;
		state.orderParams.groupid = state.params.groupid;
		state.orderParams.nonaddress = "false";
		state.orderParams.nonfin = "false";
		state.orderParams.isdeep =false;
		loadOrderDetails()
	}
	const handleInput = util.debounce(()=>{
		state.params.search = state.searchKeywords;
		handlerQuery();
	},200)
 function statusChange(e){
	 state.params.status = e
	 handlerQuery();
 }
 function customerChange(e){
	 if(e.detail.value){
		 state.params.isbusiness =e.detail.value
	 }
 }
 function shipChange(e){
	 if(e.detail.value){
		 state.params.channel =e.detail.value
	 }
 }
	function changedate(date){
			if(date){
				state.params.startDate = date[0];
				state.params.endDate = date[1]+" "+'23:59:59';
			}
	}
 function dohandlerQuery(){
	 handlerQuery();
	 searchheaderRef.value.closePop()
 }
</script>

<style scoped>
	.uni-divider-line{
		margin-top:16px;
		padding-top:16px;
		border-top: 1px solid #eee;
	}
	.header-wrap{
		background-color: #fff;
		padding:8px 12px;
	}
	.form-box{
		padding:16px;
	}
	.big-font{
		color:#ff7315;
		font-size:18px;
		line-height: 18px;
		margin-left:2px;
	}
	.uni-order-header{
		padding:12px 8px 2px 8px;
	}
	.cell-r-16{
		margin-right:16px;
	}
</style>
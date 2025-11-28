<template>
	<view class="header-wrap"> 
	<view class="cell-b-8 block-segmented">
	<uni-segmented-control :current="indexS" :values="settlement" @clickItem="onClickItem"
	styleType="button" activeColor="#ff7315"></uni-segmented-control>
    </view>
	<view class="search-group ">
			 <uni-data-select
			         v-model="params.datetype"
			         :localdata="searchData"
			 		 :clear="false"
			         @change="changeType"
			       ></uni-data-select>
			<Datepicker @changedate="changedate" 
			:dateLength="30"
			 :clearIcon="false" :iswidth="false" :days="0" />
	</view>
		
	<view class="uni-flex uni-between cell-t-8">
		<view class="uni-flex">
	<Group @changeData="groupChange" :stylegray="stylegray" defaultValue="only"></Group>
	<Market class="cell-r-8"  ref="marketRef" @changeData="marketChange" :groupid="params.groupid"  defaultValue="only"></Market>
	<picker @change="currencyChange" :value="indexC" range-key="name"  :range="currency">
		<view class="uni-flex uni-row-center  uni-between uni-select-button">
		<view class="picker-label" v-if="currency.length>0">{{currency[indexC].name}}</view>
		<text class="icon-xiala iconfont"></text>
		</view>
	</picker>
	</view>
	</view>	
	</view>
	<view class="card-wrap-body">
		<scroll-view :scroll-x="true">
			<view class="uni-flex" > 
			<uni-card class="n-shadow c-width" margin="8px 0px 8px 8px" padding="16px 8px">
				<view class="bank-icon-wrap">
					<uni-icons type="wallet-filled" color="#ff7315" size="24"></uni-icons>
				</view>
				<view class="account-wrap">
				<text class="data-num">{{summary.finacc}}</text>
					<view class="uni-h6 cell-t-8">
						未结算金额
					</view>
				</view>
			</uni-card>
			<uni-card class="n-shadow c-width" margin="8px 0px 8px 8px" padding="16px 8px">
				<view class="bank-icon-wrap">
					<uni-icons type="wallet-filled" color="#67c23a" size="24"></uni-icons>
				</view>
				<view class="account-wrap">
					<text class="data-num">{{summary.finsett}}</text>
					<view class="uni-h6 cell-t-8">
						已结算金额
					</view>
				</view>
			</uni-card>
			<uni-card class="n-shadow c-width" margin="8px 0px 8px 8px" padding="16px 8px">
				<view class="bank-icon-wrap">
					<uni-icons type="wallet-filled" color="#3c8bfa" size="24"></uni-icons>
				</view>
				<view class="account-wrap">
					<text class="data-num">{{summary.finsum}}</text>
					<view class="uni-h6 cell-t-8">
						总金额
					</view>
				</view>
			</uni-card>
			<uni-card class="n-shadow c-width" margin="8px" padding="16px 8px">
				<view class="bank-icon-wrap">
					<uni-icons type="wallet-filled" color="#909399" size="24"></uni-icons>
				</view>
				<view class="account-wrap">
					<text class="data-num">{{summary.totalfailedsummary}}</text>
					<view class="uni-h6 cell-t-8">
						转账失败金额
					</view>
				</view>
			</uni-card>
			</view>
		</scroll-view>
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
		    <uni-card class="n-shadow" margin="8px" padding="16px 8px">
                <view class="uni-flex uni-between">
					<view>
						<view>{{row.groupname}}
						<uni-tag 
						 v-if="row.tstatus==='Succeeded'"
						text="已转账" type="success"
						 inverted
						 size="mini"></uni-tag>
						<uni-tag 
						v-else
						text="未转账" type="warning"
						 inverted
						 size="mini"></uni-tag>
						</view>
						<view class=" cell-t-8">{{row.marketName}}</view>
						<view class="uni-h6 cell-t-8">结算周期:
						{{row.startDate.substring(0, 10)}} ~ {{row.endDate?.substring(0, 10)}}</view>
					</view>
					
					<view class="uni-h5">
						<view class="font-bold">USD {{row.totalAmount}}</view>
						<view class="uni-h6 cell-t-8">CNY {{row.totalAmount_to}}</view>
						<view class="uni-h6 cell-t-8"
						v-show="row.deposit_date"
						>{{row.deposit_date?.substring(0, 10)}} 转账</view>
					</view>
				</view>
			</uni-card>
		</template>
	</GlobalTable>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance, onMounted, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import settlementAccRptApi from '@/api/amazon/finances/settlementAccRptApi.js';
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const searchheaderRef =ref();
	const marketRef  =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		stylegray:'stylegray',
		params:{
			groupid:"",
			marketplaceid:'',
			fromDate:util.getCurrentMonth()[0],
			endDate:util.getCurrentMonth()[1]+' '+'23:59:59',
			search:'',
			datetype:'',
			currency:'CNY',
			fatype:'finsett',
			sort:"startDate",
		},
	searchData:[
		{text:'结算日期',value:''},
		{text:'转账日期',value:'acc'},
	],

	currency:[
		{name:'站点币种',value:'market'},
		{name:'CNY',value:'CNY'},
		{name:'USD',value:'USD'},
	],
	indexC:1,
	isload:false,
	indexS:0,
		searchKeywords:'',
		summary:{},
	settlement:["已结算","未结算"],
	})
	const{
		params,
		stylegray,
		searchKeywords,
		tableData,
		searchData,
		currency,
		indexC,
		settlement,
		summary,
		isload,
	}=toRefs(state)

	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
		
	}
	function marketChange(marketplaceid,name){
		state.params.marketplaceid=marketplaceid;
		state.params.marketplace_name = name;
		handlerQuery()
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}

	
	function loadTable(params){
     settlementAccRptApi.getSettlementAccReportSum(params).then(res=>{
     	 state.summary=res;
     })          
	  
	  settlementAccRptApi.getSettlementAccReport(params).then(res=>{
	  			 if(res&&res.records){
	  		state.tableData.records=res.records;
	  		state.tableData.total=res.total;
	  			 }
	  })
	}

 function onClickItem(e){
	state.params.fatype=e.currentIndex===0?"finsett":"other";
	handlerQuery();
 }

   function currencyChange(e){
	   state.params.currency =  state.currency[e.detail.value].value;
	   handlerQuery();
   }
	function changedate(date){
			if(date){
				state.params.fromDate = date[0];
				state.params.endDate = date[1]+" "+'23:59:59';
			}
			if(!state.isload){
				handlerQuery();
			}
			state.isload = false;
	}
  function changeType(e){
	 state.params.datetype = e;
	 handlerQuery();
  }
  onMounted(()=>{
	  state.isload = true;
  })
</script>

<style scoped>

	.header-wrap{
		background-color: #fff;
		padding:8px 16px;
	}
.c-width{
	width:180px;
	flex: 0 0 auto;
}
.bank-icon-wrap{
	background-color: #f5f5f5;
	display: inline-block;
	padding:6px 8px;
	border-radius: 20px;
}	
.data-num{
	font-size: 20px;
	font-weight: 600;
	color:#333;}
	
	.account-wrap{
		margin-top: 24px;
	}
	.card-wrap-body{
		margin-right: 8px;
	}
</style>
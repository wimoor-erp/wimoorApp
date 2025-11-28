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
	<Operator operator="product"/>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex">
			 	<view class="form-box">
					<uni-forms ref="baseForm" >
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
		    <uni-card class="n-shadow" margin="8px 16px">
				<template v-slot:title>
				     <view class="uni-order-header uni-flex uni-between">
				     	<view><text class="uni-h6">创建时间 {{row.orderid}}</text></view>
				     	<text class="uni-h6  " >{{row.statusText}}</text>
				     </view>
				</template>
				<view class="uni-list-product">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}</view>
						<view class="uni-h6 text-omit-1">fnsku:{{row.fnsku}}</view>
					</view>
					<view class="uni-right">
						<view class=" uni-h5">{{row.operator}}</view>
						<text class="uni-h6">操作人</text>
					</view>
				</view>
		        <view class="uni-flex  uni-between uni-row-bottom cell-t-8">
					<text class="uni-h6" >{{row.ftype?'企业调价':'个人调价'}}</text>
					<view class="uni-flex uni-row-bottom" >
					<text class="uni-h6 cell-r-16">调价前 ${{row.standardprice}}</text>
					<text class="uni-h6">调价后 
					</text>
					<text class="big-font" v-if="row.saleprice"> {{row.saleprice}}</text>
					<text v-else> -</text>
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
	import Operator from"@/components/header/operator.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
    import productinfoApi from '@/api/amazon/product/productinfoApi.js';
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
			startDate:util.getCurrentDefineDay(0,1)[0],
			endDate:util.getCurrentDefineDay(0,1)[1],
			searchtype:"sku",
			search:'',
		},
		searchData:[
			{text:'SKU',value:'sku'},
			{text:'ASIN',value:'asin'},
			{text:'FNSKU',value:'fnsku'},
		],
		searchKeywords:'',
	})
	const{
		params,
		stylegray,
		searchData,
		searchKeywords,
		tableData,
	}=toRefs(state)

	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
		
	}
	function marketChange(marketplaceid){
		state.params.marketplaceid=marketplaceid;
		handlerQuery()
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}
	function changeType(e){
		state.params.searchtype =e
	}
	function loadTable(params){
			productinfoApi.priceQueue(params).then(data=>{
				if(data&&data.records){
					state.tableData.records=data.records;
					state.tableData.total=data.total; 
				}else{
					state.tableData.records=[];
					state.tableData.total=0; 
				}
			})
	}


	const handleInput = util.debounce(()=>{
		state.params.search = state.searchKeywords;
		handlerQuery();
	},200)



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
		padding:8px 16px;
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
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
	</view>
	</view>	
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
				<uni-card
				 class="n-shadow"
				 @click="detailsRef.openPop('bottom',row)"
				 margin="8px 12px">
				 <view class="uni-flex uni-between uni-row-center">
				<view>
				<view class="uni-h5 font-bold">{{row.sku}}</view> 
				 <view class="uni-h6  cell-t-8">ASIN: {{row.asin}}</view>
				 </view>
				<uni-icons type="forward" size="16" color="#999"></uni-icons>
				 </view>
				</uni-card>
		</template>
	</GlobalTable>
	<Details ref="detailsRef"/>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Datepicker from "@/components/header/datepicker.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import Details from "./components/details.vue";
   import productAnysApi from '@/api/amazon/product/productAnysApi.js';
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const detailsRef =ref();
	const marketRef  =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		stylegray:'stylegray',
		params:{
			groupid:"",
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
			productAnysApi.productAsinList(params).then(data=>{
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





</script>

<style scoped>
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
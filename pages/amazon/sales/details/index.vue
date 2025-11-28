<template>
	<view class="header-wrap"> 
			
	 <uni-easyinput suffixIcon="search" v-model="searchKeywords" placeholder="请输入SKU" @input="handleInput">
	 </uni-easyinput>
		
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
							<Datepicker @changedate="changedate"  :clearIcon="false" :iswidth="false" :days="1" />
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
				     	<view><text class="uni-h6">上架日期 {{row.openDate}}</text></view>
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
						<view class=" uni-h5">{{row.ownername}}</view>
						<text class="uni-h6">负责人</text>
					</view>
				</view>
		        <view class="uni-flex  uni-between uni-row-bottom cell-t-8">
					<text class="uni-h6">{{state.labels?.name[0]}}-{{state.labels?.name[state.labels?.name.length-1]}}</text>
					<view class="uni-flex uni-row-bottom" >
					<text class="uni-h6">销量合计
					</text>
					<text class="big-font"> {{row.vsum}}</text>
					</view>
				</view>
					<view class="uni-right uni-divider-line">
					<button
					 @click="handleDetails(row)"
					 size="mini" type="primary">销量明细</button>
					</view>
			</uni-card>
		</template>
	</GlobalTable>
	<SalesBar :labels="labels"  ref="salesBarRef"/>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Operator from"@/components/header/operator.vue";
	import SalesBar from"./components/salesBar.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import salessumApi from "@/api/amazon/summary/salessumApi.js"
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const searchheaderRef =ref();
	const salesBarRef =ref()
	const marketRef  =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		stylegray:'stylegray',
		params:{
			groupid:"",
			marketplaceid:'',
			fromdatestr:util.getCurrentDefineDay(1,7)[0],
			enddatestr:util.getCurrentDefineDay(1,7)[1]+' '+'23:59:59',
			summaryType:'day',
			search:'',
			sort:"vsum",
		},
	
		searchKeywords:'',
		labels:{
			label:[],
			name:[],
		},
	})
	const{
		params,
		stylegray,
		searchKeywords,
		tableData,
		labels,
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
		getHeaderLabel()
	}
    function getHeaderLabel(){
		 salessumApi.getOrderSumField(state.params).then(res=>{
			if(res){
				state.labels.label =[];
				state.labels.name =[];
				res.forEach(item=>{
					state.labels.label.push(item.label)
					state.labels.name.push(item.name)
				})
			}
		 })
	}
	
	function loadTable(params){
		salessumApi.getOrderData(params).then(res=>{
			if(res){
				state.tableData.records = res.records
				state.tableData.total =res.total
			}
		})
           
	}
  function handleDetails(row){
	  // #ifdef MP-WEIXIN
	    wx.setPageOrientation({ orientation: 'landscape' })
	  // #endif
	  salesBarRef.value.show(row)
  }
	const handleInput = util.debounce(()=>{
		state.params.search = state.searchKeywords;
		handlerQuery();
	},200)


	function changedate(date){
			if(date){
				state.params.fromdatestr = date[0];
				state.params.enddatestr = date[1]+" "+'23:59:59';
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
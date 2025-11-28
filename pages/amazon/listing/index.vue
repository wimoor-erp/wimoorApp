<template>
	<view class="header-wrap"> 
		<view class="search-group ">
				 <uni-data-select
				         v-model="params.searchtype"
				         :localdata="searchData"
				 		 :clear="false"
				         @change="changeType"
				       ></uni-data-select>
				 <uni-easyinput suffixIcon="search" v-model="params.search" placeholder="搜索..." @input="handleInput">
				 </uni-easyinput>
		</view>
		
	<view class="uni-flex uni-between cell-t-8">
		<view class="uni-flex">
	<Group @changeData="groupChange" :indexC="1" :stylegray="stylegray" ></Group>
	<Market class="cell-r-8"  ref="marketRef" :indexC="1" @changeData="marketChange" :groupid="params.groupid"  ></Market>
	<Operator @changeData="operatorChange"
	 operator="product"/>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex">
			 	<view class="form-box">
					<view class="uni-flex uni-row-center uni-between cell-b-16">
						<text class="uni-h5 font-bold">筛选</text>
						<uni-icons
						 @click="hanldeClose"
						 type="closeempty" size="16"></uni-icons>
					</view>
					<uni-forms ref="baseForm" >
						<uni-forms-item label="销售状态"  >
					       <SaleStatus @status="getStatus" @changeStatus="changeStatus"/>
						</uni-forms-item>
						<uni-forms-item label="产品状态"  >
							<ProStatus @proStatusChange="proStatusChange"/>
						</uni-forms-item>
						<uni-forms-item label="产品标签"  >
							<Tags @changeData="changeTags"/>
						</uni-forms-item>
						<uni-forms-item label="产品分类"  >
							<Category @changeData="changeCategory" />
						</uni-forms-item>
						<uni-forms-item label="销量"  >
							<uni-data-select
							        v-model="params.changeRate"
							        :localdata="saleFloat"
									 :clear="false"
							        @change="changeSaleFloat"
							      ></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="产品名称"  >
					      <uni-easyinput   v-model="params.name" placeholder="请输入内容"></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item label="备注"  >
					      <uni-easyinput   v-model="params.remark" placeholder="请输入内容" ></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item label="配送方式"  >
							<uni-data-checkbox  mode="button" v-model="params.isfba" :localdata="shipType"></uni-data-checkbox>
						</uni-forms-item>
						<uni-forms-item label="发现差评"  >
							<switch :checked="params.isbadreview" @change="changeReview" color="#ff7315" style="transform:scale(0.8)"/>
						</uni-forms-item>
						
					</uni-forms>
					   <button class="searchbtn" type="primary" @click="dohandlerQuery">查询</button>
				</view>
	</SearchHeader>
	</view>	
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
		    <uni-card class="n-shadow" margin="8px 12px" padding="16px">
				<view class="uni-list-product">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
						<view class="cell-t-8 uni-flex uni-row-center">
							<uni-tag
							size="small"
							class="cell-r-8"
							:type="row.optstatuscolor==='info'?'default':row.optstatuscolor"
							:text="row.optstatusname">
							</uni-tag>
							<uni-tag v-for="(item,index) in row.tagNameList"
							size="small"
							inverted
							class="cell-r-8"
							:type="item.color==='info'?'default':item.color"
							 :text="item.name">
							 </uni-tag>
							 <uni-tag
							 type="error"
							 size="small"
							 inverted
							 v-if="parseInt(row.flownnumber)>1&&parseInt(row.notread)==0"
							 :text="row.flownnumber+'人跟卖'"
							 >
							 </uni-tag>
							 <uni-tag
							 type="error"
							 size="small"
							 inverted
							 v-else-if="parseInt(row.flownnumber)>1&&parseInt(row.notread)>0"
							 :text="parseInt(row.flownnumber)-1+'人跟卖'"
							 >
							 </uni-tag>
							 <uni-icons 
							  v-else-if="row.flownnumber"
							  color="#de4545"
							 type="staff-filled" size="24"></uni-icons>
						</view>
						<view class="cell-t-8">
							<text class="uni-h7 cell-r-8">
								{{row.opendate}} 上架
							</text>
							<text class="uni-h7 ">
								{{row.groupname}} - {{row.marketplacename}}
							</text>
						</view>
						<view class="cell-t-8 uni-flex">
							<uni-rate
							 size="18"
							 v-model="row.positiveFeedbackRating" @change="onChange" />
							 <text class="uni-h7"> {{row.feedbackCount}}人评论</text>
						</view>
					</view>
					<view class="uni-right">
						<view 
						@click="editPrice(row)"
						class=" uni-h5 text-orange font-bold">{{row.landedCurrency}}{{row.changeprice}}</view>
						<text class="uni-h6">售价</text>
						<view class="cell-t-16">
							<view class="uni-h7">{{row.newprorate}}</view>
							<text class="uni-h7">利润率</text>
						</view>
					</view> 
				</view>
				<view class="datas-wrap uni-flex ">
					<view class="item">
						<view class="uni-h7 ">日均销量</view>
						<view class="cell-t-4">{{util.nullValueTran(row.averageSalesDay)}}</view>
					</view>
					<view class="item">
						<view class="uni-h7 ">七天销量</view>
						<view class="cell-t-4">{{util.nullValueTran(row.sumweek)}}</view>
					</view>
					<view class="item">
						<view class="uni-h7 ">三十日销量</view>
						<view class="cell-t-4">{{util.nullValueTran(row.summonth)}}</view>
					</view>
					<view class=" margin0" @click="viewData(row)">
						<view class="uni-h7 ">
							<uni-icons type="right" size="16"></uni-icons>
						</view>
					</view>
				</view>
					<view
					 @click="editRemarks(row)"
					 class=" remark-wrap uni-flex  uni-row-center">
					 <uni-icons type="compose" size="18" color="#999999"></uni-icons>
					<text class="text-omit-1 cell-r-8">备注：{{row.remark}}</text>
					</view>
			</uni-card>
		</template>
	</GlobalTable>
	<DetailsPopup :row="rowData" @getCustomer="getCustomer" :order="orderData" ref="popupRef"/>
	<AdjustPriceDialog :row="rowData" ref="adjustPriceRef"/>
	<Remarks :row="rowData" ref="remarksPopRef" />
	<DataDetails  :row="rowData" ref="dataRef"/>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Operator from"@/components/header/operator.vue";     
	import SaleStatus from "./components/saleStatus.vue/";
	import AdjustPriceDialog from "./components/adjustPriceDialog.vue/";
	import Remarks from "./components/remarks.vue/";
	import DataDetails from "./components/dataDetails.vue/";
	import Tags from"@/components/header/tags.vue"
	import Category from"@/components/header/category.vue"
	import ProStatus from "./components/proStatus.vue/";
	import Datepicker from "@/components/header/datepicker.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance,onMounted } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
   import productinfoApi from '@/api/amazon/product/productinfoApi.js'
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const searchheaderRef =ref();
	const popupRef=ref(null)
	const remarksPopRef=ref(null)
	const dataRef=ref(null)
	const isInit =ref(true)
	const marketRef  =ref();
	const adjustPriceRef =ref(null)
	const state = reactive({
		 tableData:{records:[],total:0},
		 rowData:{},
		 orderData:{},
		stylegray:'stylegray',
		params:{
			groupid:"",
			pointname:'',
			searchtype:"sku",
			sort:'sku,marketindex',
			order:'asc',
			disable:"false",
			salestatus:'all',
		},
		saleFloat:[
			{text:"不限",value:""},
			{text:"销量小幅下降",value:"1"},
			{text:"销量大幅下降",value:"2"},
			{text:"销量小幅上升",value:"3"},
			{text:"销量大幅上升",value:"4"},
		],
		searchData:[
			{text:'SKU',value:'sku'},
			{text:'ASIN',value:'asin'},
			{text:'本地SKU',value:'number'},
		],
		shipType:[
			{text:'不限',value:''},
			{text:'FBA',value:'fba'},
			{text:'FBM',value:'fbm'},
		],
	})
	const{
		params,
		saleFloat,
		stylegray,
		searchData,
		tableData,
		rowData,
		orderData,
		shipType,
	}=toRefs(state)
	function viewData(row){
		dataRef.value.openPop("bottom")
		state.rowData = row
	}
	
	function editPrice(row){
		adjustPriceRef.value.openPop("bottom")
	     state.rowData = row
	}
	
	function changeReview(e){
		state.params.isbadreview = e.detail.value
	}
	function changeCategory(e){
		state.params.category = e
	}
	function changeTags(e){
		var arr=[];
		arr.push(e);
		state.params.taglist = arr
	}
	function proStatusChange(e){
		state.params.disable = e;
	}
	function changeStatus(e){
		state.params.salestatus = e;
	}
    function getStatus(e){
		state.params.salestatus = e;
	}
	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
		
	}
	function marketChange(marketplaceid){
		state.params.marketplace=marketplaceid;
		handlerQuery()
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
		
	}
	function changeType(e){
		state.params.searchtype =e
	}
	function loadTable(params){
	  productinfoApi.productList(params).then(res=>{
		 state.tableData.records = res.records
		 state.tableData.total = res.total
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
 function operatorChange(e){
	 if(isInit.value){
		 state.params.ownerid = e
		 handlerQuery();
	 }
	 isInit.value =true
	 
 }
 function hanldeClose(){
	 searchheaderRef.value.closePop()
 }
 onMounted(()=>{
	 isInit.value =false
 })
 
 function editRemarks(row){
	 state.rowData = row
	 remarksPopRef.value.openPop("left")
 }
</script>

<style scoped>
	.cell-b-16{
		margin-bottom: 16px;
	}
	.datas-wrap{
		margin-left:60px;
	}
	
	.datas-wrap .item{
		padding:8px 8px;
		border-radius:4px;
		margin-right:8px;
	}
	.datas-wrap .margin0{
		margin: auto;
		margin-right: 0;
	}
	.cell-t-16{
		margin-top: 16px;
	}
	.remark-wrap{
		margin-left: 68px;
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
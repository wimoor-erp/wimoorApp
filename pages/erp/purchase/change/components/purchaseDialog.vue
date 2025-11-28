<template>
	<uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popup-content" >
				<view class="uni-flex uni-row-center uni-between cell-b-16">
					<text class="uni-h5 font-bold">选择采购单</text>
					<uni-icons
					 @click="hanldeClose"
					 type="closeempty" size="16"></uni-icons>
				</view>		
		<view class="filter-head">
			<view  class="uni-flex   uni-row-center uni-between">
				<view class="search-group ">
					<uni-data-select
					        v-model="params.ftype"
					        :localdata="items"
							 :clear="false"
					        @change="onchange"
					      ></uni-data-select>
				<view >
			   <uni-easyinput v-model="search"  suffixIcon="loop" @iconClick="refreshtab" placeholder="请输入内容自动查询" @input="searchInput"></uni-easyinput>
				 </view>
				  </view>
		     </view>
		 <view class="uni-flex uni-between m-t-8">
				 <view class="uni-select-group">
					 <Warehouse  @changeData="warehouseChange"></Warehouse>
					 <Status
					  :isall="true"
					  class="cell-l-8" @changeState="statusChange"></Status>
				 </view>
				<SearchHeader ref="searchheaderRef" class="uni-flex">
				   <view class="form-box">
				   <uni-forms ref="baseForm" >
						<uni-forms-item label="日期范围"  >
							<Datepicker @changedate="changedate"  :clearIcon="true" :iswidth="false" :days="0" />
						</uni-forms-item>
					</uni-forms>
					<button class="searchbtn" type="primary" @click="doHandlerQuery">查询</button>
					</view>
				</SearchHeader>
		</view>
		</view>	
				<scroll-view  scroll-y="true" class="scroll-Y">
			<view >
				<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
					<template v-slot:default="{row}"  > 
						<view class="uni-media-list">
							<view class="isfull">
								<view class="uni-flex uni-between order-header">
									<view class="uni-h6 ">
									创建日期: {{row?.createdate}}
									</view>
									<text class="order-state-text">{{statusFuc(row?.auditstatus)}}</text>
								</view>
							<view class="uni-flex uni-row isfull">
							<image v-if="row?.image" @click.stop="goMaterialInfoPage(row?.materialid)" class="uni-media-list-logo" :src="row?.image"></image>
							<image v-else src="/static/empty/noimage40.png" class="uni-media-list-logo"></image>
							<view class="uni-media-list-body"  >
								<view class="uni-flex uni-between  isfull cell-bottom">
							  <view class="uni-flex-item">	
								<view class="uni-flex uni-row-center ">
								<text class="uni-sku">{{ row?.sku }}</text>
									&nbsp;
								<text v-if="row?.issfg==='1'"  class='light-font'>(组)</text>
								</view>
								<view class="uni-h6 cell-bottom-4">{{row?.warehousename}}</view>
								<text  class="tag-blue-plain tag-small">{{paystatusFuc(row?.paystatus)}}</text>
								</view>
								<view class="light-font uni-right"><view class="uni-orange-data">{{row?.amount}}</view>数量</view>
								</view>
								</view>
								</view>
								<view class="uni-flex uni-between">
									<view class="uni-h6  ">
										供应商 
										<view class="text-black m-t-8">{{row?.suppliername||'-'}}</view>
									</view>
									<view class="uni-h6 ">
									创建人
									<view class="text-black m-t-8">{{ row?.creatorname }}</view>
									</view>
									<view class="uni-h6 ">
									采购金额
									<view class="text-black m-t-8">￥{{row.orderprice}}</view>
									</view>
								</view>
								<view class="uni-order-footer isfull uni-between uni-flex uni-row-center">
										<view  class="uni-h6 uni-flex uni-flex-item ">
											<text >订单号:{{row?.number}} </text>
										</view>
										<button  
										@click="bindingOrder(row)"
										type="primary" size="mini">关联单号</button>
								</view>
							</view>
						</view>
					</template>
					</GlobalTable>	
			</view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import SearchHeader from "@/components/searchheader/base.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import Status from "../../components/status.vue"
	import Datepicker from "@/components/header/datepicker.vue";
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import GlobalTable from "@/components/globaltable/index.vue";
	import util from '@/utils/util';
	const emit = defineEmits(["getPurchuaseNumber"]);
	const popup =ref();
	const globalTableRef = ref();
	const state= reactive({
	   params:{
		   ftype:"sku",
		   auditstatus:'all',
		   warehouseid:'',
		   fromDate:util.getCurrentDefineDay(0,30)[0],
		   toDate:util.getCurrentDefineDay(0,30)[1]+" "+"23:59:59",
	   },
	   items: [
	   	{text:'SKU',value:'sku'},
	   	{text:'订单号',value:'order'},
	   	{text:'运单号',value:'logistics'},
	   ],
	  tableData:{records:[],total:0},
	  isMonted:false,
	})
	const{
		items,
		params,
		tableData,
		isMonted,
	}=toRefs(state)
	
	const searchInput=util.debounce(function(e){
	      state.params.search = e
		  handleQurey()
	}, 500)	

	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
	function doHandlerQuery(){
		handleQurey()
	}
	
	function paystatusFuc(value){
				if(value=='1' || value==1){
					return '已付款';
				}else{
					return '未付款';
				}
			}
	function statusFuc(value){
		if(value==0 || value=='0'){
			return '已退回';
		}else if(value==1 || value=='1'){
			return '待审核';
		}else if(value==2 || value=='2'){
			return '处理中';
		}else if(value==3 || value=='3'){
			return '已完成';
		}
	}
	function loadTable(params){
		params.needinventory=true;
		purchaselistApi.list(params).then((res)=>{
			state.tableData.records = res.records;
			state.tableData.total = res.total;
		})
	}
	function show(){
		popup.value.open("bottom");
		nextTick(()=>{
			handleQurey();
		})
	}
	function hanldeClose(){
		popup.value.close();
	}
	function statusChange(e){
		state.params.auditstatus = e;
		handleQurey()
	}
	function warehouseChange(e){
		state.params.warehouseid = e;
		if(!state.isMonted){
			handleQurey()
		}
		state.isMonted = false;
	}
	function onchange(e){
		state.params.ftype = e;
	}
	function changedate(date){
				if(date){
					state.params.fromDate = date[0];
					state.params.toDate = date[1]+" "+"23:59:59";
				}
		}
	function bindingOrder(row){
		emit("getPurchuaseNumber",row);
		hanldeClose();
	}	
   
	defineExpose({
		show,
	})
	onMounted(()=>{
		state.isMonted = true;
	})
</script>

<style scoped>
	.scroll-Y{
		height:500px;
	}
	.popup-content{
		padding:12px;
	}
	.cell-bottom{
			margin-bottom:16px;
		}
		.cell-bottom-4{
			margin-bottom:4px;
		}
	    .filter-head{
			padding:8px 0px;
			background:#fff;
		}
		.form-box{
			padding:24px 12px;
		}
		.banner-img {
			width: 100%;
		}
		.m-t-8{
			margin-top:8px;
		}
	.uni-select-group{
		display: flex;
	}
	uni-picker+uni-picker{
		margin-left:8px;
	}
	.uni-media-list{
		background-color: #fff;
		padding:12px 0px;
		width:auto!important;
		border-radius:6px;
	}
		.uni-media-list-logo {
			width: 120rpx;
			height: 120rpx;
			border-radius: 4px;
		}
	
		.uni-media-list-body {
			height: auto;
			justify-content: space-around;
	
		}
		.order-state-text{
			font-size:12px; 
			color:#999;
		}
	.cell-right-16{
		margin-right:16px;
	}
	.order-header{
		padding-bottom:8px;
		margin-bottom:8px;
	}
	.uni-order-footer{
		padding-bottom:24px;
		margin-top:8px;
		border-bottom:1px solid #eee;
	}
		.uni-media-list-text-bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
</style>
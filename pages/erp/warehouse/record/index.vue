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
		<picker  @change="orderTypeChange"  class="cell-r-8" :value="typeIndex" range-key="name"  :range="typeOptions">
			<view class="uni-flex uni-row-center  uni-between uni-select-button">
			<view  v-if="typeOptions.length>0">{{typeOptions[typeIndex].name}}</view>
			<text class="icon-xiala iconfont"></text>
			</view>
		</picker>
		<Operator  @changeData="ownerChange"></Operator>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex ">
	   <view class="form-box">
	   <uni-forms ref="baseForm" >
			<uni-forms-item label="日期范围"  >
				<Datepicker @changedate="changedate" :unlimited='unlimited'  :clearIcon="true" :iswidth="false" :days="0" />
			</uni-forms-item>
		</uni-forms>
		<button class="searchbtn" type="primary" @click="dohandleQurey">查询</button>
		</view>
	</SearchHeader>  	
	</view>	
	</view>	
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}" > 
		    <uni-card class="n-shadow" margin="8px 12px" >
				<template v-slot:title >
					<view class="uni-list  ">
						<view class="uni-between uni-flex order-c-warp">
						<view class="uni-h6">单据编码: {{row.number}}</view>
						<text v-if="row.typename==='组装'" class="text-orange">加工单</text>
						<text v-else-if="row.typename==='调库'" class="text-green">调库单</text>
						<text v-else-if="row.typename==='库存转移'" class="text-green">代料单</text>
						<text v-else-if="row.typename==='其它入库'" class="text-green">入库单</text>
						<text v-else-if="row.typename==='其它出库'" class="text-red">出库单</text>
						<text v-else-if="row.typename==='发货出库'" class="text-red">发货单</text>
						<text v-else-if="row.typename==='采购'" class="text-orange">采购单</text>
						<text v-else-if="row.typename==='盘点'" class="text-orange">盘点单</text>
						<text v-else >{{row.typename}}单</text>
						</view>
					</view>
				</template>	
				<view class="c-pro-wrap">
					<view>
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else  src="/static/empty/noimage40.png" ></image>
					</view>
					<view class="c-text-wrap">
						<view class="uni-h4 uni-flex uni-row-center">
						  <text class="cell-r-8">{{row.sku}}</text>
						   <uni-tag v-if="row.outbound>0" text="出库准备" :inverted="true"  size="mini"  type="warning" />
						   <uni-tag v-else-if="row.intbound>0" text="入库准备" :inverted="true"  size="mini"  type="warning" />
						   <uni-tag v-else-if="row.outbound<0" text="出库" :inverted="true"  size="mini"  type="warning" />
						   <uni-tag v-else-if="row.fulfillable>0" text="入库" :inverted="true"  size="mini"  type="warning" />
						   <uni-tag v-else-if="row.fulfillable<0" text="出库" :inverted="true"  size="mini"  type="warning" />
						</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
						<view class="uni-h6 cell-t-8">操作仓库：{{row.warehousename}}</view>
						<view class="uni-h6 cell-t-8">操作人：{{row.operator}}</view>
					</view>
				</view>
				<view class="order-footer-wrap">
					<view class="uni-h6  ">{{row.opttime}}</view>
					<view class="uni-right">
					<button type="primary" @click="handleDetails(row)" size="mini">库存明细</button>
					</view>
				</view>
			</uni-card>
		</template>
	</GlobalTable>
	<uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popup-content form-box" >
			<view class="uni-h5 cell-b-16  font-bold">{{skuData.sku}}</view>
			<view class="step-box-wrap">
				<view class="step-line-wrap">
					<view class="step-line-item">
						<view class="step-dot"></view>
						<view class="step-dash-line"></view>
					</view>	
					<view class="step-line-item">
						<view class="step-dot"></view>
						<view class="step-dash-line"></view>
					</view>
					<view class="step-line-item">
						<view class="step-dot"></view>
						<view class="step-dash-line " style="opacity: 0;"></view>
					</view>
				</view>
				<view class="step-content-wrap">
					<view class="step-content-item">
					<view class=" step-title">初始库存</view>
					<uni-row >
						<uni-col :span="8" >
							<text class="uni-h3">{{skuData.startfulfillable}}</text>
							<view class="uni-h6">可用库存</view>
						</uni-col>
						<uni-col :span="8" >
							<text class="uni-h3">{{skuData.startinbound}}</text>
							<view class="uni-h6">待入库</view>
						</uni-col>
						<uni-col :span="8" >
							<text class="uni-h3">{{skuData.startoutbound}}</text>
							<view class="uni-h6">待出库</view>
						</uni-col>
					</uni-row>
					</view>
					<view class="step-content-item">
					<view class=" step-title">库存变动</view>
					<uni-row >
						<uni-col :span="8" >
							<text v-if="skuData.endfulfillable&&skuData.endfulfillable>=skuData.startfulfillable"
							 class="uni-h3"><text class="text-green">+</text>{{skuData.endfulfillable-skuData.startfulfillable}}</text>
							 <text v-else  class="uni-h3"><text class="text-red">-</text>{{skuData.startfulfillable-skuData.endfulfillable}}</text>
							<view class="uni-h6">可用库存</view>
						</uni-col>
						<uni-col :span="8" >
							<text class="uni-h3" v-if="skuData.endinbound>=skuData.startinbound">
							<text class="text-green">+</text>
							{{skuData.endinbound-skuData.startinbound}}</text>
							<text v-else class="uni-h3">
								<text class="text-red">-</text>
								{{skuData.startinbound-skuData.endinbound}}
							</text>
							<view class="uni-h6">待入库</view>
						</uni-col>
						<uni-col :span="8" >
							<text class="uni-h3" v-if="skuData.endoutbound>=skuData.startoutbound">
							<text class="text-green">+</text>
							{{skuData.endoutbound-skuData.startoutbound}}</text>
							<text v-else class="uni-h3">
								<text class="text-red">-</text>
								{{skuData.startoutbound-skuData.endoutbound}}
							</text>
							<view class="uni-h6">待出库</view>
						</uni-col>
					</uni-row>
					</view>
					<view class="step-content-item">
					<view class=" step-title">结余库存</view>
					<uni-row >
						<uni-col :span="8" >
							<text class="uni-h3">{{skuData.endfulfillable}}</text>
							<view class="uni-h6">可用库存</view>
						</uni-col>
						<uni-col :span="8" >
							<text class="uni-h3">{{skuData.endinbound}}</text>
							<view class="uni-h6">待入库</view>
						</uni-col>
						<uni-col :span="8" >
							<text class="uni-h3">{{skuData.endoutbound}}</text>
							<view class="uni-h6">待出库</view>
						</uni-col>
					</uni-row>
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
	import Operator from "@/components/header/operator.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import inventoryRecordApi from '@/api/erp/inventory/inventoryRecordApi.js';
    import { reactive, toRefs,ref } from "vue";
	import util from '@/utils/util';
import { onMounted } from "vue";
const globalTableRef =ref()
const searchheaderRef =ref()
const popup = ref()
	const state=reactive({
		typeOptions:[{"id":"","name":"单据类型"}
		],
		searchData: [
		  { value: 0, text: "SKU" },
		  { value: 1, text: "单据编码" },
		],
		typeIndex:0,
		searchChecked:0,
		params:{
			    fromDate:util.getCurrentSevenDay()[0],
				toDate:util.getCurrentSevenDay()[1]+' 23:59:59',
				searchtype:'sku',
				sort:'opttime',
				warehouseid:'',
				},
		searchKeywords:'',
		tableData:{records:[],total:0},
		skuData:{},
	})
	const{
		tableData,
		typeOptions,
		typeIndex,
		searchData,
		searchChecked,
		params,
		searchKeywords,
		skuData,
	}=toRefs(state)
	
	function getOrderType(){
		inventoryRecordApi.getFormTypeList().then((res)=>{
			res.unshift({"id":"","name":"单据类型"});
			state.typeOptions=res;
			state.params.formtype=null;
		})
	}
    function changeType(e){
			if(e===0){
				state.params.searchtype='sku'
			}else if(e===1){
				state.params.searchtype='number'
			}
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
		inventoryRecordApi.list(params).then(res=>{
			if(res.records){
				state.tableData.records=res.records;
				state.tableData.total=res.total;
			}
		})
	}
	function handleDetails(row){
		popup.value.open("bottom")
		state.skuData =row
	}
	
	function warehouseChange(e){
		state.params.warehouseid =e
		handleQurey()
	}
	function changedate(date){
			if(date){
				state.params.fromDate = date[0];
				state.params.toDate = date[1]+' 23:59:59';
			}
	}
	function dohandleQurey(){
		handleQurey()
		searchheaderRef.value.closePop()
	}
	function orderTypeChange(e){
		var index = e.detail.value
		state.typeIndex = index
		if(index===0){
			state.params.formtype=null;
		}else{
			state.params.formtype = [state.typeOptions[index].id]
		}
		handleQurey()
	}
	
	function ownerChange(val){
		state.params.operator=val
		handleQurey()
	}
	onMounted(()=>{
		getOrderType()
		handleQurey()
	})
</script>

<style scoped>
	.order-c-warp{
		padding:12px;
	}
	.form-box{
		padding:16px;
	}
	.cell-b-16{
		padding-bottom:16px;
	}
</style>
<template>
	<view class="top-header">
	             	<view class="uni-flex   uni-row m-8-16" >
						<view class="flex-item-grow " >
									<UnEasyunput  @change="handlerQuery"  placeholder="请输入SKU" v-model="param.search" >
									</UnEasyunput>
						</view>
									<view class="flex-item">
							      <button class="btn-default" @click="handlerQuery">查询</button>
								  	</view>
						 </view>
						 <view class="cell-base-box">
						 <warehouse @changeData="warehouseChange"></warehouse>
						 </view>
	</view>  
	<view style="padding-top:112px; background-color: #fff;padding-left:12px;padding-right:12px">
	<global-table ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		  <view class="sku-list">
		  	<view class="sku-item">
		  		<view class="uni-flex">
		  			<image v-if="row.image" @click="goMaterialInfoPage(row.materialid)" :src="row.image"></image>
					<image v-else src="/static/empty/noimage40.png" @click="goMaterialInfoPage(row.materialid)" ></image>
		  			<view class="uni-column " style="flex:1">
						<view class="uni-flex uni-between uni-row">
						  <view class="cell-r-16">
		  			    	<view class="sku cell-b-4">{{row.sku}}</view>
		  				    <view class="name text-omit-1">{{row.name}}</view>
						  </view>
						  <view class="uni-right">
						  <text class="font-num">￥{{row.price}}</text> 
						  <view class="uni-h7">单价</view>
						  </view>
						</view>
						<view>
						<text class="light-font"> 库存:</text><text class="font-qty">{{row.fulfillable}}</text> 
						</view>
						<view class="flex-between-row ">
						 		 <text class="light-font"> 待入库:{{row.inbound}}</text>
								 <view class="uni-divider-v"></view>
						 		 <text class="light-font"> 待出库:{{row.outbound}}</text>
						</view>
		  			</view>
		  		</view>
		  	</view>
		  </view>
		</template>
	</global-table>
	</view>
</template>

<script setup>
	import UnEasyunput from '@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
	import {onShow} from "@dcloudio/uni-app";
	import GlobalTable from "@/components/globaltable/index.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import inventoryApi from '@/api/erp/inventory/inventoryApi.js';
	import warehouseApi from '@/api/erp/warehouse/warehouseApi';
	const globalTableRef=ref(GlobalTable);
	const inputDialog=ref();
	const instance=getCurrentInstance();
	const state = reactive(
	               {tableData:{records:[],total:0},
	                param:{search:"",warehouseid:""},
	                allfulfillable:"",allinbound:"",alloutbound:"",
	                form:{},
					});
	const {tableData,allfulfillable,allinbound,alloutbound,param,form,} = toRefs(state);	
	function handlerQuery(){
		setTimeout(function(){
			instance.proxy.$refs["globalTableRef"].loadTable(state.param);
		},300);
	}
	function goMaterialInfoPage(mid){
				uni.navigateTo({
					url:'../../../material/product/components/details?id='+mid
				})
			}
	function loadTable(param){
		inventoryApi.getWarehouse(param).then(data=>{
			          if(data){
						  state.tableData.records=data.records;
						  state.tableData.total=data.total;
						  if(param.currentpage==1){
								 if(data.total>0){
									  state.allfulfillable=data.records[0].allfulfillable;
									  state.allinbound=data.records[0].allinbound;
									  state.alloutbound=data.records[0].alloutbound;
								 }
						  }
					  }else{
						state.tableData.records=[];
						state.tableData.total=0;  
					  }
		})
	}
 
	function warehouseChange(warehouseid){
		state.param["warehouseid"]=warehouseid;
		state.param.sort="fulfillable";
		state.param.order="desc";
		handlerQuery();
	}
 
	function doHandlerQuery(){
		handlerQuery();
	}
	  
	onShow(()=>{
		  
	})
	 
</script>

<style>
	.cell-base-box{
		padding:0px 12px 8px 12px;
	}
	.searchbtn{
		margin:10px;
	}
	.top-header{
		position:fixed;
		left:0px;
		top:0px;
		width:100%;
		z-index:100;
		background-color: #fff;
		border:solid #e8e8e8 1px;
	}
	/* #ifdef H5 */
	.top-header{
		top:44px;
	}
	/* #endif */
.flex-item-grow{
	flex:1 ;
	padding-right: 8px;
}
.m-8-16{
	margin: 8px 12px;
}
.btn-default{
	font-size: 14px;
}
	.tab-left .segmented-control__item {
		justify-content: left!important;
		padding-left:16px;
		padding-right: 16px;
		flex: inherit!important;
		
	}
	.tab-left  .segmented-control__text{
		font-size: 16px !important;
		white-space:nowrap;
	}
	.tab-left {
		display: inline-block;
	}
			.test {
				font-family: iconfont;
				margin-left:4rpx;
				font-size:24rpx;
			}
			.font-num{
				font-size:28rpx;
				font-weight: 700;
				color: #333;
			}
			.font-qty{
				font-size:30rpx;
				font-weight: 700;
				color: #ff7315;
			}
	 .sku-list .sku{
		 font-size: 30rpx;
		 color: #333;
		 font-weight: 700;
	 }		
	 .sku-list .name{
		 font-size:24rpx;
		 color: #999;
		 margin-bottom: 24rpx;
		 
	 }
	.sku-list image{
		width:180rpx;
		height:180rpx;
		margin-right: 16rpx;
		flex-shrink:0;
		border-radius:8px;
	}
	.sku-list button{
		margin-left:16rpx;
		white-space:nowrap;
	}
	
	.sku-item {
		margin-top:24rpx;
		margin-bottom: 24rpx;
	}
		.flex-center{
			display: flex;
			align-items: center;
		}
		.uni-popover{
			position: absolute;
			z-index:1;
			width: 100%;
			left: -20px;
			border-radius: 4px;
			box-shadow: 0 4px 20px 0 rgba(0,0,0,.2);
			background-color: #fff;
			padding: 16px;
		}
		.cell-r-16{
			margin-right:16px;
		}
		.cell-b-4{
			margin-bottom:4px;
		}
</style>

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
	</view>  
	<view style="padding-top:62px;"></view>
	<warehouse @changeData="warehouseChange"></warehouse>
		<uni-card is-full>
	<global-table ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		  <view class="sku-list">
		  	<view class="sku-item">
		  		<view class="uni-flex">
		  			<image v-if="row.image" @click="goMaterialInfoPage(row.materialid)" :src="row.image"></image>
					<image v-else src="/static/empty/noimage40.png" @click="goMaterialInfoPage(row.materialid)" ></image>
		  			<view class="uni-column " style="flex:1">
		  				<view class="sku">{{row.sku}}</view>
		  				<view class="name text-omit-1">{{row.name}}</view>
		  				<view class="flex-between-row ">
							<view>
							<text class="font-num">￥{{row.price}}</text> 
							</view>
							<view>
		  					<text class="light-font"> 库存:</text><text class="font-qty">{{row.fulfillable}}</text> 
							</view>
		  				</view>
						<view class="flex-between-row ">
						 		 <text class="light-font"> 待入库:{{row.inbound}}</text>
						 		 <text class="light-font"> 待出库:{{row.outbound}}</text>
						</view>
		  			</view>
		  		</view>
		  	</view>
		  </view>
		</template>
	</global-table>
	</uni-card>
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
					url:'../../../material/material?materialid='+mid
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
		border:solid #dedede 1px;
		box-shadow: 1px 1px 2px #c6c6c6;
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
	margin: 8px 16px;
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
	@font-face {
		  font-family: 'iconfont';  /* Project id 4064508 */
		  src: url('//at.alicdn.com/t/c/font_4064508_2wnqndz5dgw.woff2?t=1683966814432') format('woff2'),
		       url('//at.alicdn.com/t/c/font_4064508_2wnqndz5dgw.woff?t=1683966814432') format('woff'),
		       url('//at.alicdn.com/t/c/font_4064508_2wnqndz5dgw.ttf?t=1683966814432') format('truetype');
		}
			.test {
				font-family: iconfont;
				margin-left:4rpx;
				font-size:24rpx;
			}
			.font-num{
				font-size:36rpx;
				font-weight: 700;
				color: #ffa200;
			}
			.font-qty{
				font-size:36rpx;
				font-weight: 700;
				color: #000000;
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
		width:190rpx;
		height:190rpx;
		margin-right: 16rpx;
		flex-shrink:0;
	}
	.sku-list button{
		margin-left:16rpx;
		white-space:nowrap;
	}
		.flex-between-row{
			display: flex;
			justify-content: space-between;
			align-items: center;
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
</style>

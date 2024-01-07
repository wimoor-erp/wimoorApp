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
									  <view  class="flex-item" style="padding-left:8px;padding-top:8px">
										  <checkbox-group  @change="handlerCheckMtype">
										 含辅料 <checkbox  value="product" :checked="param.mcheck"   color="#FFCC33"/>
										 </checkbox-group>
										 </view>
						     
						 </view>
	</view>  
	<view style="padding-top:62px;">
		
	</view>
		<warehouse-address @changeData="addressChange"></warehouse-address> 
  <uni-card is-full>
	<global-table ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		  <view class="sku-list">
		  	<view class="sku-item">
		  		<view class="uni-flex">
		  			<image v-if="row.image" :src="row.image" @click="goMaterialInfoPage(row.materialid)"></image>
					<image v-else src="/static/empty/noimage40.png" @click="goMaterialInfoPage(row.materialid)"></image>
		  			<view class="uni-column " style="flex:1">
		  				<view class="sku">{{row.sku}}</view>
		  				<view class="name">{{row.name}}</view>
		  				<view class="flex-between-row ">
		  					<view >
		  					<text class="font-num">{{row.amount}}</text> <text class="light-font"> 暂存库存</text>
		  					<view class="light-font">
		  						<text class="test">&#xe683;</text>
		  						{{row.warehousename}}</view>
		  					</view>
		  					<view class="flex-center">
		  					<button size="mini" @click="toshelfPage(row)" type="primary">上架</button>
		  					</view>
		  				</view>
		  			</view>
		  		</view>
		  	</view>
		  </view>
		</template>
	</global-table>
	</uni-card>
           <uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="input" :title="form.title" :value="form.quantity"
					placeholder="请输入内容" @confirm="submitSubShelfInv"></uni-popup-dialog>
			</uni-popup>
</template>

<script setup>
	import UnEasyunput from '@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
	import {onShow} from "@dcloudio/uni-app";
	import GlobalTable from "@/components/globaltable/index.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import WarehouseAddress from "@/components/header/warehouse_address.vue";
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi.js'
	const globalTableRef=ref(GlobalTable);
	const inputDialog=ref();
	const instance=getCurrentInstance();
	const state = reactive({tableData:{records:[],total:0},param:{addressid:"",mcheck:false,search:"",mtype:"product",sort:"amount",order:"desc"},
	form:{}});
	const {tableData,param,form,mtype} = toRefs(state);	
	function handlerQuery(){
		setTimeout(function(){
			instance.proxy.$refs["globalTableRef"].loadTable(state.param);
		},300);
	}
	function goMaterialInfoPage(mid){
				uni.navigateTo({
					url:'../../material/material?materialid='+mid
				})
			}
	function loadTable(param){
		shelfproductApi.getShelfList(param).then(data=>{
			if(data&&data.records){
				state.tableData.records=data.records;
				state.tableData.total=data.total;
			}else{
				state.tableData.records=[];
				state.tableData.total=data.total;
			}
		})
	}
    function handlerCheckMtype(event){
		if(event.detail.value.length>0){
			state.param.mtype="";
		}else{
		   state.param.mtype="product";
			
		}
		 	handlerQuery();
	}
	function addressChange(addressid){
		state.param.addressid=addressid;
		handlerQuery();
	}
 
	function doHandlerQuery(){
		handlerQuery();
	}
	function showInputDialog(row){
		state.form.materialid=row.materialid;
		state.form.shelfid=row.shelfid;
		state.form.quantity=row.quantity;
		state.form.warehouseid=row.warehouseid;
		state.form.title="下架sku:"+row.sku;
		inputDialog.value.open();
	}
 
	function submitSubShelfInv(value){
		var invoptList=[];
		state.form.quantity=value;
		invoptList.push(state.form);
		shelfproductApi.subShelfInventory(invoptList).then(res=>{
			uni.showToast({
				title:'下架成功！',
				icon:'none',
				duration:2000
			})
			inputDialog.value.close();
			handlerQuery();
		})
	}
	function toshelfPage(row){
		let detail = {
					addressid:	state.param.addressid,
					materialid:row.id,warehouseid:row.warehouseid
		};
		uni.navigateTo({
			"url": '/pages/erp/warehouse/shelf/index?detailData=' +
				encodeURIComponent(JSON.stringify(detail))
		});
		
	}
	onShow(()=>{
		handlerQuery();
	})
	 
</script>

<style>
	.searchbtn{
		margin:10px;
	}
	.top-header{
		position:fixed;
		left:0px;
		top: 0px;
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
	 .sku-list .sku{
		 font-size: 30rpx;
		 color: #333;
		 font-weight: 700;
	 }		
	 .sku-list .name{
		 font-size:24rpx;
		 color: #999;
		 line-height:36rpx;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 display: -webkit-box;
		 -webkit-line-clamp:1;
		 -webkit-box-orient: vertical;
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

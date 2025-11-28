<template>
	<uni-card class="n-shadow" margin="8px 12px" >
		 			<template v-slot:title>
						<uni-list>
							<view class="uni-order-header uni-flex uni-between">
								<view class=" uni-flex uni-row-center">
									<text class="cell-l-8">{{orderForm.number}}</text>
								</view>
								<text class="text-green" v-show="orderForm.isworking===false">盘点完成</text>
								<text class="text-orange" v-show="orderForm.isworking===true">进行中</text>
							</view>
						</uni-list>
					</template>
					<view class="cell-list">
						<view class="uni-flex uni-between">
							<text>盘点类型</text>
							<text v-show="orderForm.ftype===1">仓位</text>
							<text v-show="orderForm.ftype===2">库位</text>
						</view>
						<view class="uni-flex uni-between">
							<text>备注</text>
							<text>{{orderForm.remark}}</text>
						</view>
					</view>
		 		</uni-card>
      <view class="uni-header">
		<uni-segmented-control :current="current" :values="warehouseData" style="overflow: inherit;" style-type="text"
		 active-color="#ff6700" @clickItem="onClickItem" />
		 </view>
	<uni-card class="n-shadow" margin="8px 12px">
		<view class="uni-list-product" v-for="item in productData">
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else  src="/static/empty/noimage40.png" ></image>
			<view class="uni-flex-item">
				<view class="uni-flex uni-between">
					<view class="cell-r-16">
						<view class="uni-h4">{{item.sku}}</view>
						<view class="uni-h6 text-omit-1">{{item.name}}</view>
					</view>
					<view class="uni-right">
					<view class="ListNum">{{item.amount}}</view>
					<text class="uni-h6">盘点数</text>
				    </view>
					</view>
				<view class="uni-flex  cell-t-8 cell-b-8">
				 <text class="uni-6 uni-text-gray"> 账面数量 
				<text > {{item.amount-item.overamount+item.lossamount}}</text>
				 </text>
				 <text class="uni-h6 cell-l-8">单价 ￥{{item.price}} </text>
				 <text class="uni-h6 cell-l-8">可用库存 <text>{{item.fulfillable}}</text></text>
				 </view>
				 <view class="cell-t-8 cell-b-8">
					 <text class="uni-h6 ">待出库 {{item.outbound}} </text>
					 <text class="uni-h6 cell-l-8">盘盈数量 {{item.overamount}} </text>
					 <text class="uni-h6 cell-l-8">盘亏数量 {{item.lossamount}} </text>
				 </view>
			</view>
			<view>
			</view>
		</view>
	</uni-card>
	<uni-card class="n-shadow" margin="8px 12px" padding="16px 16px 24px 16px">
		<view class="uni-h5 font-bold cell-b-8">合计</view>
		<view class="uni-flex">
			<view class="uni-center uni-flex-item">
				<view class="uni-h4 font-bold"><text class="uni-h7">￥</text>{{totalAmount.overprice}}</view>
				<text>盘盈金额</text>
			</view>
			<view class="uni-center uni-flex-item">
				<view class="uni-h4 font-bold"><text class="uni-h7">￥</text>{{totalAmount.lossprice}}</view>
				<text>盘亏金额</text>
			</view>
		</view>
		</uni-card>
</template>

<script setup>
	
	import { onMounted, reactive, ref, toRefs,} from 'vue';
	import stocktakingApi from '@/api/erp/inventory/stocktakingApi.js';
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi';
	import {onLoad} from "@dcloudio/uni-app";
	const popRef =ref();
	const state=reactive({
				orderId:'',
				productData:[],
				orderForm:[],
				warehouseData:[],
				current:0,
				totalAmount:{},
	})
	const{
		orderId,
		productData,
		orderForm,
		warehouseData,
		current,
		totalAmount,
	}=toRefs(state)
	onLoad((event)=>{
		// TODO 后面把参数名替换成 payload
		const payload = event.id || event.payload;
		// 目前在某些平台参数会被主动 decode，暂时这样处理。
		try {
			state.orderId = JSON.parse(decodeURIComponent(payload));
		} catch (error) {
			state.orderId = JSON.parse(payload);
		}
		load(state.orderId)
	})
	function load(id){
		stocktakingApi.view({"id":id}).then(res=>{
			if(res){
                state.orderForm = res;
				state.totalAmount = res
				var checkid=[];
				if(state.orderForm.ftype===2&&res.shelflist.length>0){
					res.shelflist.forEach(item=>{
						checkid.push(item.shelfid)
					})
				}else if(state.orderForm.ftype===1&&res.warehouselist.length>0){
					res.warehouselist.forEach(item=>{
						checkid.push(item.warehouseid) ;
					})
				}
				loadTabsData(checkid,state.orderForm.ftype)
			}
		})
	}
	function loadTabsData(tabsid,ftype){
		if(tabsid!=[] && tabsid!=null && tabsid!=""){
			if(ftype===1){
				stocktakingApi.stocktakingListWarehouse(tabsid).then(res=>{
					var arr=[]
					res.forEach(item=>{
						arr.push(item.name)
					})
					state.warehouseData = arr;
					loadItemList(state.warehouseData[0].id)
				})
			}else{
				stocktakingApi.stocktakingListShelf(tabsid).then(res=>{
					var arr=[]
					res.forEach(item=>{
						arr.push(item.name)
					})
					state.warehouseData = arr;
					loadItemList(state.warehouseData[0].id);
				})
			}
		}
	}
	
	function loadItemList(itemid){
		var params={selected:"true",isstocking:"true"};
		params.stocktakingid=state.orderId;
		if(state.orderForm.ftype==1){
			params.warehouseid=itemid;
			stocktakingApi.searchCondition(params).then((res)=>{
				state.productData = res;
			});
		}else{
			params.shelfid=itemid;
			shelfproductApi.getShelfInventoryStockingList(params).then(function(res) {
					state.productData = res;
			})
		}
	
	}
	
	function onClickItem(e){
		state.current = e
	}
</script>

<style scoped>
	.ListNum{
		font-weight: bold;
		color:#f86300;
		font-size:16px;
	}
	.uni-list-product{
		padding-top:8px;
		padding-bottom:8px;
	}
	.ListNum text{
		font-weight: 400;
		font-size:12px;
		margin-left:4px;
	}
	.ListBox{
		border-radius: 4px;
	}
	.uni-order-header{
			margin:12px;
		}
		.uni-header{
			margin:0px 16px;
		}
	.cell-list .uni-flex{
		margin-top: 8px;
		font-size:14px;
		color:#999;
	}
	.cell-list{
		margin-bottom: 16px;
	}
	.uni-affix-box{
		height:64px;
		
	}
	.cell-8{
		flex: 1;
		padding: 16px;
	}
	.uni-text-gray{
		color:#999;
	}
</style>
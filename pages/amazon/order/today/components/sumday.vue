<template>
 <view class="gra-bg" >
	   <view class="cardin" v-if="summaryData" >
		<scroll-view 
		 :scroll-top="scrollTop" scroll-x="true"  
		 @scroll="scroll">
		 <view class="uni-flex uni-row-center">
		<view class="card-width"> 
		<uni-card class="n-shadow" padding="16px" margin="8px 8px 0px 12px">
			<view class="uni-h7 cell-b-8">
				<text>截至{{summaryData.counrtyname}}{{summaryData.counrtynow}}</text>
			</view>
			<view class="cell-b-16">
				<view class="text-orange big-font">
				<text>{{summaryData.currency}}</text>	
				<text class="font-bold">{{summaryData.nowtotalprice}}</text>
				<view class="uni-h7">销售额</view>
				</view>
			</view>
			<uni-row>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.nowtotalOrder}}</text>
					<view class="uni-h7 cell-b-16">订单量</view>
				</uni-col>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.nowtotalquantity}}</text>
					<view class="uni-h7 cell-b-16">销量</view>
				</uni-col>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.currency}}{{summaryData.nowavgprice}}</text>
					<view class="uni-h7 ">平均单品净销售额</view>
				</uni-col>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.nowavgsales}}</text>
					<view class="uni-h7 ">每单平均销量</view>
				</uni-col>
			</uni-row>
		</uni-card>
		</view>	
		<view class="card-width">
		<uni-card class="n-shadow" padding="16px" margin="8px 8px 0px 0px">
			<view class="uni-h7 cell-b-8">
				<text>截至{{summaryData.counrtyname}}{{summaryData.counrtyyes}}</text>
			</view>
			<view  class="cell-b-16">
				<view class="text-orange big-font">
				<text>{{summaryData.currency}}</text>
				<text class="font-bold">{{summaryData.yesstotalprice}}</text>
				<view class="uni-h7">销售额</view>
				</view>
			</view>
			<uni-row>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.yesstotalOrder}}</text>
					<view class="uni-h7 cell-b-16">订单量</view>
				</uni-col>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.yesstotalquantity}}</text>
					<view class="uni-h7 cell-b-16">销量</view>
				</uni-col>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.currency}}{{summaryData.yessavgprice}}</text>
					<view class="uni-h7">平均单品净销售额</view>
				</uni-col>
				<uni-col :span="12">
					<text class="subdata">{{summaryData.yessavgsales}}</text>
					<view class="uni-h7">每单平均销量</view>
				</uni-col>
			</uni-row>
		</uni-card>
		 </view>
		 </view>
		</scroll-view>  
</view>
 
</view>
  
</template>

<script setup>
	import orderListApi from "@/api/amazon/order/orderListApi.js";
	import inventoryRptApi from "@/api/amazon/inventory/inventoryRptApi.js";
    import { reactive,toRefs,onMounted,ref } from "vue";
	import {formatFloat} from '@/utils/util';
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	const state = reactive({summaryData:{} });
	const { summaryData } = toRefs(state);
	function loadData(queryParams){
		orderListApi.getParamOfTodayOrder(queryParams).then((data)=>{
			if(data){
				state.summaryData=data;
				state.summaryData.counrtynow=data.counrtynow;
				state.summaryData.counrtyyes=data.counrtyyes;
				state.summaryData.currency=data.currency;
				if(data.list&&data.list[0]){
					state.summaryData.yesstotalOrder=data.list[1].total_order;
					state.summaryData.nowtotalOrder=data.list[0].total_order;
					state.summaryData.yesstotalprice=formatFloat(data.list[1].total_price);
					state.summaryData.nowtotalprice=formatFloat(data.list[0].total_price);
					state.summaryData.yesstotalquantity=data.list[1].total_quantity;
					state.summaryData.nowtotalquantity=data.list[0].total_quantity;
					state.summaryData.yessavgsales=formatFloat(data.list[1].total_quantity/data.list[1].total_order);
					state.summaryData.nowavgsales=formatFloat(data.list[0].total_quantity/data.list[0].total_order);
					state.summaryData.yessavgprice=formatFloat(data.list[1].total_price/data.list[1].total_quantity);
					state.summaryData.nowavgprice=formatFloat(data.list[0].total_price/data.list[0].total_quantity);
				}else{
					state.summaryData.yesstotalOrder=0;
					state.summaryData.nowtotalOrder=0;
					state.summaryData.yesstotalprice=0;
					state.summaryData.nowtotalprice=0;
					state.summaryData.yesstotalquantity=0;
					state.summaryData.nowtotalquantity=0;
					state.summaryData.yessavgsales=0;
					state.summaryData.nowavgsales=0;
					state.summaryData.yessavgprice=0;
					state.summaryData.nowavgprice=0
				}
			} 
		})
	}
 defineExpose({
   loadData,
 })
</script>

<style scoped>
		.card-width {
			width:320px;
			flex-shrink: 0;
		}
	.cell-b-16{
		margin-bottom:16px;
	}
	.subdata{
		font-size:18px;
		font-weight: 700;
		color:#333;
	}
    .cardin{
		padding:0px;
	}
	.big-font{
		font-size:26px;
	}
	.text-orange{
		color:#ff8913
	}
	.gra-bg{
		background: linear-gradient(180deg, #ff6700 20%, rgba(0,0,0,0) 80%);
	}
</style>
<template>
 <view class="uni-bg-orange-tran " >
	   <view class="cardin" v-if="summaryData" >
	   <uni-grid 
	      :column="2" 
	      :square="false" 
		  :showBorder="false"
	      :highlight="false" 
		  @change="change">
	   				<uni-grid-item  :index="1" >
	   					<view class="grid-item-box"  >
	   						 <view class="light-font">
								 <text class="icon-shijian iconfont"></text>
								 截至{{summaryData.counrtyname}}</view>
	   						 <view >{{summaryData.counrtynow}}</view>   
	   					</view>
	   				</uni-grid-item>
					<uni-grid-item  :index="2" >
						<view class="grid-item-box" >
							<view class="light-font">
								<text class="icon-shijian iconfont"></text>
								截至{{summaryData.counrtyname}}</view>
							<view >{{summaryData.counrtyyes}}</view> 
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="3" >
						<view class="grid-item-box"  >
							<view class="light-font ">订单数量</view>
							<view class="font-bold big-font">{{summaryData.nowtotalOrder}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="4" >
						<view class="grid-item-box"  >
							<view class="light-font">订单数量</view>
							<view class="font-bold big-font">{{summaryData.yesstotalOrder}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="5" >
						<view class="grid-item-box"  >
							<view class="light-font">销量</view>
							<view class="font-bold">{{summaryData.nowtotalquantity}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="6" >
						<view class="grid-item-box"  >
							<view class="light-font">销量</view>
							<view class="font-bold">{{summaryData.yesstotalquantity}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="7" >
						<view class="grid-item-box"  >
							<view class="light-font">每单平均销量</view>
							<view class="font-bold">{{summaryData.currency}}{{summaryData.nowavgsales}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="8" >
						<view class="grid-item-box"  >
								<view class="light-font">每单平均销量</view>
								<view class="font-bold">{{summaryData.currency}}{{summaryData.yessavgsales}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="9" >
						<view class="grid-item-box"  >
							<view class="light-font">订单金额</view>
							<view class="font-bold">{{summaryData.currency}}{{summaryData.nowtotalprice}}</view>
							
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="10" >
						<view class="grid-item-box"  >
							<view class="light-font">订单金额</view>
							<view class="font-bold">{{summaryData.currency}}{{summaryData.yesstotalprice}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="11" >
						 <view class="grid-item-box"  >
						<view class="light-font">平均单品净销售额</view>
						<view class="font-bold">{{summaryData.currency}}{{summaryData.nowavgprice}}</view>
						</view>
					</uni-grid-item>
					<uni-grid-item  :index="12" >
						<view class="grid-item-box"  >
							<view class="light-font">平均单品净销售额</view>
							<view class="font-bold">{{summaryData.currency}}{{summaryData.yessavgprice}}</view>
						</view>
					</uni-grid-item>
	   			</uni-grid>
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

<style>
	.intitle{
		padding:20px;
	}
    .cardin{
		padding:0px;
	}
	.grid-item-box{
		margin-left:16px;
		margin-right:16px;
		margin-bottom:16px;
		color:#fff;
	}
	.grid-item-box .light-font{
		margin-bottom:4px;
		color:#fff;
		opacity: 0.7;
	}
	.big-font{
		font-size:32px;
	}
</style>
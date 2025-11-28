<template>
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<scroll-view scroll-y="true" class="scoll-height">
			<view class="order-wrap">
				<view class="uni-flex  uni-between">
				<view>
				<view class="uni-flex uni-row-center">
					<uni-icons 
					:class="order.itemstatus==='Shipped'?'text-green':'text-orange'"
					custom-prefix="iconfont" type="icon-success-fill" size="22"></uni-icons>
					<text class="uni-h4">{{order.itemstatus}}</text>
				</view>
				<view class="uni-h6">订单号：{{order.orderid}}</view>
				</view>
				<text class="uni-text-small">下单时间{{util.dateFormat(order.buydate)}}</text>
				</view>
				<view class="uni-h6 cell-t-8" v-if="email">买家邮箱：{{email}}</view>
				<view class="address-wrap">
					<view class="uni-flex uni-row-center">
					<uni-icons type="location" size="24" color="#333"></uni-icons>
					<view>
					<text v-if="!row.addressState">暂无配送地址</text>
					<text v-else>{{row.addressState}},{{row.addressCity}},{{row.addressCountry}},{{row.addressPostal}}</text>
					<view>
						<text class="uni-h6">配送方式：{{order.channel}}</text>
						<text ></text>
					</view>
					</view>
					</view>
				</view>
<!-- 				<view class="uni-right cell-t-8">
					<button
					 plain="true"
					 @click="viewCustomer"
					 size="mini" type="default">查看买家信息</button>
				</view> -->
				<view class="uni-list-product uni-divider-line">
					<image v-if="order.image" :src="order.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{order.sku}}</view>
						<view class="uni-h6 text-omit-1">{{order.name}}</view>
					</view>
					<view class="uni-right">
						<view class=" uni-h5">{{order.itemprice}}</view>
						<text class="uni-h6">售价</text>
					</view>
				</view>
				<view class="v-gap">
				<view class="uni-flex uni-between">
					<text class="text-light">币种</text>
					<text class="font-bold">{{row.currency}}</text>
				</view>
				<view class="uni-flex uni-between">
					<text class="text-light">订单总额</text>
					<text class="font-bold">{{order.orderprice}}</text>
				</view>
				<view class="uni-flex uni-between">
					<text class="text-light">运费</text>
					<text class="font-bold">{{priceValue(row.shipprice)}}</text>
				</view>
				<view class="uni-flex uni-between">
					<text class="text-light">优惠金额</text>
					<text class="font-bold">{{priceValue(row.itemdiscount)}}</text>
				</view>
				<view class="uni-flex uni-between">
					<text class="text-light">商品税</text>
					<text class="font-bold">{{priceValue(row.itemtax)}}</text>
				</view>
				<view class="uni-right">
					<text class="uni-h5">实付款 </text>
					<text class="big-font"> {{row.orderprice}}</text>
				</view>
				</view>
				<view class="uni-divider-line v-gap " >
					<view class="uni-h5  cell-b-8">交易详情</view>
					<view
					 v-for="(item,index) in row.financialList" :key="index"
					 class="uni-flex uni-between uni-row-center uni-h6">
						<view>
						<text >{{item.marketplaceId}}</text>
						<view>{{item.ftype}}</view>
						</view>
						<text>{{priceValue(item.amount)}}</text>
					</view>
				</view>
				<view class="uni-right">
					<text class="uni-h5">卖家账户余额变动 </text>
					<text class="big-font"> {{row.financialfee}}</text>
				</view>
			</view>
		</scroll-view> 
		</uni-popup>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,computed} from 'vue';
	import util from '@/utils/util.js';
	const props=defineProps({
		row:{},
		order:{},
	})
	const emit=defineEmits(["getCustomer"])
	const {row,order}=toRefs(props)
	const state = reactive({
		
	}); 
	const {} = toRefs(state);
	const email = computed(()=>{
		if(Object.keys(props.row).length===0){
			return null
		}else{
			return props.row.orderMain.buyerEmail
		}
	})
	const popup=ref();
	function openPop(type){
		popup.value.open(type)
	}
	function closePop(){
		popup.value.close()
	}
	
	function priceValue(val){
		if(val===null||val===''||val===undefined){
			return "0.00"
		}else{
			return val
		}
	}
/* 	function viewCustomer(){
		emit(getCustomer)
	} */
	 defineExpose({
		  openPop,closePop,
	   })
</script>

<style scoped>
	.scoll-height{
		height:calc(100vh - 48px)
	}
	.address-wrap{
		background-color: #f5f5f5;
		margin-top:12px;
		padding:8px;
		border-radius: 4px;
	}
	.big-font{
	color:#ff7315;
	font-size:18px;
	line-height: 18px;
	font-weight: 700;
	margin-left:2px;
	}
	.v-gap .uni-flex{
		margin-top:8px;
		margin-bottom:8px;
	}
	.text-light{
		color:#999;
	}
	.uni-divider-line{
		margin-top:16px;
		padding-top:16px;
		border-top: 1px solid #eee;
	}
	.text-green{
		color: #07ad07!important;
	}
	.text-orange{
		color: #ff7315!important;
	}
	.order-wrap{
		padding:16px;
		width:320px;
	}
</style>
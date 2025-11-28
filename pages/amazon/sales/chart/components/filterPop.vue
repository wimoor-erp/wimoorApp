<template>
	 <view class="uni-flex uni-row-center"  @click="openPop('left')">
		 <text>筛选</text>
		 <uni-icons custom-prefix="iconfont" type="icon-filter" size="16"></uni-icons>
	 </view>
	 <uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popup-content" >
			<scroll-view scroll-y="true" class="scoll-height">
			<view class="uni-h5 ">销售渠道</view>
			<view class="item-wrap">
				<uni-data-checkbox 
				mode="tag"
				multiple 
				@change="channelAll"
				v-model="allchecked" 
				:localdata="all"></uni-data-checkbox>
				
				<uni-data-checkbox multiple 
				mode="tag"
				v-model="params.salechannel" 
				:map="{text:'name',value:'sales_channel'}"
				:localdata="country"></uni-data-checkbox>
			</view>
			<view class="uni-h5">配送方式</view>
			<view class="item-wrap">
				<uni-data-checkbox multiple 
				mode="tag"
				v-model="params.fulfillmentChannel" :localdata="shipType"></uni-data-checkbox>
			</view>
			<view class="uni-h5 ">客户类型</view>
			<view class="item-wrap">
				<uni-data-checkbox multiple 
				mode="tag"
				v-model="params.isBusinessOrder" :localdata="customerType"></uni-data-checkbox>
			</view>
			<view class="uni-h5 ">订单状态</view>
			<view class="item-wrap">
				<uni-data-checkbox multiple 
				mode="tag"
				@change="handleChange"
				v-model="params.orderStatus" :localdata="status"></uni-data-checkbox>
			</view>
			<view class="uni-h5 ">促销订单</view>
			<view class="item-wrap">
				<uni-number-box :min="0" :max="100" :step="1" :value="params.discountto" />
				<text class="uni-h7">折扣金额占原价</text>
			</view>
			<button class="searchbtn" type="primary" @click="dohandlerQuery">查询</button>
			</scroll-view>
		</view>
	 </uni-popup>
</template>
<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	import summaryChartApi from '@/api/amazon/order/summaryChartApi.js';
	import {listDictsByCode} from "@/api/sys/admin/dict.js";
	const state = reactive({
		country:[
		],
		shipType:[
			{text:'亚马逊配送',value:'Amazon'},
			{text:'卖家自配送',value:'Merchant'},
		],
		customerType:[
		{text:'企业买家',value:'true'},
		{text:'个人买家',value:'false'},
		],
		status:[
		      {
					text:'Shipped',
					value:"Shipped"
					},{
					text:'UnShipped',
					value:"UnShipped"
					},{
					text:'Pending',
					value:"Pending"
					},{
					text:'CanCelled',
					value:"CanCelled"
					},
	             ],
		params:{
			salechannel:[],
			fulfillmentChannel:["Merchant","Amazon"],
			isBusinessOrder:["true","false"],
			orderStatus:["Shipped","UnShipped","Pending"],
			discountfrom:0,
			discountto:100,
			discountrate:[0,100],
		},
		all:[{text:"全部",value:true}],
		allchecked:false,
	}); 
	const { 
		country,
		shipType,
		customerType,
		status,
		params,
		all,
		allchecked,
	} = toRefs(state);
	const popup=ref();
	const emit=defineEmits(["filterItemsChange"])
	function dohandlerQuery(){
		emit("filterItemsChange",state.params)
	}
	function openPop(type){
		popup.value.open(type)
	}
	function closePop(){
		popup.value.close()
	}
	function loadChannel(){
		summaryChartApi.getOrderChannel().then(res=>{
			if(res){
				res.sort((a,b)=>{
					if(a.isdifferent===0&&b.isdifferent!==0){
						return -1;
					}else if(a.isdifferent!==0&&b.isdifferent===0){
						return 1;
					}else{
						return 0;
					}
				})	
				res.forEach(item=>{
					if(item.isdifferent===0){
						state.params.salechannel.push(item.sales_channel)
						
					}else{
						item.name = item.name+'+'
					}
				})
				
				state.country = res;
			}
		})
	}
  function channelAll(e){
	  var arr=[];
	  state.country.forEach((item)=>{
		  arr.push(item.sales_channel)
	  })
	  if(e.detail.value[0]){
		 state.params.salechannel=arr
	  }else{
		  state.params.salechannel=[]
	  }
  }
	onMounted(()=>{
		loadChannel()
		
	})
	 defineExpose({
		  openPop,closePop,
		  state,
	   })
</script>

<style scoped>
	.popup-content{
		padding:16px;
		width:calc(100vw - 120px);
	}
	.item-wrap{
		margin-bottom: 24px;
		margin-top:12px;
	}
	.scoll-height{
		height: calc(100vh - 70px);
	}
</style>
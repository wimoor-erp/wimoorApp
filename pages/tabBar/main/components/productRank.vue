<template>
	<view class="chart-card">
		<uni-card :isFull="true" class="n-shadow "  >
			<template v-slot:title>
				<view class="card-title">商品销量排名</view>
			</template>
			<view class="uni-flex uni-row product-list" v-for="(item,index) in tableData" :key="index">
				<view class="">
					<image v-if="item.image" class="image60" :src="item.image"></image>
					<image v-else src="/static/empty/noimage40.png"></image>
				</view>
				<view class="message-box ">
					<view class=" uni-flex uni-between uni-row-center"> 
					<view class="shink-flex">
					<view class="title">{{item.sku}}</view>
					<view class="sub-text text-omit-1">{{item.name}}</view>
					</view>
					<view class='data uni-flex uni-column uni-right'>
						<text>{{item.quantity}}</text>
						<view class="sub-text"> 销量 </view> 
					</view>
					</view>
					<view class="uni-row uni-flex sub-text">
						<text>销售额
						<text class="text-orange">{{util.currency(item.marketname)}}{{item.orderprice}}	</text>
						</text>
						&nbsp; &nbsp; &nbsp;
						<text>FBA可售 {{item.fulfillable}}</text>
					</view>
					<view class="uni-cell-top inline">    
					<text class="tag-info-plain">{{item.groupname}}</text>&nbsp;
					<text class="tag-info-plain">{{item.marketname}}</text>
					</view>
				</view>
			</view>
		</uni-card>
		</view>
</template>
<script setup>
	import { ref,reactive,onMounted,watch,nextTick,toRefs } from 'vue'
	import summaryDataApi from '@/api/amazon/summary/summaryDataApi'
	import util from '@/utils/util.js';
	const props=defineProps({
		params:{},login:false,
	})
	const state=reactive({
		tableData:[],
	})
	const {tableData}=toRefs(state)
	const {params} = toRefs(props);
	watch(props.params,(val)=>{
		if(props.login){
		summaryDataApi.top5(props.params).then((res)=>{
			state.tableData=res;
		});	
		}
	})
</script>

<style scoped>
	.shink-flex{
		flex-shrink: 1;
	}
	.card-title{
		font-size: 17px;
		font-weight: 600;
		margin-top: 16px;
		margin-left:12px;
	}
	.chart-card{
		margin-left:12px!important;
		margin-right:12px!important;
		margin-top:8px;
		margin-bottom:8px;
	}
	.image60{
		width: 60px;
		height:60px;
		border-radius:8px;
	}
	.product-list{
		padding:16px 0px;
	}
	.message-box{
		margin-left:8px;
		flex:1;
		margin-bottom:12px;
	}
	.message-box .title{
		font-weight: 700;
		color:#333;
		margin-bottom:4px;
	}
	.message-box .sub-text{
		color:#999;
		font-size:12px;
		font-weight: 500;
	}
	.message-box .data{
		margin-top:8px;
		font-weight:700;
		color:#333;
		font-size:14px;
		white-space: nowrap;
		margin-left:8px;
	}
	.uni-cell-top{
		margin-top:8px;
	}
</style>
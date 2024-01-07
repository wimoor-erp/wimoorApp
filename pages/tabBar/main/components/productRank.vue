<template>
	<view class="chart-card">
		<uni-card title="商品销量排名" :isFull="true" class="n-shadow "  >
			<view class="uni-flex uni-row product-list" v-for="(item,index) in tableData" :key="index">
				<view class="">
					<image v-if="item.image" class="image60" :src="item.image"></image>
					<image v-else src="/static/empty/noimage40.png"></image>
				</view>
				<view class="message-box ">
					<view class="title">{{item.sku}}</view>
					<view class="sub-text text-omit-1">{{item.name}}</view>
					<view class='data uni-flex uni-row'><text class="sub-text"> 销量 </text> &nbsp;{{item.quantity}}</view>
					<view class="uni-row uni-flex sub-text">
						<text>FBA可售 {{item.fulfillable}}</text>
						 &nbsp; &nbsp; &nbsp;
						<text>销售额(站点币种) {{item.orderprice}}</text>
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
	.chart-card{
		margin-left:16px!important;
		margin-right:16px!important;
		margin-top:16px;
	}
	.image60{
		width: 60px;
		height:60px;
		border-radius: 4px;
	}
	.product-list{
		padding:16px 0px;
	}
	.message-box{
		margin-left:8px;
		flex-shrink:1;
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
		color:#ffa006;
		font-size:16px;
	}
	.uni-cell-top{
		margin-top:8px;
	}
</style>
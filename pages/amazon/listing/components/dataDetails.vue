<template>
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="order-wrap">
				<view class="uni-flex uni-row-center uni-between cell-b-16">
					<text class="uni-h5 font-bold">数据详情</text>
					<uni-icons
					 @click="closePop"
					 type="closeempty" size="16"></uni-icons>
				</view>
			   <view class="title  uni-flex uni-row-center">
			   	<uni-icons type="smallcircle-filled" size="10" color="#ff7315"></uni-icons>
			   		<text class="cell-l-8"> 销售数据</text>
			   </view>
			   <uni-row>
				   <uni-col :span="8">
					   <text class="uni-h6">日均销量</text>
					   <view class="data">{{util.nullValueTran(row.averageSalesDay)}}</view>
				   </uni-col>
				   <uni-col :span="8">
					   <text class="uni-h6">七天销量</text>
					   <view class="data">{{util.nullValueTran(row.sumweek)}}</view>
				   </uni-col>
				   <uni-col :span="8">
					   <text class="uni-h6">三十日销量</text>
					   <view class="data">{{util.nullValueTran(row.summonth)}}</view>
				   </uni-col>
			   </uni-row>
			   <view class="item">
			   <uni-row >
				   <uni-col :span="8">
					   <text class="uni-h6">销售排名</text>
					   <view class="data">{{util.nullValueTran(row.rank)}}</view>
				   </uni-col>
				   <uni-col :span="8">
					   <text class="uni-h6">七日访问量</text>
					   <view class="data">{{util.nullValueTran(row.sessions)}} </view>
				   </uni-col>
				   <uni-col :span="8">
					   <text class="uni-h6">七日转化率</text>
					   <view class="data">{{formatFloat(row.sessionrate)}}%</view>
				   </uni-col>
			   </uni-row>
			   </view>
			   <view class="item">
			   <uni-row >
				   <uni-col :span="8">
					   <text class="uni-h6">购物车比例</text>
					   <view class="data">{{util.nullValueTran(row.buybox)}}%</view>
				   </uni-col>
				   <uni-col :span="8">
					   <text class="uni-h6">可售库存</text>
					   <view class="data">{{util.nullValueTran(row.fulfillmentAvailability)}} </view>
				   </uni-col>
				   <uni-col :span="8">
					   <text class="uni-h6">可售天数</text>
					   <view class="data">
					   <text >
					   	{{util.nullValueTran(row.dayfulfilla)}}
					   </text>
					   <text v-if="row.dayinbound">
					      +{{row.dayinbound}}
					   </text>
					  </view>
				   </uni-col>
			   </uni-row>
			   </view>
			   <view class="title cell-t-32 uni-flex uni-row-center">
			   	<uni-icons type="smallcircle-filled" size="10" color="#ff7315"></uni-icons>
			   		<text class="cell-l-8">  近七天广告数据</text>
			   </view>
			   <uni-row>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">IMPR</text>
			   					   <view class="data">{{util.nullValueTran(row.advimpr)}}</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">CTR</text>
			   					   <view class="data">{{util.nullValueTran(row.advctr*100)}}%</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">CLICKS</text>
			   					   <view class="data">{{util.nullValueTran(row.advclick)}}</view>
			   				   </uni-col>
			   </uni-row>
			   <view class="item">
			   <uni-row>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">CPC</text>
			   					   <view class="data">{{util.nullValueTran(row.advcpc)}}</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">Sale_Order</text>
			   					   <view class="data">{{util.nullValueTran(row.advsales)}}</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">CR</text>
			   					   <view class="data">{{util.nullValueTran(row.advspc*100)}}%</view>
			   				   </uni-col>
			   </uni-row>
			</view>
			   <view class="item">
			   <uni-row>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">SPEND</text>
			   					   <view class="data">{{util.nullValueTran(row.advspend)}}</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">ACOS</text>
			   					   <view class="data">{{util.nullValueTran(row.advacos*100)}}%</view>
			   				   </uni-col>
							   <uni-col :span="8">
								   <text class="uni-h6">广告费</text>
								   <view class="data">{{row.landedCurrency}}{{util.nullValueTran(row.advspend)}}</view>
							   </uni-col>
			   </uni-row>
			</view>
			<view class="title cell-t-32 uni-flex uni-row-center">
				<uni-icons type="smallcircle-filled" size="10" color="#ff7315"></uni-icons>
					<text class="cell-l-8"> 近七成本利润</text>
			</view>
			<uni-row>
							   <uni-col :span="8">
								   <text class="uni-h6">利润率</text>
								   <view class="data">{{util.nullValueTran(row.prorate)}}%</view>
							   </uni-col>
							   <uni-col :span="8">
								   <text class="uni-h6">利润</text>
								   <view class="data"> {{row.landedCurrency}}{{formatFloat(row.profits)}} </view>
							   </uni-col>
							   <uni-col :span="8">
								   <text class="uni-h6">ACOAS</text>
								   <view class="data">{{formatFloat(row.acoas*100)}}%</view>
							   </uni-col>
			</uni-row>
			<view class="item">
			   <uni-row>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">净利润率</text>
			   					   <view class="data">{{formatFloat(row.proprate*100)}}%</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">净利润</text>
			   					   <view class="data">{{row.landedCurrency}}{{formatFloat(row.profitall)}}</view>
			   				   </uni-col>
			   				   <uni-col :span="8">
			   					   <text class="uni-h6">其它成本</text>
			   					   <view class="data">{{util.nullValueTran(row.othercost)}}</view>
			   				   </uni-col>
			   </uni-row>
			</view>
			</view>
		</uni-popup>
</template>

<script setup>
	import { computed, nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import util from '@/utils/util.js';
	import {formatFloat} from '@/utils/util.js';
	const props=defineProps({
		row:{},
	})
	const {row,}=toRefs(props)
	const state = reactive({
	}); 
	const {
	} = toRefs(state);
	
	function getData(){

	}


 
	const popup=ref();
	function openPop(type){
		popup.value.open(type)
		nextTick(()=>{
			getData()
		})
	}
	function closePop(){
		popup.value.close()
	}


	 defineExpose({
		  openPop,closePop,
	   })
</script>

<style scoped>
	.cell-t-32{
		margin-top:32px;
	}
	.item{
		margin-top:16px;
	}
	.title{
		margin-bottom:16px;
	}
	.data{
		font-weight:500;
		margin-top: 4px;
	}
    .order-wrap{
		width:calc(100vw - 48px);
		padding:24px
	}
	.cell-b-16{
		margin-bottom:16px;
	}
   .remarks-list{
	   height:calc(100vh - 260px);
   }
</style>
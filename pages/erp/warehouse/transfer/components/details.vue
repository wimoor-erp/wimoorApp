<template>
	<uni-card class="n-shadow" margin="8px 16px">
		<uni-steps :options="stepList" :active="active" />
	</uni-card>
	<uni-card class="n-shadow" margin="8px 16px">
		<view class="uni-h5 font-bold cell-b-8">调库商品</view>
		<view class="uni-list-product" v-for="item in productData">
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else  src="/static/empty/noimage40.png" ></image>
			<view class="uni-flex-item">
				<view class="uni-h4">{{item.sku}}</view>
				<view class="uni-h6 text-omit-1">{{item.name}}</view>
				<view class="uni-flex uni-between cell-t-8 cell-b-8">
				<view class="ListNum">{{item.amount}}<text>调库数</text></view>
					<uni-tag :circle="true" @click="item.invDetails=!item.invDetails" :inverted="true" text="库存详情" />
				</view>
				<view class=" uni-flex uni-between " v-if="item?.invDetails">
					<view class="ListBox uni-flex-item  cell-r-8">
						<view class="uni-h7 cell-b-8">调出仓</view>
						<view class="uni-flex uni-between">
							<view class="cell-r-8">
								<view>{{item.from_warehouse_inbound}}</view>
								<text class="uni-h7">待入</text>
							</view>
							<view class="cell-r-8">
								<view>{{item.from_warehouse_fulfillable}}</view>
								<text class="uni-h7">可用</text>
							</view>
							<view>
								<view>{{item.from_warehouse_outbound}}</view>
								<text class="uni-h7">待出</text>
							</view>
						</view>
					</view>
					<view class="ListBox uni-flex-item">
						<view class="uni-h7 cell-b-8">调入仓</view>
						<view class="uni-flex uni-between">
							<view class="cell-r-8">
								<view>{{item.to_warehouse_inbound}}</view>
								<text class="uni-h7">待入</text>
							</view>
							<view class="cell-r-8">
								<view>{{item.to_warehouse_fulfillable}}</view>
								<text class="uni-h7">可用</text>
							</view>
							<view>
								<view>{{item.to_warehouse_outbound}}</view>
								<text class="uni-h7">待出</text>
							</view>
						</view>
					</view>
					
				</view>
			</view>
			<view>
				
			</view>
		</view>
	</uni-card>
 <uni-card class="n-shadow" margin="8px 16px" >
	 			<template v-slot:title>
					<uni-list>
						<view class="uni-order-header uni-flex uni-between">
							<view class=" uni-flex uni-row-center">
								<text class="cell-l-8">{{orderForm.number}}</text>
							</view>
							<text class="text-orange" v-show="orderForm.auditstatus===0">未提交</text>
							<text class="text-orange" v-show="orderForm.auditstatus===1">待审核</text>
							<text class="uni-text-gray" v-show="orderForm.auditstatus===2">配货中</text>
							<text class="uni-text-gray" v-show="orderForm.auditstatus===3">已发货</text>
							<text class="text-green" v-show="orderForm.auditstatus===4">已完成</text>
							<text class="uni-text-gray" v-show="orderForm.auditstatus===5">已驳回</text>
						</view>
					</uni-list>
				</template>
				<view class="cell-list">
					<view class="uni-flex uni-between">
						<text>调出仓库</text>
						<text>{{orderForm.fromwarehouse}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>调入仓库</text>
						<text>{{orderForm.towarehouse}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>申请人</text>
						<text>{{orderForm.creator}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>申请时间</text>
						<text>{{orderForm.opttime}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>操作类型</text>
						<text>{{orderForm.ftypeName}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>预计到货日期</text>
						<text>{{orderForm.arrivalTime}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>备注</text>
						<text>{{orderForm.remark}}</text>
					</view>
				</view>
	 		</uni-card>
			<view class="uni-affix-box">
				<view class="uni-flex  uni-affix">
					<view class="cell-8">
						<button   class="uni-flex-item" @click="handleRevoke">撤销</button>
						</view>
				</view>
				</view>
				<uni-popup ref="popRef" type="dialog">
				  <uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" title="提示" content="确认撤销单据吗?" @confirm="Confirm"
						></uni-popup-dialog>
				  </uni-popup>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,} from 'vue';
	import dispatchApi from '@/api/erp/inventory/dispatchApi.js';
	import {onLoad} from "@dcloudio/uni-app";
	const popRef =ref();
	const state=reactive({
		stepList:[{
					title: '创建'
				}, {
					title: '审核'
				}, 
				{
					title: '配货中'
				}, 
				{
					title: '已发货'
				}, 
				{
					title: '完成'
				}, ],
				active:0,
				orderId:'',
				productData:[],
				orderForm:[],
	})
	const{
		stepList,
		active,
		orderId,
		productData,
		orderForm,
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
		dispatchApi.getData({"id":id}).then(res=>{
			if(res){
				state.productData = res.dispatchFormEntryList;
                state.orderForm = res.warehouseform;
			}
		})

	}
	
	function handleRevoke(){
		popRef.value.open()
	}
	function Confirm(){
		dispatchApi.examine({"ids":state.orderId,"status":orderForm.auditstatus}).then((res)=>{
			  if(res){
				  uni.showToast({
				  	title:'撤销成功！',
				  	icon:'success',
				  	duration:2000
				  });
				  load();
			  }else{
				 uni.showToast({
				 	title:'操作失败！',
				 	icon:'error',
				 	duration:2000
				 });
			  }})
	}
</script>

<style scoped>
	.ListNum{
		font-weight: bold;
		color:#f86300;
		margin-top:8px;
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
		background-color: #f5f5f5;
		padding:8px;
		border-radius: 4px;
	}
	.uni-order-header{
			margin:16px 0px;
		}
	.cell-list .uni-flex{
		margin-top: 8px;
		font-size:12px;
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
</style>
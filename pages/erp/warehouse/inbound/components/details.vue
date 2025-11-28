<template>

	<uni-card class="n-shadow" margin="8px 12px" >
		<view class="uni-list-product" v-for="item in productList" >
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			<view class=" uni-flex-item">
				<view class="uni-flex uni-between">
				<view class="cell-r-8">
				<view class="uni-h4">{{item.sku}}</view>
				<view class="uni-h6 text-omit-1">{{item.name}}</view>
				</view>
				<view class="uni-right">
					<view class=" ">{{item.fulfillable}}</view>
					<view class="uni-h6 cell-t-4 " style="white-space:nowrap">库存</view>
				</view>
				</view>
				<view class="uni-flex uni-between uni-row-center cell-t-8">
					<view><text class="uni-h7">入库 </text><text class="uni-h4"> {{item.amount}}</text></view>
					<view >
						<ShelfPop :optType="0" :warehouseid="formData.warehouseid" :itemForm="item"/>
					</view>
				</view>
			</view>
		</view>
	</uni-card>
	<uni-card class="n-shadow cell-list" margin="8px 12px" >
		<view class="uni-flex uni-between">
			<text class="uni-h6">单据编码</text>
			<text class="text-black">{{formData.number}}</text>
		</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">入库仓库</text>
			<text class="text-black">{{formData.warehouse}}</text>
		</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">入库申请人</text>
			<text class="text-black">{{formData.creator}}</text>
		</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">入库时间</text>
			<text class="text-black">{{formData.opttime}}</text>
		</view>
	</uni-card>
	<uni-card class="n-shadow " margin="8px 12px" padding="16px 12px">
		<view class="uni-flex uni-between">
			<text class="uni-h6" style="width: 72px;margin-right:16px;">订单备注</text>
			<view class="text-black">{{formData.remark}}</view>
		</view>
		</uni-card>
</template>

<script setup>
	import inApi from '@/api/erp/inventory/inApi.js';
	import ShelfPop from '@/pages/erp/warehouse/shelf/components/shelfPop.vue'
	import {onMounted, reactive, toRefs,ref}from"vue"
	import {onLoad} from "@dcloudio/uni-app";
	const state=reactive({
		orderId:'',
		productList:[],
		formData:{
			number:'',
		},
		})
	const {
		orderId,
		productList,
		formData,
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
		inApi.getData({"id":id}).then((res)=>{
			if(res){
				state.productList = res.inFormEntryList
				state.formData=res.warehouseform
			}
		});
	}

</script>

<style scoped>

	.card-title{
		margin-bottom:8px;
		color: #333;
		font-weight: 700;
	}
	.uni-list-product{
		padding-top:16px;
		padding-bottom: 16px;
	}
	.cell-list view{
		padding-top:8px;
         padding-bottom: 8px;
	}

</style>
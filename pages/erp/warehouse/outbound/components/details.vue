<template>
	<uni-card class="n-shadow" margin="8px 12px" >
		<view class="uni-list-product " v-for="item in productList" >
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			<view class="isfull">
				<view class="uni-flex uni-between">
			<view class=" uni-flex-item ">
				<view class="uni-h4">{{item.sku}}</view>
				<view class="uni-h6 text-omit-1">{{item.name}}</view>
			</view>
			<view class="uni-right">
				<text class="uni-h6">库存</text>
				<view class="cell-t-4 ">{{item.fulfillable}}</view>
			</view>
			</view>
			<view class="uni-flex uni-between uni-row-center cell-t-8 isfull">
				<view><text class="uni-h7">出库 </text><text class="uni-h4"> {{item.amount}}</text></view>
				<view >
					<ShelfPop :optType="1" :warehouseid="formData.warehouseid" :itemForm="item"/>
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
			<text class="uni-h6">出库仓库</text>
			<text class="text-black">{{formData.warehouse}}</text>
		</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">出库申请人</text>
			<text class="text-black">{{formData.creator}}</text>
		</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">出库时间</text>
			<text class="text-black">{{formData.opttime}}</text>
		</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6" style="width: 72px;">备注</text>
			<text class="text-black">{{formData.remark}}</text>
		</view>
	</uni-card>
</template>

<script setup>
	import outApi from '@/api/erp/inventory/outApi.js';
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
		outApi.getData({"id":id}).then((res)=>{
			if(res){
				state.productList = res.outFormEntryList
				state.formData=res.warehouseform
			}
		});
	}

</script>

<style scoped>
	
	.isfull{
       flex:1;
	}
	.uni-list-product{
		padding-top:16px;
		padding-bottom: 16px;
	}
	.cell-list view{
		padding-top:4px;
         padding-bottom: 4px;
	}

</style>
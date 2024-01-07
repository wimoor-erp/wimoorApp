<template>
    <uni-card class="n-shadow " margin="8px" v-for="item in productList">
		<uni-row>
           <uni-col :span="24">
			<view class="uni-flex">
				<view class="images">
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			</view>
			<view>
			<view class="uni-flex uni-between cell-b-8 uni-row-center">
			<view class="uni-h4 ">{{item.fromsku}}</view>
			<text class="uni-6">库存:{{item.fromfulfillable}}</text>
			</view>
			<view class="uni-h6 text-omit-1">{{item.fromname}}</view>
			</view>
			</view>
		</uni-col>
		</uni-row>
		<uni-row>
			<uni-col :span="5">
				<view class="uni-flex uni-between uni-column">
				<view class="  arrow-v " v-for="item in 3">
				<text class="icon-youjiantou-lanse iconfont "></text>
				</view>
				</view>
			</uni-col>
			<uni-col :span="19">
				<view class="markbox-wrap uni-flex uni-between">
					<text>
						<text class="icon-tuihuo iconfont cell-r-8" style="color: #ff7315;"></text>
						调库数量</text>
					<view class="font-bold text-black">{{item.amount}}</view>
				</view>
			</uni-col>
		</uni-row>
		<uni-row>
			<uni-col :span="24">
				<view class="uni-flex">
				<view class="images">
				<image v-if="item.image" :src="item.image" ></image>
				<image v-else src="/static/empty/noimage40.png" ></image>
				</view>
				<view>
					<view class="uni-flex uni-between cell-b-8 uni-row-center">
				<view class="uni-h4 ">{{item.sku}}</view>
				<text class="uni-6">库存:{{item.fulfillable}}</text>
				</view>
				<view class="uni-h6 text-omit-1">{{item.name}}</view>
				</view>
				</view>
			</uni-col>
		</uni-row>
	</uni-card>	
	<uni-card class="n-shadow cell-list" margin="8px" >
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
		<view class="uni-flex uni-between">
			<text class="uni-h6" style="width: 72px;">备注</text>
			<text class="text-black">{{formData.remark}}</text>
		</view>
	</uni-card>
</template>

<script setup>
	import changeApi from '@/api/erp/inventory/changeApi.js';
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
		changeApi.getData({"id":id}).then((res)=>{
			if(res){
				console.log(res)
				state.productList = res.formEntryList
				state.formData=res.warehouseform
			}
		});
	}

</script>

<style scoped>
	.cell-list .uni-flex{
		margin-top:12px;
		margin-bottom:12px;
	}
	.images uni-image,.images image{
		width:60px;
		height:60px;
		border-radius: 4px;
		margin-right:12px;
	}
.arrow-v{
		transform: rotate(90deg);
		text-align: center;
		line-height:20px;
		width:58px;
		color: #ff7315;
	}
	.arrow-v .iconfont{
		font-size:10px;
	}
	.markbox-wrap{
		background-color: rgba(255, 136, 0, 0.05);
		border:1px solid #ff7315;
		border-radius: 4px;
		padding: 12px;
		margin-top:8px;
	}
</style>
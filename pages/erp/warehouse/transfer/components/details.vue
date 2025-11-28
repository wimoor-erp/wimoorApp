<template>
	<uni-card class="n-shadow" margin="8px 12px">
		<uni-steps :options="stepList" :active="active" />
	</uni-card>
	<uni-card class="n-shadow" margin="8px 12px">
		<view class="uni-list-product" v-for="item in productData">
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else  src="/static/empty/noimage40.png" ></image>
			<view class="uni-flex-item">
				<view class="uni-flex uni-between">
					<view class="cell-r-16">
				<view class="uni-h4">{{item.sku}}</view>
				<view class="uni-h6 text-omit-1">{{item.name}}</view>
				</view>
				<view class="uni-right">
				<view class="ListNum">{{item.amount}}</view>
				<text class="uni-h7">调库数</text></view>
				</view>
				<view class="uni-flex-end uni-flex cell-t-8 cell-b-8">
					<view class="cell-r-8">
					<button @click="handlePrint(item)"  type="default" size="mini">
					 打印单据
					</button></view>
					<view>
					<button @click="item.invDetails=!item.invDetails"  type="primary" size="mini">
					 库存详情
					</button></view>
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
								<view>{{item.to_warehouse_inbound||0}}</view>
								<text class="uni-h7">待入</text>
							</view>
							<view class="cell-r-8">
								<view>{{item.to_warehouse_fulfillable||0}}</view>
								<text class="uni-h7">可用</text>
							</view>
							<view>
								<view>{{item.to_warehouse_outbound||0}}</view>
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
 <uni-card class="n-shadow" margin="8px 12px" >
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
					<view class="cell-8 uni-flex">
						<view>
						<button v-if="orderForm.auditstatus<=3" type="primary"  plain @click="handleRevoke(4,'done')">直接完成</button>
						</view>
						<view>
							<button v-if="orderForm.auditstatus!=5 && orderForm.auditstatus!=0"  @click.stop="handleRevoke(orderForm.auditstatus,'back')">
								<text v-if="orderForm.auditstatus==1">驳回</text>
								<text v-if="orderForm.auditstatus==2||orderForm.auditstatus==3">取消</text>
								<text v-if="orderForm.auditstatus==4">撤销</text>
							</button>
							</view>
							<button v-if="orderForm.auditstatus==0" type="" @click="gotoeditForm">编辑</button>
							<button v-if="orderForm.auditstatus<=3" type="primary" @click="handleRevoke(orderForm.auditstatus,'submit')">
								<text v-if="orderForm.auditstatus==0">提交</text>
								<text v-if="orderForm.auditstatus==1">通过</text>
								<text v-if="orderForm.auditstatus==2">发货</text>
								<text v-if="orderForm.auditstatus==3">收货</text>
							</button>
					</view>
				</view>
				</view>
				<PrintPop ref="printRef"></PrintPop>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,} from 'vue';
	import dispatchApi from '@/api/erp/inventory/dispatchApi.js';
	import PrintPop from "@/pages/erp/purchase/components/printPop.vue";
	import {onLoad} from "@dcloudio/uni-app";
	const printRef=ref();
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
				console.log(res)
				state.active = res.warehouseform.auditstatus;
				state.productData = res.dispatchFormEntryList;
                state.orderForm = res.warehouseform;
			}
		})

	}
	function handlePrint(item){
		var form = state.orderForm;
		item = {
			...item,
			...form,
		}
		printRef.value.openPop("rec-dis",null,item);
	}
	
	
	function handleRevoke(status,ftype){
		//状态的回滚和提交操作
		var titleStr="";
		var title="";
		if(ftype=="back"){
			if(status==1){
				titleStr="您确认要驳回该调库单吗？";
				title="驳回调库单";
				status=5;
			}else if(status==2){
				titleStr="您确认要取消该调库单吗？";
				title="取消调库单";
				status=5;
			}else if(status==3){
				titleStr="您确认要取消该调库单吗？";
				title="取消调库单";
				status=5;
			}else if(status==4){
				titleStr="您确认要撤销该调库单吗？";
				title="撤销调库单";
				status=5;
			} 
		}
		if(ftype=="submit"){
			if(status==0){
				titleStr="您确认要提交该调库单吗？";
				title="提交调库单";
				status=1;
			}else if(status==1){
				titleStr="您确认要通过该调库单吗？";
				title="通过调库单";
				status=2;
			}else if(status==2){
				titleStr="您确认要发货出库吗？";
				title="发货调库单";
				status=3;
			}else if(status==3){
				titleStr="请确认您已收到所有货物？";
				title="收货调库单";
				status=4;
			} 
		}
		if(ftype=="done"){
			titleStr="您确定要直接完成发货单吗？";
			title="完成调库单";
			status=4;
		}
		uni.showModal({
		   title: title,
		   content: titleStr,
		   success: function (res) {
		   		if (res.confirm){
		   			dispatchApi.examine({"ids":state.orderId,"status":status}).then((res)=>{
		   					    	  if(res){
		   					    		  uni.showToast({
		   					    		 	title:'操作成功！',
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
		   					    	  }
		   			 });
		   		} else if (res.cancel){
		   			uni.showToast({
		   				title:'取消操作！',
		   				icon:'success',
		   				duration:2000
		   			});
		   		}
		   	}
		
		   })
		
	}
	
</script>

<style scoped>
	.uni-flex-end{
		justify-content: end;
	}
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
			margin:12px;
		}
	.cell-list .uni-flex{
		margin-top: 8px;
		font-size:14px;
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
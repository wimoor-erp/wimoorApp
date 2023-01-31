<template>
	<view>
		<view class="banner" >
			<view style="margin-bottom: 10rpx;">
			</view>
			<view >
				<view style="width:20%;float: left;">
					 <picker  @change="onchange" mode=selector :value="index"   :range="items" >
						<view class="uni-input mydropdown" >{{items[index]}}</view> 
					</picker>   
				</view>
				<view style="width:60%;float: left;padding-top: 3rpx;padding-left: 10rpx;">
					<uni-easyinput v-model="search" :styles="styles" :placeholderStyle="placeholderStyle" suffixIcon="loop" @iconClick="refreshtab" placeholder="请输入内容自动查询" @input="input"></uni-easyinput>
				 </view>
				<view style="width:10%;float: left;padding-top: 7rpx;">
					<uni-icons @click="scanHandler" color="#FFA400"  type="scan" style="padding-left: 12px;" size="28"></uni-icons>
				</view>
             </view>
		</view>
		<view class="uni-list" >
			<block v-for="(value, index) in listData" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goDetail(value)">
					<view class="uni-media-list">
						<image @click.stop="goMaterialInfoPage(value.materialid)" class="uni-media-list-logo" :src="value.image"></image>
						<view class="uni-media-list-body"  >
							<view class="uni-media-list-text-top">SKU:{{ value.sku }} 
								<block v-if="value.issfg=='1'">
									<text class='light-font'>(组)</text>
								</block>
							</view>
							<view class="uni-media-list-text-bottom">
								<text><text class="light-font">数量:</text><text style="color: #000000;">{{value.amount}}</text></text> 
								<text><text class="light-font">状态:</text>{{statusFuc(value.auditstatus)}}</text>
							</view>
							<view>
							<text class="light-font">预计到货日期:</text>{{deliverydateFuc(value.deliverydate)}}
							</view>
							<view>
							<text  class="light-font">付款状态:</text>{{paystatusFuc(value.paystatus)}}
							</view>
							<view>
								<text class="light-font">供应商:</text>{{suppliernameFuc(value.suppliername)}}
							</view>
							<view @click.stop="searchOrder(value.number)">
								<text  class="light-font">采购订单号:</text>{{value.number}} 
								<uni-icons color="#787878"  type="search" size="12"></uni-icons>
							</view>
							<view class="uni-media-list-text-bottom">
								<text>{{ value.creatorname }}</text>
								<text>{{ value.createdate }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
				<!-- <view class="ad-view" v-if="(index > 0 && (index+1) % 10 == 0)">
					<ad :adpid="adpid" @error="aderror"></ad>
				</view> -->
				<!-- #endif -->
			</block>
		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>

	import purchaseApi from '@/api/erp/purchase/purchase.js'
	export default {
		data() {
			return {
				search:'',
				placeholderStyle: "color:#ffa400;font-size:14px",
				styles: {
						color: '#ffa400',
						borderColor: '#ffa400'
				},
				listData: [],
				last_id: '',
				reload: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				ftype:'sku',
				offset:1,
				index: 0,
				items: ["SKU","订单号","运单号"],
				values:["sku", "order", "logistics"],
			};
		},
		onLoad() {
			this.getList();
		},
		onPullDownRefresh() {
			this.reload = true;
			this.last_id = '';
			this.getList();
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		methods: {
			searchOrder(order){
				this.listData=[];
				this.offset=1;
				this.reload=true;
				this.search=order;
				this.index=1;
				this.ftype="order";
				this.getList();
			},
			suppliernameFuc(value){
				if(value==undefined || value==null || value==''){
					return '--';
				}else{
					return value;
				}
			},
			paystatusFuc(value){
				if(value=='1' || value==1){
					return '已付款';
				}else{
					return '未付款';
				}
			},
			deliverydateFuc(value){
				if(value!=null && value !=undefined && value!=''){
					return value.split(" ")[0];
				}else{
					return '--';
				}
			},
			statusFuc(value){
				if(value==0 || value=='0'){
					return '已退回';
				}else if(value==1 || value=='1'){
					return '待审核';
				}else if(value==2 || value=='2'){
					return '执行中';
				}else if(value==3 || value=='3'){
					return '已完成';
				}
			},
			refreshtab(){
			   this.offset=1;
			   this.search='';
			   this.ftype='sku';
			   this.index=0;
			   this.reload=true;
			   this.getList();
			},
			scanHandler(){
				// 允许从相机和相册扫码
				var self=this;
				uni.scanCode({
					success: function (res) {
						if(res.result){
							self.listData=[];
							self.offset=1;
							self.index=2;
							self.ftype='logistics';
							self.reload=true;
							self.search=res.result;
							self.getList();
						}
					}
				});
			},
			 onchange(e) {
				 this.index = e.detail.value
				 this.ftype=this.values[ this.index];
				 this.listData=[];
				 this.offset=1;
				 this.reload=true;
				 this.getList();
			},
 
			 input(e) {
				 this.listData=[];
				 this.offset=1;
				 this.reload=true;
			 	 this.search=e;
				 this.getList();
			},
			getList() {
				if (this.last_id) {
					//说明已有数据，目前处于上拉加载
					this.status = 'loading';
				}

	     purchaseApi.list({ sort:'sku',
							 order:'desc',
							 offset: this.offset,
							 limit: 10,
							 auditstatus:'4',
							 ftype:this.ftype,
							 datetype:'createdate',
							 search:this.search,
							 minid:this.last_id
							 }).then(data => {
									if(data&&data.records&&data.records.length>0){
										let list = data.records;
										if(list.length>0){
											this.listData = this.reload ? list : this.listData.concat(list);
											this.last_id = list[list.length - 1].id;
											this.reload = false;
											if(list.length<10){
												this.status = 'nomore';
											}
											this.offset=this.offset+1;
										}else{
											this.status = 'nomore';
											this.reload = false;
										}
									}else{
										this.status = 'nomore';
										this.reload = false;
									}
								 

				});


			},
			goMaterialInfoPage(mid){
				uni.navigateTo({
					url:'../material/material?materialid='+mid
				})
			},
			goDetail: function(row) {
				uni.navigateTo({
					//跳转至 货物退收页面
					url:'./receive?detailData='+ encodeURIComponent(JSON.stringify(row)),
				});
			},
	 
			aderror(e) {
				
			}
		}
	};
</script>

<style>
	.banner {
		height: auto;
		overflow: hidden;
		position: relative;
		background-color: #FFFFFF;
		border-bottom: 1px solid #CCCCCC;
		padding: 10rpx;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		color: white;
		z-index: 11;
	}

	.uni-media-list-logo {
		padding-top:20px;
		width: 180rpx;
		height: 180rpx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;

	}

	.uni-media-list-text-top {
		height: auto;
		font-size: 12px;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.mydropdown{
		margin-top:1px;
		border:#CCCCCC solid 1px;
		padding-top:5px;
		padding-bottom:4px;
		border-radius:4px;
		background:#f5f5f5;
	}
</style>

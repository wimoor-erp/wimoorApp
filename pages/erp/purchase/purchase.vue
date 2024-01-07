<template>

	<view>
		   <view class="filter-head">
			<view  class="uni-flex uni-row  uni-row-center">
					 <picker  @change="onchange" mode=selector :value="index"   :range="items" >
						 <view class="uni-text-picker-w picker-border">
						 <view class="uni-flex uni-between">
						<text  >{{items[index]}}</text> 
						<text class="icon-xiala iconfont"></text>
						</view>
						</view>
					</picker>   
				<view style="margin-left:8px;margin-right:8px;width:100%">
					<uni-easyinput v-model="search"  suffixIcon="loop" @iconClick="refreshtab" placeholder="请输入内容自动查询" @input="input"></uni-easyinput>
				 </view>
					<uni-icons @click="scanHandler" color="#ff7315"  type="scan" style="padding-left:8px;" size="28"></uni-icons>
             </view>
		<view class="uni-flex uni-between m-t-8">
						 <view class="uni-select-group">
							 <Warehouse  @changeData="warehouseChange"></Warehouse>
							 <Status class="cell-l-8" @changeState="statusChange"></Status>
						 </view>
						<SearchHeader ref="searchheaderRef" class="uni-flex">
						   <view class="form-box">
						   <uni-forms ref="baseForm" >
								<uni-forms-item label="日期范围"  >
									<Datepicker @changedate="changedate" :unlimited='unlimited' :clearIcon="true" :iswidth="false" :days="1" />
								</uni-forms-item>
								<uni-forms-item label="产品名称"  >
									<uni-easyinput v-model="name"   placeholder="请输入" />
								</uni-forms-item>
							</uni-forms>
							<button class="searchbtn" type="primary" @click="doHandlerQuery">查询</button>
							</view>
						</SearchHeader>
		</view>
		</view>
		<view  >
			<block v-for="(value, index) in listData" :key="index">
					<view class="uni-media-list" @click="goDetail(value)">
						<view class="isfull">
							<view class="uni-flex uni-between order-header">
								<view class="uni-h6 ">
								创建日期: {{ deliverydateFuc(value.createdate) }}
								</view>
								<text class="order-state-text">{{statusFuc(value.auditstatus)}}</text>
							</view>
						<view class="uni-flex uni-row isfull">
						<image v-if="value.image" @click.stop="goMaterialInfoPage(value.materialid)" class="uni-media-list-logo" :src="value.image"></image>
						<image v-else src="/static/empty/noimage40.png" class="uni-media-list-logo"></image>
						<view class="uni-media-list-body"  >
							<view class="uni-flex uni-between  isfull cell-bottom">
						  <view class="uni-flex-item">	
							<view class="uni-flex uni-row-center ">
							<text class="uni-sku">{{ value.sku }}</text>
								&nbsp;
							<text v-if="value.issfg==='1'"  class='light-font'>(组)</text>
							</view>
							<view class="uni-h6 cell-bottom-4">{{value.warehousename}}</view>
							<text  class="tag-blue-plain tag-small">{{paystatusFuc(value.paystatus)}}</text>
							</view>
							<view class="light-font"><view class="uni-orange-data">{{value.amount}}</view>数量</view>
							</view>
							</view>
							</view>
							<view class="uni-flex uni-between">
								<view class="uni-h6  ">
									供应商 
									<view class="text-black m-t-8">{{suppliernameFuc(value.suppliername)}}</view>
								</view>
								<view class="uni-h6 ">
								创建人
								<view class="text-black m-t-8">{{ value.creatorname }}</view>
								</view>
								<view class="uni-h6 ">
								预计到货日期
								<view class="text-black m-t-8">{{deliverydateFuc(value.deliverydate)}}</view>
								</view>
							</view>
							<view class="uni-order-footer isfull uni-between uni-flex uni-row-center">
									<view @click.stop="searchOrder(value.number)" class="uni-h6 uni-flex uni-flex-item ">
										<text >订单号:  {{value.number}} </text>
										<uni-icons color="#999"  type="search" size="16"></uni-icons>
									</view>
									<button  type="primary" size="mini">货物退收</button>
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
    import SearchHeader from "@/components/searchheader/base.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import Status from "./components/status.vue"
	import Datepicker from "@/components/header/datepicker.vue"
	import purchaseApi from '@/api/erp/purchase/purchase.js'
	export default {
		components:{Warehouse,SearchHeader,Status,Datepicker},
		data() {
			return {
				search:'',
				listData: [],
				last_id: '',
				reload: false,
				auditstatus:"4",
				warehouse:"",
				name:"",
				datetype:"createdate",
				fromDate:"",
				toDate:"",
				mydate:'',
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
				unlimited:true,
			};
		},
		onShow() {
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
				this.index=0;
				this.ftype="sku";
				this.getList();
			},
			warehouseChange(val){
				this.warehouse=val;
				this.searchOrder(this.search);
			},
			doHandlerQuery(){
				this.$refs["searchheaderRef"].closePop();
				this.searchOrder(this.search);
			},
			statusChange(val){
				this.auditstatus=val;
				if(val==='1'||val==='4'){
					this.unlimited=true
					this.fromDate='';
					this.toDate="";
				}else{
				   this.unlimited=false
				   this.fromDate = this.mydate[0];
				   this.toDate = this.mydate[1]+" 23:59:59";
				}
				this.searchOrder(this.search);
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
			changedate(date){
				if(date){
					this.mydate = date
					this.fromDate = date[0];
					this.toDate = date[1]+" 23:59:59";
				}
			},
			statusFuc(value){
				if(value==0 || value=='0'){
					return '已退回';
				}else if(value==1 || value=='1'){
					return '待审核';
				}else if(value==2 || value=='2'){
					return '处理中';
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
         if(this.auditstatus=="4"){
			 this.toDate="";
		 }
	     purchaseApi.list({ sort:'sku',
							 order:'desc',
							 currentpage: this.offset,
							 pagesize: 10,
							 auditstatus:this.auditstatus,
							 ftype:this.ftype,
							 datetype:'createdate',
							 search:this.search,
							 toDate:this.toDate,
							 fromDate:this.fromDate,
							 warehouseid:this.warehouse,
							 name:this.name,
							 minid:this.last_id
							 }).then(data => {
									if(data&&data.records&&data.records.length>0){
										const list = data.records;
										console.log(list)
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
	.cell-bottom{
		margin-bottom:16px;
	}
	.cell-bottom-4{
		margin-bottom:4px;
	}
    .filter-head{
		padding:8px 16px;
		background:#fff;
	}
	.form-box{
		padding:24px 16px;
	}
	.banner-img {
		width: 100%;
	}
	.m-t-8{
		margin-top:8px;
	}
.uni-select-group{
	display: flex;
}
uni-picker+uni-picker{
	margin-left:8px;
}
.uni-media-list{
	background-color: #fff;
	margin:8px 16px;
	width:auto!important;
	border-radius:6px;
}
	.uni-media-list-logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 4px;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;

	}
	.order-state-text{
		font-size:12px; 
		color:#999;
	}
.cell-right-16{
	margin-right:16px;
}
.order-header{
	padding-bottom:8px;
	margin-bottom:8px;
	border-bottom:1px solid #eee;
}
.uni-order-footer{
	padding-top:8px;
	margin-top:8px;
	border-top:1px solid #eee;
}
	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>

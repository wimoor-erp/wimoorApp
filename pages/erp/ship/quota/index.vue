<template>
		<view class="uni-bg-orange-tran padding-t">
			<uni-section type="line">
				<uni-card class="n-shadow" :title="shipmentid" :sub-title="createdate" :extra="auditime" margin="0px 16px">
					<view class="uni-body">
						<view class="uni-flex uni-row">
							<view class="flex-item mar-right ">
								<uni-section padding>
									<uni-steps :options="warehouseList" active-color="#ff7315" :active="active"
										direction="column" />
								</uni-section>
							</view>
							<view class="flex-item  data-mar">
								<view class='uni-num'><text>SKU数量:</text>{{quotaoderData.skuamount}}</view>
								<view class="uni-num"><text>发货数量:</text>{{quotaoderData.sumQuantity}}</view>
							</view>
						</view>
					</view>
				</uni-card>
			</uni-section>
		</view>
		<uni-card margin="8px 16px" class="n-shadow">
			<uni-icons type="compose" size="16"></uni-icons><text>备注</text>
			<view class="uni-h6">{{quotaoderData.remark}}</view>
		</uni-card>
		<uni-card v-for="(item,index) in productListData" :key="index" class="n-shadow" margin="8px 16px" padding="12px 8px">
			<ShelfProduct 
			:id="item.id" 
			:item="item" 
			:warehouseid="quotaoderData.warehouseid" 
			:itemid="item.id" 
			:isAssemblyItem="false" 
			@afterSave="getquotaData"></ShelfProduct>
			<!-- 子产品内容 -->
		<view v-if="item.issfg == 1&&item.assemblyList.length>0">	
		    <view class="wcollapse uni-center " @click="changeItemShow(item)">
			<text>子产品</text>	
			 <uni-icons v-if="item.asshow" color="#999" type="top" size="16"></uni-icons>
			 <uni-icons v-else type="bottom" color="#999" size="16"></uni-icons>
			 </view>
			<view :index="index" title="子产品"  v-show="item.asshow" border="false">
				<view class="content" v-for="(subproData,subindex) in item.assemblyList" :key="subindex">
					 <ShelfProduct 
					 :id="subproData.id" 
					 :item="subproData" 
					 :itemid="item.id" 
					 :warehouseid="quotaoderData.warehouseid" 
					 :isAssemblyItem="true" 
					 @afterSave="getquotaData">
					 </ShelfProduct>
				</view>
			</view>
	      </view>		
		</uni-card>
</template>

<script>
	import util from "@/utils/util.js"
	import quotaApi from '@/api/erp/ship/quotaApi.js'
	import ShelfProduct from './components/shelfproduct.vue'
	import UniCollapseItem from '@/uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue'
	import UniCollapse from '@/uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue'
	import UniSteps from '@/uni_modules/uni-steps/components/uni-steps/uni-steps.vue'
	export default {
		components:{
			  ShelfProduct,UniCollapseItem,UniCollapse,UniSteps
		  },
		data() {
			return {
				shipmentid: '',
				createdate: "-",
				auditime: "-",
				active: 2,
				warehouseList: [{
					title: '暂无数据',
					desc: '发货仓库'
				}, {
					title: '暂无数据',
					desc: '目的仓库'
				}],
				productListData: [],
				quotaoderData: {},
			}
		},
		onLoad(query) {
			if (query.q) {
				const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容
				const scancode_time = parseInt(query.scancode_time) // 获取用户扫码时间 UNIX 时间戳
				if (q) {
					this.shipmentid = q.split("wxsc/")[1];
				}
			} else {
				try {
					this.shipmentid =query.shipmentid; 
				} catch (error) {
					//this.data = JSON.parse(payload);
				}
			}
			/* this.getShipFromListData(); */
		},
		onShow(){this.getquotaData(); },
		methods: {
			changeItemShow(item){
				if(item.asshow){
					item.asshow=false;
				}else{
					item.asshow=true;
				}
			},
			getquotaData: function() {  
				this.productListData=[];
				quotaApi.getQuotainfo(this.shipmentid).then(data => {
					if (data){
						this.quotaoderData = data
						this.shipmentid = data.shipmentid
						this.createdate = "创建于" + util.dateFormat(data.createdate)
						this.auditime = util.dateFormat(data.auditime) + "审核"
						this.warehouseList[0].title = data.warehouse
						this.warehouseList[1].title = data.groupname + "-" + data.country + "(" + data.center + ")"
						//产品列表
						this.productListData = data.itemList
						if(this.productListData){
							this.productListData.forEach(item=>{
								item.asshow=false;
							})
						}
						
					}
				})

			}
		}
	}
</script>

<style scoped>
	.padding-t{
		padding-top:8px;
	}
	.radio radio {
		transform: scale(0.7);
	}
.content{
	border-top: 1px solid #eee;
	background-color: #f5f5f5;
	margin-top:8px;
	padding-bottom:8px;
	padding-left:8px;
	padding-top:8px;
}
	.uni-data-checklist .checklist-group .checklist-box {
		margin-right: 0px !important;
	}
	.uni-collapse-item__title-text {
		flex: 1;
		font-size: 22rpx !important;
	}

	.uni-collapse-item__title.uni-collapse-item-border {
		border-top: 1px solid #ebeef5;
	}

	.uni-collapse-item__title-box {
		height: 32px !important;
	}

	.nui-ju-between {
		justify-content: space-between;
		margin: 4px 0;
	}

	.pro-list {
		font-size: 24rpx;
		margin-top: 16px;
		margin-bottom: 8px;
	}

	.pro-list .name {
		padding-top: 4px;
		line-height: 1.2;
		font-size: 24rpx;
		margin-bottom: 8px;
		color: #2a2a2a;
	}

	.pro-list .size text {
		margin-right: 4px;
		margin-left: 4px;
	}

	.pro-list .shelf {
		margin-bottom: 8px;
		margin-top: 8px;
	}

	.pro-list .shelf .uni-table-td,
	.pro-list .shelf .uni-table-th {
		font-size: 22rpx !important;
		padding: 2px 4px;
	}

	.pro-list .size {
		color: #bbb
	}

	.pro-list .text-blue {
		margin-right: 8px;
	}

	.pro-list .text-orange {
		font-size: 32rpx;
		font-weight: 600;
		margin-right: 4px;
	}

	.pro-list .num {
		font-size: 22rpx;
		color: #ffaa00;
		margin-right: 16px;
	}

	.nui-ve-center {
		display: flex;
		align-items: center;
	}

	.nui-pr-image {
		height: 56px;
		width: 56px;
		margin-right: 8px;
		border-radius: 4px;
	}

	.data-mar .uni-num {
		margin-top: 4px;
		font-size: 12px;
		margin-left: 24px;
	}

	.data-mar .uni-num text {
		color: #999
	}



	.mar-right {
		margin-right: 8px;
	}
	.wcollapse{
		border-top:solid #eee 1px ;
		padding-top:8px;
		margin-top:8px;
		
	}
	.uni-bg-orange-tran{
		    background-image: linear-gradient(rgba(255,103,0,1),rgba(255,103,0,0));
			background-color: inherit;
	}
</style>

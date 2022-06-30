<template>
	<view class="uni-flex uni-row pro-list">
		<view class="flex-item " >
			<cover-image @click="goMaterialInfoPage(item.materialid)" class="nui-pr-image" :src="item.image"></cover-image>
		</view>
		<view class="flex-item">
			<view class="name" v-if="isAssemblyItem==false">{{item.name}}</view>
			<view class="name" v-else>{{item.mname}}</view>
			<view class="sku">
				<view>SKU:<text class="text-blue">{{item.sku}}</text>
					<view v-if="isAssemblyItem==false">平台SKU:{{item.sellersku}}</view>
					<view v-if="isAssemblyItem==false">FNSKU:{{item.fnsku}}</view>
				</view>
			</view> 
			<view class="size">
				箱规:<text>{{item.boxnum}}个每箱 </text> | <text v-if="item.boxlength">
					{{item.boxlength}}*{{item.boxwidth}}*{{item.boxheight}}cm</text>
				<text v-else>-</text>
				| <text v-if="item.boxweight">{{item.boxweight}}kg</text>
				<text v-else>-</text> 
			</view>
			<view class="shelf" v-if="needshow(item.shelfInvList)">
				<radio-group @change="radioChange">
					<uni-table border emptyText="暂无数据">
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="left" width="10"></uni-th>
							<uni-th align="left" width="190">库位</uni-th>
							<uni-th align="left" width="50">库存</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr  v-for="(shelfInvList,index) in item.shelfInvList" :key="index">
							<uni-td>
								<label class="radio">
									<radio color="#FF6700" :value="index"
										:checked="getChecked(index,item.shelfInvList)" />
								</label>
							</uni-td>
							<uni-td>{{shelfInvList.shelfname}}</uni-td>
							<uni-td>{{shelfInvList.quantity}}</uni-td>
						</uni-tr>
					
					</uni-table>
				</radio-group>
			</view>
			<view><text class="text-orange ">{{item.quantity}}</text>
				<text v-if="isAssemblyItem==false" class="num">拟发货</text>
				<text v-if="isAssemblyItem==false">可用库存:{{item.invquantity}}</text>
				<text v-else>可用库存:{{item.fulfillable}}</text>
			</view>
			<view class="uni-flex  uni-row nui-ju-between" v-if="needshow(item.shelfInvList)">
				<view class="flex-item">
					<uni-number-box :min="0" @change="offshelfValChange" :max="maxShelfNum(item.shelfInvList)"
						:value="getoffShelfNum(item.quantity,item.shelfInvList)" />
				</view>
				<view class="flex-item">
					<button @click="()=>subShelfNum(item.shelfInvList)" type="primary"
						size="mini">下架</button>
				</view>
			</view> 
		</view>
	</view>
</template>

<script>
	import quotaApi from '@/api/erp/ship/quotaApi.js'
	export default {
		props: ['item', 'isAssemblyItem'],
 
		data() {
			return {
				current: -1,
				offShelfNum: -1,
				shelfListData: [],
				shipmentid: '',
				createdate: "-",
				auditime: "-",
				shelfid:"",
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
           this.offShelfNum=-1;
		},
		methods: {
			getChecked(index, list) {
				let needcurrent = "";
				if (this.current == -1) {
					list.forEach((item, mindex) =>{
						if (item.quantity > 0) {
							this.current = mindex;
							this.shelfid=item.shelfid;
						}
					});
				   if(this.current==-1){
					   this.current=0;
					   this.shelfid=list[0].shelfid;
				   }
				}
                return this.current==index;
			},
			goMaterialInfoPage(mid){
				uni.navigateTo({
					url:'../../material/material?materialid='+mid
				})
			},
			needshow(list) {
				  if(list&&list.length>0){
					  for(let i=0;i<list.length;i++){
						  if (list[i]&&list[i].quantity > 0) {
						  	 return true;
						  }
					  }
				  }
				  return false;
			},
			getoffShelfNum(val, arr) {
				let num = 0
				arr.forEach((item, index) => {
					if (this.current == index) {
						if (val <= parseInt(item.quantity)) {
							num = val
							return
						} else {
							num = parseInt(item.quantity)
						}
					}
				});
				if(this.offShelfNum==-1){
					 this.offShelfNum=num;
				}
				console.log("getoffShelfNum",this.offShelfNum,num);
				return num
			},
			getshelfid(val, a) {
				  
				return val
			},
			maxShelfNum(shelfList) {
				let num = 0
				shelfList.forEach((item, index) => {
					if (this.current == index) {
						if(item.quantity){
						    num = parseInt(item.quantity)
						}else{
							num=0;
						}
					}
				})
				return num
			},
			//下架操作
			subShelfNum(shelfList) {
				let arr = [];
				let obj = {};
				let node=shelfList[this.current];
				obj.materialid = node.materialid;
				obj.shelfid = node.shelfid;
				//多个库位时，获取选中的库位的id
				obj.quantity = this.offShelfNum;
				obj.opt = 0
				arr.push(obj);
				let that=this;
				
				quotaApi.subShelfInventory(arr).then(data => {
						uni.showToast({
							title: '下架成功！',
							icon: 'none',
							duration: 2000 
						});
						let node=shelfList[that.current];
						node.quantity=node.quantity-that.offShelfNum;
						//that.$emit('afterSave',arr);
				})
			},
			//下架数量变化时
			offshelfValChange(val) {
				this.offShelfNum = val;
			},
			//选中的库位变化值
			radioChange(val) {
			    this.current=val.detail.value;
			},


		}
	}
</script>

<style>
</style>

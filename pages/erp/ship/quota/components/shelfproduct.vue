<template>
	<view class="uni-flex uni-row pro-list">
		<view class="flex-item " >
			<image v-if="item.image"
			class="nui-pr-image" @click="handleScale(item.image)" :src="item.image"></image>
			<image v-else  class="nui-pr-image" 
			src="/static/empty/noimage40.png"></image>
		</view>
		<view class="flex-item">
			<view class="name"  @click="goMaterialInfoPage(item)"  v-if="isAssemblyItem==false">{{item.name}}</view>
			<view class="name "  @click="goMaterialInfoPage(item)"  v-else>{{item.mname}}</view>
			<view class="sku cell-t-8 cell-b-8">
				    <view v-if="isAssemblyItem==false" class="text-blue" @click="goHuoJia(item.materialid)">SKU: {{item.sku}}</view>
					 <view v-else class="text-blue " @click="goHuoJia(item.submid)">SKU:{{item.sku}}</view>
					<view class="cell-t-8 uni-h6" v-if="isAssemblyItem==false">平台SKU:{{item.sellersku||item.extendInfo.sellersku}}</view>
					<view class="cell-t-8 uni-h6" v-if="isAssemblyItem==false">FNSKU:{{item.fnsku}}</view>
			</view > 
			<view class="uni-h6 cell-b-8">
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
							<uni-th align="left" max-width="190">库位</uni-th>
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
			<view class="uni-flex uni-between cell-t-8">
			<view class="uni-flex">
				<view>
				<text v-if="isAssemblyItem==false"  class="text-orange uni-h5 font-bold">{{item.quantity||item.amount}}</text>
				<view v-if="isAssemblyItem==false" class="uni-h6">拟发货</view>
				</view>
				<view>
				<text v-if="isAssemblyItem==true"  class="text-orange uni-h5 font-bold">{{item.subamount}}</text>
				<view v-if="isAssemblyItem==true" class="uni-h6">对应需求量</view>
				</view>
				<view v-if="isAssemblyItem==false" class="uni-h6 cell-l-8"><view><text class="uni-h5">{{item.invquantity||item.fulfillable}}</text></view>可用库存</view>
				<view v-else class="uni-h6 cell-l-8"><view><text class="uni-h5">{{item.fulfillable}}</text></view>可用库存</view>
			</view>
			<view class="uni-flex  uni-row nui-ju-between" v-if="needshow(item.shelfInvList)">
				<view class="flex-item">
					 <input		  
					  class="myNumInput" 
					  type="number" 
					  v-if="isAssemblyItem==false"
					 @input="offshelfValChange"  placeholder="输入下架数量" 
					 :value="getoffShelfNum(item.quantity,item.shelfInvList)"
					 />
					 <input
					  class="myNumInput" 
					  type="number" 
					  v-else
					 @input="offshelfValChange"  placeholder="输入下架数量" 
					 :value="getoffShelfNum(item.subamount,item.shelfInvList)"
					 />
				</view>
				<view class="flex-item">
					<button @click="()=>subShelfNum(item.shelfInvList)" type="primary"
						size="mini">下架</button>
				</view>
			</view> 
			</view>
			<view class="shelf" v-if="item.shelfInvRecordList">
					<uni-table border emptyText="暂无操作记录">
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="left" width="150">操作信息 (已下架:{{sumin}}) </uni-th>
							<uni-th align="left" width="100">操作数量 </uni-th>
					 
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr  v-for="(recItem,index) in item.shelfInvRecordList" :key="index">
							<uni-td>
							<view style="padding:0px;margin-top:-8px">货架：{{recItem.shelfname}}</view>
							<view class="light-font" style="padding:0px;margin-top:-8px"> {{recItem.opttime}}</view>
							</uni-td>
							<uni-td>
							<text class="light-font" v-if="recItem.opt==0">
								下架:
							</text>
							<text class="light-font" v-else>
								上架:
							</text>
							  {{recItem.quantity}}</uni-td>
						</uni-tr>
					</uni-table>
			</view>
		</view>
	</view>
	<ImageScale ref="imageRef">
		<image class="imagewidth" :src="item.image"></image>
	</ImageScale>
</template>

<script>
	import quotaApi from '@/api/erp/ship/quotaApi.js'
	import ImageScale from"./imageScale.vue"
	export default {
		props: ['item',"itemid", 'isAssemblyItem','warehouseid'],
		components:{ ImageScale },
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
				sumin:0,
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
			goMaterialInfoPage(item){
			    if(this.$props.isAssemblyItem==true){
					uni.navigateTo({url:'../../material/material?materialid='+item.mainmid})
				}else{
					uni.navigateTo({url:'../../material/material?materialid='+item.materialid})
				}
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
			getoffShelfNum(val, arr,type) {
				let num = 0
				let value=val;
				if(this.$props.item.shelfInvRecordList){
					var sum=0;
					this.$props.item.shelfInvRecordList.forEach(item=>{
						if(item.opt==0){
						    sum=sum+parseInt(item.quantity);
						}else{
							sum=sum-+parseInt(item.quantity);
						}
					});
					this.sumin=sum;
					if(sum){
						value=value-sum;
					}
				}
				arr.forEach((item, index) => {
					if (this.current == index) {
						if (value <= parseInt(item.quantity)) {
							num = value;
						} else { 
							num = parseInt(item.quantity)
						}
					}
				});
				if(this.offShelfNum==-1||type=="change"){
					 this.offShelfNum=num;
				}
				 
				return num
			},
			goHuoJia(materialid){
				var detail={'materialid':materialid,'warehouseid':''};
				    detail.warehouseid=this.$props.warehouseid;
					detail.formid=this.$props.itemid;
					detail.formtype="outstockform";
					detail.opttype="outstockform";
				let node=this.$props.item;
				var amount=0;
				if(this.$props.isAssemblyItem==true){
					amount=this.getoffShelfNum(node.subamount,this.$props.item.shelfInvList,"change");
				}else{
					amount=this.getoffShelfNum(node.quantity,this.$props.item.shelfInvList,"change");
				}
				if(amount<0){
					detail.amount=amount*-1;
				}
			    var detailUrl=	encodeURIComponent(JSON.stringify(detail));
				uni.navigateTo({
					"url": '/pages/erp/warehouse/shelf/index?detailData=' +detailUrl
					
				})
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
				obj.warehouseid=node.warehouseid;
				//多个库位时，获取选中的库位的id
				obj.formid=this.$props.itemid;
				obj.formtype="outstockform";
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
						var record={opttime:"" ,shelfname:"",quantity:""};
						record.opttime=new Date().format("yyyy-MM-dd hh:mm:ss");
						record.shelfname=node.shelfname;
						record.quantity=that.offShelfNum;
						record.opt=0;
						if(that.$props.item.shelfInvRecordList){
							that.$props.item.shelfInvRecordList.push(record);
						}else{
							that.$props.item.shelfInvRecordList=[record];
						}
					    
						//that.$emit('afterSave',arr);
				})
			},
			//下架数量变化时
			offshelfValChange(e) {
				this.offShelfNum = e.detail.value;
			},
			//选中的库位变化值
			radioChange(val) {
			    this.current=val.detail.value;
				let node=this.$props.item.shelfInvList[this.current];
				this.getoffShelfNum(node.quantity,this.$props.item.shelfInvList,"change");
			},
			
           handleScale(){
			   this.$refs["imageRef"].openPop()
		   }

		}
	}
</script>

<style>
	 .myNumInput{
	 	border: 1px solid #eee;border-radius: 4px;width: 60px;
	 	margin-right:4px;
		padding:3px;
	 }
	 .flex-item .name{
		 word-break: break-all; 
		 font-size: 12px;
		 line-height: 1.5em;
	 }
	 .pro-list img,.pro-list .nui-pr-image{
		width:60px;
		 height:60px;
		 margin-right:8px;
		 border-radius: 4px;
	 }
	 .imagewidth{
		transform:scale(1.2)
	 }
</style>

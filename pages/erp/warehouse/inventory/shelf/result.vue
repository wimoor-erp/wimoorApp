<template>
	<view class="uni-center result-box">
		<uni-icons type="checkbox-filled" color="#00aa00" size="60"></uni-icons>
		<view >{{opttitle}}成功!</view>
			<button type="default"
			 @click="goShelfPage()" 
			 class="cell-button"  plain="true">返回货架页面</button>
	</view>
	<uni-card class="n-shadow" margin="8px 16px">
    <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
	</uni-card>
     <view v-for="(row,index) in list"  >
		 <uni-card  :id="index" class="n-shadow" margin="8px 16px">
		 	 <view class="uni-flex uni-row myrow">
		   <view class="flex-item ">
						<image 
						v-if="row.material.picture"
						class="uni-media-list-logo" 
						:src="row.material.picture.location"></image>
					</view>
		   <view class="flex-item" style="flex: 1;">
						<view class="uni-flex uni-column">
									<view> <text class='uni-h5 font-bold'>{{row.material.sku}}</text> </view>
									<view class="flex-item flex-item-V text-omit-1">
										 <text  >{{row.material.name}}</text>
									</view>
										<view  class='light-font cell-t-8'>{{opttitle}}时间：{{row.opttime}}</view>
										<view class="uni-flex uni-row uni-between cell-t-8">
											<view>
											 <text class="text-orange font-bold" >{{row.quantity}}</text> 
											 <view  class='light-font'>{{opttitle}}数量</view>
											</view>
											<view v-if="index==0">
											 <text class="text-orange font-bold" >{{row.shelfInventory.quantity}}</text> 
											 <view class='light-font'>库存</view>
											</view>
												
											<view>
											 <text class="text-orange font-bold" >{{row.balanceQty}}</text> 
											 <view  class='light-font'>结余库存</view>
											</view>
										</view>
						 </view>
					</view>
	           </view>
	 
</uni-card>
</view>
</template>
<script>
	import ShelfHead from "./components/shelfHead.vue"
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	export default {
		components:{
			  ShelfHead
		  },
		data() {
			return {
				search:'',
				placeholderStyle: "color:#dedede;font-size:14px",
				styles: {
						color: '#000',
						borderColor: '#eee'
				},
				tabclassAct:'flex-item text-center activetab',
				tabclassNor:'flex-item text-center',
				shelfid:'',
				addressnum:'',
				shelftreepath:'',
				list:[],
				addressid:'',
				amount:'',
				opttitle:"",
				isall:true,
				data:{},
				materialid:'',
				formid:'',
				formtype:'direct',
			}

		},
		onLoad(event) {
			var self=this;
			if(event){
				// TODO 后面把参数名替换成 payload
				const payload = event.detailData || event.payload;
				// 目前在某些平台参数会被主动 decode，暂时这样处理。
				try {
					let data = JSON.parse(decodeURIComponent(payload));
					this.data = data;
					this.addressnum=data.addressnum;
					this.shelftreepath=data.shelftreepath;
					this.materialid=data.materialid;
					this.shelfid=this.data.shelfid;
					this.amount=this.data.amount;
					this.formid=this.data.formid;
					if(this.data.ftype=="sub"){
						this.opttitle="下架";
					}else{
						this.opttitle="上架";
					}
					if(this.data.formtype){
						this.formtype=this.data.formtype;
					}
					
				} catch (error) {
					 this.data = JSON.parse(payload);
					 this.addressnum=this.data.addressnum;
					 this.shelftreepath=this.data.shelftreepath;
					 this.shelfid=this.data.shelfid;
					 this.materialid=data.materialid;
					 this.amount=this.data.amount;
					 this.formid=this.data.formid;
					 if(this.data.ftype=="sub"){
					 	this.opttitle="下架";
					 }else{
					 	this.opttitle="上架";
					 }
					 if(this.data.formtype){
					 	this.formtype=this.data.formtype;
					 }
				}
				
				setTimeout(function(){
				   self.$refs.myhead.getInfo(self.addressnum,self.shelftreepath,self.shelfid);
				},300);
			}
		},
 
		methods:{
			infoLoad(head){
				this.addressid=head.addressid;
				this.shelfid=head.id;
			    var self=this;
				warehouseApi.shelfInventoryOptRecord({
													"formid":this.formid,
													"formtype":this.formtype,
													"shelfid":this.shelfid}
												).then((data)=>{
													self.list=data;
												});
			},
			goShelfPage(){
				uni.navigateBack({
					delta:2,
				})
			}
		}
	}

</script>

<style>
	.hide{
		display: none;
	}
	.activetab{
		border-bottom: 2px solid #ffa400;
	}
	.result-box{
		margin-top:24px;
		margin-bottom:24px;
	}
	.cell-button{
		margin:16px 60px;
	}
</style>

<template>
	<uni-card>
    <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
	</uni-card>
	<view style="padding-left:20px;">{{opttitle}}操作成功</view>
     <view v-for="(row,index) in list"  >
		 <uni-card  :id="index">
		 	 <view class="uni-flex uni-row myrow">
		   <view class="flex-item ">
						<image 
						v-if="row.material.picture"
						@click="goMaterialInfoPage(row.materialid)" 
						class="uni-media-list-logo" 
						:src="row.material.picture.location"></image>
					</view>
		   <view class="flex-item" style="flex: 1;">
						<view class="uni-flex uni-column">
										<view class="flex-item flex-item-V productname">
											 <text  >{{row.material.name}}</text>
										</view>
										<view class="flex-item flex-item-V ">
											<view> <text class='light-font'>SKU:{{row.material.sku}}</text> </view>
											<view style="padding-right:20px;" class='light-font'>操作时间：{{row.opttime}}</view>
										</view>
									
										<view class="flex-item flex-item-V flex-between-row">
											<view>
											 <text class="text-orange" style="font-weight: bolder;">{{row.quantity}}</text> 
											 <text style="padding-left:5px;padding-right:10px;font-size: 10px !important;" class='light-font'>操作数量</text>
											</view>
											<view v-if="index==0">
											 <text class="text-orange" style="font-weight: bolder;">{{row.shelfInventory.quantity}}</text> 
											 <text style="padding-left:5px;padding-right:10px;font-size: 10px !important;" class='light-font'>库存</text>
											</view>
												
											<view>
											 <text class="text-orange" style="font-weight: bolder;">{{row.balanceQty}}</text> 
											 <text style="padding-left:5px;padding-right:10px;font-size: 10px !important;" class='light-font'>结余库存</text>
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
		}
	}

</script>

<style>
	.hide{
		display: none;
	}
	.text-bord{
		font-weight: bolder;
	}
	.activetab{
		border-bottom: 2px solid #ffa400;
	}
	.productname{
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
			width:270px;
	}
	.flex-between-row{
		justify-content: space-between;
		flex-direction: row;
		display: flex;
	}
</style>

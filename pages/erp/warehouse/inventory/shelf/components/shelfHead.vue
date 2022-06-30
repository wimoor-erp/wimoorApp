<template>
	<view>
		<view class="uni-container uni-flex uni-row" style="padding: 20px;background: #fff;">
			<view style="border-radius: 6px;border: 1px solid #6AA1FF;background: #6AA1FF;color: #eee;padding: 12px;width: 5%;" class="flex-item text-center">
				 {{data.startname}}
			</view>
			<view style="width: 95%;padding-left: 12px;" class="flex-item">
				<view class="text-bord">{{data.summary.warehousename}}-{{data.numbername}}</view>
				<view class="light-font" style="padding-top: 8px;">规格:{{data.length}}X{{data.width}}X{{data.height}}cm</view>
			</view>
		</view>
		 
		<view class="uni-container uni-flex uni-row" style="padding-left: 20px;padding-top: 10px;background: #fff;padding-bottom: 10px;">
			<view class="flex-item text-center" style="width: 33.3%;">
				 <view class="text-bord"> {{data.summary.skunum}}</view>
				<view class="light-font">SKU个数</view>
			</view>
			<view class="flex-item text-center" style="width: 33.3%;">
				<view class="text-bord">{{data.usesize}}%</view>
				<view class="light-font">已用容量</view>
			</view>
			<view class="flex-item text-center" style="width: 33.3%;">
				<view class="text-bord text-orange">{{data.expnumber}}</view>
				<view class="light-font">待处理</view>
			</view>
		</view>
	</view>
</template>

<script> 
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	export default {
		props: ['shelfid'],
		data() {
			return {
				data: {startname:'',usesize:'',expnumber:'',length:'',width:'',height:'',numbername:'',
				       summary:{warehousename:'',skunum:''}},
				}
			},
		onLoad(query) {
			
		},
		methods:{
			getInfo(shelfid){
				let that=this;
				 warehouseApi.getShelfInfo({'shelfid':shelfid}).then((data)=>{
					   if(data){
							that.data =data; 
							if(data.summary&&data.summary.warehousename){
									that.data.startname=data.summary.warehousename.substr(0,1);
							}
						
							that.data.numbername=data.number+''+data.name;
							that.$emit("onload",data);
						   }else{
							   that.$emit("onload",{});
						   }
				});
			}
		}
	}
			
</script>

<style>
</style>
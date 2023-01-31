<template>
	<view>
		<view class="uni-container uni-flex uni-row" style="padding: 20px;background: #fff;">
			<view style="border-radius: 6px;border: 1px solid #6AA1FF;background: #6AA1FF;color: #eee;padding: 12px;width: 5%;" class="flex-item text-center">
				 {{data.startname}}
			</view>
			<view style="width: 90%;padding-left: 12px;" class="flex-item">
				<view class="text-bord">{{data.summary.warehousename}}-{{data.numbername}}</view>
				<view class="light-font" style="padding-top: 8px;">规格:{{data.length}}X{{data.width}}X{{data.height}}cm</view>
			</view>
			<view style="width: 5%;padding-left: 12px;" class="flex-item ">
			   <uni-icons @click="loadData" type="loop" color="#5e6d82" size="24"></uni-icons>
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
				<view class="text-bord text-green" v-if="data.summary.quantity">{{data.summary.quantity}}</view>
				<view class="text-bord text-green" v-else>0</view>  
				<view class="light-font">库存个数</view>
			</view>
		</view>
	</view>
</template>

<script> 
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	import UniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
	export default {
		props: ['shelfid'],
		components:{
			 UniIcons
		  },
		data() {
			return {
				data: {startname:'',usesize:'',expnumber:'',length:'',width:'',height:'',numbername:'',
				       summary:{warehousename:'',skunum:''},
					   },
				addressnum:'',
				shelftreepath:'',
				shelfid:'',
			    }
			},
		onLoad(query) {
			
		},
		methods:{
			getInfo(addressnum,shelftreepath,shelfid){
				if(!shelfid){
					this.shelfid=''
				}else{
					this.shelfid=shelfid;
				}
				this.addressnum=addressnum;
				this.shelftreepath=shelftreepath;
				this.loadData();
			},
			loadData(){
				let that=this;
				warehouseApi.getShelfInfo({
				'shelfid':this.shelfid,
				'addressnum':this.addressnum,
				'shelftreepath':this.shelftreepath}).then((data)=>{
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
			},
		}
	}
			
</script>

<style>
</style>
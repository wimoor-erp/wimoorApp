<template>
	<view>
		<view class="uni-container uni-flex uni-row cell-t-8" >
			<view  class="shelf-image">
				 {{data.startname}}
			</view>
			<view  class="flex-item cell-l-8">
				<view class="uni-h5 font-bold">{{data.summary.warehousename}}-{{data.numbername}}</view>
				<view class="light-font" style="padding-top: 8px;">规格:{{data.length}}X{{data.width}}X{{data.height}}cm</view>
			</view>
			
		</view>
		 
		<view class=" uni-flex uni-between cell-t-24 cell-b-8" >
			<view class="uni-flex-item uni-center" >
				 <view class="uni-h5 font-bold"> {{data.summary.skunum}}</view>
				<view class="light-font">SKU个数</view>
			</view>
			<view class="uni-flex-item uni-center" >
				<view class="uni-h5 font-bold">{{data.usesize}}%</view>
				<view class="light-font">已用容量</view>
			</view>
			<view class="uni-flex-item uni-center" >
				<view class="uni-h5 font-bold" v-if="data.summary.quantity">{{data.summary.quantity}}</view>
				<view class="uni-h5 font-bold" v-else>0</view>  
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
	.shelf-image{
		border-radius:30px;
		background: #ff7315;
		color: #eee;
		font-weight: 700;
		width:44px;
		height:44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cell-t-24{
		margin-top:16px;
	}
</style>
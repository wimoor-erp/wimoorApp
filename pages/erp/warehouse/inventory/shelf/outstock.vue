<template>
	<view>
    <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
	<view>
	     <view class="uni-container" style="padding: 15px;background: #fff;margin-top: 10px;border-bottom:1px solid #eee;">
		   <uni-easyinput  type="text" v-model="search"   :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入SKU" @input="input" ></uni-easyinput>
		   <view class="light-font" style="font-size:8px !important;">拉到底才能全选所有产品</view>
		 </view>
	    <InvList ref="invlist" @submit="afterSubmit()" :editable="true"></InvList>
</view>
</view>
</template>
<script>
	import ShelfHead from "./components/shelfHead.vue"
	import InvList from "./components/invList.vue"
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	export default {
		components:{
			  ShelfHead,InvList
		  },
		data() {
			return {
				search:'',
				placeholderStyle: "color:#dedede;font-size:14px",
				styles: {
						color: '#000',
						borderColor: '#eee'
				},
				shelfid:'',
				warehouseid:'',
				isall:true,
			}

		},
		onLoad(event) {
			if(event){
				// TODO 后面把参数名替换成 payload
				const payload = event.detailDate || event.payload;
				// 目前在某些平台参数会被主动 decode，暂时这样处理。
				try {
					let data = JSON.parse(decodeURIComponent(payload));
					this.shelfid=data.shelfid;
					this.$refs.myhead.getInfo(this.shelfid);
				} catch (error) {
					 
				}
			}
		},
		methods:{
			infoLoad(head){
				this.warehouseid=head.warehouseid;
				this.refreshTable();
			},
			refreshTable(){
				this.$nextTick(()=>{
					this.$refs.invlist.refreshList(this.warehouseid,this.shelfid,this.search);
				 });
			},
			afterSubmit(){
				this.$refs.myhead.getInfo(this.shelfid);
			},
			input(e){
				this.search=e;
				this.refreshTable();
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
	.img-logo{
		width: 140rpx;
		height: 140rpx;
	}
	.newsku{
		font-size: 10px !important;
		float: right;background: #DFF3EA;padding: 0px;padding-left: 3px;padding-right: 3px;
	}
	.tabbar{
		display: flex;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		box-shadow: 0 -1px 1px rgba(100, 100, 100, .1);
		height: 15px;
		z-index: 999;
	}
</style>

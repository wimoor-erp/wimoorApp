<template>
	<view>
    <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
	<view>
	     <view class="uni-container" style="padding: 15px;background: #fff;margin-top: 10px;border-bottom:1px solid #eee;">
		   <uni-easyinput  type="text" v-model="search"   :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入SKU" @input="input" ></uni-easyinput>
		 </view>
	    <InvList ref="invlist" @submit="afterSubmit" :editable="true"></InvList>
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
				addressnum:'',
				shelftreepath:'',
				placeholderStyle: "color:#dedede;font-size:14px",
				styles: {
						color: '#000',
						borderColor: '#eee'
				},
				shelfid:'',
				addressid:'',
				materialid:'',
				amount:'',
				isall:true,
			}

		},
		onLoad(event) {
			if(event){
				// TODO 后面把参数名替换成 payload
				const payload = event.detailData || event.payload;
				// 目前在某些平台参数会被主动 decode，暂时这样处理。
				try {
					let data = JSON.parse(decodeURIComponent(payload));
					this.addressnum=data.addressnum;
					this.shelftreepath=data.shelftreepath;
					this.materialid=data.materialid;
					this.shelfid=data.shelfid;
					this.amount=data.amount;
				} catch (error) {
					 let data = payload;
					 this.addressnum=data.addressnum;
					 this.shelftreepath=data.shelftreepath;
					 this.materialid=data.materialid;
					 this.shelfid=data.shelfid;
					 this.amount=data.amount;
				}
			}
		},
		onShow() {
			  this.$refs.myhead.getInfo(this.addressnum,this.shelftreepath);
		},
		methods:{
			infoLoad(head){
				this.addressid=head.addressid;
				this.shelfid=head.id;
				this.refreshTable();
			},
			refreshTable(){
				this.$nextTick(()=>{
					this.$refs.invlist.refreshList(this.addressid,this.shelfid,this.search,this.materialid,this.amount);
				 });
			},
			afterSubmit(formid){
				let detail = {
					addressnum:this.addressnum,
					shelftreepath:this.shelftreepath,
					ftype:'sub',
					materialid:this.materialid,
					shelfid:this.shelfid,
					amount:this.amount,
					'formid':formid,
					'formtype':this.opttype,
				};
				uni.navigateTo({ 
					//跳转至 上下架页面
					url:'./result?detailData='+ encodeURIComponent(JSON.stringify(detail)),
				});
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
	.newsku{
		font-size: 10px !important;
		float: right;background: #DFF3EA;padding: 0px;padding-left: 3px;padding-right: 3px;
	}
 
</style>

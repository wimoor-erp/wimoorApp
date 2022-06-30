<template>
	<view>
    <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
	<view>
	     <view class="uni-container" style="padding: 15px;background: #fff;margin-top: 10px;border-bottom:1px solid #eee;">
		   <uni-easyinput  type="text" v-model="search"   :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入SKU" @input="input" ></uni-easyinput>
		 </view>
		<view class="uni-container uni-flex uni-row" style="background: #fff;padding-top:10px;padding-left:10px;">
				<view :class="tabclassAct" style="padding-bottom: 5px;" @click="changeWH">
					全部产品
				</view>
			    <view :class="tabclassNor" style="margin-left:20px;padding-bottom: 5px;" @click="changeINV">
				   库位产品
			     </view>
			<view class="light-font" style="font-size: 10px !important;margin-left: 50px;">拉到底才能全选所有产品</view>
		</view>
	         <view v-if="isall">
				<WhsList ref="whslist" @submit="afterSubmit">test</WhsList>
			 </view>
			 <view v-if="!isall">
			 	<InvList ref="invlist" :editable="false"></InvList>
			 </view>
</view>
</view>
</template>
<script>
	import ShelfHead from "./components/shelfHead.vue"
	import InvList from "./components/invList.vue"
	import WhsList from "./components/whsList.vue" 
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	export default {
		components:{
			  ShelfHead,WhsList,InvList
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
				if(this.tabclassAct=="flex-item text-center activetab"){
				   this.$nextTick(()=>{
				         this.$refs.whslist.refreshList(this.warehouseid,this.shelfid,this.search);
				   });
				}else{
					this.$nextTick(()=>{
				     	this.$refs.invlist.refreshList(this.warehouseid,this.shelfid,this.search);
					 });
				}
			},
			changeINV(){
				this.tabclassAct='flex-item text-center';
				this.tabclassNor='flex-item text-center activetab';
				this.isall=false;
			    this.refreshTable();
			},
			changeWH(){
				this.tabclassNor='flex-item text-center';
				this.tabclassAct='flex-item text-center activetab';
				this.isall=true;
				this.refreshTable();
			},
			afterSubmit(){
				this.tabclassAct='flex-item text-center';
				this.tabclassNor='flex-item text-center activetab';
				this.isall=false;
				console.log("afterSubmit")
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

</style>

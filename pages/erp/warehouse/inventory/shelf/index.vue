<template>
<view class="uni-container">
	 <uni-card is-full>
      <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
	</uni-card>
	<view style="font-size:22px;padding-top:20px;" class='light-font'>请选择操作类型:
	</view>
	<view style="padding-top: 10px;">
			<view class="uni-flex uni-column">
				  <view class="flex-item flex-item-V productname">
					<button class="itembtn-left" @click="openAddUrl" v-if="!opttype||opttype=='direct'" >
						上架
					</button>
					<button class="itembtn-right" @click="openSubUrl" v-if="!opttype||opttype=='direct'" >
						下架
					</button>
			</view>
		</view>
	</view>
	<uni-card is-full>
		<InvList ref="invlist" :editable="false"></InvList>
	</uni-card>
</view>
</template>

<script>
	import ShelfHead from "./components/shelfHead.vue"
	import InvList from "./components/invListAll.vue"
	export default {
		data() {
			return {
				shelftreepath:'',
				addressnum:'',
				shelfid:'',
				materialid:'',
				amount:'',
				formid:'',
				opttype:'',
				data:{},
			}
		},
		components:{
			  ShelfHead,InvList
		  },
		onLoad(query) {
			var self=this;
			if(query.q){
				const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容
				const scancode_time = parseInt(query.scancode_time) // 获取用户扫码时间 UNIX 时间戳
				if(q&&q.indexOf("ws/")>0){ 
						let param =q.split("ws/")[1];
						let params=param.split("/");
						this.addressnum=params[0];
						this.shelftreepath=params[1];
			     }
			  }else{
				    const payload = query.detailData || query.payload;
					
				try {
					this.data = JSON.parse(decodeURIComponent(payload));
					this.addressnum=this.data.addressnum;
					this.shelftreepath=this.data.shelftreepath;
					this.shelfid=this.data.shelfid;
					this.materialid=this.data.materialid;
					this.amount=this.data['amount'];
					this.formid=this.data['formid'];
					this.opttype=this.data['opttype'];
				} catch (error) {
					 this.data = JSON.parse(payload);
					 this.addressnum=this.data.addressnum;
					 this.shelftreepath=this.data.shelftreepath;
					 this.shelfid=this.data.shelfid;
					 this.materialid=this.data.materialid;
					 this.amount=this.data['amount'];
					 this.formid=this.data['formid'];
					 this.opttype=this.data['opttype'];
				}
				if(!this.opttype){
					this.opttype="direct";
				}
					
			}
			
			
		},
		onShow() {
			var self=this;
			setTimeout(function(){
			   self.$refs.myhead.getInfo(self.addressnum,self.shelftreepath,self.shelfid);
			   if(self.opttype=="purchase"||self.opttype=="outstockform"){
			   	self.openAddUrl();
			   	return ;
			   }
			   else if(self.opttype=="out"){
			   	self.openSubUrl();
			   	return ;
			   }
			},300);
		},
		methods:{
			infoLoad(head){
				this.addressid=head.addressid;
				this.shelfid=head.id;
				this.$refs.invlist.refreshList(this.addressid,this.shelfid,"",this.materialid);
			},
			openAddUrl(){
				let detail = {
					addressnum:this.addressnum,
					shelftreepath:this.shelftreepath,
					ftype:'add',
					materialid:this.data.materialid,
					shelfid:this.shelfid,
					amount:this.amount,
					formid:this.formid,
					opttype:this.opttype,
				};
				uni.navigateTo({
					//跳转至 上下架页面
					url:'./addstock?detailData='+ encodeURIComponent(JSON.stringify(detail)),
				});
			},
			openSubUrl(){
				let detail = {
					addressnum:this.addressnum,
					shelftreepath:this.shelftreepath,
					ftype:'sub',
					materialid:this.data.materialid,
					shelfid:this.shelfid,
					amount:this.amount,
					formid:this.formid,
					opttype:this.opttype,
				};
				uni.navigateTo({ 
					//跳转至 上下架页面
					url:'./outstock?detailData='+ encodeURIComponent(JSON.stringify(detail)),
				});
			}
			
		}
	
	}
	
</script>

<style>
	.flex-between-row{
		justify-content: space-between;
		flex-direction: row;
		display: flex;
	}
	.itembtn-left{
		margin-left: 20px;
		margin-right: 10px;
		margin-bottom:20px;
		background: #087e14;
		color: #fff;
		width:35%;
		float:left;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.itembtn-right{
		margin-left: 10px;
		margin-right: 20px;
		margin-bottom:20px;
		width:35%;
		background: #ffa400;
		color: #fff;
		float:right;
		padding-top: 10px;
		padding-bottom: 10px;
	}
</style>

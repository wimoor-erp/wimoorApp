<template>
<view class="uni-container">
	 <uni-card class="n-shadow" margin="8px 16px">
      <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad" ></ShelfHead> 
    </uni-card>
	<uni-card class="n-shadow"  margin="8px 16px" padding="0px">
		<template v-slot:title>
		  <view class="uni-flex uni-between uni-card-header">
			  <view class="uni-h5 font-bold">货架上产品</view>
			  <view class="font-bold" @click="handleUpdate">
				  <uni-icons  type="refreshempty" color="#999" size="20"></uni-icons>
			  </view>
		  </view>
		</template>
		<InvList ref="invlist" :editable="false"></InvList>
	</uni-card>
</view>
 <view class="uni-affix-box">
	<view class="uni-flex uni-column uni-affix">
		  <view class="uni-flex cell-8">
			<button  type="warn" class="uni-flex-item" @click="openAddUrl" v-if="!opttype||opttype=='direct'" >
				上架
			</button>
			<button  type="primary" class="uni-flex-item" @click="openSubUrl" v-if="!opttype||opttype=='direct'" >
				下架
			</button>
		</view>
	</view>
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
				addressid:'',
				amount:'',
				warehouseid:'',
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
					this.addressid=this.data.addressid;
					this.warehouseid=this.data.warehouseid;
					this.amount=this.data['amount'];
					this.formid=this.data['formid'];
					this.opttype=this.data['opttype'];
				} catch (error) {
					 this.data = JSON.parse(payload);
					 this.addressnum=this.data.addressnum;
					 this.shelftreepath=this.data.shelftreepath;
					 this.shelfid=this.data.shelfid;
					 this.addressid=this.data.addressid;
					 this.materialid=this.data.materialid;
					 this.warehouseid=this.data.warehouseid;
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
						addressid:this.addressid,
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
						addressid:this.addressid,
						amount:this.amount,
						formid:this.formid,
						opttype:this.opttype,
					};
					uni.navigateTo({ 
						//跳转至 上下架页面
						url:'./outstock?detailData='+ encodeURIComponent(JSON.stringify(detail)),
					});
			},
			handleUpdate(){
				this.$refs.myhead.loadData()
			}
			
		}
	
	}
	
</script>

<style scoped>
	.flex-between-row{
		justify-content: space-between;
		flex-direction: row;
		display: flex;
	}
	.cell-8{
		padding:16px;
	}
	button+button{
		margin-left:8px;
	}
	.uni-affix{
		background-image: linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1));
	}
	.uni-affix-box{
		height:60px;
	}
</style>

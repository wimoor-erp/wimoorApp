<template>
		<uni-card class="n-shadow"  margin="8px 16px" >
    <ShelfHead ref="myhead" :shelfid="shelfid" @onload="infoLoad"></ShelfHead> 
		</uni-card>
	  <uni-card  class="n-shadow" margin="8px 16px">
	     <view class="uni-container">
		   <uni-easyinput  type="text" v-model="search"  :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入SKU" @input="input" ></uni-easyinput>
		 </view>
		 <WhsList ref="whslist" @submit="afterSubmit"></WhsList>
     </uni-card>
</template>
<script>
	import ShelfHead from "./components/shelfHead.vue"
	import WhsList from "./components/whsList.vue" 
	import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	export default {
		components:{
			  ShelfHead,WhsList
		  },
		data() {
			return {
				search:'',
				placeholderStyle: "color:#999;font-size:14px",
				styles: {
						color: '#000',
						borderColor: '#eee'
				},
				tabclassAct:'flex-item text-center activetab',
				tabclassNor:'flex-item text-center',
				shelfid:'',
				formid:'',
				opttype:'',
				addressnum:'',
				shelftreepath:'',
				addressid:'',
				amount:'',
				isall:true,
				data:{},
				materialid:'',
				warehouseid:'',
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
					this.addressid=data.addressid;
					this.shelfid=this.data.shelfid;
					this.amount=this.data.amount;
					this.formid=this.data.formid;
					this.opttype=this.data.opttype;
				} catch (error) {
					 this.data = JSON.parse(payload);
					 this.addressnum=this.data.addressnum;
					 this.shelftreepath=this.data.shelftreepath;
					 this.shelfid=this.data.shelfid;
					 this.addressid=data.addressid;
					 this.materialid=data.materialid;
					 this.amount=this.data.amount;
					 this.formid=this.data.formid;
					 this.opttype=this.data.opttype;
				}
				
			}
		},
		mounted(){
			    console.log(this.$refs.myhead)
			   this.$refs.myhead.getInfo(this.addressnum,this.shelftreepath,this.shelfid);
		},
		methods:{
			infoLoad(head){
				this.addressid=head.addressid;
				this.shelfid=head.id;
				this.refreshTable();
			},
			refreshTable(){
				   this.$nextTick(()=>{
				         this.$refs.whslist.refreshList(
						 this.addressid,
						 this.shelfid,
						 this.search,
						 this.materialid,
						 this.amount,
						 this.formid,
						 this.opttype);
				   });
			},
			afterSubmit(formid){
				let detail = {
					addressnum:this.addressnum,
					shelftreepath:this.shelftreepath,
					ftype:'add',
					materialid:this.data.materialid,
					addressid:this.addressid,
					shelfid:this.shelfid,
					amount:this.amount,
					formid:formid,
					formtype:this.opttype,
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

</style>

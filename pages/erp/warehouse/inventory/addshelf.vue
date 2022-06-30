<template>
<view class="uni-container">
	<view>
      <ShelfHead ref="myhead" :shelfid="shelfid"></ShelfHead> 
	</view>
	<view style="font-size:22px;padding-top:20px;" class='light-font'>请选择操作类型:
	</view>
	<view style="padding-top: 10px;">
		<button style="margin-left: 10px;margin-right: 10px;background: #087e14;color: #fff;padding-top: 30px;padding-bottom: 30px;" @click="openAddUrl" >
			上架
		</button>
		<button style="margin-left: 10px;margin-right: 10px;margin-top: 50px;background: #ffa400;color: #fff;padding-top: 30px;padding-bottom: 30px;" @click="openSubUrl">
			下架
		</button>
	</view>
</view>
</template>

<script>
	import ShelfHead from "./shelf/components/shelfHead.vue"
	export default {
		data() {
			return {
				shelfid:'',
				data:{},
			}
		},
		components:{
			  ShelfHead
		  },
		onLoad(query) {
			if(query.q){
				console.log("外部扫码模式");
				const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容
				const scancode_time = parseInt(query.scancode_time) // 获取用户扫码时间 UNIX 时间戳
				if(q){
					this.shelfid=q.split("shelf/")[1];
				}
			}else{
				console.log("内部扫码模式");
				const payload = query.detailDate || query.payload;
				try {
					this.data = JSON.parse(decodeURIComponent(payload));
					this.shelfid=this.data.shelfid;
				} catch (error) {
					//this.data = JSON.parse(payload);
				}
			}
			this.$refs.myhead.getInfo(this.shelfid);
		},
		methods:{
			openAddUrl(){
				let detail = {
					shelfid:this.shelfid,
					ftype:'add'
				};
				uni.navigateTo({
					//跳转至 上下架页面
					url:'./shelf/addstock?detailDate='+ encodeURIComponent(JSON.stringify(detail)),
				});
			},
			openSubUrl(){
				let detail = {
					shelfid:this.shelfid,
					ftype:'sub'
				};
				uni.navigateTo({
					//跳转至 上下架页面
					url:'./shelf/outstock?detailDate='+ encodeURIComponent(JSON.stringify(detail)),
				});
			}
			
		}
	
	}
	
</script>

<style>
</style>

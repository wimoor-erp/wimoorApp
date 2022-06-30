<template>
	<view>
			<view style="margin-bottom: 50px;" >
				 <view class="uni-list" >
					   <checkbox-group  @change="checkboxChange">
						<block v-for="(value, index) in listData" :key="index">
						  <view class="uni-list-cell" hover-class="uni-list-cell-hover">
						  	<view class="uni-media-list">
						  			<label class="radio" style="padding-top: 20px;"  >
						  				 <checkbox style="transform:scale(0.7)" color="#FF6B00" :value="value.materialid"  :checked="value.checkstatus"/>
						  			</label>
						  		<image @click="goMaterialInfoPage(value.materialid)" class="uni-media-list-logo" :src="value.image"></image>
						  		<view class="uni-media-list-body"  >
						  			<view class="uni-media-list-text-top">
						  				 <text>{{nameFunc(value.name)}}</text>  <!-- <text class="text-green newsku text-right" >新品</text> -->
						  				 <view><text class='light-font'>SKU:{{skuFunc(value.sku)}}</text></view>
						  				 <view><text class="text-orange" style="font-weight: bolder;">{{value.quantity}}</text> 
						  			            <text style="padding-left:10px;font-size: 10px !important;" class='light-font'>暂存库存</text>
						  					    <input type="number" class="pullright" style="border: 1px solid #eee;border-radius: 3px;width: 50px;" v-model="value.amount"  :placeholder="value.amount" />
						  				 </view>
						  			</view>
						  		</view>
						  	</view>
						  </view>
						</block>
						</checkbox-group>
					</view>
					<uni-load-more  :status="status" :icon-size="16" :content-text="contentText" />
				</view>
				<view class="uni-container tabbar">
					<view style="position:fixed;left: 10px;bottom: 10px;padding: 5px;">
						<label class="radio">
							<checkbox-group @change="checkall" >
							<checkbox  style="transform:scale(0.7)"  
							:disabled="checkalldisable" color="#FF6B00" 
							value="all" :checked="checkallstatus"/>全选
							</checkbox-group>
							</label>
					</view>
					<view style="position:fixed;left: 140px;bottom: 15px;padding: 5px;">已选产品<text class="text-orange">({{checknums}})</text> </view>
					 <view style="position: fixed;right:10px;bottom: 10px;padding: 8px;background: #FF6B00;color: #fff;">
						  <text  @click="submit">提交上架</text>
					 </view>
				 </view>
	</view>
</template>
<script>
  import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
	export default {
			data() {
				return {
					materials:[],
					checkalldisable:true,
					warehouseid:'',
					search:'',
					isall:true,
					numbers:1,
					loading: false,
					listData:[],
					status: 'more',
					contentText: {
						contentdown: '上拉加载更多',
						contentrefresh: '加载中',
						contentnomore: '没有更多'
					},
					// 每页数据量
					pageSize: 10,
					// 当前页
					pageCurrent: 1,
					// 数据总量
					total: 0,
					shelfid:'',
					checknums:0,
					checkallstatus:false,
				}
	
			},
			onLoad(event) {
	 
			},
			onPullDownRefresh() {
				this.reload = true;
				this.last_id='';
				this.status='more';
				this.getList();
			},
			onReachBottom() {
				this.reload = false;
				this.getList();
			},
			methods:{
				goMaterialInfoPage(mid){
					uni.navigateTo({
						url:'../../../material/material?materialid='+mid
					})
				},
				refreshList(warehouseid,shelfid,search){
					this.warehouseid=warehouseid;
					this.shelfid=shelfid;
					this.listData=[];
					this.status='more';
					this.reload = true;
					if(search){
					    this.search=search;
					}else{
						this.search="";
					}
					if(this.checkallstatus!=false){
						this.checkallstatus=false;
					}
					this.pageCurrent=1;
					this.getList();
				},	
			     skuFunc(value){
						if(value && value.length>20){
							return value.substr(0,20)+"...";
						}else{
							if(value==undefined || value=='' || value==null){
								return '--';
							}else{
								return value;
							}
						}
					},
					nameFunc(value){
						if(value && value.length>15){
							return value.substr(0,15)+"...";
						}else{
							if(value==undefined || value=='' || value==null){
								return '--';
							}else{
								return value;
							}
						}
					},
				checkall(e,v){ 
					if(this.checkalldisable==true){
						uni.showToast({
							title:'请拉到底部才能全选！',
							icon:'none',
							duration:2000
						});
					}else{
						//全选checkbox
					     if(e.detail.value[0]=="all"){
							this.checkallstatus=true;
						 }else{
							 this.checkallstatus=false;
						 }
						if(this.listData){
							if(this.checkallstatus==true){
								this.materials=[];
								this.listData.forEach((item)=>{
									item.checkstatus=true;
									this.materials.push(item.materialid);
								});
								this.checknums=this.materials.length;
							}else{
								this.materials=[];
								this.listData.forEach((item)=>{
									item.checkstatus=false;
								});
								this.checknums=this.materials.length;
							}
						}
					}
				},
				checkboxChange: function (e) {
					var values = e.detail.value;
					this.materials=	values;
					this.checknums=this.materials.length;
					if(this.checknums!=this.listData.length){
						this.checkallstatus=false;
					}else{
						this.checkallstatus=true;
					}
					let that=this;
					this.listData.forEach((item)=>{
						if(that.materials.includes(item.materialid)){
							if(item.checkstatus==false)item.checkstatus=true;
						}else{
							if(item.checkstatus==true)item.checkstatus=false;
						}
						
					});
				},
				getList(){
					this.total=0;
					if(this.status=="nomore"){
						return;
					} 
					if (this.status=="more") {
						this.status = 'loading';
					}
					var data= { search:this.search,
								shelfid:this.shelfid,
								warehouseid:this.warehouseid,
								allchildren:"false",
								pagesize:this.pageSize, 
								currentpage:this.pageCurrent,
							};
				   warehouseApi.getShelfList(data).then((data)=> { 
						if(data ){
							if(data.records){
								let list = data.records;
								if(list.length>0){
									list.forEach((item)=>{
										item.checkstatus=false;
									});
									this.listData = this.reload ? list : this.listData.concat(list);
									this.reload = false;
									if(this.pageCurrent>=(data.total/10.0)){
										this.status = 'nomore';
										this.reload = false;
										this.checkalldisable=false;
									}else{
										this.pageCurrent=this.pageCurrent+1;
										this.status = 'more';
									}
									return;
								   }
								}
							this.reload = false;
							this.status = 'nomore';
							this.checkalldisable=false;
						}else{
							uni.showToast({
								title:res.msg,
								icon:'none',
								duration:2000
							})
						}
					});
				},
				inputNumber(value){
					
				},
				submit(){
					var that=this;
					if(that.materials.length>0){
						var list=[];
						that.listData.forEach(function(item,index){
							if(that.materials.includes(item.materialid)){
								//被勾选了
								var row={};
								row.materialid=item.materialid;
								row.quantity=item.amount;
							    row.opt=1;
								row.shelfid=that.shelfid;
								list.push(row);
							}
						});
						uni.showModal({
							title: '提示',
							content: '请确认是否操作?',
							success: function (res) {
								if (res.confirm) {
									warehouseApi.invAdd(list).then(data => { 
									            that.$emit("submit",list);
												uni.showToast({
													title:'上架成功',
													icon:'none',
													duration:3000
												})
										})
								} else if (res.cancel) {
									 
								}
							}
						});
						
					}else{
						uni.showToast({
							title:'请至少选择一个产品',
							icon:'none',
							duration:2000
						})
					}
				},
				
			}
		}
	
	
	
</script>

<style>
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
		height: 50px;
		z-index: 999;
	}
</style>
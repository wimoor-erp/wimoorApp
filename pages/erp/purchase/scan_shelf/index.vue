<template>
	<view class="scanshelf-wrap">
		<view class="header-text">
			<view class="font-big">商品上架</view>
			<view class="font-small">扫码上架更高效</view>
		</view>
		<!-- #ifdef H5 -->
		<view class="header-img"></view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		  <image class="bg-image" src="/static/scan.png"></image>
		<!-- #endif -->
	<uni-card class="n-shadow" margin="12px">
		<view class="uni-flex uni-column uni-between scan-height">
			<view>
		<view class="uni-flex uni-between uni-row-center from-item">
		<text class="uni-h6">上架SKU</text>
			 <view>
		<view class="my-button" @click="handleScan">
		<uni-icons type="scan" color="#ff6700" size="16"></uni-icons>
		<text class="cell-l-8">扫一扫识别SKU</text>
		</view>
		</view>
		</view>
		<view class="from-item">
		<view class="uni-list-product card-header" v-if="fromData.sku">
			<image v-if="fromData.image" :src="fromData.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			<view class=" uni-flex-item">
				<view class="uni-h4">{{fromData.sku}}</view>
				<view class="uni-h6 text-omit-1">{{fromData.name}}</view>
			</view>
			<view class="uni-right">
				<text class="uni-h6">上架数量</text>
				<view class="cell-t-4 font-bold">{{fromData.quantity}}</view>
			</view>
		</view>	
		<view class="empty-bg"  v-else>
			<text class="uni-h6">请扫描...</text>
		</view>
		</view>
		 <view class="uni-flex uni-between uni-row-center from-item">
		<text class="uni-h6">上架数库位</text>	 
		<view class="my-button" @click="handleScan">
		<uni-icons type="scan" color="#ff6700" size="16"></uni-icons>
		<text class="cell-l-8">扫一扫识别库位</text>
		</view>
		</view>
		<uni-easyinput  v-model="fromData.shelf" placeholder="手动选择库位" @focus="bindPickerChange"></uni-easyinput>
		<view class="uni-flex uni-between uni-row-center from-item">
		<view class="uni-h6"> </view>	 
		<view  >
		 <button type="primary" @click.stop="submit">确认上架</button>
		</view>
		</view>
		<view v-if="shelftree" class="pick-select">
		 <BaTreePicker ref="treePicker" :multiple='false' @select-change="selectChange" title="选择库位"
		        :localdata="shelftree" valueKey="id" textKey="numbername" childrenKey="children" />
		</view>
		<view 
		v-if="historyShelf?.length>0"
		class="shelf-list">
		<text class="uni-h6">已上货架/历史货架</text>
		<view 
		v-for="item in historyShelf" 
		:key="item.id"
		class="cell-t-8 uni-flex uni-between uni-row-center">
			<view>{{item.addressname}}-{{item.shelfname}}---{{item.quantity}}</view>
			<view>
				<button 
				@click="flashFill(item)"
				size="mini" class="uni-h6">快速选择</button>
			</view>
		</view>
		</view>
		</view>
		</view>
	</uni-card>
	</view>
</template>

<script setup>
import { reactive, toRefs,ref } from 'vue';
import {handleScode} from '@/hooks/erp/scodehandler/handler.js'
import storagedetailApi from '@/api/erp/purchase/receive/storagedetailApi.js';
import shelfproductApi from '@/api/erp/warehouse/shelfproductApi.js';
import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
 import BaTreePicker from "@/components/ba-tree-picker/ba-tree-picker.vue"
import {onLoad} from "@dcloudio/uni-app";
const treePicker=ref(); 
	  const state = reactive({
		  codeData:null,
		  shelfParams:{},
		  productid:null,
		  shelftree:null,
		  treeList:[],
		  historyShelf:null,
		  fromData:{
			  sku:null,
			  quantity:0,
			  shelf:null,
		  },
	  })
	 const{
		 treeList,
		 codeData,
		 shelfParams,
		 fromData,
		 productid,
		 shelftree,
		 historyShelf,
	 }=toRefs(state) 
	 
	onLoad((event)=>{
		state.productid = event.recid;
		if(state.productid){
			getProductData(state.productid);
		}
		if(event.detailData){
			state.shelfParams= JSON.parse(decodeURIComponent(event.detailData));
			state.shelfParams.shelfid="";
			getShelfData(state.shelfParams);
		}
	})
	 function getcodeData(data){
		 if(data.indexOf("ws/")>=0){
			if(data.indexOf("http")>=0){
				var str = data.split("ws/")[1];
				state.shelfParams.addressnum = str.split("/")[0];
				state.shelfParams.shelftreepath = str.split("/")[1];
				state.shelfParams.shelfid="";
			}else{
				var str = data.split("/");
				state.shelfParams.addressnum = str[1];
				state.shelfParams.shelftreepath = str[2];
				state.shelfParams.shelfid="";
			}
			 
			  getShelfData(state.shelfParams);
		 }else if(data.indexOf("rec/")>=0){
			 if(data.indexOf("http")>=0){
			 	var str = data.split("rec/")[1];
			    state.productid = str;
			 }else{
				 state.productid = data.split("/")[1];
			 }
			 getProductData(state.productid);
		 }
	 }
	 
	 function getProductData(id){
		 state.shelftree = [];
		 storagedetailApi.getReceiveInv({"id":id}).then((res)=>{
			 if(res){
				state.fromData.sku = res.sku;
				state.fromData.image = res.image;
				state.fromData.name = res.name;
				state.fromData.quantity = res.amount;
				state.fromData.warehousename = res.warehousename;
				if(res.shelftree[0].children.length>0){
					state.treeList = res.shelftree[0].children;
					state.shelftree = state.treeList;
				}
				state.fromData.materialid = res.materialid;
				state.fromData.opt = 1;
				state.fromData.warehouseid = res.warehouseid;
				getHistoryShelf(res);
			 }
		 })
	 }
	
	function getShelfData(details){
		warehouseApi.getShelfInfo(details).then(data=>{
			if(data){
				state.fromData.shelf = data.summary.warehousename+"-"+data.number+data.name;
				state.fromData.shelfid = data.id;
			}
		})
	}
	 
	 function getHistoryShelf(res){
		 var params = {};
		 params.materialid = res.materialid;
		 params.warehouseid = res.warehouseid;
		 shelfproductApi.getShelfInventoryList(params).then((res)=>{
			 if(res){
				state.historyShelf = res.records;
			 }
		 })
	 }
	 
	 function flashFill(item){
		 state.fromData.shelf = item.addressname+"-"+item.shelfname;
		 state.fromData.shelfid = item.shelfid;
	 }
	 function handlerScodeResult(res){
	 	if (res.result) {
	 		getcodeData(res.result);
	 	}
	 }
	 /* 扫码识别 */
	 function handleScan(){
		// #ifdef MP-WEIXIN
		 uni.scanCode({
		 	success: function(res) {
		 		 handlerScodeResult(res);
		 	}
		 });
		// #endif
		// #ifdef H5 
		if(state.productid){
			uni.navigateTo({
				"url": "/pages/sys/scan/scan?backurl=/pages/erp/purchase/scan_shelf/index?recid="+state.productid
			});
		}else{
			uni.navigateTo({
				"url": "/pages/sys/scan/scan?backurl=/pages/erp/purchase/scan_shelf/index"
			});
		}

		 // #endif
	 }
	 
	 function submit(){
		 var list = [];
		 if(state.fromData.sku===null){
			 uni.showToast({
			 	title:'SKU不能为空',
			 	icon:'none',
			 	duration:3000
			 });
			 return;
		 }
		 if(state.fromData.shelf===null){
			 uni.showToast({
			 	title:'库位不能为空',
			 	icon:'none',
			 	duration:3000
			 });
			 return;
		 }
		 var param={"shelfid":state.fromData.shelfid,
		            "warehouseid":state.fromData.warehouseid,
					"materialid":state.fromData.materialid,
					"formtype":"purchase",
					"quantity":state.fromData.quantity,
					"formid":state.productid,
					"opt":1};
		 list.push(param);
		 warehouseApi.invAdd(list).then(data=>{
			 if(data){
				 uni.showModal({
				    title: '上架成功',
				    content: '成功上架了'+state.fromData.sku+"！",
				    success: () => {
						    state.fromData.quantity = null;
						     getProductData(state.productid);
				 		}
				    })
			 }
		 })
	 }
	 
	 function bindPickerChange(){
		 treePicker.value._show();
	 }
	 function selectChange(ids, names){
          state.fromData.shelf = state.fromData.warehousename +"-"+names;
          state.fromData.shelfid = ids[0];
       }
	 
</script>

<style scoped>
	.scanshelf-wrap{
		background-color: #ff6700;
		position: relative;
		padding-bottom:24px;
	}
	.header-text{
		margin-left:24px;
		color:#fff;
		padding-top:48px;
		padding-bottom:8px;
	
	}
	.header-text .font-big {
		font-size: 24px;
		margin-bottom:8px;
	}
	.header-text .font-small {
		font-size: 12px;
		opacity: 0.8;
	}
	.bg-image{
		position: absolute;
		right: 0;
		top: -26px;
	}
	.header-img{
		position: absolute;
		background-image: url("/static/scan.png");
		background-size: cover;
		width:307px; /* 如果需要，指定容器的宽度 */  
		height:225px; /* 根据需要指定容器的高度 */ 
		right: 0;
		top: -26px;
	}
	.my-button{
		display: flex;
		align-items: center;
       justify-content: center;
	   color:#ff6700;
	   border: 1px solid #ff6700;
	   background-color: rgba(255, 103, 0, 0.1);
	   padding:8px 16px;
	   border-radius: 4px;
	}
	.from-item{
		margin-top:8px;
		margin-bottom:16px;
	}
	.shelf-list{
		margin-top: 24px;
		margin-bottom: 24px;
	}
	.scan-height{
		/* #ifdef H5 */
		height:calc(100vh - 226px);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height:calc(100vh - 182px);
		/* #endif */
	}
	.empty-bg{
		border-radius: 4px;
		border:1px solid #eee;
		padding:10px 8px;
	}
</style>
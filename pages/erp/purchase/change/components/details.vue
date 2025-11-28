<template>
	<view>
	<uni-card class="n-shadow" margin="8px 12px">
		<uni-steps :options="stepList" :active="active" />
	</uni-card>
		<uni-card class="n-shadow" margin="8px 12px" >
			<template v-slot:title>
				<uni-list v-for="(item,index) in itemData" :key="index">
				<view class="uni-list-product card-header">
					<image v-if="item.image" :src="item.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{item.sku}}</view>
						<view class="uni-h6 text-omit-1">{{item.name}}</view>
						<view class="uni-h6 m-t-4">
							<span>可用库存: </span>
							<span>{{inventory.fulfillable}}</span>
						</view>
						<view class="uni-h6 m-t-4">
							<span>待入库: </span>
							<span>{{inventory.inbound}}</span>
						</view>
					</view>
					<view class="uni-right">
						<text class="uni-h6">换货数量</text>
						<view class="cell-t-4 ">{{changeform?.amount}}</view>
					</view>
				</view>
				</uni-list>
			</template>
			<view class="uni-ui-list">
						  <view class="uni-ui-list-item">
							  <text class="uni-ui-list-label">单据编码</text>
							  <text class="uni-ui-list-value">{{changeform.number}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">采购单编码</text>
						  				<text class="uni-ui-list-value">-</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">供应商</text>
						  				<text class="uni-ui-list-value">{{supplier?.name}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">单据状态</text>
						  				  <text v-if="changeform.auditstatus===1" class="uni-ui-list-value text-orange">待审核</text>
						  				  <text v-else-if="changeform.auditstatus===2" class="uni-ui-list-value text-orange">待收货</text>
						  				  <text v-else-if="changeform.auditstatus===3" class="uni-ui-list-value ">已完成</text>
						  				  <text v-else class="uni-ui-list-value">已取消</text>
						  </view>
						  <view
						   v-if="mainMaterial && mainMaterial.sku" 
						   class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">组合SKU</text>
						  				  <text class="uni-ui-list-value">{{mainMaterial.sku}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">操作仓库</text>
						  				  <text class="uni-ui-list-value">{{warehouse.name}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">创建人</text>
						  				  <text class="uni-ui-list-value">{{changeform.creator}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">创建时间</text>
						  				  <text class="uni-ui-list-value">{{util.dateFormat(changeform.opttime)}}</text>
						  </view>
			</view>
	</uni-card>
	<uni-card class="n-shadow " margin="8px 12px"
	 v-if="assform?.number"
	 >
		<view class="uni-ui-list">
					  <view class="uni-ui-list-item"
					  @click="goAssform(assform.id)"
					  >
					  				  <text class="uni-ui-list-label">组装单</text>
					  				  <text class="uni-ui-list-value text-blue">{{assform.number}}</text>
					  </view>
					  <view 
					  @click="goAssform(disform.id)"
					  class="uni-ui-list-item">
					  				  <text class="uni-ui-list-label ">拆分单</text>
					  				  <text class="uni-ui-list-value text-blue">{{disform.number}}</text>
					  </view>
		</view>
	</uni-card>
	<uni-card class="n-shadow " margin="8px 12px" >
		<view class="font-bold cell-b-8  text-black">换货原因</view>
						  <text class="uni-ui-list-label uni-h7">描述</text>
						  <text class="uni-ui-list-value uni-h7 text-black">{{changeform.remark}}</text>
						  <view class="cell-t-8">
						  <uni-file-picker 
						  :modelValue="attachments" 
						  @select="uploadExcel"
						  @delete="handleRemove"
						  limit="3" title="图片证明"></uni-file-picker>
						  </view>
	</uni-card>	
	<uni-card
	 v-if="changeform.auditstatus!==1"
	 class="n-shadow" margin="8px 12px" >
		<view class="font-bold cell-b-8  text-black">入库进度</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">已入库</text>
			<text class="uni-h6">{{changeform.totalin}}/{{changeform.amount}}</text>
		</view>
		<ProgressBar :width="barWidth"/>
	</uni-card>	
	<uni-card 
	v-if="changeform.auditstatus!==1"
	class="n-shadow" margin="8px 12px" >
		<view class="font-bold cell-b-16  text-black">入库记录</view>
         <view v-if="recordList.length>0" v-for="(item,index) in recordList" :key="index">
		   <view class="uni-flex cell-b-16 uni-between">
			   <view>
			 <view class="uni-h5">入库 {{item.amount}}</view>
			 <view>
				 <text class="uni-h6">{{item.operator}} | </text>  
				 <text class="uni-h6">{{util.dateFormat(item.opttime)}}</text>
			 </view>
			 </view>
			 <view>
			 <uni-tag 
			 @click="resetInv(item.id)"
			 inverted text="撤销入库"></uni-tag>	
			 </view>
			 </view>
		 </view>
		 <view v-else class="uni-h6 uni-center cell-t-8">暂无记录！</view>
	</uni-card>	
	<view class="uni-affix-box">
		<view class="uni-flex uni-column uni-affix">
			  <view class="uni-flex cell-8">
				<button  v-if="state.active==1|state.active==2"    @click="stopOrder" >
					终止单据
				</button>
				<button v-if="state.active===1"  type="primary" class="uni-flex-item" @click="passExamine"  >
					通过审核
				</button>
				<button v-if="state.active===2" type="primary" class="uni-flex-item" @click="inBoundconfirm">确认收货</button>
			</view>
		</view>
	</view>
	</view>
	<uni-popup ref="inputDialog" type="dialog">
		<uni-popup-dialog ref="inputClose"  mode="input" title="入库数量" :value="(changeform.amount-changeform.totalin)"
			placeholder="请输入数量" @confirm="dialogInputConfirm"></uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="inverDialog" type="dialog"  >
		<uni-popup-dialog   mode="input" title="产品入库" :value="isinvNumber"
			placeholder="请输入数量" @confirm="inverConfirm"></uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="stopOrderRef" type="dialog">
	  <uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" title="提示" content="确认终止单据吗?" @confirm="stopConfirm"
			></uni-popup-dialog>
	  </uni-popup>
</template>

<script setup>
	import { computed, onMounted, reactive, ref, toRefs,watch} from 'vue';
	 import ProgressBar from"@/components/other/progressBar.vue"
	 import changeApi from '@/api/erp/purchase/change/changeApi.js';
	 import util from '@/utils/util';
	 import {onLoad} from "@dcloudio/uni-app";
	 const inputDialog=ref();
	 const inverDialog=ref();
	 const stopOrderRef=ref();
	const state=reactive({
		orderId:'',
		barWidth:0,
		inventory:{},
		warehouse:{},
		supplier:{},
		handleCount:0,
		attachments:[],
		itemData:{},
		assform:{},
		disform:{},
		mainMaterial:{},
		changeform:{},
		recordList:[],
		stepList:[{
					title: '创建'
				}, {
					title: '待审核'
				}, {
					title: '待收货'
				},{
					title: '完成'
				}, ],
				active:0,
		isinvNumber:0,		
	})
	const {
		stepList,
		inventory,
		supplier,
		active,
		current,
		barWidth,
		orderId,
		itemData,
		assform,
		disform,
		handleCount,
		changeform,
		warehouse,
		recordList,
		isinvNumber,
		attachments,
		mainMaterial,
	}=toRefs(state)
	onLoad((event)=>{
		// TODO 后面把参数名替换成 payload
		const payload = event.id || event.payload;
		// 目前在某些平台参数会被主动 decode，暂时这样处理。
		try {
			state.orderId = JSON.parse(decodeURIComponent(payload));
		} catch (error) {
			state.orderId = JSON.parse(payload);
		}
	})
	onMounted(()=>{
			loadDetails()
	})
	function getFileExtension(obj) {  
	  // 确保obj有name属性且为字符串  
	  if (obj && typeof obj.name === 'string') {  
	    // 使用split('.')分割字符串，得到一个数组  
	    // 数组中的最后一个元素就是文件的后缀  
	    const parts = obj.name.split('.');  
	    // 如果数组长度大于1，说明有后缀，使用pop()获取最后一个元素  
	    if (parts.length > 1) {  
	      return parts.pop().toLowerCase(); // 转换为小写以统一格式  
	    }  
	  }  
	  // 如果没有后缀或obj/name不符合要求，返回空字符串或null等  
	  return '';  
	}  
	
	function loadDetails(){
		changeApi.getData({"id":state.orderId}).then((res)=>{
			if(res){
				state.assform = res.assform;
				state.disform = res.disform;
				state.itemData =res.material;
				state.recordList = res.recordList;
				state.changeform= res.changeform;
				state.warehouse = res.warehouse;
				state.inventory = res.inventory;
				state.supplier = res.supplier;
				state.active = res.changeform.auditstatus;
				state.mainMaterial = res.mainMaterial;
				state.barWidth = res.changeform.totalin/res.changeform.amount*100;
				res.attachments.forEach((item)=>{
					state.attachments.push({
						url:item.image,
						extname:getFileExtension(item),
						name:item.name,
						id:item.id
					})
				})
			}
		})
	}

   function uploadExcel(e){
	 const filepath = e.tempFiles[0].path;  
     const obj={};
	 obj.entryid = state.orderId;
   	changeApi.uploadAttachment(obj,filepath).then(function(res){
		uni.showToast({
			title:'操作成功！',
			icon:'success',
			duration:2000
		});
   	})
   }
   //删除图片
	function handleRemove(e){
		if(e.tempFile.id){
			changeApi.deleteAttachment(e.tempFile.id).then(res=>{
						 uni.showToast({
						 	title:'操作成功！',
						 	icon:'success',
						 	duration:2000
						 });
			});
		}
	}

	function inBoundconfirm(){
		inputDialog.value.open()
	}
	
	function passExamine(){
		changeApi.purchaseapply({"id":state.orderId}).then(res=>{
			uni.showToast({
				title:'操作成功！',
				icon:'success',
				duration:2000
			});
			loadDetails();
		});
	}

	function dialogInputConfirm(e){
		if(e>0){
			changeApi.saveRecord({
				amount:e,
				changeid:state.orderId,
			}).then(res=>{
				if(res){
					uni.showToast({
						title:'入库成功！',
						icon:'success',
						duration:2000
					});
					loadDetails()
				}
			})
		}
	}
	function inInvertory(){
		inverDialog.value.open()
	}
	function inverConfirm(e){
		if(e>0){
			saveRecord({"remark":itemData.remark,"formid":state.orderId,"amount":e}).then((res)=>{
				if(res){
					uni.showToast({
						title:'入库成功！',
						icon:'success',
						duration:2000,
					});
					loadDetails()
				}
			});
		}else{
			uni.showToast({
				title:'输入错误！',
				icon:'error',
				duration:2000
			});
		}
	}
	function restartOrder(){
		resetAssForm({"id":state.orderId}).then(res=>{
			loadDetails()
		})
	}
	function resetInv(id){
		if(state.changeform.auditstatus==1){
			changeApi.cancelInstock({"receiveid":id}).then((res)=>{
				if(res){
					uni.showToast({
						title:'撤销成功！',
						icon:'success',
						duration:2000,
					});
					load();
				}
			});
		}else{
			uni.showToast({
				title:'单据已完成,不支持撤销！',
				icon:'error',
				duration:2000,
			});
		}
	}
	function stopOrder(){
		stopOrderRef.value.open()
		
	}
	function stopConfirm(){
		changeApi.examine({"ids":state.orderId}).then((res)=>{
			  if(res){
				 uni.showToast({
				 	title:'成功终止单据！',
				 	icon:'success',
				 	duration:2000,
				 });
			  uni.navigateTo({
				url:'../index',
			  });
				loadDetails();
				
			  }
		  });
	}
 function  goAssform(id){
	 uni.navigateTo({
	 	//跳转加工单详情页
	 	url:'/pages/erp/purchase/process/components/details?id='+ encodeURIComponent(JSON.stringify(id)),
	 });
 }

</script>

<style >
	.m-t-4{
		margin-top:4px;
	}
	.cell-b-16{
		margin-bottom:16px;
	}
	.card-header{
		padding:16px 12px!important;
	}
	.uni-list-product{
		padding:16px 0px;
	}
  .bg-gray{
	  background-color: #f1f1f1;
	  padding:2px 4px;
	  margin-top:8px;
	  display: inline-block
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
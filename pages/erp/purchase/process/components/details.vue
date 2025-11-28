<template>
	<view>
	<uni-card class="n-shadow" margin="8px 12px">
		<uni-steps :options="stepList" :active="active" />
	</uni-card>
		<uni-card class="n-shadow" margin="8px 12px" >
			<template v-slot:title>
				<uni-list>
				<view class="uni-list-product card-header">
					<image v-if="itemData.image" :src="itemData.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{itemData.skuname}}</view>
						<view class="uni-h6 text-omit-1">{{itemData.mname}}</view>
					</view>
					<view class="uni-right">
						<text class="uni-h6">加工数量</text>
						<view class="cell-t-4 ">{{itemData.amount}}</view>
						<view class="cell-t-4" v-show="state.active===1">
							<uni-tag  @click="handleEdit" text="修改" type="warning"></uni-tag>
							</view>
					</view>
				</view>
				</uni-list>
			</template>
			<view class="uni-ui-list">
						  <view class="uni-ui-list-item">
							  <text class="uni-ui-list-label">单据编码</text>
							  <text class="uni-ui-list-value">{{itemData.number}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">操作类型</text>
						  				  <uni-tag class="uni-ui-list-value" v-if="itemData.ftype==='ass'" type="warning" :inverted="true" text="组装单" ></uni-tag>
						  				  <uni-tag class="uni-ui-list-value" type="primary" :inverted="true" v-else text="拆分单"></uni-tag>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">单据状态</text>
						  				  <text v-if="itemData.auditstatus===2" class="uni-ui-list-value">处理中</text>
						  				  <text v-else class="uni-ui-list-value">完成</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">操作仓库</text>
						  				  <text class="uni-ui-list-value">{{itemData.warehouse}}</text>
						  </view>
						  <view class="uni-ui-list-item">
						  				  <text class="uni-ui-list-label">备注</text>
						  				  <text class="uni-ui-list-value">{{itemData.remark}}</text>
						  </view>
			</view>
	</uni-card>
	<uni-card class="n-shadow" margin="8px 12px" >
		<view class="font-bold cell-b-8  text-black">处理进度</view>
		<view class="uni-flex uni-between">
			<text class="uni-h6">已入库 <text class="text-black font-bold"> {{itemData.inAmount}}</text></text>
			<text class="uni-h6">{{itemData.inAmount}}/{{handleCount}}</text>
		</view>
		<ProgressBar :width="barWidth"/>
	</uni-card>	
	
	<uni-segmented-control :current="current" :values="tabDatas" style-type="text"
	 active-color="#ff6700" @clickItem="onClickItem" />
	 
	<uni-card v-if="current===0" v-for="item in subSKU" class="n-shadow" margin="8px 12px" padding="0px 12px 16px 12px">
		<view class="uni-list-product">
			<image v-if="item.image" :src="item.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			<view class=" uni-flex-item">
				<view class="uni-h4">{{item.sku}}</view>
				<view class="uni-h6 text-omit-1">{{item.mname}}</view>
				<text class="uni-h7 bg-gray">{{item.warename}}</text>
			</view>
			<view class="uni-right">
				<uni-tag @click="gotoPurchase(item)" :inverted="true"  text="采购" ></uni-tag>
			</view>
		</view>
		<uni-row >
		 <uni-col :span="6" >
			 <view class="uni-center">
				 <view class="font-bold text-black cell-t-8">{{item.subnumber}}</view>
				 <text class="uni-h6"> 单位数量 </text>
			 </view>
		 </uni-col>
		 <uni-col :span="6" >
			 <view class="uni-center">
				 <view class="font-bold text-black cell-t-8">{{item.totalamount}}</view>
			 <text class="uni-h6">需求数量</text>
			 </view>
		 </uni-col>
		 <uni-col :span="6" class="uni-center">
			 <view class="uni-center">
				 <view class="font-bold text-black cell-t-8">{{item.invcount}}</view>
			 <text class="uni-h6">可用库存</text>
			 </view>
		 </uni-col>
		 <uni-col :span="6" class="uni-center">
			 <view class="uni-center">
				 <view class="font-bold text-black cell-t-8">{{item.inbound}}</view>
			 <text class="uni-h6">待入库</text>
			 </view>
		 </uni-col>
		</uni-row>
	</uni-card>	
	<uni-card  v-for="item in recordList" v-if="current===1&&recordList.length>0" class="n-shadow" margin="8px 16px" >
		<view class="uni-flex uni-between uni-row-center">
			<view>
			<text class="uni-h5 text-black font-bold">{{item.name}} 入库产品 {{item.amount}}</text>
			<view class="uni-h6 cell-t-8">{{item.opttime}}</view>
			</view>
			<view class="uni-flex">
				<view class="cell-r-8">
				<uni-tag @click="handlePrint(item)" type="primary" :inverted="true" text="打印单据" />
				 </view>
				 <view>
				<uni-tag @click="revoke(item.id)" :inverted="true" text="撤销入库" />
				</view>
			</view>
		</view>
	</uni-card>
	<view v-else v-show="current===1" class="uni-h6 uni-center cell-t-8">暂无记录！</view>
	<view class="uni-affix-box">
		<view class="uni-flex uni-column uni-affix">
			  <view class="uni-flex cell-8">
				<button  v-if="state.active===1"    @click="stopOrder" >
					终止单据
				</button>
				<button v-if="state.active===1"  type="primary" class="uni-flex-item" @click="inInvertory"  >
					<text v-if="itemData.ftype==='ass'">组装</text><text v-else>拆分</text>入库
				</button>
				<button v-else type="primary" class="uni-flex-item" @click="restartOrder">重启单据</button>
			</view>
		</view>
		</view>
	</view>
	<uni-popup ref="inputDialog" type="dialog">
		<uni-popup-dialog ref="inputClose"  mode="input" title="修改加工数量" :value="itemData.amount"
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
	  <PrintPop ref="printRef"></PrintPop>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	 import ProgressBar from"@/components/other/progressBar.vue"
	 import PrintPop from "@/pages/erp/purchase/components/printPop.vue";
	 import {getData,changeAssAmount,saveRecord,resetAssForm,assemblyCancelInstock,stopAssemblyEvent} from '@/api/erp/assembly/assemblyApi.js'
	 import {onLoad} from "@dcloudio/uni-app";
	 const inputDialog=ref();
	 const printRef=ref();
	 const inverDialog=ref();
	 const stopOrderRef=ref();
	const state=reactive({
		orderId:'',
		barWidth:0,
		handleCount:0,
		itemData:{},
		subSKU:[],
		recordList:[],
		current:0,
		tabDatas:['子SKU列表', '入库记录', ],
		stepList:[{
					title: '创建'
				}, {
					title: '处理中'
				}, {
					title: '完成'
				}, ],
				active:0,
		isinvNumber:0,		
	})
	const {
		stepList,
		active,
		tabDatas,
		current,
		barWidth,
		orderId,
		itemData,
		handleCount,
		subSKU,
		recordList,
		isinvNumber,
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
	function loadDetails(){
		getData({formid:state.orderId}).then((res)=>{
			if(res){
				state.itemData =res.warehouseform;
				state.subSKU = res.asFormEntryList;
				state.recordList = res.recordList;
				state.handleCount= res.count;
				state.active = Number(res.status)-1;
				state.barWidth = (state.itemData.inAmount/state.handleCount)*100
				
			}
		})
	}
	function onClickItem(e){
		state.current = e.currentIndex
	}
	function handleEdit(){
		inputDialog.value.open()
		
	}
	function dialogInputConfirm(e){
		changeAssAmount({
			value:e,
			formid:state.orderId,
		}).then(res=>{
			if(res){
				uni.showToast({
					title:'修改成功！',
					icon:'success',
					duration:2000
				});
				loadDetails()
			}
		})
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
	function revoke(id){
		assemblyCancelInstock({"instockid":id}).then((res)=>{
			if(res){
					uni.showToast({
						title:'撤销成功！',
						icon:'success',
						duration:2000,
					});
					loadDetails()
			}
		});
	}
	function stopOrder(){
		stopOrderRef.value.open()
	}
	function stopConfirm(){
		stopAssemblyEvent({"formid":state.orderId}).then(res=>{
			if(res){
					uni.showToast({
						title:'成功终止单据！',
						icon:'success',
						duration:2000,
					});
					loadDetails()
			}
		})
	}
function gotoPurchase(){
	uni.navigateTo({
		//跳转加工单详情页
		url:'../../purchase'
	});
}

	function handlePrint(item){
		var form = state.itemData;
		item = {
			...item,
			...form,
		}
		printRef.value.openPop("rec-po",null,item);
	}
	
</script>

<style>
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
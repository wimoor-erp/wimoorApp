<template>
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="order-wrap">
				<view class="uni-flex uni-row-center uni-between cell-b-16">
					<text class="uni-h5 font-bold">
						<text v-if="orderType==='rec'">入库单详情</text>
						<text v-else>上架单打印</text>
					</text>
					<uni-icons
					 @click="closePop"
					 type="closeempty" size="16"></uni-icons>
				</view>
			</view>
			<view class="form-box" >
				<view class="uni-list-product card-header">
					<image v-if="dataMap.image||row.image"  :src="dataMap.image||row.image" ></image>
					<image v-else  src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{dataMap.sku||row.sku||row.skuname}}</view>
						<view 
						v-if="orderType==='rec'"
						class="uni-h6 text-omit-1">采购数量：{{dataMap.buyamount}}</view>
						<view 
						class="uni-h6 text-omit-1"
						>{{row.name}}</view>
					</view>
					<view class="uni-right">
						<text v-if="orderType==='rec'"  class="uni-h6">入库数量</text>
						<text v-else-if="orderType==='rec-sku'"  class="uni-h6">暂存库存</text>
						<text v-else-if="orderType==='rec-dis'"  class="uni-h6">调库数</text>
						<text v-else-if="orderType==='rec-po'"  class="uni-h6">加工数</text>
						<view class="cell-t-4 ">{{dataMap.amount||row.amount}}</view>
					</view>
				</view>
				<view class="uni-divider-H cell-b-16 cell-t-16 "></view>
			<view class="uni-ui-list">
						  <view v-if="orderType!=='rec-sku'" class="uni-ui-list-item">
							  <text class="uni-ui-list-label">单据编码</text>
							  <text class="uni-ui-list-value">{{dataMap.orderNumber||row.number}}</text>
						  </view>

						  <view v-if="orderType==='rec'" class="uni-ui-list-item" >
						  				  <text class="uni-ui-list-label">供应商</text>
						  				  <text class="uni-ui-list-value">{{dataMap.supplier}}</text>
						  </view>
						  <view  class="uni-ui-list-item">
								  <text class="uni-ui-list-label">操作人</text>
								  <text class="uni-ui-list-value">{{dataMap.operator||row.operator}}</text>
						  </view>
						  <view  class="uni-ui-list-item">
								  <text class="uni-ui-list-label">操作时间</text>
								  <text class="uni-ui-list-value">{{dataMap.opttime||row.opttime}}</text>
						  </view>
			</view>
			<view class="cell-t-16">
				<view class="uni-flex uni-row-center cell-b-16">
					<view class="cell-r-8 uni-h6">上架数量</view>
					<uni-number-box 
					:max="row.amount"
					@change="orderNumChnage"
					v-model="orderNum" />
				</view>
				<view class="uni-flex uni-row-center cell-b-16">
				<view class="cell-r-8 uni-h6">打印份数</view>
				<uni-number-box 
				@change="printNumChnage"
				v-model="printNum" />
			</view>
			<button 
			@click="printPaper"
			type="primary">远程打印</button>
	
			</view>
			</view>
		</uni-popup>
</template>

<script setup>
	import { computed, nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import util from '@/utils/util.js';
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import {formatFloat} from '@/utils/util.js';
	import store from '@/store/index.js';//需要引入store
 	/* import print from '@/hooks/erp/purchase/print.js'; */
	const props=defineProps({
		
	})
	const {}=toRefs(props)
	const state = reactive({
		dataMap:{},
		recid:"",
		row:{},
		url:"",
		warehouseid:"",
		ip:"",
		paper:"100",
		data:{},
		printNum:1,
		urlhttps:null,
		orderType:null,
		orderNum:0,
	}); 
	const {
		dataMap,
		data,
		row,
		paper,
		ip,
		warehouseid,
		printNum,
		urlhttps,
		orderType,
		orderNum,
	} = toRefs(state);
 
	const popup=ref();
	function openPop(type,value,row){
		popup.value.open("bottom")
		state.orderType = type;
		state.warehouseid=row.warehouseid;
		if(row.to_warehouseid){
			state.warehouseid=row.to_warehouseid;
		}
		if(type==='rec'){
			if(value.id){
					   state.recid=value.id;
					   value.sku=row.sku;
					   loadData(value)
			}
		}else{
			state.row = row;
			state.orderNum = row.amount;
			setPrintData(row)
		}
	}
	function closePop(){
		popup.value.close()
	}
	
	function setPrintData(row){
		purchaselistApi.getPrintIpByWarehouse({"warehouseid":state.warehouseid}).then(res=>{
		state.ip=res.ip;
		state.paper = res.paper;
		if(row){
			var barCode ="";
			if(state.orderType==='rec-sku'){
				barCode = state.orderType+"/"+row.warehouseid+"/"+row.materialid+"/"+state.orderNum;
				row.opttime = util.getCurrentDate();
				 store.commit('setCurrentUser',uni.getStorageSync("currentuser"));
				row.operator= store._state.data.currentUser.userinfo.name;
			}else if(state.orderType==='rec-dis'){
				barCode = state.orderType+"/"+row.formid;
				row.operator="";
				row.operator=row.creator;
			}else if(state.orderType==='rec-po'){
				barCode = state.orderType+"/"+row.formid;
				row.operator = row.name;
				row.name = row.mname;
			}
			state.data={
				"orderNumber":row.number,
				"buyamount":row.amount,
				"amount":state.orderNum,
				"sku":state.row.sku,
				"barCode":barCode,
				"operator":row.operator,
				"opttime":row.opttime,
				"num":state.printNum,
			};
		}else{
			state.data={"amount":state.orderNum,
						"orderNumber":state.dataMap.orderNumber,
						"buyamount":state.dataMap.buyamount,
						"operator":state.dataMap.operator,
						"opttime":state.dataMap.opttime,
						"sku":state.dataMap.sku,
						"barCode":"rec/"+state.recid,
						"num":state.printNum,
										};
		}
		 
		});
	}
	
   function  loadData(value){
		purchaselistApi.reviewPruchaseStockPage({"recid":value.id}).then((res)=>{
			if(res){
				state.dataMap=res;
				state.dataMap.sku=value.sku;
				state.orderNum = state.dataMap.amount;
				 if(!state.dataMap.operator){
					 state.dataMap.operator=value.operator;
				 }
		      setPrintData();
			}
		});
	}
 
	function printNumChnage(e){
			state.printNum = e;
	}
	function orderNumChnage(e){
			state.orderNum = e;
			state.data.amount =state.orderNum; 
	}
	 
	 function jsonToParam(json) {
	     return Object.keys(json).map(function(key) {
	         return key + '=' +json[key];
	     }).join('&');
	 }
 
		function printPaper(){
			    state.data.num=state.printNum;
				state.url="http://print.wimoor.com?ip="+state.ip+"&paper="+state.paper+"&"+jsonToParam( state.data );
				window.open(state.url);
		}
	/* print.initSocket(); */
	 defineExpose({
		  openPop,closePop,
	   })
	   
</script>

<style scoped>
	.form-box{
		padding: 0px 24px 24px 24px;
	}
	.title{
		margin-bottom:16px;
	}

    .order-wrap{
		width:calc(100vw - 48px);
		padding:24px
	}
	.cell-b-16{
		margin-bottom:16px;
	}
.cell-t-16{
	margin-top: 16px;
}
</style>
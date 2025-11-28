<template>
	<view class=" uni-form-wrap">
			<uni-forms ref="formRef" :modelValue="formData"  label-position="top">
				<uni-forms-item label="单据编码" >
					<uni-easyinput v-model="formData.number" 
					disabled
					placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="操作仓库" required>
					<Warehouse ref="warehouseRef"  @changeData="warehouseChange"></Warehouse>
				</uni-forms-item>
				<uni-forms-item label="采购单号" >
						<uni-easyinput v-model="formData.entryNumber" placeholder="请选择关联的采购单"
						 @focus="openPuschase"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="供应商" >
						<uni-easyinput v-model="formData.suppliername"
						 @focus="openSuplieer"
						 placeholder="选择供应商"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="组装单换货" >
					<uni-data-checkbox
					 @change="formData.sku=''"
					 v-model="formData.isCombination" :localdata="formData.combinationData"></uni-data-checkbox>
					<view 	class="cell-t-8"	 v-if="formData.isCombination===2">
						<uni-easyinput
						 v-model="formData.sku"
						 @focus="openCombination"
						 placeholder="选择组合SKU"></uni-easyinput>
					</view>
				</uni-forms-item>
				
				<uni-forms-item label="备注" >
						<uni-easyinput v-model="formData.remark" placeholder="输入备注" @input="input"></uni-easyinput>
						<view class="cell-t-8">
						  <uni-file-picker
						   @select="uploadImage"
						   limit="3" title="图片描述"></uni-file-picker>
						  </view>
				</uni-forms-item>
			</uni-forms>
			<view class="uni-divider-H"></view>
			<view class="uni-flex cell-t-16 uni-between uni-row-center">
				<text class="font-bold">换货商品</text>
				<view>
				<button type="primary"
				 @click="addProduct"
				 size="mini">添加商品</button>
				</view>
			</view>
			<view class="table-wrap">
			<uni-table  emptyText="暂无更多数据" >
				<!-- 表头行 -->
				<uni-tr>
					<uni-th   align="left">	商品信息</uni-th>
					<uni-th width="100" align="left">换货数量</uni-th>
					<uni-th width="60" align="left">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in tableData" :key="index">
					<uni-td>
						<view class="uni-flex uni-row-center">
						<image :src="item.image" v-if="item.image" style="width:48px;height:48px;" ></image>
						<image v-else style="width:48px;height:48px;" src="/static/empty/noimage40.png" ></image>
						<view class="cell-l-8">
							<view>{{item.sku}}</view>
							<text class="uni-h6">可用库存:{{item.fulfillable}}</text>
						</view>
						</view>
					</uni-td>
					<uni-td >
						<uni-easyinput v-model="item.amount"
						 :clearable="false"
						 placeholder="数量"
						  type="number"
						  @input="input"></uni-easyinput>
					</uni-td>
					<uni-td @click="delect(index)">
						<uni-icons
						 type="trash" color="#ff6700" size="24"></uni-icons>
					</uni-td>
				</uni-tr>
			</uni-table>
			</view>
			<view class="uni-affix-box">
				<view class="uni-flex uni-column uni-affix">
					  <view class="uni-flex cell-8">
						<button   type="primary" class="uni-flex-item" @click="submitForm">
							提交
						</button>
					</view>
				</view>
			</view>
	</view>
	<PurchaseDialog ref="purchaseRef" @getPurchuaseNumber="getPurchuaseNumber" />
	<Suplieer ref="suplieerRef" @getSuplieer="getSuplieer"/>
	<MaterialDialog
	 @getProductData="getProductData"
	 @getparentSku = "getparentSku"
	 :pmainid="pmainid"
	 :warehouseid="formData.warehouseid" ref="marterialRef" />
</template>

<script setup>
	import{ref,reactive, toRefs, onMounted}from"vue";
	import PurchaseDialog from "./purchaseDialog.vue";
	import Suplieer from "./suplieer.vue";
	import serialnumberApi from '@/api/erp/common/serialnumberApi.js';
	import Warehouse from "./warehouse_form.vue"; 
	import MaterialDialog from"./materialDialog.vue";
	import changeApi from '@/api/erp/purchase/change/changeApi.js';  
	import {onLoad} from "@dcloudio/uni-app";
	const formRef=ref();
	const purchaseRef=ref();
	const suplieerRef=ref();
	const marterialRef=ref();
	const warehouseRef=ref();
	const state= reactive({
		formData:{
			number:"",
			entryNumber:'',
			warehouseid:'',
			isCombination:1,
			combinationData:[ {
					text: '否',
					value: 1
				}, {
					text: '是',
					value: 2
				}],
		},
		tableData:[],
		isload:false,
		imageFile:"",
		pmainid:null,
		purchaseParam:null,
	})
	const{
		formData,
		tableData,
		imageFile,
		isload,
		pmainid,
		purchaseParam,
	}=toRefs(state)
	
	function openCombination(){
		//mainid为null
		marterialRef.value.show("psku");
	}
	onLoad((event)=>{
		// TODO 后面把参数名替换成 payload
		const payload = event.changeData || event.payload;
		// 目前在某些平台参数会被主动 decode，暂时这样处理。
		try {
			state.purchaseParam = JSON.parse(decodeURIComponent(payload));
		} catch (error) {
			state.purchaseParam = JSON.parse(payload);
		}
		loadPurchaseData(); 
	})
	
	function loadPurchaseData(){
		state.formData.entryNumber=state.purchaseParam.number;
		state.formData.entryid=state.purchaseParam.id;
		state.formData.suppliername = state.purchaseParam.suppliername;
		state.formData.supplierid = state.purchaseParam.supplier;
		var timer=setTimeout(function(){
		warehouseRef.value.setWarehouse(state.purchaseParam.warehouseid);	 
			clearTimeout(timer);
		},1000)
		
		 
		var row={"image":state.purchaseParam.image,"id":state.purchaseParam.materialid,"amount":state.purchaseParam.amount,
			"fulfillable":state.purchaseParam.fulfillable,"sku":state.purchaseParam.sku};
		state.tableData.push(row); 
	}
	
	function loadData(){
		serialnumberApi.getSerialNumber({"ftype":"SO","isfind":"true"}).then((res)=>{
			if(res){
				state.formData.number=res;
			}
		});
	}
	function openPuschase(){
		purchaseRef.value.show();
	}
	function openSuplieer(){
		suplieerRef.value.show();
	}
	
	function getPurchuaseNumber(row){
		state.formData.entryNumber = row.number;
		state.formData.entryid = row.id;
	}
	function getSuplieer(row){
		state.formData.suppliername = row.name;
		state.formData.supplierid = row.id;
	}
	function warehouseChange(e){
		state.formData.warehouseid = e;
	}
	function addProduct(){
		if(state.formData.sku){
			marterialRef.value.show("subsku");
		}else{
			marterialRef.value.show();
		}
	}
	function getProductData(row){
		 const exists = state.tableData.some(item => item.id === row.id); 
	     if (!exists) {
	        state.tableData.push(row);  
	    }else{
			uni.showToast({
				title:'重复添加！',
				icon:'error',
				duration:2000
			});
		} 
	}
	
	function getparentSku(row){
		state.formData.sku = row.sku;
		state.pmainid = row.id;
	}
  function delect(index){
	  state.tableData.splice(index,1)
  }
  function getskumapstr(){
	  const ischeck = state.tableData.some(item => item.amount > 0);
	  var skulist = {};
	   state.tableData.forEach(item=>{
		   if(item.amount>0){
			   skulist[item.id] = item.amount;
		   }
	   })
	   if(ischeck){
		   state.isload = true;
		   return skulist;
	   }else{
		   uni.showToast({
		   	title:'请填写换数量！',
		   	icon:'error',
		   	duration:2000
		   });
		   state.isload = false;
	   }
  }
  function submitForm(){
	  var obj = {};
	  obj.warehouseid = state.formData.warehouseid;
	  if(state.formData.remark){
	       obj.remark=state.formData.remark;
	  }
	  if(state.formData.supplierid){
	       obj.supplierid=state.formData.supplierid;
	  }
	  if(state.formData.entryid){
	     obj.entryid=state.formData.entryid;
	  }
	  if(state.formData.mainid){
	  	obj.mainid=state.formData.mainid;
	  }
	  
	  obj.id="";
	  obj.skumapstr = JSON.stringify(getskumapstr());
	  var uploadObj=state.imageFile[0];
	  var filepath = null;
	  if(uploadObj){
		  filepath = uploadObj.path
	  }
	  if(state.isload ){
		changeApi.saveData(obj,filepath).then(res=>{
			if(res){
				uni.showToast({
					title:'添加成功！',
					icon:'success',
					duration:2000
				});
			  uni.navigateTo({
				url:'../index',
			  });
			}
		})

	  }
	
  }
  
  function uploadImage(e){
	  state.imageFile = e.tempFiles;
  }
	onMounted(()=>{
		loadData();
	})
</script>

<style >
	
	table{
		width: 100%;
	}
	.uni-table-td{
		 vertical-align: middle;
	}
</style>
<style scoped>

	.table-wrap{
		margin-bottom:80px;
	}
	.cell-8{
		padding-right:24px;
		padding-bottom:16px;
		background-image: linear-gradient(to  bottom ,rgba(255,255,255,0),rgba(255,255,255,1));
	}
	.uni-form-wrap{
		background-color: #fff;
		padding:12px;
	}
	.cell-t-16{
		margin-top: 16px;
	}
</style>
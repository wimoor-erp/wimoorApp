<template>
	<view class="top-header">
	             	<view class="uni-flex   uni-row m-8-16" >
						<view class="flex-item-grow " >
									<UnEasyunput  @change="handlerQuery"  placeholder="请输入SKU" v-model="param.search" >
									</UnEasyunput>
						</view>
									<view class="flex-item">
							      <button class="btn-default" @click="handlerQuery">查询</button>
								  	</view>
						 </view>
	</view>  
	<view style="padding-top:60px;"></view>
	<warehouse-address @changeData="addressChange"></warehouse-address>
	<global-table ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		   <uni-card 
		          :title="row.sku" 
		   		  :sub-title="row.name" 
		   		  :extra="row.warehousename" 
		   		  :thumbnail="row.image" >
		   		  <view class="uni-flex uni-between uni-row-center">
					  <view>
					  <text style="padding-right:20px;">{{row.shelfname}}</text> <text>数量：</text>{{row.quantity}}
					  </view>
					  <view>
					  <button size="mini" @click="showInputDialog(row)" >下架</button>
					  </view>
		   		  </view>
		   </uni-card>
		</template>
	</global-table>
           <uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="input" :title="form.title" :value="form.quantity"
					placeholder="请输入内容" @confirm="submitSubShelfInv"></uni-popup-dialog>
			</uni-popup>
</template>

<script setup>
	import UnEasyunput from '@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue'
	import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
	import GlobalTable from "@/components/globaltable/index.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import WarehouseAddress from "@/components/header/warehouse_address.vue";
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi.js'
	const globalTableRef=ref(GlobalTable);
	const inputDialog=ref();
	const instance=getCurrentInstance();
	const state = reactive({tableData:{records:[],total:0},param:{addressid:"",search:""},
	form:{}});
	const {tableData,param,form,} = toRefs(state);	
	function handlerQuery(){
		setTimeout(function(){
			instance.proxy.$refs["globalTableRef"].loadTable(state.param);
		},300);
	}
	function loadTable(param){
		shelfproductApi.getShelfInventoryList(param).then(res=>{
			if(res&&res.records){
				state.tableData.records=res.records;
				state.tableData.total=res.total;
			}else{
				state.tableData.records=[];
				state.tableData.total=res.total;
			}
		})
	}
 
	function addressChange(addressid){
		state.param.addressid=addressid;
		handlerQuery();
	}
 
	function doHandlerQuery(){
		handlerQuery();
	}
	function showInputDialog(row){
		state.form.materialid=row.materialid;
		state.form.shelfid=row.shelfid;
		state.form.quantity=row.quantity;
		state.form.warehouseid=row.warehouseid;
		state.form.title="下架sku:"+row.sku;
		inputDialog.value.open();
	}
 
	function submitSubShelfInv(value){
		var invoptList=[];
		state.form.quantity=value;
		invoptList.push(state.form);
		shelfproductApi.subShelfInventory(invoptList).then(res=>{
			uni.showToast({
				title:'下架成功！',
				icon:'none',
				duration:2000
			})
			inputDialog.value.close();
			handlerQuery();
		})
	}
	onMounted(()=>{
		//handlerQuery();
	})
	 
</script>

<style>
	.searchbtn{
		margin:10px;
	}
	.top-header{
		position:fixed;
		left:0px;
	    top: 0px;
		width:100%;
		z-index:100;
		background-color: #fff;
		border:solid #dedede 1px;
		box-shadow: 1px 1px 2px #c6c6c6;
	}
	/* #ifdef H5 */
	.top-header{
		top:44px;
	}
	/* #endif */
.flex-item-grow{
	flex:1 ;
	padding-right: 8px;
}
.m-8-16{
	margin: 8px 16px;
}
.btn-default{
	font-size: 14px;
}
	.tab-left .segmented-control__item {
		justify-content: left!important;
		padding-left:16px;
		padding-right: 16px;
		flex: inherit!important;
		
	}
	.tab-left  .segmented-control__text{
		font-size: 16px !important;
		white-space:nowrap;
	}
	.tab-left {
		display: inline-block;
	}
</style>

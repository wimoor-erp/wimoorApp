<template>
	<search-header ref="searchheaderRef">
			 	<template>
					   <warehouse-address @changeData="addressChange"></warehouse-address>
				</template>
	</search-header>
	<view class="top-header">
		<uni-row class="demo-uni-row" :width="nvueWidth">
							<uni-col :span="4">
								SKU：
							</uni-col>
							<uni-col :span="14">
									<input class="winput" v-model="param.search"   placeholder="请输入SKU" />
							</uni-col>
							<uni-col :span="5" :offset="1">
							 <button size="mini" @click="handlerQuery">查询</button>
							</uni-col>
						</uni-row>
	</view>
	<view style="padding-top:50px;"></view>
	<global-table ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		   <uni-card 
		          :title="row.sku" 
		   		  :sub-title="row.name" 
		   		  :extra="row.warehousename" 
		   		  :thumbnail="row.image" >
		   		  <view> <text   style="padding-right:20px;">{{row.shelfname}}</text> <text>数量：</text>{{row.quantity}}
						<button size="mini" @click="showInputDialog(row)" style="width:70px;float:right">下架</button>
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
	import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
	import GlobalTable from "@/components/globaltable/index.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import WarehouseAddress from "@/components/header/warehouse_address.vue";
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi.js'
    const searchheaderRef=ref(SearchHeader);
	const globalTableRef=ref(GlobalTable);
	const inputDialog=ref();
	const instance=getCurrentInstance();
	const state = reactive({tableData:{records:[],total:0},param:{addressid:"",search:""},form:{}});
	const {tableData,param,form} = toRefs(state);	
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
		instance.proxy.$refs["searchheaderRef"].closeDrawer();
		handlerQuery();
	}
	function showInputDialog(row){
		state.form.materialid=row.materialid;
		state.form.shelfid=row.shelfid;
		state.form.quantity=row.quantity;
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
		handlerQuery();
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
		padding: 15px;
		z-index:100;
		padding:10px;
		background-color: #fff;
		border:solid #dedede 1px;
		box-shadow: 1px 1px 2px #c6c6c6;
	}
	.winput{
		margin-left:10px;
		margin-right:10px;
		padding-left:3px;
		padding-right:10px;
		border:solid #dedede 1px;
		color: #999;
		border-radius: 4px;
		
		box-shadow: 0 2px 12px 0  #fff;
	}
</style>

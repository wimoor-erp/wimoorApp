<template>
<GlobalTable ref="globalTableRef" :option="tableOption"  submitTitle="上架"  :tableData="tableData" @submit="submit" @loadTable="loadTable">
	<template v-slot:default="{row}"  > 
	      <view class="uni-flex uni-row">
	                <view class="flex-item ">
						<image v-if="row.image" @click="goMaterialInfoPage(row.id)" class="uni-media-list-logo" :src="row.image"></image>
						<image v-else src="/static/empty/noimage40.png" class="uni-media-list-logo"></image>
					</view>
	                <view class="uni-flex-item " >
						<view class="uni-flex uni-column">
							<view class="flex-item ">
								 <text class='uni-h5'>{{skuFunc(row.sku)}}</text> 
							</view>
						                <view class="flex-item  ">
											 <text  class="text-omit-1 uni-h6">{{nameFunc(row.name)}}</text>
										</view>
						                <view class="cell-t-8">
											<view>
											 <text class="text-orange uni-h5 font-bold" >{{row.quantity}}</text> 
											 <text  class='uni-h7 cell-r-8'> 暂存库存</text>
											 <text  
											 class='uni-h7' v-if="row.warehousename">
												 {{row.warehousename}}</text>
											</view>
											<view class="uni-flex-end">
											 <input 
											  class="myNumInput" 
											  v-model.number="row.amount"  
											  :placeholder="row.amount"
											   @focus="inputFocus(row)"
											   @blur="inputChange(row)"/>
											   </view>
							</view>
						</view>
					</view>
	            </view>
	</template>
</GlobalTable>
</template>
<script setup>
  import warehouseApi from '@/api/erp/warehouse/warehouseApi.js'
  import GlobalTable from "@/components/globaltable/checktable.vue";
  import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
  const globalTableRef=ref(GlobalTable);
   const emit = defineEmits(['submit']);
  const state=reactive({
	  queryParam:{ },
      tableOption:{key:"id",submitTitle:"上架"},
	  tableData:{records:[],total:0},
	  optamount:"",
  });
  const {tableData,queryParam,tableOption} = toRefs(state);	
 function goMaterialInfoPage(mid){
  	uni.navigateTo({
  		url:'../../../material/material?materialid='+mid
  	})
  }
  
function refreshList(addressid,shelfid,search,materialid,amount,formid,formtype){
	                state.queryParam={  search:"",
		  			shelfid:"",
		  			addressid:"",
		  			allchildren:"false",
		  			materialid:"",
		  			searchtype:"sku", };
					state.queryParam.addressid=addressid;
					state.queryParam.shelfid=shelfid;
					state.queryParam.materialid=materialid;
					state.queryParam.formid=formid;
					state.queryParam.formtype=formtype;
					state.optamount=amount;
					if(search){
					    state.queryParam.search=search;
					}else{
						state.queryParam.search="";
						state.queryParam.searchtype=null;
					}
					queryHandler();
				}
				
function skuFunc(value){
					if(value==undefined || value=='' || value==null){
						return '--';
					}else{
						return value;
					}
		 }
function  nameFunc(value){
						if(value==undefined || value=='' || value==null){
							return '--';
						}else{
							return value;
						}
	 }
 
function inputChange(row){
	if(row.amount&&row.amount!=row.fulfillable){ 
		globalTableRef.value.checkByKey(row.id);
	}else if(!row.amount){
		row.amount=row.fulfillable;
	}
}
function inputFocus(row){
	if(!row.amount){
		row.amount="";
	}
}
function  submit(rows){
						var list=[];
						 rows.forEach(function(item,index){
								//被勾选了
								var row={};
								if(item&&item.amount){
									row.materialid=item.id;
									row.quantity=item.amount;
									row.opt=1;
									row.formtype="direct";
								    row.warehouseid=item.warehouseid;
									row.shelfid=state.queryParam.shelfid;
									if(state.queryParam.materialid){
										if(	state.queryParam.formid){
											row.formid=state.queryParam.formid;
										}
										if(state.queryParam.formtype){
											   row.formtype=state.queryParam.formtype;
										}
									}
									list.push(row);
								}
						});
						uni.showModal({
							title: '提示',
							content: '确定要上架选中的产品吗?',
							success: function (res) {
								if (res.confirm) {
									warehouseApi.invAdd(list).then(data => { 
												uni.showToast({
													title:'上架成功',
													icon:'none',
													duration:3000
												});
											    emit("submit",data);
										})
								} else if (res.cancel) {
									 
								}
							}
						});
				}
				
function queryHandler(){
	globalTableRef.value.loadTable(state.queryParam);
}			
	
function loadTable(param){
			warehouseApi.getShelfList(param).then((data) => { 
					if(data){
						if(data.records){
							data.records.forEach(item=>{
								if(state.queryParam.materialid&&state.optamount){
									item.amount=state.optamount;
								}else{
									item.amount=item.quantity;
								}
							});
							state.tableData.records=data.records;
							state.tableData.total=data.total;
						  }
					}else{
						state.tableData.records=[];
						state.tableData.total=0;
					}
				});
 }
	defineExpose({
	  refreshList
	})
</script>

<style>
	.myNumInput{
		border: 1px solid #ddd;border-radius: 4px;width: 60px;
		padding: 2px 8px;
		font-weight: 700;
		color: #333;
	}
	.uni-flex-end{
		display: flex;
		justify-content: flex-end;
	}
		.test {
			font-family: iconfont;
			margin-left:4rpx;
			font-size:24rpx;
		}
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
	.uni-media-list-logo{
		padding-top:6px;
	}
	.flex-between-row{
		justify-content: space-between;
		flex-direction: row;
		display: flex;
	}
	.productname{
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
			width:270px;
	}
</style>
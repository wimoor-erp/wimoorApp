<template>
<GlobalTable ref="globalTableRef" :option="tableOption" :tableData="tableData" @submit="submit" @loadTable="loadTable">
	<template v-slot:default="{row}"  > 
	  <view class=" uni-media-list">
	      <view class=" uni-flex uni-row"  >
	                <view class="flex-item ">
						<image v-if="row.image" @click="goMaterialInfoPage(row.materialid)" class="uni-media-list-logo" :src="row.image"></image>
						<image v-else src="/static/empty/noimage40.png" class="uni-media-list-logo"></image>
					</view>
	                <view class="flex-item">
						<view class="uni-flex uni-column">
							           <view class="flex-item flex-item-V">
							           	 <text class='uni-h5 '>{{skuFunc(row.sku)}}</text> 
							           </view>
						                <view class="cell-b-8  uni-h6 text-omit-1 ">
											 <text  >{{nameFunc(row.name)}}</text>
										</view>
						                <view class="flex-item flex-item-V flex-between-row">
											<view>
											 <text class="text-orange uni-h5 font-bold" >{{row.quantity}}</text> 
											 <text class='uni-h7  cell-r-8'> 库位库存</text>
											 <text 
											 class='uni-h7' v-show="row.warehousename">
											   {{row.warehousename}}</text>
										    </view>
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
  import materialApi from '@/api/erp/material/materialApi.js'
  import GlobalTable from "@/components/globaltable/index.vue";
  import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
  const globalTableRef=ref(GlobalTable);
   const emit = defineEmits(['submit']);
  const state=reactive({
	  queryParam:{},
	  tableOption:{key:"materialid",submitTitle:"下架"},
	  tableData:{records:[],total:0},
  });
  const {tableData,queryParam,tableOption} = toRefs(state);	
  let props = defineProps({
  	  editable:false,
   })
  const { editable } = toRefs(props);
  
 function goMaterialInfoPage(mid){
  	uni.navigateTo({
  		url:'../../../material/material?materialid='+mid
  	})
  }

function refreshList(addressid,shelfid,search,materialid){
	                state.queryParam={search:"",
		  			shelfid:"",
		  			addressid:addressid,
		  			allchildren:"false",
		  			materialid:"",
		  			searchtype:"sku",
		  		    order:"desc",
					sort:"quantity",};
					state.queryParam.shelfid=shelfid;
					state.queryParam.materialid=materialid;
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
	if(row.amount&&row.amount!=row.quantity){
		globalTableRef.value.checkByKey(row.materialid);
	}else if(!row.amount){
		row.amount=row.quantity;
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
								row.materialid=item.materialid;
								row.quantity=item.amount;
							    row.opt=1;
								row.formtype="direct";
								row.shelfid=state.queryParam.shelfid;
								list.push(row);
						});
						uni.showModal({
							title: '提示',
							content: '请确认是否操作?',
							success: function (res) {
								if (res.confirm) {
									warehouseApi.invSub(list).then(data => { 
												uni.showToast({
													title:'下架成功',
													icon:'none',
													duration:3000
												});
											   emit("submit",data);
										})
								} 
							}
						});
				}
				
function queryHandler(){
	globalTableRef.value.loadTable(state.queryParam);
}			
 
 function loadTable(param){
		  warehouseApi.getShelfInventoryList(param).then((data)=> { 
					if(data){
						if(data.records){
							data.records.forEach(item=>{
								item.amount=item.quantity;
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
		border: 1px solid #eee;border-radius: 4px;width: 60px;
		padding-left:3px;
	}
	.newsku{
		font-size: 10px !important;
		float: right;background: #DFF3EA;padding: 0px;padding-left: 3px;padding-right: 3px;
	}
	.uni-media-list-logo{
		padding-top:6px;
	}
			.test {
				font-family: iconfont;
				margin-left:4rpx;
				font-size:24rpx;
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
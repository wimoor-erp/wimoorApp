<template>
	<view class="height-affix">
	<view class="uni-affix-box">
	<view class="uni-flex uni-bg-orange-tran cell-header">
		<Group class="opticy-bg"  @changeData="groupChange" defaultValue="only"></Group>
		<Market class="opticy-bg" ref="marketRef" @changeData="marketChange"  defaultValue="only"></Market>
	</view>
	</view>
	</view>
	  <SumDay ref="sumDayRef"></SumDay>
   	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
   		<template v-slot:default="{row}"  > 
   		    <uni-card 
			class="n-shadow"  margin="8px 16px">
					  <template v-slot:title>
						<uni-list>
							<uni-list-chat 
							:title="row.sku"
							 :avatar="row.image"
							  :note="row.name"
							   :time="row.groupname"
								>
								 </uni-list-chat>
						</uni-list>
					</template>
					  <view class=" uni-h6 uni-flex uni-between ">
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
							  <text class="text-black">今日</text>
						   <text >销量 {{row.QuantityOrdered}} </text> 
						   <text>净销售额 {{formatFloat(row.total_price)}} </text> 
						   <text>单价 {{formatFloat(row.price)}} </text> 
						  </view>
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
							  <text class="text-black">昨日</text>
						   <text>销量 {{row.QuantityOrdered_yy}} </text> 
						   <text>净销售额 {{formatFloat(row.totalprice_yy)}} </text> 
						   <text>单价 {{formatFloat(row.price_yy)}} </text> 
						  </view>
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
							  <text class="text-black">上周同日</text>
						   <text>销量 {{row.QuantityOrdered_lw}} </text> 
						   <text>净销售额 {{formatFloat(row.totalprice_lw)}} </text> 
						   <text>单价 {{formatFloat(row.price_lw)}} </text> 
						  </view>
					  </view>
   			</uni-card>
   		</template>
   	</GlobalTable>
  
</template>

<script setup>
	import orderListApi from "@/api/amazon/order/orderListApi.js";
	import inventoryRptApi from "@/api/amazon/inventory/inventoryRptApi.js";
    import { reactive,toRefs,onMounted,ref,getCurrentInstance } from "vue";
	import {onShow} from "@dcloudio/uni-app";
	import {formatFloat} from '@/utils/util';
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import SumDay from "./components/sumday.vue";
	const globalTableRef=ref(GlobalTable);
	const sumDayRef=ref(SumDay);
	const state = reactive({queryParams:{groupid:"",marketplaceid:"",isorder: "isproduct",status:"",
	                                      searchtype:"sku",channel:"",color:"",isbusiness:"",sort:"QuantityOrdered" ,order:"desc"},
	                          tableData:{records:[],total:0},
							});
	const { queryParams,tableData } = toRefs(state);
	const instance=getCurrentInstance();
	const marketRef=ref(Market);
	function groupChange(groupid){
		state.queryParams.groupid=groupid; 
		instance.proxy.$refs["marketRef"].handlerQuery(state.queryParams.groupid);
		doHandlerQuery()
	}
	function marketChange(marketplaceid){
		state.queryParams.marketplaceid=marketplaceid;
		doHandlerQuery()
	}
	function doHandlerQuery(){
		instance.proxy.$refs["sumDayRef"].loadData(state.queryParams);
		instance.proxy.$refs["globalTableRef"].loadTable(state.queryParams);
		
	}
	function loadTable(params){
		orderListApi.todaylist(params).then((data)=>{
			    if(data&&data.records){
					state.tableData.records=data.records;
					state.tableData.total=data.total; 
				}else{
					state.tableData.records=[];
					state.tableData.total=0; 
				}
		})
	}
 onMounted(()=>{
	 doHandlerQuery()
 })
</script>

<style scoped>
	.cell-header{
		padding:8px 16px;
	}
   .cell-text-8 uni-text{
	   margin-bottom:8px;
   }
   .uni-affix-box{
	position: fixed;
  /* #ifdef H5 */
   top:44px;
   /* #endif */
   z-index: 99;
   width: 100%;
   }
   .height-affix{
   	   height: 58px;
   }
   /* #ifdef H5 */
   .height-affix{
   	   height: 56px;
   }
  /* #endif */

</style>
<style>
	.opticy-bg .uni-text-picker-w{
			background-color: rgba(255,255,255,0.2)!important;
			color:#fff;
		}
		.opticy-bg .icon-xiala{
			color:#fff;
			opacity: 0.8;
		} 
		.opticy-bg .uni-select-button{
			background-color: rgba(255,255,255,0.2)!important;
			color:#fff;
		}
		.opticy-bg .icon-xiala{
			color:#fff;
			opacity: 0.8;
		} 
</style>
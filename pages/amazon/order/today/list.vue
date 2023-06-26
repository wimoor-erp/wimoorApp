<template>
	  <SumDay ref="sumDayRef"></SumDay>
<SearchHeader ref="searchheaderRef">
  				   <Group   @changeData="groupChange" defaultValue="only"></Group>
  				   <Market  ref="marketRef" @changeData="marketChange"  defaultValue="only"></Market>
				   <button  class="searchbtn" @click="doHandlerQuery">查询</button>
</SearchHeader>
 
   <view style="margin-bottom:10px;"></view>
   	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
   		<template v-slot:default="{row}"  > 
   		    <uni-card 
			          :title="row.sku" 
					  :isFull="true" 
					  :is-shadow="false" 
					  :sub-title="row.name" 
					  :extra="row.groupname" 
					  :thumbnail="row.image" >
					  <view><text>销量：</text>{{row.QuantityOrdered}} 
					        <text style="float:right" class="light-font">国家：{{row.market}}</text>
					  </view>
				      <view>
						   <text>净销售额：</text>{{formatFloat(row.total_price)}}
				           <text style="float:right" class="light-font">单价：{{formatFloat(row.price)}}</text>
					   </view>
					 <view><text>昨日销量：</text>{{row.QuantityOrdered_yy}}
					       <text style="float:right" class="light-font">昨日单价：{{formatFloat(row.price_yy)}}</text>
					  </view>
				      <view><text>昨日净销售额：</text>{{row.totalprice_yy}} </view>
					  <view><text>上周同日销量：</text>{{row.QuantityOrdered_lw}}
					        <text style="float:right" class="light-font">上周同日单价：{{formatFloat(row.price_lw)}}</text>
					 </view>  
				     <view><text>上周同日净销售额：</text>{{row.totalprice_lw}} 
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
	import SearchHeader from "@/components/searchheader/base.vue";
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
	}
	function marketChange(marketplaceid){
		state.queryParams.marketplaceid=marketplaceid;
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
 onShow(()=>{
	 setTimeout(function(){doHandlerQuery()},1000);
 })
</script>

<style>
	.intitle{
		padding:20px;
	}
	.searchbtn{
		margin:10px;
	}
</style>
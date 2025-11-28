<template>
	<view class="header-wrap"> 
	<view class="cell-b-8 block-segmented">
	<uni-segmented-control :current="indexS" :values="settlement" @clickItem="onClickItem"
	styleType="button" activeColor="#ff7315"></uni-segmented-control>
    </view>
	<view class="form-box">
    <uni-datetime-picker type="date" :clear-icon="false" 
	 @change="changedate"
	v-model="params.byday"  />
	</view>
	<view class="uni-flex uni-between cell-t-8">
		<view class="uni-flex">
	<Warehouse
	v-show="indexS===0"
	 class="cell-r-8" @changeData="warehouseChange"  :defaultId="true"></Warehouse>
	 <Group
	 v-show="indexS===1"
	  @changeData="groupChange" :stylegray="stylegray" defaultValue="only"></Group>
	 <Market 
	 v-show="indexS===1"
	 class="cell-r-8"  ref="marketRef" @changeData="marketChange" :groupid="params.groupid"  defaultValue="only"></Market>
	<uni-easyinput suffixIcon="search" v-model="searchKeywords" placeholder="请输入SKU" @input="handleInput">
	</uni-easyinput>
	</view>
	</view>	
	</view>
   	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
   		<template v-slot:default="{row}"  > 
   		    <uni-card 
			class="n-shadow"  margin="8px">
					  <template v-slot:title>
						<uni-list>
							<uni-list-chat 
							:title="row.sku"
							 :avatar="row.image"
							  :note="row.name"
								>
								 </uni-list-chat>
						</uni-list>
					</template>
					  <view class=" uni-h6 uni-flex uni-between list-f-h">
						  <view class="uni-flex uni-h6 cell-text-8 uni-column ">
						   <text >库存 <text class="text-black">{{row.quantity}}</text> </text> 
						   <text>待入库 <text class="text-black">{{row.inbound}} </text> </text> 
						   <text>采购单价 <text class="text-black">{{row.price }} </text></text>  
						  </view>
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
						   <text>总货值  <text class="text-black">{{row.totalprice}} </text> </text> 
						   <text>在途货值  <text class="text-black">{{valueChange(row.inpasscost)}}</text> </text> 
						   <text>采购待付款  <text class="text-black">{{valueChange(row.inpasspay)}} </text> </text> 
						  </view>
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
						   <text>其它费用  <text class="text-black">{{row.otherFeer}}  </text> </text> 
						  </view>
					  </view>
   			</uni-card>
   		</template>
   	</GlobalTable>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance, onMounted, nextTick, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import inventoryRptApi from '@/api/erp/inventory/inventoryRptApi.js';
	import inventoryRptApiFBA from '@/api/amazon/inventory/inventoryRptApi.js';
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const searchheaderRef =ref();
	const marketRef  =ref();
	const state = reactive({
		tableData:{records:[],total:0},
		stylegray:'stylegray',
		params:{
			search:'',
			byday:"",
		},
	    indexS:0,
		searchKeywords:'',
	settlement:["本地仓","FBA仓"],
	})
	const{
		params,
		stylegray,
		searchKeywords,
		tableData,
		settlement,
		indexS,
	}=toRefs(state)
	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
	}
	function marketChange(marketplaceid){
		state.params.marketplaceid=marketplaceid;
		if(indexS===1){
			handlerQuery()
		}
	}
	function onClickItem(e){
		state.indexS = e.currentIndex;
		handlerQuery()
	}
   function valueChange(val){
	   if(val){
		   return val
	   }else{
		   return "0";
	   }
   }
	function warehouseChange(id){
		state.params.warehouseid = id
			const timer= setTimeout(()=>{
				handlerQuery()
				clearTimeout(timer);
			},200)
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}
	function loadTable(params){
		if(state.indexS===0){
			inventoryRptApi.inventoryCost(params).then((res)=>{
				state.tableData.records = res.records
				state.tableData.total =res.total
			})
		}else{
			inventoryRptApiFBA.inventoryCostFBA(params).then((res)=>{
				state.tableData.records = res.records
				state.tableData.total =res.total
			})
		}
	}
	

	function changedate(date){
			state.params.byday  = date;
			handlerQuery();
	}
  onMounted(()=>{
	  var date = new Date()
	  date.setTime(date.getTime());
	  nextTick(()=>{
		  state.params.byday = util.dateFormat(date);
	  })
	 
  })
	const handleInput = util.debounce(()=>{
		state.params.sku = state.searchKeywords;
		handlerQuery();
	},200)

</script>

<style scoped>
.list-f-h{
	line-height:20px;
}
	.header-wrap{
		background-color: #fff;
		padding:8px 16px;
	}
.c-width{
	width:180px;
	flex: 0 0 auto;
}
.bank-icon-wrap{
	background-color: #f5f5f5;
	display: inline-block;
	padding:6px 8px;
	border-radius: 20px;
}	
.data-num{
	font-size: 20px;
	font-weight: 600;
	color:#333;}
	
	.account-wrap{
		margin-top: 24px;
	}
	.card-wrap-body{
		margin-right: 8px;
	}
</style>
<template>
	<view class="header-wrap"> 
		<view >
			 <uni-easyinput suffixIcon="search" v-model="searchKeywords" placeholder="请输入SKU" @input="handleInput">
			 </uni-easyinput>
		</view>
	<view class="uni-flex uni-between cell-t-8">
		<view class="uni-flex">
	<Group @changeData="groupChange" :stylegray="stylegray" defaultValue="only"></Group>
	<Market class="cell-r-8"  ref="marketRef" @changeData="marketChange" :groupid="params.groupid"  defaultValue="only"></Market>
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
							  :note="row.pname"
							   :time="row.warehouse"
								>
								 </uni-list-chat>
						</uni-list>
					</template>
					  <view class=" uni-h6 uni-flex uni-between ">
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
						   <text >库存 <text class="text-black">{{row.afnWarehouseQuantity}}</text> </text> 
						   <text>可售库存 <text class="text-black">{{row.afnFulfillableQuantity}} </text> </text> 
						   <text>预留库存 <text class="text-black">{{row.afnReservedQuantity}} </text></text>  
						  </view>
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
						   <text>正在发货  <text class="text-black">{{row.afnInboundWorkingQuantity}} </text> </text> 
						   <text>待接收  <text class="text-black">{{row.afnInboundShippedQuantity}}</text> </text> 
						   <text>正在接收  <text class="text-black">{{row.afnInboundReceivingQuantity}} </text> </text> 
						  </view>
						  <view class="uni-flex uni-h6 cell-text-8 uni-column">
						   <text>不可用  <text class="text-black">{{row.afnUnsellableQuantity}}  </text> </text> 
						   <text>异常 <text class="text-black"> {{row.afnResearchingQuantity}} </text> </text> 
						  </view>
					  </view>
   			</uni-card>
   		</template>
   	</GlobalTable>
	<DetailsPopup :row="rowData" @getCustomer="getCustomer" :order="orderData" ref="popupRef"/>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
    import inventoryRptApi from "@/api/amazon/inventory/inventoryRptApi.js";
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const searchheaderRef =ref();
	const marketRef  =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		stylegray:'stylegray',
		params:{
			groupid:"",
			sort:'sku',
		},
		searchKeywords:'',
	})
	const{
		params,
		stylegray,
		searchKeywords,
		tableData,
	}=toRefs(state)

	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
	}
	function marketChange(marketplaceid,pointName){
		state.params.marketplaceid=marketplaceid;
		handlerQuery()
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}

	function loadTable(params){
			 inventoryRptApi.getWarehouse(params).then(res=>{
				 state.tableData.records=res.records;
				 state.tableData.total=res.total;
				 if(params.currentpage==1){
					 if(res.total>0){
					 	  state.summary=res.records[0].summary;
					 }else{
						 state.summary={};
					 }
				 }
				
				 
			 })
	}

	

	const handleInput = util.debounce(()=>{
		state.params.search = state.searchKeywords;
		handlerQuery();
	},200)


</script>

<style scoped>
	.uni-divider-line{
		margin-top:16px;
		padding-top:16px;
		border-top: 1px solid #eee;
	}
	.header-wrap{
		background-color: #fff;
		padding:8px 16px;
	}
	.form-box{
		padding:16px;
	}
	.big-font{
		color:#ff7315;
		font-size:18px;
		line-height: 18px;
		margin-left:2px;
	}
	.uni-order-header{
		padding:12px 8px 2px 8px;
	}
	.cell-r-16{
		margin-right:16px;
	}
</style>
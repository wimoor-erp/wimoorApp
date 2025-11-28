<template>
	<view class="c-herder-wrap">
		<view class="uni-flex">
		<Warehouse class="cell-r-8" @changeData="warehouseChange" :isgroup="true" :defaultId="true"></Warehouse>
		<uni-easyinput  v-model="searchKeywords" placeholder="请输入SKU" @input="handleInput"></uni-easyinput>
		</view>
		<view class="cell-t-8">
			<Datepicker @changedate="changedate" :unlimited='unlimited' dateType="month"  :clearIcon="false" :iswidth="false" :days="0" />
		</view>
	</view>
	<view class="white-bg">
	   	 <uni-table   :loading="loading"  emptyText="暂无更多数据">
	 				<uni-tr>
	 					<uni-th width="60">图片</uni-th>
	 					<uni-th width="120" >SKU</uni-th>
	 					<uni-th  width="85" @sort-change="(e)=>sortChange(e,'startqty')"  sortable>期初</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'endqty')" width="85" sortable>期末</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'purchase')" width="85" sortable>采购</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'otherin')" width="85" sortable>入库</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'otherout')" width="85" sortable>出库</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'shipment')" width="85" sortable>发货</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'dispatch')" width="85" sortable>调库</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'assembly')" width="85" sortable>组装</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'stock')" width="85" sortable>盘点</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'diff')" width="110" sortable>库存差异</uni-th>
						<uni-th @sort-change="(e)=>sortChange(e,'period')" width="100" sortable>周转个数</uni-th>
						<uni-th @sort-change="(e)=>sortChange(e,'turndays')" width="100" sortable>周转天数</uni-th>
	 				</uni-tr>
	 				<uni-tr v-for="row in tableData.records">
	 					<uni-td>
							<image style="width:40px;height:40px;" v-if="row.image" :src="row.image" ></image>
							<image style="width:40px;height:40px;" v-else src="/static/empty/noimage40.png" ></image>
						</uni-td>
	 					<uni-td>
	 						<view class="uni-h5">{{ row.sku }}</view>
							<view class="uni-h7">{{row.warehousename}}</view>
	 					</uni-td>
	 					<uni-td >{{ row.startqty }}</uni-td>
	 					<uni-td >{{ row.endqty }}</uni-td>
	 					<uni-td >{{ row.purchase }}</uni-td>
	 					<uni-td >{{ row.otherin }}</uni-td>
	 					<uni-td >{{ row.otherout }}</uni-td>
	 					<uni-td >{{ row.shipment }}</uni-td>
	 					<uni-td >{{ row.dispatch}}</uni-td>
	 					<uni-td >{{ row.assembly }}</uni-td>
	 					<uni-td >{{ row.stock }}</uni-td>
	 					<uni-td >{{ row.diff }}</uni-td>
						<uni-td >{{ row.period }}</uni-td>
						<uni-td >{{ row.turndays }}</uni-td>
	 				</uni-tr>
	 	</uni-table>
		<view class="uni-pagination-box">
			<uni-pagination :total="tableData.total" @change="changePages" prev-text="前一页" next-text="后一页" />
			</view>
	 </view>
</template>

<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import inventoryRptApi from '@/api/erp/inventory/inventoryRptApi.js';
	import { reactive, toRefs,ref,onMounted } from "vue";
	import util from '@/utils/util';
	const state = reactive({
			       tableData:{records:[],total:0},
			 			params:{
							days:540,
							pagesize:10,
							currentpage:1,
			 				sort:'',
							fromDate:new Date().getFullYear()+'-'+new Date().getMonth(),
							monthDate:new Date().getFullYear()+'-'+new Date().getMonth(),
			 			},
			 searchKeywords:'', 
	 }) 
	const{
			 tableData,
			 params,
			 monthDate,
			 searchKeywords,
	}=toRefs(state)
	function handleQurey(){
		loadTable(state.params);
	}
	const  handleInput = util.debounce(e=>{
				 state.params.search=e
				 state.params.sku=e
				 handleQurey()
	},500)
	
	function changedate(e){
		state.params.monthDate = e
		handleQurey()
	}
	
	function warehouseChange(id){
		state.params.warehouseid = id
		handleQurey()
	}

	function loadTable(params){
		inventoryRptApi.getAllInventorySummaryMonth(params).then(res=>{
			if(res.records){
				state.tableData.records = res.records
				state.tableData.total = res.total
			}
		
		})
	}
	function changePages(e){
		state.params.currentpage=e.current
		handleQurey()
	}
	function sortChange(e,th){
		state.params.sort = th
		if(e.order==="ascending"){
		state.params.order = "asc"	
		}else if(e.order==="descending"){
			state.params.order = "desc"
		}else{
			state.params.sort = ""
		}
		handleQurey()
	}
</script>

<style scoped>
	.white-bg{
		background-color: #fff;
	}
	.uni-pagination-box{
		padding:8px
	}

</style>
<style >
	.uni-table-td {
    vertical-align: middle;
}

</style>

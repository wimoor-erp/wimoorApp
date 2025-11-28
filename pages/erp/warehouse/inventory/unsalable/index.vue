<template>
	<view class="c-herder-wrap">
		<view class="uni-flex">
		<Warehouse class="cell-r-8" @changeData="warehouseChange" :isgroup="true" :defaultId="true"></Warehouse>
	    <uni-easyinput  v-model="searchKeywords" placeholder="请输入SKU" @input="handleInput">
	    </uni-easyinput>
		</view>
	</view>
	<view class="white-bg">
	<uni-segmented-control :current="current" :values="tabDatas" style="overflow: inherit;" style-type="text"
	 active-color="#ff6700" @clickItem="onClickItem" />	
       	 <uni-table   :loading="loading"  emptyText="暂无更多数据">
	 				<uni-tr>
	 					<uni-th width="60">图片</uni-th>
	 					<uni-th width="120" >SKU</uni-th>
						<template v-if="dateType">
	 					<uni-th  width="85" @sort-change="(e)=>sortChange(e,'qtysum0')"  sortable>0-30天</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'qtysum30')" width="95" sortable>30-60天</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'qtysum60')" width="85" sortable>60-90天</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'qtysum90')" width="95" sortable>90-180天</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'qtysum180')" width="102" sortable>180-365天</uni-th>
	 					<uni-th @sort-change="(e)=>sortChange(e,'qtysum365')" width="102" sortable>365天以上</uni-th>
						</template>
						<template v-else>
	 					<uni-th width="75" sortable>30天</uni-th>
	 					<uni-th width="85" sortable>60天</uni-th>
	 					<uni-th width="85" sortable>90天</uni-th>
						</template>
						<uni-th width="95" sortable>冗余库存</uni-th>
	 				</uni-tr>
					<uni-tr>
						<uni-td>
							<view>合计</view>
						</uni-td>
						<uni-td></uni-td>
						<template v-if="dateType">
						<uni-td>{{summary?.allqtysum0}}</uni-td>
						<uni-td>{{summary?.allqtysum30}}</uni-td>
						<uni-td>{{summary?.allqtysum60}}</uni-td>
						<uni-td>{{summary?.allqtysum90}}</uni-td>
						<uni-td>{{summary?.allqtysum180}}</uni-td>
						<uni-td>{{summary?.allqtysum365}}</uni-td>
						</template>
						<template v-else>
							<uni-td>{{summary?.allsalesum30}}</uni-td>
							<uni-td>{{summary?.allsalesum60}}</uni-td>
							<uni-td>{{summary?.allsalesum180}}</uni-td>
						</template>
						<uni-td>{{summary?.allnowinv90}}</uni-td>
					</uni-tr>
	 				<uni-tr v-for="row in tableData.records">
	 					<uni-td>
							<image style="width:40px;height:40px;" v-if="row.image" :src="row.image" ></image>
							<image style="width:40px;height:40px;" v-else src="/static/empty/noimage40.png" ></image>
						</uni-td>
	 					<uni-td>
	 						<view class="uni-h5">{{ row.sku }}</view>
							<view class="uni-h7">库存:{{row.qtysum}}</view>
	 					</uni-td>
						<template v-if="dateType">
	 					<uni-td >{{ row.qtysum0 }}</uni-td>
	 					<uni-td >{{ row.qtysum30 }}</uni-td>
	 					<uni-td >{{ row.qtysum60 }}</uni-td>
	 					<uni-td >{{ row.qtysum90 }}</uni-td>
	 					<uni-td >{{ row.qtysum180 }}</uni-td>
	 					<uni-td >{{ row.qtysum365}}</uni-td>
						</template>
						<template v-else>
	 					<uni-td >{{ row.salesum30 }}</uni-td>
	 					<uni-td >{{ row.salesum60 }}</uni-td>
	 					<uni-td >{{ row.salesum90 }}</uni-td>
						</template>
						<uni-td >{{ row.nowinv90 }}</uni-td>
	 				</uni-tr>
	 	</uni-table>
		<view class="uni-pagination-box">
			<uni-pagination :total="tableData.total" @change="changePages" prev-text="前一页" next-text="后一页" />
			</view>
	 </view>
</template>
<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
    import { reactive, toRefs,ref,onMounted } from "vue";
	import inventoryRptApi from '@/api/erp/inventory/inventoryRptApi.js';
	import util from '@/utils/util';
	const state=reactive({
		searchData: [
		  { value: 0, text: "本地仓" },
		  { value: 1, text: "海外仓" },
		],
		searchChecked:0,
		current:0,
		loading:true,
		tabDatas:['库龄', '出库数量',],
		tableData:{records:[],total:0},
		params:{days:540,
		        sort:'',
				order:'desc',
				currentpage:1,
				pagesize:10},
		searchKeywords:'',
		dateType:true,
		summary:{},
	})
	const{
		searchData,
		searchChecked,
		current,
		tabDatas,
		tableData,
		params,
		searchKeywords,
		dateType,
		summary,
		loading,
	}=toRefs(state)
	
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
	
	function warehouseChange(id,ftype){
		if(ftype){
			state.params.ftype = ftype
		}
		state.params.warehouseid = id
		handleQurey()
	}
	function handleQurey(){
		loadTable(state.params);
	}
	
	function loadTable(params){
		inventoryRptApi.findUnsalableReport(params).then(res=>{
			if(res.records){
				state.tableData.records = res.records
				state.tableData.total = res.total
				state.summary = res.records[0].summary
				state.loading =false
			}
		
		})
	}
	 const  handleInput = util.debounce(e=>{
			 state.params.search=e
			 handleQurey()
		 },500)
	function onClickItem(e){
		if(e.currentIndex===0){
			state.dateType = true
		}else{
			state.dateType = false
		}
	}	 
	
	function changePages(e){
		state.params.currentpage=e.current
		handleQurey()
	}
	onMounted(()=>{
	})
</script>

<style>
	.white-bg{
		background-color: #fff;
	}
	.uni-pagination-box{
		padding:8px
	}
	.uni-table-td {
    vertical-align: middle;
}
.uni-table>.uni-table-tr:nth-child(2){
	background-color: #f5f5f5;
}
</style>
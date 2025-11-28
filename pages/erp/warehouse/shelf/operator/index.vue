<template>
	<view class="c-herder-wrap  ">
		<view class="cell-b-8">
				 <uni-easyinput  v-model="searchKeywords" placeholder="请输入内容" @input="handleInput">
				 </uni-easyinput>
		</view>
	<view class="uni-between uni-row-center uni-flex">
	 <view class="uni-flex">
		<Warehouse class="cell-r-8"
		 @changeData="warehouseChange"
		 :isSelectShelf="true"
		 ></Warehouse>
		 <view class="form-box">
		<Datepicker @changedate="changedate" :unlimited='unlimited'  :clearIcon="false" :iswidth="false" :days="0" />
		</view>
	</view>
	</view>	
	</view>	
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}" > 
		    <uni-card class="n-shadow" margin="8px 12px" >
				<template v-slot:title >
					<view class="uni-list  ">
						<view class="uni-between uni-flex order-c-warp uni-row-center">
						<view class="uni-h6  ">{{row.opttime}}</view>
						<text class="text-orange">{{row.formname}}</text>
						</view>
					</view>
				</template>	
				<view class="c-pro-wrap">
					<view>
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else  src="/static/empty/noimage40.png" ></image>
					</view>
					<view class="c-text-wrap">
						<view class="uni-h4 uni-flex uni-row-center">
						  <text class="cell-r-8">{{row.sku}}</text>
						</view>
						<view class="uni-h6 text-omit-1">{{row.mname}}</view>
						<view class="uni-h6 cell-t-8">操作人：{{row.operator}}</view>
						<view class="cell-t-8">
						<text class="uni-h6 cell-r-8">{{row.optname}}</text>
						<text class="uni-orange-data">{{row.quantity}}</text>
						<text class="uni-h5   uni-row-center">  结余:{{row.quantity2}}</text>
						</view>
					</view>
				</view>
				<view class="order-footer-wrap">
					<view class="uni-h6  ">仓库/库位</view>
					<view class="uni-right">
					<view>
						{{row.wname}} / 
						{{row.shelfname}}
					</view>
					</view>
				</view>
			</uni-card>
		</template>
	</GlobalTable>
</template>

<script setup>
	import Warehouse from "@/components/header/warehouse.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import shelfApi from '@/api/erp/warehouse/shelf.js';
    import { reactive, toRefs,ref } from "vue";
	import util from '@/utils/util';
import { onMounted } from "vue";
const globalTableRef =ref()
const popup = ref()
	const state=reactive({
		params:{
			    startDate:util.getCurrentSevenDay()[0],
				endDate:util.getCurrentSevenDay()[1]+" "+'23:59:59',
				sort:'opttime',
				warehouseid:'',
				},
		searchKeywords:'',
		tableData:{records:[],total:0},
	})
	const{
		tableData,
		params,
		searchKeywords,
	}=toRefs(state)
	
	const handleInput=util.debounce(function(e){
		if(e){
			state.params.search=e
		}else{
		 delete	state.params.search;
		}
	   handleQurey()
	}, 500)	
	
   	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
		shelfApi.getOptList(params).then(res=>{
			if(res.records){
				state.tableData.records=res.records;
				state.tableData.total=res.total;
			}
		})
	}
	
	function warehouseChange(e){
		state.params.warehouseid =e
		handleQurey()
	}
	function changedate(date){
			if(date){
				state.params.startDate = date[0];
				state.params.endDate = date[1]+" "+'23:59:59';
			}
			handleQurey()
	}
	
</script>

<style scoped>
	.cell-b-16{
		padding-bottom:16px;
	}
	.order-c-warp{
		margin-right:12px;
		margin-left:12px;
	}
</style>
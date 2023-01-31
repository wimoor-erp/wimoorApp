<template>
	<SearchHeader ref="searchheaderRef">
			 	<template>
					   <Status @changeData="statusChange"></Status>
					   <Group @changeData="groupChange"></Group>
					   <Market  ref="marketRef" @changeData="marketChange" :groupid="param.groupid"></Market>
					   <Warehouse  @changeData="warehouseChange"></Warehouse>
					   <DatePicker title="开始日期" @changeData="startChange" :days="30"></DatePicker>
					   <DatePicker title="结束日期" @changeData="endChange" :days="0"></DatePicker>
					   <SearchType @changeData="searchChange"></SearchType>
					   <button class="searchbtn" @click="doHandlerQuery">查询</button>
				</template>
	</SearchHeader>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"  > 
		    <uni-card>
				<view><text class="light-font">货件编码:</text>{{row.shipmentid}}
				<button size="mini" @click="goPeiHuoPage(row)" style="width:70px;float:right">配货</button>
				</view>
				<view><text class="light-font">货件名称:</text>{{row.name}}</view>
				<view><text class="light-font">店铺仓库:</text>{{row.groupname}}-{{row.country}}-{{row.centerId}}</view>
				<view>
					 <text class="light-font">创建日期:</text>
					 <uni-dateformat :date="row.createdate"></uni-dateformat>  
				</view>
				<view v-if="row.arrivalTime"> 
				    <text class="light-font">预计到货日期</text>:
					<uni-dateformat :date="row.arrivalTime"></uni-dateformat>  
				</view>
				<view><text class="light-font">货件状态:</text>{{row.shipmentstatus}}
				<text v-if="row.sumrec" class="light-font">已收货:{{row.sumrec}}</text>
				</view>
				<view><text class="light-font">SKU个数:</text>{{row.skuamount}}
				<text class="light-font">发货数量: {{row.sumshipped}}</text>
				</view>
				<view><text class="light-font">物流公司:</text>{{row.company}}</view>
				<view><text class="light-font">物流渠道:</text>{{row.channame}}-{{row.transtypename}}</view>
			</uni-card>
		</template>
	</GlobalTable>

</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue';
	import GlobalTable from "@/components/globaltable/index.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import DatePicker from "@/components/header/datepicker.vue"
	import Status from "./components/status.vue"
	import SearchType from "./components/searchtype.vue"
	import shipmenthandlingApi from '@/api/erp/ship/shipmenthandlingApi.js'
    const searchheaderRef=ref(SearchHeader);
	const globalTableRef=ref(GlobalTable);
	const marketRef=ref(Market);
	const instance=getCurrentInstance();
	const state = reactive({tableData:{records:[],total:0},param:{groupid:"",marketplaceid:""}});
	const {tableData,param} = toRefs(state);	
	function handlerQuery(){
		setTimeout(function(){
			instance.proxy.$refs["globalTableRef"].loadTable(state.param);
		},300);
	}
	function loadTable(param){
		if(param.auditstatus==7){
			param.fromdate=''; 
			param.enddate='';
		}
		shipmenthandlingApi.getshipList(param).then(res=>{
			if(res&&res.records){
				state.tableData.records=res.records;
				state.tableData.total=res.total;
			}else{
				state.tableData.records=[];
				state.tableData.total=res.total;
			}
		})
	}
	function groupChange(groupid){
		state.param.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(groupid);
	}
	function marketChange(marketplaceid){
		state.param.marketplaceid=marketplaceid;
	}
	function warehouseChange(warehouseid){
		state.param.warehouseid=warehouseid;
	}
	function startChange(start){
		state.param.fromdate=start;
	}
	function endChange(end){
		state.param.enddate=end+" 23:59:59";
	}
	function statusChange(status){
		state.param.auditstatus=status.orderStatus;
		state.param.hasexceptionnum=status.hasexceptionnum;
	}
	function searchChange(search){
		state.param.searchtype=search.type;
		state.param.search=search.search;
	}
	function doHandlerQuery(){
		instance.proxy.$refs["searchheaderRef"].closeDrawer();
		handlerQuery();
	}
	function goPeiHuoPage(row){
		uni.navigateTo({
			"url": '/pages/erp/ship/quota/index?shipmentid=' +row.shipmentid
		});
	}
	onMounted(()=>{
		handlerQuery();
	})
	 
</script>

<style>
	.searchbtn{
		margin:10px;
	}
</style>

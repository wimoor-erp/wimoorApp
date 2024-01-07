<template>
	
	 					<uni-segmented-control :current="current" :values="tabDatas" style="overflow: inherit;" style-type="text"
	 					 active-color="#ff6700" @clickItem="onClickItem" />
	 <view class="uni-flex uni-header uni-row-center">
		 <view class="cell-r-8 uni-flex-item">
		 		 <uni-easyinput  v-model="searchKeywords" placeholder="单据编码" @input="handleInput">
		 		 </uni-easyinput>
				 </view>
		<SearchHeader ref="searchheaderRef" class="uni-flex ">
		   <view class="form-box">
		   <uni-forms ref="baseForm" >
				<uni-forms-item label="盘点仓库"  >
					<Warehouse class="cell-r-8" @changeData="warehouseChange"></Warehouse>
				</uni-forms-item>
				<uni-forms-item label="日期范围"  >
					<Datepicker @changedate="changedate" :unlimited='unlimited'  :clearIcon="true" :iswidth="false" :days="0" />
				</uni-forms-item>
			</uni-forms>
			<button class="searchbtn" type="primary" @click="dohandleQurey">查询</button>
			</view>
		</SearchHeader>  
	 </view>
	 <GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
	 	<template v-slot:default="{row}"  > 
	 	    <uni-card class="n-shadow" margin="8px 16px" >
	 			<template v-slot:title>
					<uni-list>
						<view class="uni-order-header uni-flex uni-between">
							<view class=" uni-flex uni-row-center">
								<text class="cell-l-8">{{row.number}}</text>
							</view>
							<text class="uni-text-gray " v-if="row.isworking===false">已完成</text>
							<text class="text-green" v-else>进行中</text>
						</view>
					</uni-list>
				</template>
				<view class="cell-list">
					<view class="uni-flex uni-between">
						<text>盘点位置</text>
						<text>{{row.wfname}}</text>
						<uni-tag v-for="item in row.warehouselist" :inverted="true" :text="item.name" />
					</view>
					<view class="uni-flex uni-between">
						<text>SKU个数</text>
						<text>{{row.skunum}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>盘点数</text>
						<text v-if="row.amount">{{row.amount}}</text>
						<text v-if="row.amountshelf">{{row.amountshelf}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>盘存金额</text>
						<text>￥{{row.amountprice}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>盘盈金额</text>
						<text class="text-green">￥{{row.overamountprice}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>盘亏金额</text>
						<text class="text-red">￥{{row.lossamountprice}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>创建时间</text>
						<text>{{row.createdate}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>备注</text>
						<text>{{row.remark}}</text>
					</view>
				</view>
				<view class=' uni-right'>
					<button  type="primary" @click="goDetails(row)" size="mini">详情</button>
				</view>
	 		</uni-card>
	 	</template>
	 </GlobalTable>
</template>

<script setup>
	import SearchHeader from "@/components/searchheader/base.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import stocktakingApi from '@/api/erp/inventory/stocktakingApi.js';
	import util from '@/utils/util';
     import { reactive ,toRefs,onMounted,ref} from "vue";
	 const globalTableRef =ref()
	 const searchheaderRef =ref()
	  const state = reactive({
		       tableData:{records:[],total:0},
		 			params:{
		 				fromDate:util.getCurrentSevenDay()[0],
		 				toDate:util.getCurrentSevenDay()[1],
		 				order:'desc',
		 				searchtype:"sku",
						isworking:'',
		 				sort:'opttime',
		 				auditstatus:"",
		 			},
		 			current:0,
		 tabDatas:['全部', '盘点中', '已完成',],
		 searchKeywords:'', 
	  }) 
	 const{
		tableData,
		 params,
		 current,
		 tabDatas,
		 searchKeywords,
	 }=toRefs(state)
	
		function goDetails(row){
			  uni.navigateTo({
			  	url:'./components/details?id='+ encodeURIComponent(JSON.stringify(row.id)),
			  });
		  }
		 const  handleInput = util.debounce(e=>{
			 state.params.search=e
			 handleQurey()
		 },500)
		
		function onClickItem(e){
			 if (state.current != e.currentIndex) {
				   state.current =  e.currentIndex;
				   if(e.currentIndex===0){
					   state.params.isworking=""
				   }else if(e.currentIndex===1){
					  state.params.isworking="1"
				   }else{
					   state.params.isworking="0"
				   }
			      }
				handleQurey()
		}
		function changedate(date){
				if(date){
					state.params.fromDate = date[0];
					state.params.toDate = date[1];
				}
		}
		function dohandleQurey(){
			searchheaderRef.value.closePop();
			handleQurey()
		}
		function handleQurey(){
			globalTableRef.value.loadTable(state.params);
		}
		
	 function warehouseChange(e){
				  state.params.warehouseid=e
	}
		function loadTable(params){
			stocktakingApi.list(params).then(res=>{ 
				if(res.records){
					state.tableData.records=res.records;
					state.tableData.total=res.total;
				}
			})
		}
	 
	   onMounted(()=>{
		 handleQurey();
	  })
</script>

<style scoped>
	.search-group{
		margin-right:16px;
	}
	.uni-header{
		margin:8px 16px;
	}
	.form-box{
		padding:24px 16px;
	}
	.uni-order-header{
		margin:16px 0px;
	}
.cell-list .uni-flex{
	margin-top: 8px;
	font-size:12px;
	color:#999;
}
.cell-list{
	margin-bottom: 16px;
}

</style>
<template>
	
	 <scroll-view class="scroll-view_H" :show-scrollbar="false" scroll-x="true" @scroll="scroll">
	 					<uni-segmented-control :current="current" :values="tabDatas" style="overflow: inherit;" style-type="text"
	 					 active-color="#ff6700" @clickItem="onClickItem" />
	 	</scroll-view>
	 <view class="uni-flex uni-header uni-row-center">
		 <view class="cell-r-8 uni-flex-item">
		 		 <uni-easyinput  v-model="searchKeywords" placeholder="输入换货单编码,SKU或名称" @input="handleInput">
		 		 </uni-easyinput>
				 </view>
		<SearchHeader ref="searchheaderRef" class="uni-flex ">
		   <view class="form-box">
		   <uni-forms ref="baseForm" >
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
	 	    <uni-card class="n-shadow" margin="8px 12px" >
	 			<template v-slot:title>
					<uni-list>
						<view class="uni-order-header uni-flex uni-between">
							<view class=" uni-flex uni-row-center">
								<text class="cell-l-8">{{row.number}}</text>
							</view>
							<text class="text-orange" v-show="row.auditstatus==='1'">待审核</text>
							<text class="text-orange" v-show="row.auditstatus==='2'">待收货</text>
							<text class="text-green" v-show="row.auditstatus==='3'">已完成</text>
							<text class="uni-text-gray" v-show="row.auditstatus==='0'">已取消</text>
						</view>
					</uni-list>
				</template>
				<view class="cell-list">
					<view class="uni-flex uni-between">
						<text>操作仓库</text>
						<text class="text-black">{{row.wname}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>SKU</text>
						<text class="text-black">{{row.sku}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>数量</text>
						<text class="text-black">{{row.amount}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>申请人</text>
						<text class="text-black">{{row.creator}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>申请时间</text>
						<text class="text-black">{{row.opttime}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>备注</text>
						<text class="text-black">{{row.remark}}</text>
					</view>
				</view>
				<view class=' uni-right'>
					<button  type="primary" @click="goDetails(row)" size="mini">详情</button>
				</view>
	 		</uni-card>
	 	</template>
	 </GlobalTable>
	 <view class="uni-affix-box">
	 	<view class="uni-affix">
			<view class="cell-b-button">
	 			<button  type="primary"
				 @click="goCreate"
				 class="uni-flex-item" >
	 				添加换货单
	 			</button>
				</view>
	 		</view>
	 	</view>
</template>

<script setup>
	import SearchHeader from "@/components/searchheader/base.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import changeApi from '@/api/erp/purchase/change/changeApi.js';
	import util from '@/utils/util';
     import { reactive ,toRefs,onMounted,ref, nextTick} from "vue";
	 const globalTableRef =ref();
	 const searchheaderRef =ref();
	  const state = reactive({
		       tableData:{records:[],total:0},
		 			params:{
		 				fromDate:util.getCurrentDefineDay(0,30)[0],
		 				toDate:util.getCurrentDefineDay(0,30)[1]+" "+"23:59:59",
		 				order:'desc',
		 				sort:'opttime',
		 				auditstatus:"",
		 			},
		 			current:0,
		 tabDatas:['全部', '待审核', '待收货',"已完成","已取消"],
		 searchKeywords:'', 
	  }) 
	 const{
		tableData,
		 params,
		 current,
		 tabDatas,
		 searchKeywords,
	 }=toRefs(state)
	     function goCreate(){
			 uni.navigateTo({
			 	url:'./components/create',
			 });
		 }
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
			   if(parseInt(e.currentIndex)===0){
				   state.params.auditstatus = ""
			   }else if(parseInt(e.currentIndex)===4){
				   state.params.auditstatus = "0"
			   }else{
				   state.params.auditstatus = e.currentIndex.toString()
			   }
				handleQurey()
		}
		function changedate(date){
				if(date){
					state.params.fromDate = date[0];
					state.params.toDate = date[1]+" "+"23:59:59";
				}
		}
		function dohandleQurey(){
			searchheaderRef.value.closePop();
			handleQurey()
		}
		function handleQurey(){
				globalTableRef.value.loadTable(state.params);
		}
		
		function loadTable(params){
			changeApi.list(params).then(res=>{ 
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
	.cell-b-button{
		padding:12px;
	}
	.search-group{
		margin-right:16px;
	}
	.uni-header{
		margin:8px 12px;
	}
	.form-box{
		padding:24px 16px;
	}
	.uni-order-header{
		margin:12px;
	}
.cell-list .uni-flex{
	margin-top: 8px;
	font-size:14px;
	color:#999;
}
.cell-list{
	margin-bottom: 16px;
}

.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

</style>
<style>
	.segmented-control__item{
		min-width: 90px!important;
	}
	.segmented-control{
		overflow: inherit!important;
	}
</style>
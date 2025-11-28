<template>
	<view class="header-wrap"> 
		<view class="search-group ">
				 <uni-data-select
				         v-model="params.searchtype"
				         :localdata="searchData"
				 		 :clear="false"
				         @change="changeType"
				       ></uni-data-select>
				 <uni-easyinput suffixIcon="search" v-model="params.search" placeholder="搜索..." @input="handleInput">
				 </uni-easyinput>
		</view>
		
	<view class="uni-flex uni-between cell-t-8">
	<view class="uni-flex">
	<Supplier  @change="supplierChange"/>
	<Market class="cell-r-8"  ref="marketRef" :indexC="1" @changeData="marketChange" :groupid="params.groupid"  ></Market>
	<Operator @changeData="operatorChange"
	 operator="product"/>
	</view>
	<SearchHeader ref="searchheaderRef" class="uni-flex">
			 	<view class="form-box">
					<view class="uni-flex uni-row-center uni-between cell-b-16">
						<text class="uni-h5 font-bold">筛选</text>
						<uni-icons
						 @click="hanldeClose"
						 type="closeempty" size="16"></uni-icons>
					</view>
					<uni-forms ref="baseForm" >
						<uni-forms-item label="产品状态"  >
							<uni-data-checkbox
							@change="proStateChange"
							 v-model="proState" :localdata="proStateData"></uni-data-checkbox>
						</uni-forms-item>
						<uni-forms-item label="产品名称"  >
					      <uni-easyinput   v-model="params.name" placeholder="请输入内容"></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item label="备注"  >
					      <uni-easyinput   v-model="params.remark" placeholder="请输入内容" ></uni-easyinput>
						</uni-forms-item>
					</uni-forms>
					   <button class="searchbtn" type="primary" @click="dohandlerQuery">查询</button>
				</view>
	</SearchHeader>
	</view>	
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
		      <uni-card class="n-shadow" margin="8px 12px"  > 
		    	  <view class="box-wrap-header uni-flex uni-between">
		    		  <view class="n-s-wrap">
		    			  <view class="text-blue cell-b-8">{{row.sku}}</view>
		    			  <view class="font-small">{{row.name}}</view>
		    		  </view>
		    		  <view class="text-orange font-bold">
		    			  ￥{{row.price}}
		    		  </view>
		    	  </view>
		    	  <view class="box-wrap-body">
		    		  <view class="cell-b-16">
		    		  <text class="cell-r-8"> 
		    		  	<uni-tag :circle="true" size='small' :text="row.category" 
		    			 custom-style="background-color: #f1f1f1; border-color: #f1f1f1; color: #999;"
		    			 />
		    		  </text>
		    		  <text class="cell-r-8">
		    		  	<uni-tag :circle="true" size='small' :text="row.weight+'kg'" 
		    			  custom-style="background-color: #f1f1f1; border-color: #f1f1f1; color: #999;"
		    			 />
		    			</text>
		    		  	<uni-tag :circle="true" size='small' 
						:text="row.length+'*'+row.width+'*'+row.height+'cm'" 
		    			 custom-style="background-color: #f1f1f1; border-color: #f1f1f1; color: #999;"
		    			/>
		    			</view>
		    			<view >
		    				<uni-link :href="row.purchaseUrl">{{row.supplier}}</uni-link>
		    				<text class="uni-h6 cell-l-8">供货周期 {{row.delivery_cycle}} 天</text>
		    			</view>
		    	  </view>
		    	  <view class="box-wrap-footer uni-flex uni-row-center uni-between">
		    		  <view class="uni-flex uni-row-bottom">
		    			  <view>
		    				  <text class="uni-h6">库存 </text>
		    				  <text class="uni-h4 text-black">{{row.fulfillable}}</text>
		    			  </view>
		    			  <text class="uni-h6 cell-l-16">在途库存 {{row.inbound}} </text>
		    		  </view>
		    		  <view>
		    			  <button type="primary" size="mini" @click="goDetails(row)">详情</button>
		    		  </view>
		    	  </view>
		      </uni-card> 
		</template>
	</GlobalTable>
</template>

<script setup>
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance,onMounted } from "vue";
	import Supplier from "@/components/header/supplier.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import materialApi from '@/api/erp/material/materialApi.js';
	import util from '@/utils/util.js';
	const globalTableRef = ref()
     const state = reactive({
     	 tableData:{records:[],total:0},
     	 proStateData:[
     	 	  {text:'启用',value:0},
     	 	  {text:'停用',value:1},
     	 	],
     	 proState:0,	
     	params:{
     		searchtype:"sku",
			supplier:"",
     	},
     	searchData:[
     		{text:'SKU',value:'sku'},
     		{text:'产品名称',value:'name'},
     		{text:'供应商',value:'suplier'},
     		{text:'备注',value:'remark'},
     	],
     })
     const{
     	params,
		searchData,
     	proStateData,
		proState,
     	tableData,
     }=toRefs(state)
	 
	 function handleQurey(){
	 	globalTableRef.value.loadTable(state.params);
	 }
	 
	 function loadTable(params){
	    materialApi.packageList(params).then((res)=>{
		  state.tableData.records = res.records;
		  state.tableData.total =res.total;
	})
	 }
	const handleInput=util.debounce(function(e){
	      state.params.search = e
		  handleQurey()
	}, 500)	
	 
	 function changeType(e){
		  state.params.searchtype =e
	 }
	 function supplierChange(e){
		 state.params.supplier = e
		 handleQurey()
	 }
	 function goDetails(row){
		 uni.navigateTo({
		 		url:'./components/details?id='+ row.id,
		 	})
	 }
	onMounted(()=>{
		handleQurey()
	}) 
</script>

<style scoped>
	.cell-l-16{
		margin-left: 16px;
		margin-bottom: 6px;
	}
	.box-wrap-footer{
		margin-top:8px;
	}
	.font-small{
		font-size: 13px;
	}
.header-wrap{
	padding:8px;
	background-color: #ffffff;
}
.form-box{
	padding:16px;
}
.cell-b-16{
	margin-bottom:16px;
}
.box-wrap-body{
	margin-top:8px;
}
</style>
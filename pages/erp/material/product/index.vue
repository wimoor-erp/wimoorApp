<template>
	<view class="serach-wrap">
	<view class="search-group ">
		<view style="margin-left: 1px;">
			 <uni-data-select
			         v-model="searchChecked"
			         :localdata="searchData"
			 		 :clear="false"
			         @change="changeType"
			       ></uni-data-select>
				   </view>
			 <uni-easyinput 
			  suffixIcon="search"
			  placeholder="搜索..."
			   @input="handleInput">
			 </uni-easyinput>
	</view>
	</view >
		<view class="white-bg">
			<view class="c-herder-wrap">
		<view class="uni-between uni-row-center uni-flex">
		 <view class="uni-flex flex-gap">
			<Operator  operator="owner" @changeData="ownerChange"></Operator>
			<Category @changeData="changeCategory" type="product" />
			<Tags @changeData="changeTags" />
		</view>
		<SearchHeader ref="searchheaderRef" class="uni-flex ">
		   <view class="form-box">
		   <uni-forms ref="baseForm" >
				<uni-forms-item label="产品类型"  >
					<uni-data-checkbox mode="tag" v-model="proType"
					@change="proTypeChange"
					 :localdata="proTypeData"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="产品状态"  >
						<uni-data-checkbox
						@change="proStateChange"
						 v-model="proState" :localdata="proStateData"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="SKU多搜"  >
					<uni-easyinput type="textarea"
					@input="skusChange"
					 autoHeight v-model="SKUs" placeholder="请输入本地SKU,以英文的逗号分割"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="备注"  >
					<uni-easyinput type="textarea"  v-model="remarks" placeholder="请输入"></uni-easyinput>
				</uni-forms-item>
			</uni-forms>
			<button class="searchbtn" type="primary" @click="dohandleQurey">查询</button>
			</view>
		</SearchHeader>  	
		</view>	
		</view>
		<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
			<template v-slot:default="{row}"> 
			   <view class="uni-flex flex-gap sku-wrap " @click="handleDetails(row)">
				   <view class="image-wrap">
					   <image v-if="row.image" :src="row.image" ></image>
					   <image v-else  src="/static/empty/noimage40.png" ></image>
				   </view>
				   <view class="text-wrap">
						  <view class="uni-h4 cell-t-8">{{row.sku}}</view> 
						  <view class="uni-h6 text-omit-2">{{row.name}}</view>
						  <view class="uni-flex flex-gap cell-t-8">
							  <uni-tag
							    v-for="(item,index) in row.TagNameList" 
							   :key="index"
							   inverted
							   size="mini"
							   :type="item.color"
							   :text="item.name">
							   </uni-tag> 
							  <uni-tag
							   inverted
							   v-show="row.issfg==='0'"
							   size="mini"
							   text="单独">
							   </uni-tag> 
							  <uni-tag
							   inverted
							   v-show="row.issfg==='1'"
							   size="mini"
							   type="warning"
							   text="组合">
							   </uni-tag> 
							  <uni-tag
							   inverted
							   v-show="row.issfg==='2'"
							   size="mini"
							   text="待组">
							   </uni-tag> 
							  <uni-tag
							   inverted
							   size="mini"
							   :text="row.category">
							   </uni-tag> 
						  </view>
						  <view class="uni-flex cell-t-8">
							  <view class="uni-flex ">
								  <text style="margin-top:8px;font-size: 12px;">￥</text>
								  <view class=" font-fi">{{row.price}}</view>
								  <view class=" uni-h6 cell-l-8"  style="margin-top:6px;">库存 {{row.fulfillable}}</view>
								</view>
						  </view>
						  <view class="uni-flex flex-gap cell-t-8">
							  <text class="uni-h6">{{row.weight}}kg</text>
							  <text class="uni-divider"></text>
							  <text class="uni-h6">
							  {{row.length}}*{{row.width}}*{{row.height}}cm
							  </text>
						  </view>
				   </view>
			   </view>
			</template>
		</GlobalTable>
		</view>
</template>

<script setup>
	import SearchHeader from "@/components/searchheader/base.vue";
	import Operator from "@/components/header/operator.vue";
	import Category from "@/components/header/category.vue";
	import Tags from "@/components/header/tags.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import materialApi from '@/api/erp/material/materialApi.js';
	import{reactive,ref,toRefs,onMounted}from"vue"
	import util from '@/utils/util';
	const globalTableRef = ref()
	const searchheaderRef = ref()
	const state = reactive({
		searchData:[
			{text:'SKU',value:0,label:'sku'},
			{text:'产品名称',value:1,label:'name'},
			{text:'供应商',value:2,label:'supplier'},
			{text:'备注',value:3,label:'remark'},
			],
			proTypeData:[
			  {text:'全部产品',value:''},
			  {text:'单独产品',value:0},
			  {text:'组合产品',value:1},
			  {text:'待组装产品',value:2},	
			],
			proStateData:[
			  {text:'启用',value:0},
			  {text:'停用',value:1},
			],
			SKUs:"",
			tableData:{records:[],total:0},
		proState:0,	
		searchChecked:0,
		proType:0,
		params:{
			sort:'opttime',
			searchtype:'sku',
			mtype:"product",
			taglist:[],
		},
		remarks:'',	
	})
	const {
		remarks,
		SKUs,
		proStateData,
		proState,
		searchData,
		proTypeData,
		proType,
		searchChecked,
		params,
		tableData,
	}=toRefs(state)
	

		
	function handleDetails(row){
			uni.navigateTo({
				url:'./components/details?id='+ encodeURIComponent(JSON.stringify(row.id+'-'+row.sku)),
		})
	}
	function changeType(e){
		state.params.searchtype = state.searchData[e].label
	}
   	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
			materialApi.getMaterialList(params).then((res)=>{
				state.tableData.records = res.records
				state.tableData.total =res.total
			})
	}
	function ownerChange(e){
		state.params.owner = e
		handleQurey()
	}
	function changeCategory(e){
		state.params.categoryid=e
		handleQurey()
	}
	
	function dohandleQurey(){
		state.params.searchlist = state.SKUs
		state.params.remark = state.remarks
		handleQurey()
		searchheaderRef.value.closePop()
	}
	function proTypeChange(e){
		state.params.issfg = e.detail.value
	}
	function proStateChange(e){
		state.params.isDelete = e.detail.value
	}
	function changeTags(e){
		if(e!==''){
			state.params.taglist=[e]
		}else{
			state.params.taglist = []
		}
		handleQurey()
	}
	
	const handleInput=util.debounce(function(e){
	      state.params.search = e
		  handleQurey()
	}, 500)	
	
	onMounted(()=>{
		handleQurey()
	})
</script>

<style scoped>
	.serach-wrap{
		padding:8px;
		background: #ff6700;
	}
	.search-group{
		background: #fff;
	}
	.white-bg{
		background-color: #fff;
	}
	.form-box{
		padding:24px;
	}
	.flex-gap{
		gap:8px;
	}
	.sku-wrap{
		margin-bottom: 24px;
		padding:0 16px;
	}
	.font-fi{
		font-size: 40rpx;
		font-weight:bold;
	}
</style>
<style >
	.image-wrap uni-image,.image-wrap image{
		width: 160px;
		height: 160px;
		border-radius: 16px;
	}
</style>
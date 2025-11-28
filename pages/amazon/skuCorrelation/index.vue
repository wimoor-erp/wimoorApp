<template>
	<view class="header-wrap"> 
				 <uni-easyinput suffixIcon="search" v-model="searchKeywords"
				  placeholder="搜索ASIN或平台SKU" @input="handleInput">
				 </uni-easyinput>
	<view class="uni-flex uni-between cell-t-8">
		<view class="uni-flex">
	<Group @changeData="groupChange" :stylegray="stylegray" defaultValue="only"></Group>
	<Market class="cell-r-8"  ref="marketRef" @changeData="marketChange" :groupid="params.groupid"  defaultValue="only"></Market>
	</view>
	</view>	
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
		    <uni-card class="n-shadow" margin="8px 16px">
				<view class="uni-list-product">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}
						</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
					</view>
					<view class="uni-right">
						<view class=" uni-h5">{{row.fulfillable}}</view>
						<text class="uni-h6">库存</text>
					</view>
				</view>
				<view class="uni-list-product cell-t-8">
					<image v-if="row.pimage" :src="row.pimage" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4  ">{{row.psku}}
						<uni-tag text="MSKU" inverted size="mini"></uni-tag></view>
						<view class="uni-h6 text-omit-1">{{row.pname}}</view>
					</view>
					<view class="uni-right">
						<view class=" uni-h5">{{row.fbaquantity}}</view>
						<text class="uni-h6">FBA库存</text>
					</view>
				</view>	
					<view class="uni-right uni-divider-line">
					<button
					 @click="proRef.openPop('bottom')"
					 size="mini" type="primary">重先绑定</button>
					</view>
			</uni-card>
		</template>
	</GlobalTable>
	<ProductList ref="proRef"/>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Market from "@/components/header/market.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import ProductList from"./components/productList.vue";
   import listApi from '@/api/amazon/listing/listingApi.js';
	import util from '@/utils/util.js';
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const proRef=ref(null)
	const marketRef  =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		 rowData:{},
		stylegray:'stylegray',
		params:{
			groupid:"",
			sort:"psku"
		},
		searchKeywords:'',
	})
	const{
		params,
		stylegray,
		searchKeywords,
		tableData,
		rowData,
	}=toRefs(state)

	function groupChange(groupid){
		state.params.groupid=groupid;
		instance.proxy.$refs["marketRef"].handlerQuery(state.params.groupid);
		
	}
	function marketChange(marketplaceid){
		state.params.marketplaceid=marketplaceid;
		handlerQuery()
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}

	function loadTable(params){
			listApi.getProductInfoWithFnSKU(params).then(data=>{
				if(data&&data.records){
					state.tableData.records=data.records;
					state.tableData.total=data.total; 
				}else{
					state.tableData.records=[];
					state.tableData.total=0; 
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
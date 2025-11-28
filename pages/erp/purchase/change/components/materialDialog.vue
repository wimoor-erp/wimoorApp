<template>
	<uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popup-content" >
				<view class="uni-flex uni-row-center uni-between cell-b-16">
					<text class="uni-h5 font-bold">选择SKU</text>
					<uni-icons
					 @click="hanldeClose"
					 type="closeempty" size="16"></uni-icons>
				</view>	
				<view class="cell-t-8">
					<uni-easyinput    placeholder="搜索SKU" @input="searchInput"></uni-easyinput>
					</view>
				<scroll-view  scroll-y="true" class="scroll-Y">
			<view >
				<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
					<template v-slot:default="{row}"> 
			<view
			 @click="handleAdd(row)"
			 class="uni-flex uni-row product-list" >
				<view class="">
					<image v-if="row.image" class="image60" :src="row.image"></image>
					<image v-else  class="image60" src="/static/empty/noimage40.png"></image>
				</view>
				<view class="message-box ">
					<view class=" uni-flex uni-between uni-row-center"> 
					<view class="shink-flex">
					<view class="title">{{row.sku}}</view>
					<view class="sub-text text-omit-1">{{row.name}}</view>
					</view>
					<view class='data uni-flex uni-column uni-right'>
						<text>{{row.fulfillable}}</text>
						<view class="sub-text"> 可用库存 </view> 
					</view>
					</view>
					<view class="uni-row uni-flex sub-text">
						<text>供应商
						<uni-link  :href="row.purchaseUrl" fontSize	="12" :text="row.supplier"></uni-link>
						</text>
					</view>
					<view class="uni-cell-top inline">    
					<text class="tag-info-plain text-orange" v-if="row.issfg=='1'">组合产品</text>&nbsp;
					</view>
				</view>
			</view>
					</template>
					</GlobalTable>	
			</view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import GlobalTable from "@/components/globaltable/index.vue";
	import materialApi from '@/api/erp/material/materialApi.js';
	import util from '@/utils/util';
	const popup =ref();
	const globalTableRef = ref();
	const emit = defineEmits(["getProductData","getparentSku"]);
	const props=defineProps({
		warehouseid:'',
		pmainid:null,
	})
	const state= reactive({
	   params:{
		   search:"",
		   ftype:"shipment",
		   warehouseid:'',
		   searchtype:"sku",
	   },
	  tableData:{records:[],total:0},
	  checkarr:[],
	  isffg:false,
	})
	const{
		items,
		params,
		tableData,
		checkarr,
		isffg,
	}=toRefs(state)
	function show(val){
		state.isffg = val
		popup.value.open("bottom");
		nextTick(()=>{
			handleQurey()
		})
	}
	const searchInput=util.debounce(function(e){
	      state.params.search = e
		  handleQurey()
	}, 500)	
	function hanldeClose(){
		popup.value.close();
	}
   function loadTable(params){
	   if(state.isffg==='psku'){
		 params.mainid = null;
		 params.issfg = "1";  
	   }
	   if(state.isffg==='subsku'){
		  params.mainid = props.pmainid; 
	   }
	   params.warehouseid = props.warehouseid;
	   materialApi.getMaterialList(params).then((res)=>{
				state.tableData.records = res.records;
				state.tableData.total = res.total;
		})
   	 
   }
	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}

   function handleAdd(row){
	   if(state.isffg==='psku'){
		   emit("getparentSku",row)
	   }else{
		   emit("getProductData",row);
	   }
	   hanldeClose()
   }
   
	defineExpose({
		show,
	})
	onMounted(()=>{
		
	})
</script>

<style scoped>
	.text-orange{
		border-color:#ff7315!important;
	}
	.scroll-Y{
		height:500px;
	}
   .popup-content{
	   padding:12px;
   }
	.shink-flex{
		flex-shrink: 1;
	}

	.image60{
		width: 60px;
		height:60px;
		border-radius:8px;
	}
	.product-list{
		padding:16px 0px;
	}
	.message-box{
		margin-left:8px;
		flex:1;
		margin-bottom:12px;
	}
	.message-box .title{
		font-weight: 700;
		color:#333;
		margin-bottom:4px;
	}
	.message-box .sub-text{
		color:#999;
		font-size:12px;
		font-weight: 500;
	}
	.message-box .data{
		margin-top:8px;
		font-weight:700;
		color:#333;
		font-size:14px;
		white-space: nowrap;
		margin-left:8px;
	}
	.uni-cell-top{
		margin-top:8px;
	}
</style>
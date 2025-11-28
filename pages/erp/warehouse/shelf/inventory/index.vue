<template>
	<view class="header-wrap"> 
		<view class="uni-flex uni-between ">
			<view class="cell-r-8 cell-b-8">
			<uni-data-picker placeholder="请选择仓库" popup-title="请选择库位"
			:localdata="shelfData"
			v-model="shelfId"
			:clearIcon="false"
			:map="{text:'numbername',value:'id'}"
			@change="shelfChange" />
			</view>
		 <uni-easyinput suffixIcon="search" v-model="searchKeywords" placeholder="搜索SKU" @input="handleInput">
		 </uni-easyinput>
		</view>
	<view >
	<view class=" block-segmented">
	<uni-segmented-control :current="indexS" :values="shelf" @clickItem="shelfswitch"
	styleType="button" activeColor="#ff7315"></uni-segmented-control>
	</view>
	</view>	
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
		    <uni-card class="n-shadow" margin="8px 12px">
				<view class="uni-list-product">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
					</view>
					<view class="uni-right">
						<view class=" uni-h5 big-font cell-b-8">{{row.quantity}}</view>
						<text v-if="indexS===0" class="uni-h6 ">库位库存</text>
						<text v-else  class="uni-h6 ">暂存库存</text>
					</view>
				</view>
		        <view class="uni-flex  uni-between uni-row-bottom cell-t-8">
					<text class="uni-h6">{{row.warehousename}}</text>
					<text class="uni-h6 cell-r-16">{{row.shelfname}}</text>
				</view>
					<view class="uni-right uni-divider-line">
					<button
					v-if="indexS===0"
					 @click="underShelf(row)"
					 size="mini" type="primary">下架</button>
					<button
					v-else
					 @click="onShelf(row)"
					 size="mini" type="primary">上架</button>
					</view>
			</uni-card>
		</template>
	</GlobalTable>
	<uni-popup ref="popup" background-color="#fff" @change="change"  type="dialog">
		<uni-popup-dialog  mode="input" :title="popuptitle" :value="shelfnum"
			placeholder="请输入内容" @confirm="dialogInputConfirm"></uni-popup-dialog>
	</uni-popup>	
</template>

<script setup>
	import Datepicker from "@/components/header/datepicker.vue";
	import SearchHeader from "@/components/searchheader/base.vue";
    import { reactive, toRefs,ref,getCurrentInstance, } from "vue";
	import GlobalTable from "@/components/globaltable/index.vue";
    import shelfproductApi from '@/api/erp/warehouse/shelfproductApi.js';
	import shelfApi from '@/api/erp/warehouse/shelf.js';
	import util from '@/utils/util.js';
import { onMounted } from "vue";
	const instance=getCurrentInstance();
	const globalTableRef =ref();
	const popup =ref();
	const state = reactive({
		 tableData:{records:[],total:0},
		 shelf:["已上架","未上架"],
		params:{
			searchtype:"sku",
		    addressid:'',
			shelfid:'',
			allchildren:true,
		},
		searchKeywords:'',
		shelfId:'',
		indexS:0,
		shelfData:[],
		popuptitle:"",
		shelfnum:0,
		underParams:{},
		onParams:{},
	})
	const{
		params,
		shelf,
		searchKeywords,
		tableData,
		indexS,
		shelfId,
		shelfData,
		popuptitle,
		shelfnum,
		underParams,
		onParams,
	}=toRefs(state)
    function shelfswitch(e){
		state.indexS = e.currentIndex;
		handlerQuery();
	}
	
    function shelfChange(e){
		state.params.addressid = e.detail.value[0].value;
		state.params.shelfid = e.detail.value[1].value;
	}
	function handlerQuery(){
		instance.proxy.$refs["globalTableRef"].loadTable(state.params);
	}

	function loadTable(params){
		if(state.indexS===0){
			shelfproductApi.getShelfInventoryList(params).then(function(response) {
				if(response){
					state.tableData.records = response.records;
					state.tableData.total=response.total;
				}else{
					state.tableData.records = [];
					state.tableData.total=0;
				}
			})
		}else{
		  var obj = {};
		   obj.shelfid ="";
		   obj.mtype ="product";
		   obj.sort ="orderitem";
		   obj.addressid = 	params.addressid;	
		   obj.currentpage = params.currentpage;	
		   obj.loadType = 	params.loadType;	
		   obj.pagesize = 	params.pagesize;
		   obj.order = 	params.order;
			shelfproductApi.getShelfList(obj).then(res=>{
				if(res){
					state.tableData.records = res.records;
					state.tableData.total=res.total;
				}else{
					state.tableData.records = [];
					state.tableData.total=0;
				}
			})
		}
	}

    function getshelfTree(defaultid){
		 shelfApi.getWarehouseShelf().then(function(res){
	         state.shelfData = res;
			 state.shelfId =res[0].id;
			 state.params.addressid = res[0].id;
			 handlerQuery()
		 });
    }
	
	const handleInput = util.debounce(()=>{
		state.params.search = state.searchKeywords;
		handlerQuery();
	},200)
  onMounted(()=>{
	  getshelfTree()
  })
  
  function underShelf(row){
	  popup.value.open("center");
	  state.popuptitle ="下架";
	  state.shelfnum = row.quantity;
	  state.underParams.materialid = row.materialid;
	  state.underParams.shelfid = row.shelfid;
	  state.underParams.opt = 0;
	  
  }
  function onShelf(row){
	  popup.value.open("center");
	  state.popuptitle ="上架";
	  state.shelfnum = row.quantity;
	  if(state.shelfId!==''&&state.shelfId!==state.params.addressid){
		  state.onParams.shelfid =state.shelfId;
	  }else{
		  uni.showToast({
		  	title:'请在左上选择库位！',
		  	icon:'none',
		  	duration:2000
		  })
		  popup.value.close();
	  }
	  state.onParams.materialid =row.materialid;
	  state.onParams.warehouseid =row.warehouseid;
	  state.onParams.opt = 1;
  }
  
  function dialogInputConfirm(e){
	  if(e){
		 if(state.indexS===0){
		  state.underParams.quantity = e;
		  var arr =[];
		  arr.push(state.underParams);
		  shelfproductApi.subShelfInventory(arr).then(res=>{
			  if(res.code === "201"){
				  uni.showToast({
				  	title:'下架成功！',
				  	icon:'none',
				  	duration:2000
				  })
			  }
		  })	
		 }else{
			 state.onParams.quantity = e;
			 var arr =[];
			 arr.push(state.onParams);
			 shelfproductApi.addShelfInventory(arr).then(res=>{
				 if (res.code == "201") {
				 uni.showToast({
				 	title:'上架成功！',
				 	icon:'none',
				 	duration:2000
				 })
				 }
			 })
		 }
	  }else{
		  uni.showToast({
		  	title:'请输入！',
		  	icon:'none',
		  	duration:2000
		  })
	  }
  }
</script>

<style scoped>
	.uni-divider-line{
		margin-top:16px;
		padding-top:16px;
		border-top: 1px solid #eee;
	}
	.header-wrap{
		background-color: #fff;
		padding:8px 12px;
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
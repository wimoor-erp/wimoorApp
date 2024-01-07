<template>
	<uni-segmented-control :current="current" :values="tabDatas" style-type="text"
	 active-color="#ff6700" @clickItem="onClickItem" />
	 <view class="uni-flex uni-header uni-row-center">
		 <view class="uni-flex-item">
		 <view class="search-group ">
		 		 <uni-data-select
		 		         v-model="searchChecked"
		 		         :localdata="searchData"
		 		 			 :clear="false"
		 		         @change="changeType"
		 		       ></uni-data-select>
		 		 <uni-easyinput  v-model="searchKeywords" placeholder="请输入内容" @input="handleInput">
		 		 </uni-easyinput>
		 </view>
		 </view>
		<SearchHeader ref="searchheaderRef" class="uni-flex">
		   <view class="form-box">
		   <uni-forms ref="baseForm" >
			   <uni-forms-item label="单据类型"  >
			   	<uni-data-checkbox v-model="orderType" @change="orderTypeChange" :localdata="orderTypeData"></uni-data-checkbox>
			   </uni-forms-item>
			   <uni-forms-item label="加工状态"  >
			   	<uni-data-checkbox v-model="processType" @change="processTypeChange" :localdata="processTypeData"></uni-data-checkbox>
			   </uni-forms-item>
			   <uni-forms-item label="本地仓库"  >
			   	<Warehouse  @changeData="warehouseChange"></Warehouse>
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
								<uni-tag :mark="true" :text="row.ftype==='ass'?'组装单':'拆分单'" type="warning" size="mini" />
								<text class="cell-l-8">{{row.number}}</text>
							</view>
							<text class="text-orange" v-show="row.auditstatus===1||row.auditstatus===2">处理中</text>
							<text class="uni-text-gray" v-show="row.auditstatus===3">已完成</text>
							<text class="uni-text-gray" v-show="row.auditstatus===4">已终止</text>
							<text class="uni-text-gray" v-show="row.auditstatus===5">已作废</text>
						</view>
					</uni-list>
				</template>
				<view class="uni-list-product">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
					</view>
					<view class="uni-right">
						<text class="uni-h6">加工数量</text>
						<view class="cell-t-4 ">{{row.amount}}</view>
					</view>
				</view>
				<view class="cell-t-8 uni-right">
					<text class="uni-h6 text-red">可处理数 {{parseInt(row.hasqty)}}</text>
				</view>
				<view class="cell-list">
					<view class="uni-flex uni-between">
						<text>操作仓库</text>
						<text>{{row.wname}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>创建人</text>
						<text>{{row.creator}}</text>
					</view>
					<view class="uni-flex uni-between">
						<text>操作时间</text>
						<text>{{row.opttime}}</text>
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

<script >
	import SearchHeader from "@/components/searchheader/base.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import Warehouse from "@/components/header/warehouse.vue";
	import GlobalTable from "@/components/globaltable/index.vue";
	import {getCountNum } from '@/api/erp/assembly/assemblyApi.js'
	import {listForm,downloadInfoWord,deleteFrom } from '@/api/erp/assembly/assemblyApi.js'
	import util from '@/utils/util';
	export default {
		components:{SearchHeader,Datepicker,Warehouse,GlobalTable,},
	  data() {
	    return {
			tableData:{records:[],total:0},
			orderTypeData:[
				{ value: 0, text: "全部" },
				{ value: 1, text: "组装单" },
				{ value: 2, text: "拆分单" },
			],
			processTypeData:[
				{ value: 0, text: "全部" },
				{ value: 1, text: "可处理" },
				{ value: 2, text: "无库存" },
			],
			orderType:0,
			processType:0,
			params:{
				fromDate:util.getCurrentSevenDay()[0],
				toDate:util.getCurrentSevenDay()[1],
				order:'desc',
				searchtype:"sku",
				sort:'opttime',
				auditstatus:"",
				searchSession:util.getCurrentSevenDay()[1],
				warehouseid:'',
			},
			current:0,
			tabDatas:['全部', '处理中', '已完成',"已终止","已作废"],
	      searchChecked: 0,
		  searchKeywords:'',
	      searchData: [
		  { value: 0, text: "SKU" },
		  { value: 1, text: "单据编码" },
		  { value: 2, text: "货件编码" },
		],
	    };
	  },
	  methods: {
		  goDetails(row){
			  uni.navigateTo({
			  	//跳转加工单详情页
			  	url:'./components/details?id='+ encodeURIComponent(JSON.stringify(row.id)),
			  });
		  },
		  warehouseChange(e){
			  this.params.warehouseid=e
		  },
	    changeType(e) {
			if(e===0){
				this.params.searchtype='sku'
			}else if(e===1){
				this.params.searchtype='number'
			}else{
				this.params.searchtype='shipment'
			}
	    },
		orderTypeChange(e){
			this.orderType=e.detail.value;
			if(this.orderType===1){
				this.params.ftype="ass"
			}else if(this.orderType===2){
				this.params.ftype="dis"
			}else{
				this.params.ftype=""
			}
		},
		processTypeChange(e){
			this.processType=e.detail.value
			if(this.processType===1){
				this.params.operate="true"
			}else if(this.processType===2){
				this.params.operate="false"
			}else{
				this.params.operate=""
			}
		},
		handleInput:util.debounce(function(e){
		   this.params.search=e
		   this.handleQurey()
		}, 500),
		onClickItem(e){
			 if (this.current != e.currentIndex) {
				   this.current =  e.currentIndex;
				   if(e.currentIndex===0){
					   this.params.auditstatus=""
				   }else{
					   this.params.auditstatus = (e.currentIndex+1).toString();
				   }
			      }
				  if(this.params.auditstatus==='2'){
					 this.params.fromDate=""
					 this.params.toDate=""
				  }else{
					  if(!this.params.fromDate){
						  this.params.fromDate=util.getCurrentSevenDay()[0]
						  this.params.toDate=util.getCurrentSevenDay()[1]
					  }
				  }
				  this.handleQurey()
		},
		changedate(date){
				if(date){
					this.params.fromDate = date[0];
					this.params.toDate = date[1];
				}
		},
		getOrderNum(){
			getCountNum().then(res=>{
				if(res){
					this.tabDatas[1]=res.inProgressNum;
					if(res.pendingNointerNum){
					  this.tabDatas[1]=this.tabDatas[1]+res.pendingNointerNum;
					}
					if(res.pendingNum){
						this.tabDatas[1]=this.tabDatas[1]+res.pendingNum;
					}
					this.tabDatas[1]="处理中 ("+this.tabDatas[1]+')'
				}
			})
		},
		dohandleQurey(){
			this.$refs["searchheaderRef"].closePop();
			this.handleQurey()
		},
		handleQurey(){
			this.$refs["globalTableRef"].loadTable(this.params);
		},
		loadTable(params){
			listForm(params).then(res=>{
				if(res.records){
					this.tableData.records=res.records;
					this.tableData.total=res.total;
				}
			})
		}
	  },
	  mounted(){
		this.handleQurey();
		this.tabDatas[1]="处理中"+"(0)"
		this.getOrderNum();
	  }
	};
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
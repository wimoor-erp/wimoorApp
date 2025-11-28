<template>
	<uni-popup ref="popup" background-color="#fff">
		<scroll-view :scroll-y="true" class="scroll-h">
		<view class="popoup-header">
		<view class="uni-list-product">
			<image v-if="infoMap.image" :src="infoMap.image" ></image>
			<image v-else src="/static/empty/noimage40.png" ></image>
			<view class=" uni-flex-item">
				<view class="uni-h4">{{infoMap.sku}}
				</view>
				<view class="uni-h6 text-omit-1">{{infoMap.name}}</view>
				<view class="cell-t-8">
					<text class="uni-h7 cell-r-8">AISN:{{infoMap.asin}}</text>
					<text class="uni-h7 ">首次上架:{{infoMap.opendate}}</text>
				</view>
			</view>
			<view class="uni-right">
				<view class=" uni-h5">{{infoMap.fulfillable}}</view>
			  <text @click="editRemark">
				<uni-icons type="compose" size="16" color="#999"></uni-icons>
				<text class="uni-h6">备注</text>
			  </text>	
			</view>
		</view>
		</view>
		<view class="remark-wrap" v-show="infoMap.anysisremark">
			备注:{{infoMap.anysisremark}}
		</view>
		<view class="popup-body">
				<Tabs  @change="tabChange"/>
			<view class="chart-box form-box">
			   <Datepicker @changedate="changedate"  :clearIcon="false" :iswidth="false" :days="0" />
			   <view class="my-chart" >
				 <l-echart 
				  style="width: 100;height:300px"
				  ref="saleChart" @finished="init"></l-echart>  
			   </view>
			</view>
		</view>
		<view class="popoup-footer">
			<scroll-view scroll-x="true" style="width:100%">
			<uni-table border stripe emptyText="暂无更多数据" >
				<!-- 表头行 -->
				<uni-tr>
					<uni-th width="100" align="left"><text class="nowrape">项目名称</text></uni-th>
					<uni-th width="60" align="left">汇总</uni-th>
					<uni-th 
					width="60"
					v-for="(item,index) in tableData?.th"
					align="left">{{item}}</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in tableData?.tr" :key="index">
					<uni-td>{{item.name}}</uni-td>
					<uni-td>{{item.summary}}</uni-td>
					<uni-td 
					v-for="sub in tableData.column[index]"
					>{{sub}}</uni-td>
				</uni-tr>
			</uni-table>
			</scroll-view>
		</view>
		</scroll-view>
	</uni-popup>
		<uni-popup ref="popupRemark" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="备注" 
			:value="infoMap.remark2"
			placeholder="请输入" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,nextTick, computed} from 'vue';
	import productAnysApi from '@/api/amazon/product/productAnysApi.js';
	import Datepicker from "@/components/header/datepicker.vue";
	import Tabs from "./tabs.vue";
	import util from '@/utils/util.js';
	import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'
	// nvue 不需要引入
	// #ifdef VUE2
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min.js';
	// #endif
	// #ifdef VUE3
	// #ifdef MP
	// 由于vue3 使用vite 不支持umd格式的包，小程序依然可以使用，但需要使用require
	const echarts = require('./../../../../uni_modules/lime-echart/static/echarts.min.js');
	// #endif
	// #ifndef MP
	// 由于 vue3 使用vite 不支持umd格式的包，故引入npm的包
	import * as echarts from 'echarts/dist/echarts.esm.js';
	// #endif
	// #endif
	const popup=ref();
	const popupRemark=ref();
	const saleChart =ref(null);
	const emit = defineEmits(['submit']);
	  const state=reactive({
		  infoMap:{},
		   params:{
			   ftype:'sales',
			   fromDate:util.getCurrentSevenDay()[0],
			   endDate:util.getCurrentSevenDay()[1]+" "+'23:59:59',
		   },
		   tableData:{
			   tr:[],
			   column:[],
		   },
		   
	  });
	  const {infoMap,params,tableData} = toRefs(state);
		function openPop(type,row){
			popup.value.open(type);
			nextTick(()=>{
				loadTable(row)
			})
		}
		function closePop(){
			popup.value.close()
		}
		 defineExpose({
			  openPop,closePop,
		   })
	function editRemark(){
		popupRemark.value.open('center');
		state.infoMap.remark2 = state.infoMap.anysisremark 
	}	  
	 function dialogInputConfirm(e){
		 	productAnysApi.updateAnyRemark({"pid":state.infoMap.id,"remark":e}).then((res)=>{
		 		if(res){
		 			uni.showToast({
		 				title:'修改成功！',
		 				icon:'none',
		 				duration:2000
		 			})
					state.infoMap.anysisremark = e
		 		}
		 	});
	 }
    function tabChange(type){
		state.params.ftype = type
		getData(state.params);
	}		   
	function loadTable(row){
			productAnysApi.productdetail({"pid":row.id}).then((res)=>{
				state.infoMap=res;
				state.params.sku = res.sku;
				state.params.groupid =res.groupid;
				state.params.marketplaceid =res.marketplaceid;
				getData(state.params);
			});
	 }

	function getChartsline(series,labels,legendData){
		  var option = {
			  tooltip : {
			  			trigger : 'axis',
			  		},
			  legend: {
			  	data:legendData,
			  	top:16,
			  	icon: "circle",
			  	itemWidth:6,
			  	itemHeight:6,
			  },
			  color:["#ff7315","#67c23a","#2864c5","#e6a23c"],
			  xAxis: {
			  	boundaryGap:false,
			  	data:labels,
			  	axisLine:{
			      show: false
			  	},
			  	axisTick:{
			  	show: false
			  	},
			  	axisLabel:{
			       color:"#acb0b9"
			  	},
			  },
			  grid:{
			  	right:24,
			  	left:45,
			    bottom:32
			  },
			  yAxis: {
			  	axisLabel:{
			       color:"#acb0b9"
			  	},
			  	splitLine:{
			  		lineStyle:{
			  		color:"#F2F3F6"
			  		}
			  	}
			  },
			  series:series,
	}
	saleChart.value.init(echarts,mychart=>{
			mychart.setOption(option)
	})
	
	}
	
	
     function getData(params){
	  const series =[];
      var labels = [];
	  const legend =[];
	  state.tableData.column =[];
	  state.tableData.tr=[];
	  productAnysApi.getChartData(params).then(res=>{
		  res.forEach(item=>{
			  var line ={
			  			showSymbol: false,
			  			smooth: 0.5,
			  			type: 'line',
			  };
			  line.name =item.name;
			  line.data = item.data;
			  labels =item.labels
			  legend.push(item.name);
			  series.push(line);
			   state.tableData.tr.push({summary:item.summary})
		  })
		  getChartsline(series,labels,legend)
		   state.tableData.th = labels;
		   series.forEach(item=>{
			   state.tableData.column.push(item.data)
		   })
		   legend.forEach((item,index)=>{
			   state.tableData.tr[index].name =item
		   })
		   
	  })
  }
  

  
</script>

<style scoped>
.popoup-header{
	padding:16px;
	border-bottom:1px solid #eee;
}
.popup-body{
	padding:16px;
}
.chart-box{
	margin-top:16px;
	
}
.nowrape{
	white-space: nowrap;
}
.my-chart{
	margin-top: 8px;
}
.scroll-h{
	height:calc(100vh  - 100px);
}
.popoup-footer{
	padding:16px;
}
.remark-wrap{
	padding:16px;
	border-bottom:1px solid #eee;
	font-size: 12px;
	background-color: #f5f5f5;
}
</style>
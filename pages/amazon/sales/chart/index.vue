<template>
	<view class="header-wrap">
	 <view class="cell-t-8 form-box" >
	 <Datepicker @changedate="changedate"  :clearIcon="false" :dateLength="30" :iswidth="false" :days="1" />
	 </view>
	<view class="uni-flex uni-between uni-row-center cell-t-8">
		<view class="uni-flex">
	<Group @changeData="groupChange" :stylegray="stylegray"  defaultValue="only"></Group>
	<view class="cell-r-8">
	<uni-easyinput suffixIcon="search" v-model="paramsCurrent.search" placeholder="请输入SKU" @input="handleInput">
	</uni-easyinput>
	</view>
	</view>
    <FilterPop ref="filterRef" @filterItemsChange="filterItemsChange"/>
	</view>	
	</view>
	<view class="body-wrap">
		<uni-card  class="n-shadow " padding="12px" margin="8px 12px">
			<view class="uni-flex uni-row my-row" >
				<view
				class="uni-flex-item"
				 @click.stop="handleChange(item)"
				 v-for="(item,index) in summarysaleData" :key='index' >
					<view class="chart-item-data  uni-flex uni-column " :class="item.checked">
						<text class="text-gray font-small">{{item.label}}</text>
						<text class="uni-h4 " >{{item.data}}</text>
						<view class="uni-h6 cell-t-4 uni-flex uni-row-center">
						<text>环比上期&nbsp;</text>
						<text :class="item.dvalue>=0?'text-green':'text-red'">{{item.dvalue}}</text>
						<text :class="item.dvalue>=0?'text-green':'text-red'" class="icon-xiala iconfont text-red"></text>
						</view>
					</view>
				</view>
			</view>
			 <view style="height:400px;width:100%">
				 <l-echart class="charts-box" 
				  style="width: 100;height:400px"
				  ref="saleChart" @finished="init"></l-echart>
			</view>
		</uni-card>
	</view>
</template>

<script setup>
	import Group from "@/components/header/group.vue";
	import Datepicker from "@/components/header/datepicker.vue";
	import FilterPop from "./components/filterPop.vue";
	import { reactive, toRefs,ref,getCurrentInstance, nextTick, } from "vue";
	import summaryChartApi from '@/api/amazon/order/summaryChartApi.js';
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
	const filterRef =ref();
	const saleChart = ref(); 
	const state=reactive({
		paramsCurrent:{
			groupid:'',
			enddate:"",
			fromdate:"",
			bytime:'Daily',
			search:'',
			sku:'',
		},
		sumParams:{},
		summarysaleData:[
			{data:"0",label:'销量',dvalue:0,checked:"active"},
			{data:"0",label:'订单量',dvalue:0,checked:''},
		],
	});
	const {
		paramsCurrent,
		sumParams,
		summarysaleData,
	}=toRefs(state)
	function filterItemsChange(e){
	  handleQuery()  
	}
	
	 function groupChange(e){
		state.paramsCurrent.groupid = e
			handleQuery()
	}
	function changedate(e){
		if(e){
			state.paramsCurrent.fromdate = e[0]
			state.paramsCurrent.enddate = e[1]+" "+"23:59:59"
		}
			handleQuery()

	}
	

	const handleInput = util.debounce((e)=>{
		state.paramsCurrent.search = e;
		state.paramsCurrent.sku = e;
	},200)
	
	
 function handleQuery(){
	 state.sumParams = {
		...filterRef.value.state.params,
		...state.paramsCurrent,
	}  
	setTimeout(()=>{
		if(state.sumParams.groupid&&state.sumParams.salechannel.length>0){
			summaryChartApi.search(state.sumParams).then(res=>{
				state.summarysaleData[1].data =res.ordersum
				state.summarysaleData[0].data =res.unitsum
				state.summarysaleData[0].dvalue =res.lastunitsum
				state.summarysaleData[1].dvalue =res.lastordersum
				chartItem(res)
			})
		} 
	},50)

 }
 function chartItem(res){
	 const series =[];
	 const labels =res.labels;
	 const legendData=['销量','订单量',]; 
	 const saleline ={
		 name: '销量',
		 showSymbol: false,
		  smooth: 0.5,
		 type: 'line',
			data:res.listdata,
			lineStyle:{
				color:'#FF6700',
			},
	       itemStyle:{
		    color:'#FF6700',
	        },
			 areaStyle: {
				  color: "rgba(255, 115, 21, 0.2)"
			 },
	 };
	 const orderline ={
			 name: '订单量',
			 smooth: 0.5,
			 type: 'line',
			 showSymbol: false,
				data:res.orderdata,
				lineStyle:{
					color:'#3c8bfa',
				},
			itemStyle:{
				color:'#3c8bfa',
			}
	 };
	  series.push(saleline);
	  series.push(orderline);
	 state.summarysaleData.forEach((item,index)=>{
		 if(item.checked===''){
			series.splice(index,1) 
		 }
	 });
	
	 getChartsline(series,labels,legendData) 
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
 function handleChange(item){
	 var count =0;
	 if(item.checked===''){
		 item.checked="active"
	 }else{
		 state.summarysaleData.forEach(sub=>{
			 if(sub.checked==='active'){
				 count++;
			 }
		 })
		 if(count>1){
			 item.checked=""
		 }
	 }
	 handleQuery()
 }
 
</script>

<style scoped>
	.header-wrap{
		background-color: #fff;
		padding:8px 12px;
	}

	.cell-r-16{
		margin-right:16px;
	}

	.chart-item-data{
		    border: 1px solid #eee;
		    padding: 12px 16px;
		    border-radius: 4px;
		    margin-top: 8px;
		    margin-bottom: 8px;
	}
	.uni-flex-item{
		flex:1;
		padding-left:8px;
		padding-right:8px;
	}
	.chart-item-data.active{
	  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
	  border-bottom: 2px solid #ff7315;
	}
</style>
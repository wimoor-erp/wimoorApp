<template>
	<uni-popup ref="popup" background-color="#fff" @change="change" @maskClick="maskClick">
			<scroll-view scroll-x="true" class="scoll-width">
		       <view class="uni-header uni-flex uni-between uni-row-center">
				   <text>{{rowData.msku}}</text>
				 <!-- #ifdef MP-WEIXIN -->
				 <uni-icons type="closeempty"
				  @click="hide"
				  size="24"></uni-icons>
				 <!-- #endif --> 
				 <!-- #ifdef H5 -->
				   <uni-icons type="closeempty"
					@click="hide"
					size="16"></uni-icons>
				 <!-- #endif -->
				   </view> 
			   
				 <l-echart class="charts-box"  ref="saleChart" style="width:100%;height:240px" ></l-echart>
			</scroll-view> 
			</uni-popup>
</template>

<script setup>
	import { nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'
	// nvue 不需要引入
	// #ifdef VUE2
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min.js';
	// #endif
	// #ifdef VUE3
	// #ifdef MP
	// 由于vue3 使用vite 不支持umd格式的包，小程序依然可以使用，但需要使用require
	const echarts = require('../../../../../uni_modules/lime-echart/static/echarts.min.js');
	// #endif
	// #ifndef MP
	// 由于 vue3 使用vite 不支持umd格式的包，故引入npm的包
	import * as echarts from 'echarts/dist/echarts.esm.js';
	// #endif
	// #endif
	const props=defineProps({
		labels:[],
	})
	const state = reactive({
		rowData:{},
	})
	const{rowData}=toRefs(state)
	const saleChart =ref()
	const popup=ref();
	function show(row){
		popup.value.open('top')
		state.rowData = row;
		var arr=[];
	    props.labels.label.forEach(item=>{
			  arr.push(state.rowData[item])
		})
		nextTick(()=>{
			getCharts(arr)
		})
	}
	
	function hide(){
		popup.value.close()
		maskClick()
	}
	function maskClick(){
		// #ifdef MP-WEIXIN
		  wx.setPageOrientation({ orientation: 'portrait' })
		// #endif
	}
	function getCharts(arr){
	   var option = {
		   tooltip : {
		   			trigger : 'axis',
		   		},
				legend: {
					data:["销量"],
					top:16,
					icon: "circle",
					itemWidth:6,
					itemHeight:6,
				},
	   xAxis: {
	    type: 'category',
	    data: props.labels.name,
		axisLabel:{
			color:"#999",
			interval: 0,
			rotate: 30 ,
		},
		axisLine:{
			
			lineStyle:{
				color:"#eee",
			}
		},
	  },
	  yAxis: {
	    type: 'value',
		show:false,
	  },
	  series: [
	    {
	      data:arr,
	      type: 'bar',
		  itemStyle:{
			  color:'#ff7315',
		  },
		 label: {
			  show: true,
			  position: 'top'
			},
	    }
	  ]
	}
	saleChart.value.init(echarts,mychart=>{
			mychart.setOption(option)
	})
	
	}
	
	defineExpose({
			  show,hide,
	  })
	  
	  
</script>

<style scoped>
	.charts-box{
		 height:240px;
		 width: 100%;
	}
	.uni-header{
		padding:8px 16px;
	}
</style>
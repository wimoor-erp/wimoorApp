<template>
	<view class="chart-card">
		<uni-card title="广告表现" :isFull="true" class="n-shadow "  >
			<uni-row :gutter="16">
				<uni-col
				 :span="6" v-for="(item,index) in adData" :key='index' >
					<view class="uni-flex uni-center uni-column" >
						<text class="font-bold">{{item.data}}</text>
						<text class="light-font">{{item.label}}</text>
					</view>
				</uni-col>
			</uni-row>
			 <view >
				 <l-echart class="charts-box" ref="adChart" @finished="init"></l-echart>
			</view>
		</uni-card>
		</view>
</template>
<script setup>
	// nvue 不需要引入
	// #ifdef VUE2
	import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
	// #endif
	// #ifdef VUE3
	// #ifdef MP
	// 由于vue3 使用vite 不支持umd格式的包，小程序依然可以使用，但需要使用require
	const echarts = require('../../static/echarts.min');
	// #endif
	// #ifndef MP
	// 由于 vue3 使用vite 不支持umd格式的包，故引入npm的包
	import * as echarts from 'echarts/dist/echarts.esm';
	// #endif
	// #endif
	import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue';
	import { ref,reactive,onMounted,watch,toRefs } from 'vue'
	import reportApi from '@/api/amazon/advertisement/report/reportApi'
	import {formatFloat} from '@/utils/util.js';
	const props=defineProps({
		params:{},login:false,
	})
	const adChart=ref()
	const {params} = toRefs(props);
	const pieChart=ref()
	const state=reactive({
		adData:[
		{
				  label:'点击量',
				  data:'',
				  checked:true,
		},
		{
				  label:'广告销量',
				  data:'',
					  checked:false,
		},
		{
				  label:'广告费$',
				  data:'',
				  checked:true,
		},
		{
				  label:'ACOS',
				  data:'0.0%',
					  checked:false,
		},
		]
	})
	const {adData} = toRefs(state);
	 function getCharts(label,title,series){
		 var option = {
		      tooltip : {
		 	  			trigger : 'axis',
		 	  		},
		       legend: {
		 	  				data:title,
		 	  				top:16,
		 	  				icon: "circle",
		 	  				itemWidth:6,
		 	  				itemHeight:6,
		 	  				
		       },
		       xAxis: {
		 	  				boundaryGap:false,
		 	  				data: label,
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
		 	  				right:40,
		 	  				left:45,
		           bottom:32
		 	  			},
		      yAxis:[{
				    type: 'value',
		 	  		axisLabel:{
		            color:"#acb0b9"
		 	  				},
		 	  				splitLine:{
		 	  					lineStyle:{
		 	  					color:"#F2F3F6"
		 	  					}
		 	  				}
		 	  			},
						{
							 type: 'value',
							axisLabel:{
						     color:"#acb0b9"
								},
								splitLine:{
								lineStyle:{
								color:"#F2F3F6"
											}
										},
						},
						], 
		       series:series
		 }
		 adChart.value.init(echarts,mychart=>{
		 		mychart.setOption(option)
		 })
	 }
	 watch(props.params,(val)=>{
		 if(props.login){
			 props.params.profileid="all";
			 props.params.currency="USD";
			 reportApi.getsumproduct(props.params).then((res)=>{
			 					   adData.value[0].data=res.summary.clicks;
			 					   adData.value[1].data=res.summary.attributedUnitsOrdered;
			 					   adData.value[2].data=formatFloat(res.summary.cost);
			 					   adData.value[3].data=formatFloat(res.summary.acos)+"%";
			 		 			   let label=res.chartdata.impressions.listLabel;
			 					   let title=['点击量','广告销量','广告费$','ACOS'];
			 					   let series=[{
			 					       smooth: 0.5,
			 					       name: '点击量',
			 					       type: 'line',
			 							data:res.chartdata.clicks.listData,
			 							lineStyle:{
			 								color:'#67C23A',
			 							},
			 							itemStyle:{
			 								color:'#67C23A',
			 							},
			 							},
			 					      {
			 					       smooth: 0.5,
			 					       name: '广告销量',
			 					       type: 'line',
			 							data:res.chartdata.order.listData,
			 							lineStyle:{
			 								color:'#FF6700',
			 							},
			 							itemStyle:{
			 								color:'#FF6700',
			 							}
			 					      },{
			 					       smooth: 0.5,
			 					       name: '广告费$',
			 					       type: 'line',
			 							data: res.chartdata.cost.listData,
			 							lineStyle:{
			 								color:'#409eff',
			 							},
			 							itemStyle:{
			 								color:'#409eff',
			 							}
			 						   }, 
			 					      {
			 					       smooth: 0.5,
			 					       name: 'ACOS',
			 					       type: 'line',
									     yAxisIndex: 1,
			 							data:res.chartdata.acos.listData,
			 							lineStyle:{
			 								color:'#E6A23C',
			 							},
			 							itemStyle:{
			 								color:'#E6A23C',
			 							}
			 					      }]
			 					   getCharts(label,title,series);
			 });
		 }
	 })
</script>

<style scoped>
	.charts-box{
		height:300px;
	}
	.chart-card{
		margin-left:16px!important;
		margin-right:16px!important;
		margin-top:16px;
	}
	.font-bold{
		font-weight: 700;
		color:#333;
		margin-top:8px;
		font-size:16px;
	}
</style>
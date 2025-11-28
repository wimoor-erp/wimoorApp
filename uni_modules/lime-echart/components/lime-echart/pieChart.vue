<template>
	<view class="chart-card">
		<uni-card :isFull="true" class="n-shadow "  >
			<template v-slot:title>
				<view class="card-title">市场销量</view>
			</template>
			 <view >
				 <l-echart class="charts-box" ref="pieChart" @finished="init"></l-echart>
			</view>
		</uni-card>
		</view>
</template>

<script setup>
	import { ref,reactive,onMounted,watch,nextTick,toRefs } from 'vue'
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
	import summaryDataApi from '@/api/amazon/summary/summaryDataApi'
	const props=defineProps({
		params:{},login:false,
	})
	const {params} = toRefs(props);
	const pieChart=ref()
	const state=reactive({
		
	})
	const {} = toRefs(state);
	
	function getCharts(summary,datas){
		var option = {
		  tooltip: {
		    trigger: "item"
		  },
		  title:{
		    text:summary,
		    left:'center',
		    top:'30%',
		    subtext:'总销量',
		    textStyle:{
		        fontSize:16,
		        fontFamily:"Helvetica Neue",
		        color:'#303133'
		    },
		    subtextStyle:{
		         fontSize:12,
		    },
		  },
		  legend: {
		    itemGap:16,
		    bottom:8,
		    icon: "circle",
		    itemWidth: 6,
		    itemHeight: 6
		  },
		  color:['#FF6700','#ff9249','#ffa76c','#ffc59e','#409eff','#66b1ff','#8cc5ff','#b3d8ff',"#67c23a","#8dd968","#ade393","#d2f7c1"],
		  series: [
		    {
		      type: "pie",
		      center: ['50%', '36%'],
		      radius: ["30%", "55%"],
		      label: {
		        show: true,
		        position: "outside",
		        color:'#666',
		        formatter: '{d}%'
		      },
		      labelLine:{
		        minTurnAngle:120,
		      },
		      data:datas
		    }
		  ]
		};
		pieChart.value.init(echarts,mychart=>{
				mychart.setOption(option)
		})
	}
	
	watch(props.params,(val)=>{
		if(props.login){
			props.params.bytime="Daily";
			summaryDataApi.queryChartMarket(props.params).then((res)=>{
					const  datas=[];
					res.sort( function(a, b){ 
						  return parseInt(a["quantity" ]) > parseInt(b["quantity" ]) ? 1 : parseInt(a[ "quantity"]) == parseInt(b[ "quantity" ])  ? 0 : -1;
					 });
					 var summary=0;
					 res.forEach((item)=>{
						 summary=summary+parseInt(item.quantity);
						 datas.push({name:item.name,value:item.quantity});
					 });
					getCharts(summary,datas)
			});
			
		}
	})
</script>

<style scoped>
	.chart-card{
		margin-top: 8px;
		margin-left:12px!important;
		margin-right:12px!important;
	}
	.card-title{
		font-size: 17px;
		font-weight: 600;
		margin-top: 16px;
		margin-left:12px;
	}
	.card-title{
		font-size: 17px;
		font-weight: 600;
		margin-top: 16px;
		margin-bottom:12px;
	}
</style>
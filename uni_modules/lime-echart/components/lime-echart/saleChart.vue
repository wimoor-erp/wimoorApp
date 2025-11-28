<template>
	<view class="chart-card" >
		<uni-card title="销售趋势" :isFull="true" class="n-shadow " >
							<template v-slot:title>
								<view class="card-title">销售趋势</view>
							</template>
			<uni-row :gutter="16" >
				<uni-col
				:span="8"
				 @click.stop="handleChange(item)"
				 v-for="(item,index) in summarysaleData" :key='index' >
					<view class="chart-item-data  uni-center uni-flex uni-column " :class="item.checked">
						<text class="uni-h4 "  >{{item.data}}</text>
						<text class="light-font">{{item.label}}</text>
					</view>
					</uni-col>
				</uni-row>
			 <view >
				 <l-echart class="charts-box"  ref="saleChart" @finished="init"></l-echart>
			</view>
		</uni-card>
		</view>
</template>
<script setup>
	import { ref,reactive,onMounted,watch,nextTick,toRefs } from 'vue'
	import LEchart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'
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
	import summaryDataApi from '@/api/amazon/summary/summaryDataApi'
	const props=defineProps({
		params:{},login:false,
	})
	const {params} = toRefs(props);
	const saleChart=ref()
	const state = reactive({
		summarysaleData:[  {
			                  label:'销量',
							  data:'0',
							  checked:"active",
							},{
							  label:'订单量',
							  data:'0',
							  checked:'',
							 },{
							  label:'退货量',
							  data:'0',
							  checked:'',
							 },
		               ],
	})
	const {
		summarysaleData,
	}=toRefs(state)
    function  getCharts(series,labels,legendData){
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
		};
			saleChart.value.init(echarts,mychart=>{
					mychart.setOption(option)
			})
	
	}
	function scanCode(){
		console.log("触发点击事件")
	}
	function handleChange(item){
		if(item.checked=='active'){
			var i=0; 
			state.summarysaleData.forEach(s=>{
				if(s.checked=='active'){
					i++
				}
			})
			if(i==1){
				item.checked="active"
			}else{
				item.checked=""
			}
		}else{
			item.checked = 'active'
			if(item.label=='订单量'){
			}
		}
	 loadData(item)
		
	}
	function loadData(item){
		 props.params.bytime="Daily"
		 if(props.login){
			 summaryDataApi.queryChartSales(props.params).then(async(res)=>{
			 	const labels=res.labels;
			 	const orderNumberList=res.orderNumberList;
			 	const quantityList=res.quantityList;
				const series=[];
				const legendData=['销量','订单量','退货量'];
				const mres= await summaryDataApi.queryChartReturn(props.params);
				const returnOrder=mres.quantityList;
				const serieQuantity={
				          smooth: 0.5,
				          name: '销量',
				          type: 'line',
								data:quantityList,
								lineStyle:{
									color:'#FF6700',
								},
								itemStyle:{
									color:'#FF6700',
								}
				      };
				const serieoOrdernumber={
							 smooth: 0.5,
							 name: '订单量',
							 type: 'line',
								data:orderNumberList,
								lineStyle:{
									color:'#3c8bfa',
								},
								itemStyle:{
									color:'#3c8bfa',
								}
									         };
				 const serieReturn={
							 smooth: 0.5,
							 name: '退货量',
							 type: 'line',
								data:returnOrder,
								lineStyle:{
									color:'#67C23A',
								},
								itemStyle:{
									color:'#67C23A',
								}
						 };
				if(item){
					series.push(serieQuantity)
					series.push(serieoOrdernumber)
					series.push(serieReturn)
					state.summarysaleData.forEach((item,index)=>{
						if(item.checked==''){
							if(series.length==2){
								series.splice(index-1,1)
							}else{
								series.splice(index,1)
							}
						}
					})
				}else{
					state.summarysaleData.forEach((item,index)=>{
						if(index>0){
							item.checked=''
						}
					})
					series.push(serieQuantity)
					
				}			 
				getCharts(series,labels,legendData)		
			 })
		 }
	}
	watch(props.params,(val)=>{
		loadData()
		if(props.login){
			var oranData= state.summarysaleData 
			summaryDataApi.queryChartReturnSummary(props.params).then(res=>{
				if(res){
					state.summarysaleData[2].data=res.quantity
				}else{
					state.summarysaleData[2].data=0
				}
			})
			summaryDataApi.queryChartSalesSummary(props.params).then(res=>{
				if(res){
					if(res.quantity){
						state.summarysaleData[0].data=res.quantity
					}
					if(res.ordernumber){
						state.summarysaleData[1].data=res.ordernumber
					}
				}else{
					state.summarysaleData[0].data = 0
					state.summarysaleData[1].data = 0
				}
			})
			
		}
	})
	onMounted(()=>{
	})
</script>

<style scoped>
	.charts-box{
	}
	.card-title{
		font-size: 17px;
		font-weight: 600;
		margin-top: 16px;
		margin-left:12px;
	}
	.chart-card{
		margin-left:12px!important;
		margin-right:12px!important;
	}
	.chart-item-data{
		/* background-color:#f8f8f8; */
		border:1px solid #eee;
		padding:12px 0px;
		border-radius:4px;
		margin-top:6px;
		margin-bottom:6px;
	}
	.chart-item-data.active .uni-h4,.chart-item-data.active .light-font{
		color:#fff;
	}
	.chart-item-data.active{
		background-color:#ff6700;
		border-color:transparent;
		box-shadow: rgba(255, 103, 0, 0.1) 0px 0px 6px 4px!important;
	}
</style>
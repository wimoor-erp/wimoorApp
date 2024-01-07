<template>
	<picker mode="date" fields="month" v-if="dateType==='month'" :value="monthDate"  @change="MonthDateChange">
				 <view class="  uni-select">
				<view class="uni-input">
				<text class="icon-yangshi_icon_tongyong_calendar iconfont uni-text-gray cell-r-8"></text>
				{{monthDate}}
				</view>
				 </view> 
	</picker>
		<uni-datetime-picker v-model="date" v-else
		 :class="{'datepicker-width':iswidth}" type="daterange"
		   :clearIcon="clearIcon" 
		  @change="bindDateChange"/>
	
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,computed,nextTick} from 'vue';
	import util from "@/utils/util.js"
	const state = reactive(
	{
	date:'',
	monthDate:new Date().getFullYear()+'-'+new Date().getMonth(),
	startDate:null,
	endDate:null,
	});
	const { 
		date,
		startDate,
		endDate,
		monthDate,
		} = toRefs(state);
	const emit = defineEmits(['changedate']);
	const props = defineProps({
		title:"",days:0,unlimited:false,clearIcon:false,iswidth:true,dateType:'day',
	 })
	const { title,days,unlimited,clearIcon,iswidth,dateType} = toRefs(props);
	
	state.startDate=computed(()=>{
		 return getDate('start');
	})
	state.endDate=computed(()=>{
		 return getDate('end');
	})
	function getDate(type){
	    	var beforedays=0;
		 if(props.days){
			  beforedays=props.days-1;
		 }else{
			  beforedays=-1;
		}
		           var end = new Date()
		           var start = new Date()
		           end.setTime(end.getTime() - 3600 * 1000 * 24 * (beforedays+1))
		           start.setTime(start.getTime() - 3600 * 1000 * 24 * (7+beforedays))
	            if (type === 'start') {
					return util.dateFormat(start)
	            } else if (type === 'end'){
					return util.dateFormat(end)
	            }
	        }
			
	function bindDateChange(e) {
		 state.date = e
		 emit("changedate",state.date);
	}
	function MonthDateChange(e){
		state.monthDate = e.detail.value
		emit("changedate",state.monthDate);
	}
	onMounted(()=>{
		nextTick(()=>{
			state.date=[state.startDate,state.endDate];
			if(props.dateType==='month'){
			}else{
				emit("changedate",state.date);
			}
		})
	})
</script>

<style>
	.datepicker-width{
		width:220px;
	}
	.uni-select{
		border-radius:4px;
		border: 1px solid #eee;
	}
	.uni-select .uni-input{
		padding:4px 16px;
	}
</style>
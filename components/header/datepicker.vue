<template>
	<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{title}}
					</view>
					<view class="uni-list-cell-db">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
					</view>
				</view>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,computed} from 'vue';
	const state = reactive({date:'',startDate:null,endDate:null,});
	const { date,startDate,endDate} = toRefs(state);
	const emit = defineEmits(['changeData']);
	let props = defineProps({
		title:"",days:0
	 })
	const { title,days } = toRefs(props);
	
	state.startDate=computed(()=>{
		 return getDate('start');
	})
	state.endDate=computed(()=>{
		 return getDate('end');
	})
	function getDate(type,days) {
	            const date = new Date();
				date.setDate(date.getDate()-days); 
	            let year = date.getFullYear();
	            let month = date.getMonth() + 1;
	            let day = date.getDate();
	            if (type === 'start') {
	                year = year - 60;
	            } else if (type === 'end') {
	                year = year + 2;
	            }
				
	            month = month > 9 ? month : '0' + month;
	            day = day > 9 ? day : '0' + day;
	            return `${year}-${month}-${day}`;
	        }
			
	function bindDateChange(e) {
		 state.date = e.detail.value
		 emit("changeData",state.date);
	}
	onMounted(()=>{
		state.date=getDate('format',props.days);
		emit("changeData",state.date);
	})
</script>

<style>
</style>
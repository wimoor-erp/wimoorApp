<template>
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="order-wrap">
				<view class="uni-list-product cell-b-16">
					<image v-if="row.image" :src="row.image" ></image>
					<image v-else src="/static/empty/noimage40.png" ></image>
					<view class=" uni-flex-item">
						<view class="uni-h4">{{row.sku}}</view>
						<view class="uni-h6 text-omit-1">{{row.name}}</view>
						<view class="uni-h6  cell-t-8">ASIN: {{row.asin}}</view>
					</view>	
				</view>	
				<view class="cell-b-16">
				<UniSegmentedControl :current="current" :values="items" styleType="text"
					active-color="#ff6700" @clickItem="onClickItem" ref="segmentedRef" />
					</view>
				<view>
					<uni-forms  >
						<uni-forms-item label="售价"  >
							<view class="uni-flex uni-row-center search-group">
							<view class="input-suffix-text">$</view>
							<uni-easyinput 
							type="number"
							  v-model="price" placeholder="请输入..."></uni-easyinput>
							</view>
						</uni-forms-item>
						<uni-forms-item label="优惠日期" v-if="current===1" >
							<uni-datetime-picker
							 :start="currentDate"
							 v-model="dateRange" type="daterange"  />
						</uni-forms-item>
					</uni-forms>
					  <button class="searchbtn" type="primary" @click="adjustPrice">提交调价</button>
				</view>	
			</view>
		</uni-popup>
</template>

<script setup>
	import { nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import UniSegmentedControl from '@/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue';
	import listingApi from '@/api/amazon/listing/listingApi.js';   
	import util from '@/utils/util.js';
	const props=defineProps({
		row:{},
		order:{},
	})
	const emit=defineEmits(["getCustomer"])
	const {row,order}=toRefs(props)
	const state = reactive({
		items:["调价","限时优惠调价"],
		current:0,
		dateRange:[],
		currentDate:util.getCurrentSevenDay()[1],
		price:0.00,
	}); 
	const {
		price,
		items,
		current,
		dateRange,
		currentDate,
	} = toRefs(state);
 
	const popup=ref();
	 function change(){
		 nextTick(()=>{
			 state.price = props.row.changeprice;
		 })
	 }
	function openPop(type){
		popup.value.open(type)
	}
	function closePop(){
		popup.value.close()
	}
	function onClickItem(e){
		state.current = e.currentIndex
	}
	function adjustPrice(){
		var params ={};
		if(state.current + 1===2){
			params.fromDate = state.dateRange[0];
			params.toDate   = state.dateRange[1];
		}else{
			params.fromDate = null;
			params.toDate   = null;
		}
		params.pid = props.row.id;
		params.price = state.price;
		params.ftype = state.current + 1;
		listingApi.changePrice().then(res=>{
			if(res && res.status==="ACCEPTED"){
				uni.showToast({
					title:'提交成功！',
					icon:'success',
					duration:2000
				});
			}
			else{
				if(res.issues&&res.issues.length>0){
					uni.showToast({
						title:'提交失败！请尝试使用队列处理提交。',
						icon:'error',
						duration:2000
					});
				}else{
					uni.showToast({
						title:'提交失败！',
						icon:'error',
						duration:2000
					});
				}
				
			}
		})
	}
	 defineExpose({
		  openPop,closePop,
	   })
</script>

<style scoped>
	.input-suffix-text{
		padding:0px 16px;
		background-color: #f5f5f5;
		line-height:40px;
	}
	.cell-b-16{
		margin-bottom:16px;
	}
	.order-wrap{
		padding:16px;
	}
</style>
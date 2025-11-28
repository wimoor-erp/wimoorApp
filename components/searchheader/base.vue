<template>
				 <view class="uni-flex uni-row-center"  @click="openPop('bottom')">
					 <text class="icon-text">筛选</text>
					 <uni-icons custom-prefix="iconfont" type="icon-filter" size="16"></uni-icons>
				 </view>
				 <uni-popup ref="popup" background-color="#fff" @change="change">
				 	<view class="popup-content" >
						<slot> </slot>
					</view>
				 </uni-popup>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const state = reactive({}); 
	const { } = toRefs(state);
	const popup=ref();
	function openPop(type){
		popup.value.open(type)
	}
	function closePop(){
		popup.value.close()
	}
	 defineExpose({
		  openPop,closePop,
	   })
</script>

<style>
	.icon-text{
		white-space: nowrap;
		margin-left:8px;
	}
</style>
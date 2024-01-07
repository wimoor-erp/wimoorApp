<template>
				 <view class="uni-flex uni-row-center"  @click="openPop('bottom')">
					 <text>筛选</text>
					 <text class="icon-filter iconfont"></text>
				 </view>
				 <uni-popup ref="popup" background-color="#fff" @change="change">
				 	<view class="popup-content" >
						<slot> </slot>
					</view>
				 </uni-popup>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	import SearchIcon from "./searchicon.vue"
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
</style>
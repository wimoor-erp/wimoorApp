<template>
				 <uni-popup ref="popup" background-color="#fff">
				 	<view class="popup-content" >
						<slot> </slot>
					</view>
				 </uni-popup>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
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
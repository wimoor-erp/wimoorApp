<template>
	<view class="progress-line" >
		<view class="width-line" :style="{'width':progressWidth}"></view>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,onUpdated} from 'vue';
	const progressWidth=ref("")
	const props=defineProps({
		width:'',
	})
	function getWidth(){
		console.log(props.width)
		if(props.width){
			console.log(props.width)
			progressWidth.value = parseInt(props.width)+'%'
		}else{
			progressWidth.value ="0%"
		}
	}
	const {width}=toRefs(props)
	onMounted(()=>{
		getWidth()
	})
	onUpdated(()=>{
		getWidth()
	})
</script>

<style >
	.progress-line{
		margin-top:8px;
		margin-bottom: 8px;
		width: 100%;
		background-color: #eee;
		height: 8px;
		border-radius: 4px;
	}
	.width-line{
		background-color: #ff7315;
		height: 8px;
		border-radius: 4px;
	}
</style>
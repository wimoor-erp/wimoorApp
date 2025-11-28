<template>
	 <uni-data-select
	        v-model="value"
	        :localdata="list"
	        @change="change"
			:clear="false"
	      ></uni-data-select>
</template>

<script setup>
import { toRefs,onMounted,reactive,ref } from "vue";
import productinfoApi from '@/api/amazon/product/productinfoApi.js';
	const state =reactive({
		list:[
			{text:'未隐藏',value:'false'},
			{text:'隐藏',value:'true'},
			{text:'失效',value:'invalid'},
			{text:'不限',value:'all'},
		],
		value:'false',
	})
	const{
	  list,
	  value,
	}=toRefs(state)
	const emit =defineEmits(['proStatusChange',])
  function change(e){
	  emit("proStatusChange",e)
  }
	
	onMounted(()=>{
		emit("proStatusChange",state.value)
	})
</script>

<style scoped>
</style>
<template>
	 <uni-data-select
	        v-model="statusid"
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
			
		],
		statusid:'all',
	})
	const{
	  list,
	  statusid,
	}=toRefs(state)
	const emit =defineEmits(['status','changeStatus'])
	function getStatusData(){
		productinfoApi.getProStatusList().then((res)=>{
			if(res&&res.length>0){
				res.push({"id":"all","name":"全部"})
				state.list = res.map(item=>{
					const{name,id} = item
					return {
						text:name,
						value:id,
					}
				})
			
				state.list.forEach((item,index)=>{
					if(!item){
						state.list.splice(index,1)
					}
				})
				emit("status",state.statusid)
			}
		})
	}
	function change(e){
		emit("changeStatus",e)
	}
	
	onMounted(()=>{
		getStatusData()
	})
</script>

<style scoped>
</style>
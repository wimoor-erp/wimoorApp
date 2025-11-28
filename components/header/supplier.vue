<template>
	<Wselect
	 @change="handleChange"
	 placeholder="供应商" :value="supplier" :showNum='10' :options="supplierList"/>
</template>

<script setup>
	import { reactive, toRefs,ref, onMounted } from "vue";
	import Wselect from "@/components/w-select/w-select.vue";
	import customerApi from '@/api/erp/material/customerApi.js';   
	const state = reactive({
		supplierList:[],
		supplier:'',
	})
	const {
		supplierList,
		supplier,
	}=toRefs(state)
	const props=defineProps({
		defaultValue:'',
	})
	const emit=defineEmits(['change'])
	
	const loadSupplier=()=>{
		   customerApi.listAll().then((res)=>{
		   	if(props.defaultValue!="only"){
		   		res.unshift({"id":"","name":"全部供应商"})
		   	}
		   	if(res&&res.length>0){
		   		res.forEach(item=>{
		   			item.value=item.id;
		   			item.label=item.name;
		   		})
		   	}
		   	state.supplierList=res;
		   	if(res&&res.length>0){
		   		if(props.defaultValue=="only"){
		   		    state.supplier = res[0].id;
		   		}else{
		   			state.supplier = "";
		   		}
		   	}
		   })
	}
	
	const handleChange = (e)=>{
		state.supplier = e.id
		emit("change",state.supplier);
	}
	onMounted(()=>{
		loadSupplier()
	})
</script>

<style>
</style>
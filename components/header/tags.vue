<template>
	<view class="tag-height">
	<uni-data-picker placeholder="请选择标签" popup-title="请选择标签" :localdata="dataTree" v-model="tagtype"
		@change="onchange">
	</uni-data-picker>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	import {getAllTags} from '@/api/sys/admin/tag.js';
	const emit=defineEmits(['changeData'])
	const state=reactive({
		tagtype:'',
		dataTree:[],
	})
	
	const {
		tagtype,
		dataTree,
	}=toRefs(state)
	function handleQuery(){
		getAllTags().then(res=>{
			if(res){
			state.dataTree = renameLabelsToText(res)
			}
		})
	}
	function onchange(e){
		if(e.detail.value.length>0){
			emit('changeData',e.detail.value[1].value)
		}else{
			emit('changeData','')
		}
	}
	
  function renameLabelsToText(data) {  
     return data.map(item => {  
    const { label, children, ...rest } = item;  
    return {  
      text: label,  
      children: children ? renameLabelsToText(children) : undefined,  
      ...rest  
    };  
  });  
}  
	
	onMounted(()=>{
		handleQuery()
	})
	
</script>

<style>

</style>
<template>
 <view >
	<block v-for="(value, index) in listData" :key="index">
		<view :id="index">
		   <slot :row="value"> </slot>
		</view>
	</block>
	</view>
	<uni-load-more @clickLoadMore="handlerQuery" :status="status" :icon-size="16" :content-text="contentText" /> 
</template>

<script setup>
import { onMounted, reactive, ref, toRefs,watch} from 'vue';
import { onPullDownRefresh,onReachBottom} from '@dcloudio/uni-app'
	 const emit = defineEmits(['loadTable']);
	let props = defineProps({
		tableData:{records:[],total:0}
	 })
	const { tableData } = toRefs(props);
	const state = reactive({status:"more",
	                        listData:[],
	                        params:{sort:'',
									order:'desc',
									currentpage:1,
									pagesize:10},
							contentText: {
											contentdown: '查看更多',
											contentrefresh: '加载中',
											contentnomore: '没有更多'
										},
							}); 
	const {  contentText,status,listData } = toRefs(state);
	onPullDownRefresh(()=>{
		state.params.currentpage=1;
		state.params.pagesize=10;
		state.listData =[];
		state.status = 'loading';
		emit("loadTable",state.params) 
	}) 
	onReachBottom(handlerQuery);  
	function handlerQuery(){
			state.status = 'loading';
			var totalpage=props.tableData.total/state.params.pagesize;
			 if(state.params.currentpage<totalpage){
				 state.params.currentpage=state.params.currentpage+1;
				 emit("loadTable",state.params) 
			 }else{
				  state.status = 'noMore';
			 }
			
	}
	function loadTable(param){
		state.params.currentpage=1;
		if(param){
		   state.params=Object.assign(state.params, param);
		}
		state.listData =[];
		state.params.loadType="loadTable";
		state.status = 'loading';
		emit("loadTable",state.params) 
	}
	defineExpose({
	  loadTable,
	})
	watch(props.tableData,(val)=>{
		   if(props.tableData&&props.tableData.records)
		   props.tableData.records.forEach(item=>{
			   state.listData.push(item);
		   })
		   var totalpage=props.tableData.total/state.params.pagesize;
		  if(state.params.currentpage>=totalpage){
			   state.status = 'noMore';
		  }else{
			   state.status = 'more';
		  }
	})
</script>

<style>
</style>
<template>
	<view class="uni-flex uni-between uni-row-center">
		<scroll-view scroll-x="true" class="scroll-w">
		<view class="tab-wrap">
	<view class="tab-item" 
	:class="item.id===current?'active':''"
	v-for="(item,index) in  list" :key="index"
	@click="handleClick(item) "
	>
	{{item.name}}	
	</view>	
	</view>
	</scroll-view>
	<view 
	@click="setTab"
	class="text-button">
	<uni-icons type="plusempty" size="16" color="#333"></uni-icons>
	 <text>设置</text>
	</view>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,nextTick, computed} from 'vue';
	import queryFieldApi from '@/api/sys/tool/queryFieldApi.js';
	const state=reactive({
			   list:[
				   {name:'销售',id:0,queryfield:"sales"},
				   {name:'历史排名',id:1,queryfield:"hisrank"},
			   ],
			   current:0,
	});
	const {list,current} = toRefs(state);
	
	function loadQueryList(data){
		//加载指标分组记录
		if(data){
			/* state.queryList=JSON.parse(JSON.stringify(data));
			state.queryList.push({name:"none","queryfield":"none","id":"none"}); */
		}else{
			queryFieldApi.getMyVersionFieldByUser({"queryname":"analysistarget"}).then((res)=>{
				res.forEach(item=>{
					state.list.push(item);
				})
			});
		}
	}
	const emit=defineEmits(["change"]);
	function handleClick(item){
		state.current = item.id;
		emit("change",item.queryfield)
	}
	function setTab(){
				  uni.navigateTo({
					//跳转加工单详情页
					url:'./components/itemSet'
				  });
	}
	
	onMounted(()=>{
		loadQueryList();
	})
</script>

<style scoped>
	.scroll-w{
		width:calc(100vw - 90px);
	}
	.tab-wrap{
		display: flex;
		align-items: center;
	}
	.tab-item{
		padding:10px 16px;
		border-radius: 4px;
		background-color: #f5f5f5;
		margin-right: 8px;
		white-space: nowrap;
	}
	.active{
		background-color: #fff1e7;
		color:#ff7315;
	}
</style>
<template>
				<picker @change="changeData" :value="index" range-key="title" :range="list">
					<view class="uni-flex uni-row-center uni-select-button">
					<view  v-if="list.length>0">{{list[index].title}}</view>
					<text class="icon-xiala iconfont"></text>
					</view>
				</picker>
</template>

<script setup>
	import groupApi from '@/api/amazon/group/groupApi.js'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:1 }); 
	const { list,index} = toRefs(state);
	state.list =[{
				title:'全部货件',
				name:0
				},{
				title:'处理中',
				name:1
				},{
				title:'已发货',
				name:2
				},{
				title:'正在接收',
				name:3
				},{
				title:'已完成', 
				name:4
				},{
				title:'已取消',
				name:5
				},{
				title:'异常单据',
				name:6
				},
				];
	 function handleClick(value){
		          var obj={hasexceptionnum:null,orderStatus:""};
					if(value=="0"){
						obj.orderStatus = ""
						obj.hasexceptionnum=null;
					}else if(value=="1"){
						obj.orderStatus = 7
						obj.hasexceptionnum=null;
					}else if(value=="2"){
						obj.orderStatus = 5
						obj.hasexceptionnum=null;
					}else if(value=="3"){
						obj.orderStatus = 55
						obj.hasexceptionnum=null;
					}else if(value=="4"){
						obj.orderStatus = 6
						obj.hasexceptionnum=null;
					}else if(value=="5"){
						obj.orderStatus = 0
						obj.hasexceptionnum=null;
					}else if(value=="6"){
						obj.hasexceptionnum='ok';
						obj.orderStatus = 6
					}
					return obj;
				}
	function changeData(event){
		state.index=event.detail.value;
		var name=state.list[state.index].name;
		var obj=handleClick(name);
	    emit("changeData",obj);
	}
	onMounted(()=>{
		 emit("changeData",handleClick("1"));
	})
</script>

<style>
</style>
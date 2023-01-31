<template>
<view class="main-frame"> 
		<uni-card is-full>
			<uni-section   type="line">
				<view class="uni-padding-wrap uni-common-mt">
					<UniSegmentedControl :current="current" :values="items" style-type="text"
						active-color="#4cd964" @clickItem="onClickItem" />
				</view>
				<view class="content">
					<block v-for="(item,index) in list" :key="index">
						    <view v-if="current === index">
								<view>
									<view class="uni-container uni-flex uni-row" style="padding-left: 20px;padding-right: 20px;padding-top: 10px;background: #fff;">
										<view class="flex-item text-center" style="width: 33.3%;">
											 <text class="light-font">SKU个数:</text>
											 <text class="text-bord"> {{item.ext.summary.skunum}}</text>
										</view>
										<view class="flex-item text-center" style="width: 33.3%;">
											<text class="light-font">库位个数:</text>											
											<text class="text-bord">{{item.ext.expnumber}}</text>
										</view>
										<view class="flex-item text-center" style="width: 33.3%;">
										    <text class="light-font">库存:</text>
											<text class="text-bord text-green" >{{item.ext.summary.quantity}}</text>  
											
										</view>
									</view>
								</view>
							</view>
					 </block>
				</view>
			</uni-section>
	 </uni-card>
	<view style="margin-top:10px;background-color: #fff;">
		<block v-for="(item,index) in list" :key="index">
			<TreeItem   v-show="item.childshow"
					    v-if="item.children&&item.children.length>0"
						:addressnum="item.number"
						:list="item.children" 
						:materialid="data.materialid"
						:formid="data.id"
						:opttype="data.opttype"
						:amount="data.amount">
			</TreeItem>
	</block>
	 </view>
</view>
</template>

<script setup>
	import TreeItem from "./components/tree.vue"
	import shelfApi from '@/api/erp/warehouse/shelf.js'
	import UniSegmentedControl from '@/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue'
	import { onMounted, reactive, ref, toRefs } from 'vue';
	import {onLoad} from "@dcloudio/uni-app";
	const state = reactive({list:[],title:"tadaye",data:{},current:0,items: [],});
    const {  list,title,data,current,items } = toRefs(state);
    function loadData(){
		 var warehouseid="";
		 if(state.data){
			warehouseid=state.data.warehouseid;
		 }
		 shelfApi.getWarehouseShelf(warehouseid).then(data=>{
			 if(data){
				 data.sort(function(s, t){
				  var a = s.number;
				  var b = t.number;
				  if (a < b) return -1;
				  if (a > b) return 1;
				  return 0;
				 }); 
			 }
			 treeClass(data,0);
			 state.list=data;
			 if(state.list&&state.list.length>0){
			 	 state.list[0].childshow=true;
			 }
			 state.list.forEach(item=>{
					 shelfApi.getWarehouseSum(item.id).then(data=>{
							  if(data&&data.summary){
								  item.ext=data;
							  }else{
								  item.ext={summary:{},expnumber:""};
							  }
					 });
			 })
		 });
	 }
	function onClickItem(e) {
				if (state.current !== e.currentIndex) {
					state.current = e.currentIndex
					 state.list.forEach(item=>{
							 if(state.items[state.current ]==item.name){
								  item.childshow=true;
							 }else{
								  item.childshow=false;
							 }
						 });
				}
	 	 }
	 function treeClass(tree,level){
		 if(tree){
			 tree.forEach((item,index)=>{
				 if(state.data.warehouseid){
					item.childshow=true;
				 }else{
					item.childshow=false; 
				 }
				 if(!item.treepath){
					 state.items.push(item.name);
					 item.startname=item.name.substr(0,1);
				 }else if(level>1){
				     item.level=level;
				 }
				 if(item.children&&item.children.length>0){
					 item.treeclass="hasTreeChildrenTitle";
					 treeClass(item.children,level+1);
				 }else{
				 	item.treeclass="noTreeChildrenTitle";
				 }
			 })
		 }
		 
	 }
 
 
	 onLoad((e)=>{
		 const payload = e.detailData || e.payload;
		 // 目前在某些平台参数会被主动 decode，暂时这样处理。
		 if(payload){
			 try {
			 	state.data = JSON.parse(decodeURIComponent(payload));
			 } catch (error) {
			 	state.data = JSON.parse(payload);
			 }
			 if(state.data.formid){
			    state.data.id=state.data.formid;
			 }
		 }
		
	 })
	 onMounted(()=>{
		 loadData();
	 })
 
</script>

<style>
	.main-frame{
	 
	}
 
	.uni-common-mt{
		margin-top:2px;
	}
</style>
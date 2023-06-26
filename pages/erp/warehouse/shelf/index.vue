<template>
<view class="main-frame"> 
		<uni-card is-full>
			<uni-section   type="line">
             <view class="uni-padding-wrap uni-common-mt">
					<UniSegmentedControl :current="current" :values="items"
						active-color="#ff6700" @clickItem="onClickItem" ref="segmentedRef" />
				</view>				
				<view class="content">
					<block v-for="(item,index) in list" :key="index">
						    <view v-if="current === index">
								<view>
									<view class="uni-container uni-flex uni-row" style="padding-left: 20px;padding-right: 20px;padding-top: 10px;background: #fff;">
										<view class="flex-item text-center" style="width: 33.3%;">
											 <text class="light-font">SKU个数:</text>
											 <text class="text-bord" v-if="item.ext"> {{item.ext.summary.skunum}}</text>
										</view>
										<view class="flex-item text-center" style="width: 33.3%;">
											<text class="light-font">库位个数:</text>											
											<text class="text-bord" v-if="item.ext">{{item.ext.expnumber}}</text> 
										</view>
										<view class="flex-item text-center" style="width: 33.3%;">
										    <text class="light-font">库存:</text>
											<text class="text-bord text-green" v-if="item.ext">{{item.ext.summary.quantity}}</text>  
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
	import { onMounted, reactive, ref, toRefs } from 'vue';
	import UniSegmentedControl from '@/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue';
	import {onLoad,onShow} from "@dcloudio/uni-app";
	const segmentedRef=ref();
	const state = reactive({list:[],
	    title:"tadaye",
		data:{},
		current:0,
		items: [],
		tabName:['库位列表', '暂存产品',],
		currentTab:1,
		addressid:"",
		address:[],
	});
    const {  list,title,data,current,items,tabName,currentTab,address} = toRefs(state);
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
			 	 state.list[state.current].childshow=true;
			 }
			 var arr=[]
			 state.list.forEach(item=>{
				 var obj = {};
				 obj.text = item.name;
				 obj.value = item.id
				      arr.push(obj)
					 shelfApi.getWarehouseSum(item.id).then(data=>{
							  if(data&&data.summary){
								  item.ext=data;
							  }else{
								  item.ext={summary:{},expnumber:""};
							  }
					 });
			 })
			 state.address = arr
		 });
	 }
	 function onClickTab(e){
		 state.currentTab = e.currentIndex
	 }
	function onClickItem(e) {
				if (state.current !== e.currentIndex) {
					state.current = e.currentIndex
					console.log(state.current);
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
				 if(level==0&&item.id==state.data.addressid){
					 state.current=index;
					 setTimeout(function(){
						segmentedRef.value._onClick(index); 
					 },400)
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
		loadData();
	 })
 
 
</script>

<style>
	.main-frame{
	 
	}
    .m-t-b-un .segmented-control{
		margin-top: 16px;
		margin-bottom: 16px;
	}
	.uni-common-mt{
		margin-top:2px;
	}
</style>
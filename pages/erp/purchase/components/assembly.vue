<template>
	
	<uni-popup ref="popup" background-color="#fff" @change="change">
		<view class="popup-content" >
				<slot> 
					<view  >
					  <uni-table border stripe emptyText="暂无更多数据"  >
						<uni-tr>
						  <uni-th>图片</uni-th>
						  <uni-th width="150px;">SKU/名称</uni-th>
						  <uni-th  >订单编号</uni-th>
						  <uni-th>数量</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in localSKUlist" :key="index">
						  <uni-td>
							<image v-if="item.image" :src="item.image" style="width: 40px; height: 40px;"></image>
							<image v-else src="/static/empty/noimage40.png" style="width: 40px; height: 40px;"></image>
						  </uni-td>
						  <uni-td>{{item.sku}}
						<view  ></view>
						  {{item.mname}}
						  </uni-td>
						  <uni-td>{{item.number}}
						  <view  ></view>
						   组装单主SKU:{{item.mainsku}}
						  </uni-td>
						  <uni-td>{{item.amount}}</uni-td>
						</uni-tr>
					  </uni-table>
					</view>
				 
				</slot>
			</view>
	</uni-popup>
</template>

<script setup>
	import { computed, nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import util from '@/utils/util';
	import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
	import {deleteFrom } from '@/api/erp/assembly/assemblyApi.js'
	const state = reactive({
		dialogVisable:false,
		tableData:[],
		skutableData:[],
		activeName:'0',
		asstitle:"组装信息",
		ftype:"ass",
		remark:"",
		orderState:[
			{label:'采购对应组装订单',name:'0',},
			{label:'关联的主SKU',name:'1',},
			{label:'本SKU组装单占比',name:'2',},
		],
		nowrow:null,
		localSKUlist:[],
	})
	const {
		dialogVisable,
		tableData,
		activeName,
		orderState,
		skutableData,
		asstitle,
		ftype,
		remark,
		nowrow,
		localSKUlist
	}=toRefs(state)
	const popup=ref();
	function openPop(type){
		popup.value.open(type)
	}
	function closePop(){
		popup.value.close()
	}
	function show(row,ftype){
		state.nowrow=row;
		loadData();
		openPop('bottom');
	}
	function  change(){
		
	}
	 
	function loadData(){
		state.tableData=[];
		purchaselistApi.getAssemblyInfo({"id":state.nowrow.id}).then((res)=>{
			if(res){
				state.localSKUlist=res.assemblyformlist;
				state.skutableData=res.assemblysublist;
				state.localSKUlist=[];
				res.assemblyformlist.forEach(item=>{
					item.entrylist.forEach(entry=>{
						if(entry.sku==state.nowrow.sku){
							entry.number=item.number;
							entry.mainsku=item.mainsku;
							state.localSKUlist.push(entry);
						}
					})
				});
			}
		});
	}
 
	function cancelAss(id){
		deleteFrom({"ids":id}).then((res)=>{
			if(res.data.type=="info"){
				ElMessage.success( res.data.msg);
				loadData();
			} 
		});
	}
	function handleChange(val){
		state.activeName = val;
		if(val=='2'){
			state.localSKUlist=[];
			state.tableData.forEach(item=>{
				item.entrylist.forEach(entry=>{
					if(entry.sku==state.nowrow.sku){
						entry.number=item.number;
						state.localSKUlist.push(entry);
					}
				})
			});
		}
		//handleQuery();
	}
	defineExpose({
		show,
	})
</script>

<style scoped="scoped">
	.img-40{
		width: 60px;
		height: 60px;flex: none;
		margin-right: 8px;
	}
	.textarea {
	  width: 100%;
	  border: 1px solid #dcdfe6;
	  border-radius: 4px;
	  padding: 10px;
	  box-sizing: border-box;
	}
</style>
<template>
	    <uni-tag class="cell-r-8" v-if="optType===0&&historyList.length>0" :inverted="true" @click="shelfHistoryDetails" text="上架记录"  />
		<button v-if="optType===0" @click="handleShelf"
		plain
		size="mini"
		type="primary" >
			上架
		</button>
		<button v-else @click="handleShelf"
		plain
		size="mini"
		type="primary" >
			下架
		</button>
	<uni-popup ref="shelfDialogRef" background-color="#fff" @change="change">
		<view class="popup-content" >
			<view class="form-box">
			<uni-forms >
			<uni-forms-item :label="optType===0?'上架库位':'下架库位'"  >
			<picker @change="handleChangeData" :value="index" range-key="numbername"  :range="Shelflist">
				<view class="uni-text-picker-w picker-border">
				<view class="uni-flex uni-row-center uni-between flex-1">
				<view  v-if="Shelflist.length>0">{{Shelflist[index].numbername}}</view>
				<text class="icon-xiala iconfont"></text>
				</view>
				</view>
			</picker>
			</uni-forms-item>
			<uni-forms-item :label="optType===0?'上架数量':'下架数量'">
				<uni-easyinput type="number" v-model="shelfAmount"   placeholder="请输入" />
			</uni-forms-item>
		</uni-forms>
		<button class="searchbtn" type="primary" @click="submit">提交</button>
		</view>
		</view>
	</uni-popup>
	<uni-popup ref="alertDialog" type="dialog">
		   <uni-popup-dialog type="warn" cancelText="取消" confirmText="继续上架" title="提示" content="上架数量大于当前入库数量!" @confirm="shelfConfirm"
				@close="dialogClose"></uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="historyRef" background-color="#fff" @change="change">
		<view class="form-box">
			<view class="font-bold cell-b-8">上架记录</view>
			<uni-table ref="table" :loading="loading" border stripe  emptyText="暂无更多数据" @selection-change="selectionChange">
							<uni-tr>
								<uni-th  align="center">库位</uni-th>
								<uni-th align="center">上架数量</uni-th>
							</uni-tr>
							<uni-tr v-for="(item, index) in historyList" :key="index">
								<uni-td>{{ item.shelfname }}</uni-td>
								<uni-td>
									<view class="name">{{ item.quantity }}</view>
									<text class="uni-h6">{{item.opttime}}</text>
								</uni-td>
							</uni-tr>
						</uni-table>
		</view>
	</uni-popup>
</template>

<script setup>
	import {onMounted, reactive, toRefs,ref}from"vue"
	import shelfApi from '@/api/erp/warehouse/shelf';
	import shelfproductApi from '@/api/erp/warehouse/shelfproductApi';
	const alertDialog = ref()
	const historyRef = ref()
	const props=defineProps({
		optType:'',
		warehouseid:'',
		itemForm:{},
	})
	const{optType,warehouseid}=toRefs(props)
	const shelfDialogRef =ref()
	const state=reactive({
		index:0,
		shelfid:"",
		shelfAmount:0,
		Shelflist:[],
		historyList:[],
		})
	const {
		shelfid,
		index,
		shelfAmount,
		Shelflist,
		historyList,
	}=toRefs(state)
	function handleChangeData(e){
		state.index = e.detail.value
		state.shelfid = state.Shelflist[state.index].id 
	}
	function handleShelf(){
		if(props.optType===0){
			shelfDialogRef.value.open("bottom")
		}else{
			UnShelf()
		}
		state.shelfAmount = props.itemForm?.amount
		shelfApi.getWarehouseShelf(props.warehouseid).then(function(res){
						 if(res){
							state.Shelflist=res[0].children
							state.shelfid =state.Shelflist[0].id 
			            }else{
							state.Shelflist=[];
						}
		}).catch(e=>{
			state.Shelflist=[];
		});
	}
	
	function submit(){
		if(state.shelfAmount>props.itemForm?.amount){
			alertDialog.value.open()
		}else{
			shelfConfirm()
		}
	}
	function shelfConfirm(){
		var data={};
		data.formid = props.itemForm?.id;
		data.materialid = props.itemForm?.materialid;
		data.warehouseid = props.warehouseid;
		data.quantity = state.shelfAmount;
		data.shelfid=state.shelfid 
		data.formtype = 'otherout';
		if(props.optType===0){
			data.opt = '0';
			shelfproductApi.subShelfInventory(data).then(res=>{
				if(res){
					uni.showToast({
						title:'下架成功！',
						icon:'success',
						duration:2000
					});
					
				}
			});
		}else{
			data.opt = '1';
			shelfproductApi.addShelfInventory(data).then(res=>{
				if(res){
					uni.showToast({
						title:'上架成功！',
						icon:'success',
						duration:2000
					});
					
				}
			});
		}

	}

	function loadShelfHisitory(){
		var data={};
		data.materialid=props.itemForm?.materialid;
		data.formid=props.itemForm?.id;
		data.formtype='otherout';
		shelfproductApi.shelfInventoryOptProList(data).then(res=>{
			if(res){
				state.historyList = res
			}
		});
	}
	function shelfHistoryDetails(){
		historyRef.value.open("bottom")
	}
	
	function UnShelf(){
	shelfDialogRef.value.open("bottom")
	}
	onMounted(()=>{
		loadShelfHisitory()
	})
</script>

<style>
	.form-box{
		padding:24px;
	}
	.flex-1{
		flex:1;
	}
</style>
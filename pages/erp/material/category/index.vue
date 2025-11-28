<template>
	<view class="uni-flex uni-row-center header-wrap">
	<uni-easyinput
	 suffixIcon="search"
	 placeholder="搜索..."
	  @input="handleInput">
	</uni-easyinput>
	<view
	@click="addBrand"
	class="uni-flex uni-row-center cell-l-8">
		<uni-icons type="plusempty" size="20" color="#333"></uni-icons>
		<text>添加</text>
	</view>
	</view>
	<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
		<template v-slot:default="{row}"> 
	     <uni-card class="n-shadow" margin="8px 8px" padding="12px 8px">
	     	<view 
	     	@click="handleDetails()"
	     	class="uni-flex uni-row-top uni-between">
	     	<view>
	     		<text class="uni-h5">
	     			{{row.name}}
	     		</text>
	     		<view class="uni-h6 cell-t-8">备注:{{row.remark}}</view>
	     		</view>
	     		<view class="uni-h6 ">操作日期:{{row.opttime}}</view>
	     	</view>
	     	<view class="uni-right cell-t-8">
	     		<button class="cell-r-8" @click="delect(row)"  type="default" size="mini">删除</button>
	     		<button type="primary" @click="editBrand(row)" size="mini">编辑</button>
	     	</view>
	     </uni-card>
		</template>
	</GlobalTable>
	<uni-popup ref="popup" background-color="#fff">
		<view class="form-box">
		<uni-forms  label-position="top">
			<uni-forms-item label="品牌名称" required>
				<uni-easyinput v-model="formData.name" placeholder="请输入" />
			</uni-forms-item>
			<uni-forms-item label="备注" >
				<uni-easyinput v-model="formData.remark" placeholder="请输入" />
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="submit">{{btntext}}</button>
		</view>
	</uni-popup>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog 
			type="info"
			 cancelText="取消"
			  confirmText="确认"
			   title="提示"
				content="删除品牌信息!"
				@confirm="dialogConfirm"
				></uni-popup-dialog>
		</uni-popup>
</template>

<script setup>
	import{reactive,ref,toRefs,onMounted}from"vue"
	import categoryApi from '@/api/erp/material/categoryApi.js';
	import GlobalTable from "@/components/globaltable/index.vue";
	import util from '@/utils/util';
	const state = reactive({
		tableData:{records:[],total:0},
		params:{},
		formData:{
			name:"",
			remark:'',
		},
		btntext:'添加品牌',
	})
	const {
		tableData,
		params,
		formData,
		btntext,
	}=toRefs(state)
	const globalTableRef =ref();
	const popup =ref();
	const alertDialog =ref();
	function loadTable(params){
		categoryApi.list(params).then(res=>{
			state.tableData.records = res.records;
			state.tableData.total =res.total;
		})
	}
	function handleQurey(){
		globalTableRef.value.loadTable(state.params);
	}
	const handleInput=util.debounce(function(e){
	      state.params.search = e
		  handleQurey();
	}, 500)	
	
	function submit(){
		if(state.formData.name!==''){
			if(state.formData.id!==''){
				categoryApi.saveData(state.formData).then((res)=>{
				 uni.showToast({
				 	title:'修改成功！',
				 	icon:'none',
				 	duration:2000
				 })
					popup.value.close();
					handleQurey();
				});
			}else{
				categoryApi.saveData(state.formData).then((res)=>{
					uni.showToast({
						title:'添加成功！',
						icon:'none',
						duration:2000
					})
					popup.value.close();
					handleQurey();
				});
			}
		}else{
			uni.showToast({
				title:'品牌名不能为空！',
				icon:'none',
				duration:2000
			})
		}
	}
	function addBrand(){
		state.btntext = '添加品牌'
		popup.value.open("bottom");
		state.formData.id ='';
	}
	function editBrand(row){
		state.btntext = '确认修改'
		popup.value.open("bottom");
		state.formData.id =row.id;
		state.formData.name =row.name;
		state.formData.remark =row.remark;
		
	}
	
	function delect(row){
		alertDialog.value.open('center');
	   state.formData.id =row.id
	}
	function dialogConfirm(){
		categoryApi.delBrand({"id":state.formData.id.toString()}).then((res)=>{
			uni.showToast({
				title:'删除成功！',
				icon:'none',
				duration:2000
			})
		 handleQurey();
		});
	}
	onMounted(()=>{
		handleQurey();
	})
</script>

<style scoped>
	.header-wrap{
		padding:8px;
	}
	.form-box{
		padding:16px;
	}
</style>
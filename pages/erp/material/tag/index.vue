<template>
	<view class="serach-wrap uni-flex uni-center uni-between">
	<view class="search-group ">
			 <uni-easyinput 
			  suffixIcon="search"
			  placeholder="搜索标签分类..."
			   @input="handleInput">
			 </uni-easyinput>
	</view>
	<view 
	@click="popup.open('bottom')"
	class="uni-flex uni-row-center plus-btn-w">
		<uni-icons type="plusempty" size="20" color="#ffffff"></uni-icons>
		<text>添加</text>
	</view>
	</view >
		<view class="white-bg">
          <GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
          	<template v-slot:default="{row}"> 
                <uni-card class="n-shadow" margin="8px 8px" padding="12px 8px">
					<view 
					@click="handleDetails(row)"
					class="uni-flex uni-row-center uni-between">
						<text class="tag-name">
							{{row.name}}
						</text>
						<uni-icons type="forward" size="16" color="#999"></uni-icons>
					</view>
				</uni-card>
          	</template>
          </GlobalTable>
		</view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="form-box">
			<uni-forms  label-position="top">
				<uni-forms-item label="标签组名称" required>
					<uni-easyinput v-model="formData.name" placeholder="请输入" />
				</uni-forms-item>
				<uni-forms-item label="排序" >
						<uni-number-box v-model="formData.sort" :step="1" />
				</uni-forms-item>
				<uni-forms-item label="状态" >
					<uni-data-checkbox v-model="formData.status" :localdata="status"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="备注" >
					<uni-easyinput v-model="formData.remarks" placeholder="请输入" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="AddTagGroup">添加标签组</button>
			</view>
		</uni-popup>
</template>

<script setup>
	import{reactive,ref,toRefs,onMounted}from"vue"
	import GlobalTable from "@/components/globaltable/index.vue";
	import util from '@/utils/util';
	import {
	  updateDictType,
	  listPageDictTypes, 
	  getDictFormData,
	  deleteDictTypes,
	  addDictType,
	} from '@/api/sys/admin/tag.js';
	const globalTableRef =ref();
	const popup =ref();
	const state = reactive({
	params:{
		name:'',
	},
	status:[
		{text:'启用',value:1},
		{text:'停用',value:0,},
		],
	formData:{
		name:"",
		status:1,
		sort:1,
		remarks:'',
	},
	tableData:{records:[],total:0},
	})
	const {
		params,
		tableData,
		status,
		formData,
	}=toRefs(state)
	
     
	function handleQurey(){
	globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
		      params.limit = params.pagesize;
			  params.page =  params.currentpage;
			  params.name = params.name;
			 listPageDictTypes(params).then(res=>{
				 if(res.length>0){
					 state.tableData.records = res;
					 state.tableData.total =res.length;
				 }
			 })
	}
	
	
	const handleInput=util.debounce(function(e){
	      state.params.name = e
		  handleQurey();
	}, 500)	
	
	function handleDetails(row){
			uni.navigateTo({
				url:'./components/details?id='+row.id+"&name="+row.name,
		})
	}
	function AddTagGroup(){
		addDictType(state.formData).then(() => {
			uni.showToast({
				title:'添加成功！',
				icon:'none',
				duration:2000
			})
			popup.value.close();
			handleQurey();
		})
	}
	
	onMounted(()=>{
		handleQurey();
	})
</script>

<style scoped>
	.serach-wrap{
		padding:8px;
		background: #ff6700;
	}
.plus-btn-w{
	color: #fff;
	padding:8px;
}
.form-box{
	padding:16px;
}
</style>
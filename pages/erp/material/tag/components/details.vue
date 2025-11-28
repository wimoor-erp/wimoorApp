<template>
	<uni-card class="n-shadow" margin="8px 8px" padding="12px 8px">
		<view 
		@click="tagPopup.open('bottom')"
		class="uni-flex uni-row-center uni-between">
			<text class="tag-name text-black">
				标签分类
			</text>
			<view>
				<text class="cell-r-8">{{name}}</text>
			<uni-icons type="forward" size="16" color="#999"></uni-icons>
			</view>
		</view>
	</uni-card>
	<uni-card class="n-shadow" margin="8px 8px" padding="0px 8px" >
		<GlobalTable ref="globalTableRef" :tableData="tableData" @loadTable="loadTable">
			<template v-slot:default="{row}"> 
		   <view @click="editTagItem(row)" class="tag-item-wrap uni-flex uni-row-center uni-between">
		   		<uni-tag :text="row.name" :type="getColor(row.color)" 
				 circle inverted/>
		   		<uni-icons type="forward" size="16" color="#999"></uni-icons>
		   </view>
			</template>
		</GlobalTable>
	</uni-card>
	<button class="cell-l-8 cell-r-8" type="primary" @click="popup.open('bottom')">添加标签</button>
	<uni-popup ref="popup" background-color="#fff">
		<view class="form-box">
		<uni-forms  label-position="top">
			<uni-forms-item label="标签名称" required>
				<uni-easyinput v-model="formData.name" placeholder="请输入" />
			</uni-forms-item>
			<uni-forms-item label="标签颜色" required>
				<view @click="selectColor('info')" class="color-item" :class="active==='info'?'active':''">
				<uni-icons type="smallcircle-filled" size="20" color="#999"></uni-icons>
				</view>
				<view @click="selectColor('primary')"  class="color-item" :class="active==='primary'?'active':''">
				<uni-icons type="smallcircle-filled" size="20" color="#0ba2ff"></uni-icons>
				</view>
				<view @click="selectColor('success')"  class="color-item" :class="active==='success'?'active':''">
				<uni-icons type="smallcircle-filled" size="20" color="#5dad31"></uni-icons>
				</view>
				<view @click="selectColor('warning')"  class="color-item" :class="active==='warning'?'active':''">
				<uni-icons type="smallcircle-filled" size="20" color="#f0cb44"></uni-icons>
				</view>
				<view @click="selectColor('error')"  class="color-item" :class="active==='error'?'active':''">
				<uni-icons type="smallcircle-filled" size="20" color="#ec4827"></uni-icons>
				</view>
			</uni-forms-item>
			<uni-forms-item label="排序" >
					<uni-number-box :value="1" :step="1" />
			</uni-forms-item>
			<uni-forms-item label="状态" >
				<uni-data-checkbox v-model="formData.status" :localdata="status"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item label="备注" >
				<uni-easyinput v-model="formData.remarks" placeholder="请输入" />
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="addTag">确认</button>
		</view>
	</uni-popup>
	<uni-popup ref="tagPopup" background-color="#fff">
		<view class="form-box">
		<uni-forms  label-position="top">
			<uni-forms-item label="标签组名称" required>
				<uni-easyinput v-model="name" placeholder="请输入" />
			</uni-forms-item>
			<uni-forms-item label="排序" >
					<uni-number-box v-model="tagForm.sort" :step="1" />
			</uni-forms-item>
			<uni-forms-item label="状态" >
				<uni-data-checkbox v-model="tagForm.status" :localdata="status"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item label="备注" >
				<uni-easyinput v-model="tagForm.remarks" placeholder="请输入" />
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="EditTagGroup">确认</button>
		</view>
	</uni-popup>
</template>

<script setup>
	import {onLoad} from "@dcloudio/uni-app";
	import { reactive,toRefs,ref, onMounted, computed, nextTick } from 'vue';
	import GlobalTable from "@/components/globaltable/index.vue";
	import {listPageDictItems,updateDictType, getDictItemData, addDictItem,  updateDictItem, deleteDictItems} from '@/api/sys/admin/tag.js';
	const state = reactive({
		id:'',
		name:'',
		active:'info',
		params:{},
		tableData:{records:[],total:0},
		status:[
			{text:'启用',value:1},
			{text:'停用',value:0,},
			],
		formData:{
			status:1,
			name:"",
			color:'info',
			remarks:'',
		},
		tagForm:{
			status:1,
			name:"",
			remarks:'',
		},	
	})
	const {
		id,
		name,
		params,
		tableData,
		status,
		formData,
		tagForm,
		active,
	} =toRefs(state)
	const globalTableRef =ref();
	const popup =ref(null);
	const tagPopup =ref(null);
	onLoad((event)=>{
		try {
			state.id  = event.id;
			state.name = event.name; 
		} catch (error) {
			state.id = "";
			state.name = "";
		}
	})
	
	function handleQurey(){
	globalTableRef.value.loadTable(state.params);
	}
	function loadTable(params){
		      params.limit = 50;
			  params.page =  params.currentpage;
			  params.groupid = state.id
		   listPageDictItems(params).then(res=>{
				 state.tableData.records = res;
				 if(res.length){
					 state.tableData.total =res.length;
				 }
		 })
	}
 function getColor(color){
	 if(color==='info'){
		 return 'default';
	 }else if(color==='blue'){
		 return 'primary';
	 }else if(color==='danger'){
		 return 'error';
	 }else{
		 return color;
	 }
 }
 
 function EditTagGroup(){
	 state.tagForm.name = state.name;
	  state.tagForm.id = state.id;
	 updateDictType(state.tagForm.id,state.tagForm).then(()=>{
		 uni.showToast({
		 	title:'修改成功！',
		 	icon:'none',
		 	duration:2000
		 })
		 tagPopup.value.close();
		 handleQurey();
	 })
	 
	 
 }
 function addTag(){
	 state.formData.color = state.active;
	 state.formData.taggroupid = state.id;
	 if(state.formData.name!==''){
		 if(state.formData.id){
			 updateDictItem(state.formData.id, state.formData).then(() => {
			   uni.showToast({
			   	title:'修改成功！',
			   	icon:'none',
			   	duration:2000
			   }) 
			   handleQurey();
			 });
		 }else{
			addDictItem(state.formData).then(() => {
				uni.showToast({
					title:'添加成功！',
					icon:'none',
					duration:2000
				}) 
				handleQurey();
			}) 
		 }
		 popup.value.close();
	 }else{
	 			uni.showToast({
	 				title:'标签名不能为空！',
	 				icon:'none',
	 				duration:2000
	 			})  
	 }
	
 }
 function selectColor(color){
	 state.active = color;
	 
 }
 function editTagItem(row){
	 popup.value.open("bottom");
	 state.active = row.color;
	 getDictItemData(row.id).then((res) => {
	 			state.formData = res;
	 });
	 
 }
  onMounted(()=>{
	  handleQurey()
  })
</script>

<style scoped>
	.tag-name{
		font-weight: 700;
	}
	.tag-item-wrap{
		padding-bottom:12px;
		padding-top: 12px;
		border-bottom:1px solid #eee;
	}
	.form-box{
		padding:16px;
	}
	.color-item{
		border:1px solid #d9d9d9;
		display: inline-block;
		padding:6px 8px;
		border-radius: 4px;
		margin-right: 16px;
	}
	.active{
		border:1px solid #ff7315;
	}
</style>
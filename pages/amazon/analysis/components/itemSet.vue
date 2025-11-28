<template>
	<view class="item-wrap">
	<uni-card class="n-shadow" margin="8px">
	<uni-data-checkbox  mode="tag"
	 class="tag-style"
	:map="{text:'title',value:'ffield'}"	
	multiple v-model="checkArry" :localdata="itemList">
	</uni-data-checkbox>
	<view class="uni-flex uni-row-center cell-t-8 cell-b-8">
	<uni-easyinput  v-model="versionName" placeholder="请输入组名称" @input="handleInput">
	</uni-easyinput>
	<button type="primary" 
	class="cell-l-8"
	style="height:40px;line-height: 40px;"
	@click="submit"
	>保存分组</button>
	</view>
	</uni-card>
	</view>
	<view class="uni-h5 cell-l-8">分组列表</view>
	<view class="cell-l-8">
	<uni-row>
		<uni-col :span="12"
		v-for="(item,index) in tableData" :key="index"
		>
			<uni-card class="n-shadow" 
			margin="8px 8px 8px 0px " 
			padding='8px 0px 16px 0px '
			>
				<view class="font-bold ">
					{{item.name}}
				</view>
				<view 			 
				v-for="(sub,index) in item.fquery"
				class="tag-style">
	           <uni-tag 
			   type="default"
			   plain
			   :text="sub"
			   inverted
			   circle
			   ></uni-tag>
			   </view>
			   <view 
			   @click="deleteItem(item.id)"
			   class="remove-icon">
			   <uni-icons type="closeempty" size="16" color="#333"></uni-icons>
			   </view>
			</uni-card>
		</uni-col>
	</uni-row>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch,nextTick, computed} from 'vue';
	import queryFieldApi from '@/api/sys/tool/queryFieldApi.js';
	const state = reactive({
		itemList:[],
		versionName:"",
		checkArry:[],
		tableData:[],
	})
	const {
		itemList,
		checkArry,
		versionName,
		tableData,
	}=toRefs(state)
	
	function loadData(){
		queryFieldApi.loadfield({"queryname":"analysistarget"}).then((res)=>{
			state.itemList=res;
		});
	}
	function deleteItem(id){
			 queryFieldApi.deleteMyVersionField({"versionid":id}).then((res)=>{
			uni.showToast({
				title:'删除成功！',
				icon:'none',
				duration:2000
			})
			loadList()
			 });
	}
	function submit(){
			 var data={};
			 data.queryname="analysistarget";
			 data.versionname=state.versionName;
			 data.fieldlist=state.checkArry;
			 if(state.versionName!="" && state.versionName!=null && state.checkArry.length>0){
				 queryFieldApi.saveMyVersionFieldWithName(data).then((res)=>{
						uni.showToast({
							title:'添加成功！',
							icon:'none',
							duration:2000
						})
						state.versionName="";
						state.checkArry=[];
						loadList()
				 });
			 }else{
				uni.showToast({
					title:'请选择指标并填写组名！',
					icon:'none',
					duration:2000
				})
			 }
	}
	
	function loadList(){
		queryFieldApi.getMyVersionFieldByUser({"queryname":"analysistarget"}).then((res)=>{
			state.tableData = res.map(item=>{
				const{fquery,...rest} = item;
				return{
					fquery:fquery.split(","),
					...rest, 
				}
			})
		});
	}
	onMounted(()=>{
		loadData();
		loadList();
	})
</script>

<style scoped>
.tag-style{
	margin-top:16px;
	margin-right: 8px;
	display: inline-block;
}
.remove-icon{
	position: absolute;
   top:4px;
   right: 7px;
   background-color: #fff;
   padding:4px;
   border-radius: 4px;
   border:1px solid #eee;
}
</style>
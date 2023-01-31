<template>
 
	 <view style="margin-bottom: 50px;" >
	  <checkbox-group  @change="checkboxChange">
	  <block v-for="(value, index) in listData" :key="index">
		  <view class="uni-list " :id="index">
			   <view class="uni-flex uni-row myrow">
			        <view class="flex-item flex-item-V ">
						<view class="boxcenter">
							 <checkbox style="transform:scale(0.7)" 
							  color="#FF6B00" 
							 :value="value.uniqueKey"  
							 :checked="value.checkstatus"/>
						</view>
					</view> 
			          <view class="flex-item flex-item-V " style="flex: 1 1 0%;">
								  <view >
									<slot :row="value"> </slot>
								 </view>
			             </view>
			  </view>
		 </view>
	   </block>
	  </checkbox-group>
	  <uni-load-more @clickLoadMore="handlerQuery"   :status="status" :icon-size="16" :content-text="contentText" /> 
	</view>
	
	<view class="uni-container tabbar bottom-footer">
		<uni-row >
			<uni-col :span="10">
				<view class="checkAllView">
					<checkbox-group @change="checkall" >
					<checkbox  style="transform:scale(0.7)"  color="#FF6B00" 
					value="all" :checked="check.checkallstatus"/>全选当前页
					</checkbox-group>
				 </view>
			</uni-col>
			<uni-col :span="6">
					<view class="selectedTitle">
						已选<text class="text-orange">({{check.checknums}})
						</text> 
					  </view>
			</uni-col>
			<uni-col :span="8">
					<view class="submitbtn">
								  <text  @click="submit">{{option.submitTitle}}</text>
					</view>
			</uni-col>
		</uni-row>
	 
	
		 
	 </view>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs,watch} from 'vue';
import { onPullDownRefresh,onReachBottom} from '@dcloudio/uni-app'
	 const emit = defineEmits(['loadTable']);
	let props = defineProps({
		tableData:{records:[],total:0},option:{key:"",submitTitle:""},
	 })
	const { tableData,option } = toRefs(props);
	const state = reactive({status:"more",
	                        listData:[],
							mykey:"id",
							check:{checkallstatus:false,checknums:0},
							ids:[],
							keyset:[],
	                        params:{sort:'',
									order:'asc',
									currentpage:1,
									pagesize:10},
							contentText: {
											contentdown: '查看更多',
											contentrefresh: '加载中',
											contentnomore: '没有更多'
										},
							}); 
	const {  contentText,status,listData,check,ids,mykey,keyset } = toRefs(state);
	onMounted(()=>{
		if(props.option.key){
			state.mykey=props.option.key;
		}
	})
	onPullDownRefresh(()=>{
		state.params.currentpage=1;
		state.params.pagesize=10;
		state.listData =[];
		state.status = 'loading';
		emit("loadTable",state.params) 
	}) 
	onReachBottom(handlerQuery);  
	function handlerQuery(){
			state.status = 'loading';
			var totalpage=props.tableData.total/state.params.pagesize;
			 if(state.params.currentpage<totalpage){
				 state.params.currentpage=state.params.currentpage+1;
				 emit("loadTable",state.params) 
			 }else{
				  state.status = 'noMore';
			 }
			
	}
	function checkboxChange(e) {
						var values = e.detail.value;
						state.ids=	values;
						state.check.checknums=state.ids.length;
						if(state.check.checknums!=state.listData.length){
							state.check.checkallstatus=false;
						}else{
							state.check.checkallstatus=true;
						}
						state.listData.forEach((item)=>{
							if(state.ids.includes(item[state.mykey])){
								if(item.checkstatus==false)item.checkstatus=true;
							}else{
								if(item.checkstatus==true)item.checkstatus=false;
							}
						});
					}
		function checkByKey(id) {
			                if(!state.ids.includes(id)){
								state.ids.push(id);
								state.check.checknums=state.ids.length;
								if(state.check.checknums!=state.listData.length){
									state.check.checkallstatus=false;
								}else{
									state.check.checkallstatus=true;
								}
								if(props.option.key){
									state.mykey=props.option.key;
								}
								state.listData.forEach((item)=>{
									if(state.ids.includes(item[state.mykey])){
										if(item.checkstatus==false)item.checkstatus=true;
									}else{
										if(item.checkstatus==true)item.checkstatus=false;
									}
											
								});
							}
							
					
						}
	function checkall(e,v){
							//全选checkbox
							if(props.option.key){
								state.mykey=props.option.key;
							}
						     if(e.detail.value[0]=="all"){
								state.check.checkallstatus=true;
							 }else{
								 state.check.checkallstatus=false;
							 }
							if(state.listData){
								if(state.check.checkallstatus==true){
									state.ids=[];
									state.listData.forEach((item)=>{
									    state.ids.push(item[state.mykey]);
										item.checkstatus=true;
									});
									state.check.checknums=state.ids.length;
								}else{
									state.ids=[];
									state.listData.forEach((item)=>{
										item.checkstatus=false;
									});
									state.check.checknums=state.ids.length;
								}
						}
					}
	function loadTable(param){
		state.ids=[];
		state.keyset=[];
		state.check.checknums=state.ids.length;
		state.params.currentpage=1;
		state.check.checkallstatus==true;
		if(param){
		   state.params=Object.assign(state.params, param);
		}
		state.listData =[];
		state.params.loadType="loadTable";
		state.status = 'loading';
		emit("loadTable",state.params) 
	}
	function  submit(){
						if(state.ids.length>0){
							var list=[];
							var hasId=[];
							if(props.option.key){
								state.mykey=props.option.key;
							}
							state.listData.forEach(function(item,index){
								if(state.ids.includes(item[state.mykey])&&!hasId.includes(item[state.mykey])){
									//被勾选了
									hasId.push(item[state.mykey]);
									list.push(item);
								}
							});
							 emit("submit",list) ;
							}else{
								uni.showToast({
									title:'请勾选对应提交的类容！',
									icon:'none',
									duration:2000
								});
							}
	 }
	defineExpose({
	  loadTable,checkByKey
	})
	watch(props.tableData,(val)=>{
		if(props.option.key){
			state.mykey=props.option.key;
		}
		   if(props.tableData&&props.tableData.records)
		   props.tableData.records.forEach(item=>{
			   if(!state.keyset.includes(item[state.mykey])){
				   item.checkstatus=false;
				   item.uniqueKey=item[state.mykey];
				   state.keyset.push(item[state.mykey]);
				   state.listData.push(item);
			   }
		   })
		   var totalpage=props.tableData.total/state.params.pagesize;
		  if(state.params.currentpage>=totalpage){
			   state.status = 'noMore';
		  }else{
			   state.status = 'more';
		  }
	})
</script>

<style>
	.bottom-footer{
		position:fixed;
		left:0px;
		bottom: 0px;
		width:100%;
		z-index:100;
		padding:0px;
		margin:0px;
		background-color: #fff;
		border-top:solid #dedede 1px;
		box-shadow: 1px 1px 2px #c6c6c6;
	}
	.submitbtn{
		padding-top: 15px;
		padding-bottom: 15px;
		padding-left: 10px;
		padding-right: 10px;
		background: #FF6B00;
		float:right;
		width:60px;
		color: #fff;
		text-align: center;
	}
	.myrow{
		padding-top:10px;
		padding-bottom:10px;
		padding-left:10px;
		padding-right:20px;
	}
	.boxcenter{
		display: flex;
		height:100%;
		align-items: center;
	}
	.selectedTitle{
		padding-top:15px;
	}
	.checkAllView{
		padding-top:14px;
	}
</style>
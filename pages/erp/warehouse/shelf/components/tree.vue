<template>
	<view  class="wtree">
	<block v-for="(item,index) in list" :key="index">
		<view  >
			<view  @click="item.childshow=true" v-show="item.childshow==false" :class="item.treeclass" >
			<uni-row class="demo-uni-row">
				<uni-col :span="16">
					<view   class="title" >
						<text v-for="n of item.level" style="padding-left:15px;"> </text>
						<text  v-if="item.treeclass=='hasTreeChildrenTitle'"
						style="padding-top:5px" 
						class="text-black">	▶ </text>
						<text  v-else
						style="padding-top:5px;" 
						class="text-black">	</text>
						{{item.number}}-{{item.name}}</view>
				</uni-col>
				<uni-col :span="8">
						<view  @click.stop="toShelfInv(item)" class="treeitembtn"> 上下架</view>
				</uni-col>
			</uni-row>
			</view>
			<view @click="item.childshow=false" v-show="item.childshow==true"  :class="item.treeclass" >
			<uni-row class="demo-uni-row" >
				<uni-col :span="16">
					<view   class="title" >
						<text v-for="n of item.level" style="padding-left:15px;"> </text>
						<text  v-if="item.treeclass=='hasTreeChildrenTitle'"
						style="padding-top:5px" 
						class="text-black">	▼</text>
						<text  v-else
						style="padding-top:5px;" 
						class="text-black">	</text>
						{{item.number}}-{{item.name}}</view>
				</uni-col>
				<uni-col :span="8"   >
						<view  @click.stop="toShelfInv(item)" class="treeitembtn"> 上下架</view>
				</uni-col>
			</uni-row>
			 </view>
			<TreeItem 
			     v-if="item.children&&item.children.length>0"
				 v-show="item.childshow" 
				:list="item.children" 
				:materialid="materialid" 
				:warehouseid="warehouseid"
				:formid="formid"
				:opttype="opttype"
				:addressnum="addressnum">
			</TreeItem>
		</view>
	</block>
	</view>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs } from 'vue';
	import TreeItem from "./tree"
	let props = defineProps({
	    list:[],
		addressnum:'',
		materialid:'',
		warehouseid:'',
		formid:'',
		opttype:'',
	 })
    const { list ,addressnum,materialid,formid} = toRefs(props);

	 function toShelfInv(item){
		 if(props.materialid||props.formid){
			 let detail = {
			 	'addressnum':props.addressnum,
			 	'shelftreepath':item.treepath,
			 	'ftype':'add',
				'warehouseid':props.warehouseid,
			 	'materialid':props.materialid,
			 	'shelfid':item.id,
				'addressid':item.addressid,
			 	'amount':props.amount,
			 	'formid':props.formid,
			 	'opttype':props.opttype,
			 };
			 uni.navigateTo({
			 	//跳转至 上下架页面
			 	url:'/pages/erp/warehouse/inventory/shelf/addstock?detailData='+ encodeURIComponent(JSON.stringify(detail)),
			 });
		 }else{
			 let detail = {
			 			'shelfid':item.id,
						'addressnum': props.addressnum,
						'shelftreepath':item.treepath,
						'addressid':item.addressid,
						'warehouseid':props.warehouseid,
			 			'materialid':props.materialid,
			 			'formid':props.formid,
			 			'amount':props.amount,
			 			"opttype":props.opttype,
			 };
			 uni.navigateTo({
			 	"url": '/pages/erp/warehouse/inventory/shelf/index?detailData=' +
			 		encodeURIComponent(JSON.stringify(detail))
			 });
		 }
		 
	 } 
 
</script>

<style>
	.treeitem{
		padding:10px;
		background-color: #fff;
		border:solid #dedede 1px;
	}
	 
	.treeitembtn{
		display: inline-flex;
		justify-content: flex-end;
		align-items: center;
		line-height: 1;
		height: 32px;
		white-space: nowrap;
		cursor: pointer;
		color:#ff6700;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		transition: .1s;
		font-weight:500;
		user-select: none;
		vertical-align: middle;
		-webkit-appearance: none;
		background-color: #ffffff;
        width:100%;
		padding: 4px 0px;
		font-size: 12px;
	}
	.wtree{
		padding-top:5px;
	}
	.wtree .title{
		padding-top:5px;
	}
  .noTreeChildrenTitle{
		padding:5px;
		border-bottom-color: #e5e5e5;
		border-bottom-style: solid;
		border-bottom-width: 0.5px;
	}
    .hasTreeChildrenTitle{
		padding:5px;
		border-bottom-color: #e5e5e5;
		border-bottom-style: solid;
		border-bottom-width: 0.5px;
	}
</style>
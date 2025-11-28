<template>
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="order-wrap">
	          <uni-forms label-position="top">
					<uni-forms-item label="产品备注" >
						<uni-easyinput type="textarea" v-model="remarkVal" placeholder="请输入..." />
					</uni-forms-item>
	          	</uni-forms>
				<view class="uni-right">
				<button class="cell-r-8" type="default" size="mini" @click="closePop">取消</button>
				<button type="primary" 
				@click="handleSubmit"
				size="mini">提交</button>
				</view>
				<view class="">
					<scroll-view scroll-y="true" class="remarks-list">
						<uni-steps :options="listData" active-color="#ff7315" :active="active" direction="column" />
					</scroll-view>
				</view>
			</view>
		</uni-popup>
</template>

<script setup>
	import { computed, nextTick, onMounted, reactive, ref, toRefs,watch} from 'vue';
	import productinoptApi from '@/api/amazon/product/productinoptApi.js';
	import productinfoApi from '@/api/amazon/product/productinfoApi.js';  
	import util from '@/utils/util.js';
	const props=defineProps({
		row:{},
	})
	const {row,}=toRefs(props)
	const state = reactive({
		listData:[],
		remarkVal:'',
	}); 
	const {
		listData,
		remarkVal,
	} = toRefs(state);
	function getData(){
		productinoptApi.getProRemarkHis({"pid":props.row.id,"ftype":"pro"}).then(res=>{
			if(res&&res.length>0){
				state.listData = res.map(item=>{
					const{opttime,optname,remark,...rest}=item
					return {
						title:remark,
						desc:opttime+' | '+optname,
						...rest,
					}
				})
				state.remarkVal = state.listData[0].title
			}
		})
	}


 
	const popup=ref();
	function openPop(type){
		popup.value.open(type)
		nextTick(()=>{
			getData()
		})
	}
	function closePop(){
		popup.value.close()
	}
    function handleSubmit(){
		productinfoApi.updateRemark({"id":props.row.id,"remark":state.remarkVal,"ftype":"pro"}).then(res=>{
			if(res && res.message=="success"){
				uni.showToast({
					title:'提交成功！',
					icon:'success',
					duration:2000
				});
				closePop()
			}else{
				uni.showToast({
					title:'提交失败！',
					icon:'error',
					duration:2000
				});
			}
		})
	}

	 defineExpose({
		  openPop,closePop,
	   })
</script>

<style scoped>
    .order-wrap{
		width: 320px;
		padding:24px
	}
	.cell-b-16{
		margin-bottom:16px;
	}
   .remarks-list{
	   height:calc(100vh - 260px);
   }
</style>
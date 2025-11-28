<template>
		<view class="uni-list ">
			 <view  >
			 	操作仓库:<view style="float:right"> <picker @change="changeData" :value="index" range-key="name" :range="list">
			 		<text class="uni-input" v-if="list.length>0&&index>=0">{{list[index].name}}</text>
					<text class="uni-input" v-else>未找到</text>
			 	</picker>
				</view>
			 </view>
		</view>
</template>

<script setup>
	import warehouseApi from '@/api/erp/warehouse/warehouseApi'
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	const emit = defineEmits(['changeData']);
	const state = reactive({list:[],index:0}); 
	const { list,index} = toRefs(state);
	let props = defineProps({
		warehouseid:"",
		addressid:"",
	 })
	const { warehouseid } = toRefs(props);
	function changeData(event){
		state.index=event.detail.value;
		var id=state.list[event.detail.value].id;
		emit("changeData",id);
	}
	function handlerQuery(addressid){
		var myaddressid=props.addressid;
		if(addressid){
			myaddressid=addressid;
		}
		state.list=[];
		 warehouseApi.getNamelistByAddressid(myaddressid).then((res)=>{
			if(res){
			    state.list=res.reverse();
				var mindex=-1
				res.forEach((item,index)=>{
					if(props.warehouseid&&props.warehouseid==item.id){
						mindex=index;
					}
					if(!props.warehouseid&&item.isdefault){
						mindex=index;
					}
				  })
				};
				if(mindex==-1){
					res.forEach((item,index)=>{
						if(mindex==-1&&item.name.indexOf("正品")>=0){
							mindex=index;
						}
					  })
					if(mindex==-1){
						mindex=0;
					}
				}
				state.index=mindex;
			   emit("changeData",res[state.index].id );
		});
	}
	defineExpose({ handlerQuery })
	 onMounted(()=>{
		 handlerQuery();
	 })
</script>

<style>
</style>
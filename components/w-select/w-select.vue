<template>
	<view  ref="selectwrap">
	<input class="inputWrap"
	@input="handleInput"
	 @focus="handleFocus"
	 @blur="handleBlur"
	 v-model="inputText"
	 :placeholder="placeholderSelf" />
	</view> 
	<view class="w-select-wraper"  v-show="isHidden">
		<scroll-view :style="{'height':scollHeight,}" @scroll="handleScroll" scroll-y="true">
			<ul
			 :style="{ transform: `translateY(${translateY})` }"
			 class="w-select-dropdowm" ref="parentRef" >
				<li
				@click="selectOptions(item)"
				 v-if="options.length>0"
				 :class="{'active':item.value===value}"
				 v-for="item in showList" :key="item.value">{{item.name}}</li>
				<li v-else ><text class="uni-h6">暂无数据</text></li>
			</ul>
		</scroll-view>
	</view>
	<view
	 v-show="isShow"
	 @click="isShow=false,isHidden=false"
	 class="select-mask"></view>
</template>

<script setup>
	import{ref,reactive,onMounted,toRefs,nextTick,computed,onUnmounted}from"vue"
	const state = reactive({
		isHidden:false,
		inputText:'',
		placeholderSelf:'',
		isShow:false,
	})
	const emit=defineEmits(['change','viewText'])
	const parentRef = ref(null);
	const selectwrap = ref(null);
	const scollHeight = ref(0)
	const itemLiHeight = ref(0)
	const itemCount = ref(0)
	const start = ref(0)
	const filterData = ref([])
	const translateY = ref(0)
	const props = defineProps({
		placeholder:{     
          type: String,  
          default:'下拉',   
      },
	  options:{  
		  type:Array,
		  default:[],
	  },
	  value:{
		  type: String,
		  default:'',  
	  },
	  showNum: { 
	   type: Number,
	   default: 0 },
	})
	const {
		placeholder,
		options,
		value,
		showNum,
	}=toRefs(props)
	
	const {
		isHidden,
		inputText,
		placeholderSelf,
		isShow,
	}=toRefs(state)
	
    const handleFocus=()=>{
		filterData.value = props.options;
		state.isHidden = true;
		state.inputText=""
		itemLiHeight.value = 34
		scollHeight.value = itemLiHeight.value*props.showNum + 'px';
		state.isShow = true;
	}
	const selectOptions=(e)=>{
		state.inputText = e.name
		state.placeholderSelf = e.name
		emit('change',e)
		state.isHidden = false
		state.isShow = false;
	}
	
	onMounted(()=>{
		state.placeholderSelf = props.placeholder
	})
	
	const showList = computed(()=>{
		return filterData.value.slice(start.value,start.value + props.showNum + 1)
	})
	
	const handleScroll =( e)=>{
		  const scrollTop = e.detail.scrollTop
		  start.value = Math.floor(scrollTop / itemLiHeight.value)  
		  translateY.value = scrollTop + 'px'
	}
   
   const handleInput = (e)=>{
	   filterData.value = props.options
	   filterData.value = filterData.value.filter(item=>{
		  return item.name.includes(e.detail.value);  
	  })
   }
	const handleBlur = (e)=>{
		state.inputText = state.placeholderSelf
	}
</script>

<style >
	.w-select-wraper{
		margin-top:8px;
		background-color: #fff;
		box-shadow:0px 0px 12px rgba(0, 0, 0, .12);
		border:1px solid #e4e7ed;
		border-radius: 4px;
		position: absolute;
		z-index: 3;
		width: calc(100vw - 32px);
	}
	.w-select-wraper::after{
		  content: "";  
		  position: absolute;  
		  top:-6px; /* 根据需要调整下拉距离 */  
		  right:50%; /* 根据需要调整下拉距离 */  
		   width: 10px;
		    height: 10px;
		    transform: rotate(45deg);
		    background: #fff;
		    box-sizing: border-box;
		  z-index: 2;
		  border-bottom-color: transparent!important;
		  border-right-color: transparent!important;
		  border-top-left-radius: 2px;
		  border:1px solid #e4e7ed;
	}
	.w-select-dropdowm{
		list-style: none;
		padding: 6px 0;
		margin: 0;
		box-sizing: border-box;
	}
   .w-select-dropdowm li,.w-select-dropdowm view{
	   font-size: 26rpx;
	   padding: 0 32px 0 20px;
	   position: relative;
	   white-space: nowrap;
	   overflow: hidden;
	   text-overflow: ellipsis;
	   color:#333;
	   height: 34px;
	   line-height: 34px;
	   box-sizing: border-box;
	   cursor: pointer;
   }
    .w-select-dropdowm li:hover,.w-select-dropdowm view:hover{
		background-color:#f5f7fa;
	}
	.inputWrap{
		border: 1px solid #ddd;
		border-radius: 4px;
		height: 35px;
		padding-left: 12px;
		font-size: 24rpx;
		position: relative;
	}
	
	.inputWrap .input-placeholder{
		line-height: 1.5;
	}
	.inputWrap::after{
		  content: "";  
		  position: absolute;  
		  top:15px; /* 根据需要调整下拉距离 */  
		  right:12px; /* 根据需要调整下拉距离 */  
		  width: 0;  
		  height: 0;  
		  border-left: 5px solid transparent; /* 左边透明 */  
		  border-right: 5px solid transparent; /* 右边透明 */  
		  border-top:6px solid #999; /* 底部颜色 */
	}
	.w-select-wraper .active{
		font-weight: 700;
		color:#ff7315;
	}
	.select-mask{
		position: fixed;
		    top: 0;
		    bottom: 0;
		    right: 0;
		    left: 0;
			z-index:2;
	}
</style>
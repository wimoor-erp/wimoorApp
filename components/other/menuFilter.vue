<template>
	<view class="uni-header">
	<uni-easyinput prefixIcon="search"  v-model="searchWords" placeholder="功能查询"></uni-easyinput>
	</view>
	<view class="cal-img" @click="GoTOCalculater">
	<image 
	 style="width:100%; padding:0 12px"
	  mode="widthFix" 
	   src="/static/calculater.png" ></image>
	   </view>
<!-- 	<view class="tab-style">
	<scroll-view
	 scroll-x="true"
	 ref="tabRef"
	 @scroll="scorllX"
	:scroll-left = 'tabScrolltoXPosition'
	:scroll-with-animation="true"
	>
	<view class="left-menu-list">
		<view  v-for="(item,index) in menuData" :key="index">
		<view class="menu-text " 
		@click="handleTab(item.id)"
		:class="{'active':item?.isactive}" v-if="item?.ishow">
			{{item.name}}
		</view>
		</view>
	</view>
	</scroll-view>
	</view> -->
	<view class="uni-flex uni-row">
	 <view style="flex:1">
	<!-- 		<scroll-view  
			 :scroll-into-view="scolltoDom"
			 :scroll-with-animation="true"
			 scroll-y="true" class="scroll-h"  @scrolltoupper="upper"
			@scrolltolower="lower" @scroll="scroll"
			> -->
		<view class="right-content">
			<view class="submenu-wrap" v-for="(a,i) in fliterSubsubMenuData"  :key="i" >
				<uni-card class="n-shadow" margin="0" padding="0 0px 12px 0px">
		<template v-if="a?.ishow"   v-slot:title>
				<view :id="a?.id"  class="menu-title ">
					{{a?.name}}
				</view>
		</template>
					<uni-grid :column="4" :show-border="false" :square="false" >
						<uni-grid-item v-for="(item ,index) in a?.item" :index="index" :key="index">
							<view class="grid-item-box" @click="GoTOPages(item.url)">
							<view class="t-icon " :class="item.icon"></view>
								<view class="uni-h6 cell-t-8">{{item.text}}</view>
							</view>
						</uni-grid-item>
					</uni-grid>
			</uni-card>
			</view>
		</view>
		<!-- </scroll-view> -->
		</view>  
	</view>
</template>

<script setup>
import { onMounted, reactive,toRefs,ref, computed,getCurrentInstance } from "vue";
import MenuJson from '/components/other/menu.json';
import menuApi from "@/api/sys/admin/menuApi.js"
import util from "@/utils/util.js"
const arrDom = ref([])
	const state=reactive({
		menuData:[],
		subMenuData:[],
		authlist:[],
		scolltoDom:'',
		searchWords:'',
		tabScrolltoXPosition:0,
	})
	
	const{
    authlist,
	menuData,
	subMenuData,
	scolltoDom,
	searchWords,
	tabScrolltoXPosition,
	}=toRefs(state)
	
	async function getData(){
		var menuData=MenuJson.menuData;
		var subMenuData=MenuJson.subMenuData;
		await checkAuthority(menuData,subMenuData);
		state.menuData =menuData;
		state.menuData[0].isactive = true
		state.subMenuData =subMenuData;
		 
	}
	function setAuthlist(list){
		if(list&&list.length>0){
			list.forEach(menu=>{
				state.authlist.push(menu.name);
				if(menu.children){
					setAuthlist(menu.children);
				}
			})
		}
		
	}
 async function checkAuthority(menuData,subMenuData){
	 state.authlist=[];
	  await menuApi.getRoute().then(data=>{
		     setAuthlist(data);
			 if(menuData&&menuData.length>0){
			 	menuData.forEach(menu=>{
			 		if(state.authlist.includes(menu.menuid)){
			 			menu.ishow=true;
			 		}else{
			 			menu.ishow=false;
			 		}
			 	})
			 }
			 if(subMenuData&&subMenuData.length>0){
			 	subMenuData.forEach(menu=>{
			 		if(state.authlist.includes(menu.menuid)){
			 			menu.ishow=true;
			 		}else{
			 			menu.ishow=false;
			 		}
			 	})
			 }
		});
		
	
	}
	function handleTab(id){
		state.scolltoDom = id
	}
	const Instance=getCurrentInstance()
	const tabDomWidth = ref(0)
	const tabRef = ref(null)
	const  scroll=  util.debounce(function(event){
		var arr=[]
		state.menuData.forEach((item)=>{
			item.isactive =  false
		// #ifdef MP-WEIXIN
		 const query = wx.createSelectorQuery().in(Instance)
	    query.select("#"+item.id).boundingClientRect(res=>{
		 arr.push(res.top)
		 }).exec()
	 
		// #endif
				// #ifdef H5
				uni.createSelectorQuery().select("#"+item.id).boundingClientRect(res => {
					arr.push(res.top)
				 }).exec(
				 )
				 // #endif
			})
		 var timer = setTimeout(()=>{
				const minindex = filterMinAbsIndex(arr)
				if(minindex!== -1){
					state.menuData[minindex].isactive = true
				}
				clearTimeout(timer)
			},100)
 			var windowHeight = 0;
			var windowWidth = 0;
			uni.getSystemInfo({
				  success:(res=>{
						 if(res){
							windowHeight = res.windowHeight 
							windowWidth = res.windowWidth
						 }
				   })
			   });
			if(event.detail){
				const isScrollHeight = event.detail.scrollHeight - windowHeight;
					if(tabDomWidth.value===0){
						state.tabScrolltoXPosition = 10
					}else{
						const isScorllwidth = tabDomWidth.value - windowWidth
						setTabScroll(isScrollHeight,event.detail.scrollTop,isScorllwidth)
					}
			}
			
	},100)
	
	function scorllX(event){
		tabDomWidth.value = event.detail.scrollWidth
	}
	function setTabScroll(height,top,width){
		state.tabScrolltoXPosition = top/height*width
	}
	function filterMinAbsIndex(arr){
		var minAbs = Infinity; 
		var minIndex = -1
		for(var i=0; i<arr.length; i++){
			const abs = Math.abs(arr[i]);
			if(abs<minAbs){
				minAbs = abs;
				minIndex = i;
			}
		}
		return minIndex
	}

	const fliterSubsubMenuData = computed(()=>{
		var result=state.subMenuData.filter(item => {  
		    return item.item.some(subItem => subItem.text.includes(state.searchWords));  
		});  
			if(state.searchWords!=''){
				return result
			}else{
				console.log(state.subMenuData);
				return state.subMenuData
			}
	})
	function GoTOPages(url){
		uni.navigateTo({
			"url":url
		})
	}
	function GoTOCalculater(){
		uni.navigateTo({
			"url":"/pages/amazon/profit/calculator/index"
		})
	}
	onMounted(async ()=>{
		await getData()
	})
</script>

<style scoped>
	.cal-img{
		margin-bottom:6px;
	}
	.uni-h6{
		color:#333;
		font-size:14px;
	}
	.scroll-h{
		/* #ifdef H5 */
		height:calc(100vh - 158px);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height:calc(100vh - 100px);
		/* #endif */
	}
	.submenu-wrap{
		padding-bottom:8px;
	}
	.menu-title{
		padding-top:20px;
		padding-bottom:20px;
		color: #999;
		padding-left:8px;
	}
	.left-menu-list{
		display: flex;
		margin-bottom:12px;
		flex-direction: row;}
	.tab-style{
	}
	.menu-text{
		white-space: nowrap;
		align-items: center;
		font-size: 14px;
		color: #666;
		height:44px;
		margin:0px 24px;
		display: flex;
		justify-content: center;
	}
	.active{
		color: #333;
		font-weight: 700;
		border-bottom: 2px solid #ff7315;
		
	}
	.right-content{
		flex:1;
		padding:0px 12px;
	}
	.icon{
		font-size:32px;
	}
	.grid-item-box{
		display: flex;
		align-items: center;
		padding-top:16px;
		padding-bottom:16px
	}
	.uni-header{
		padding:8px 12px;
	}
</style>
<style>
	.uni-grid-item{
		height: inherit;
	}
</style>
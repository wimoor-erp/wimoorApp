<template>
	<view class="uni-header">
	<uni-easyinput suffixIcon="search" @input="input" v-model="searchWords" placeholder="功能查询" @iconClick="iconClick"></uni-easyinput>
	</view>
	<view class="uni-flex uni-row">
		<view id="test" class="left-menu-list">
			<view  v-for="item in menuData" >
			<view class="menu-text " 
			@click="handleTab(item.id)"
			:class="{'active':item?.isactive}" v-if="item?.ishow">
				{{item.name}}
			</view>
			</view>
		</view>
	 <view style="flex:1">
			<scroll-view  :scroll-top="scrollTop"
			 :scroll-into-view="scolltoDom"
			 scroll-y="true" class="scroll-h"  @scrolltoupper="upper"
							@scrolltolower="lower" @scroll="scroll"
							>
		<view class="right-content">
			<view class="submenu-wrap" v-for="a in fliterSubsubMenuData"   >
		   <view v-if="a?.ishow">
				<view :id="a?.id"  class="menu-title font-bold">
					{{a?.name}}
				</view>
					<uni-grid :column="3" :show-border="false" :square="false" @change="change">
						<uni-grid-item v-for="(item ,index) in a?.item" :index="index" :key="index">
							<view class="grid-item-box" @click="GoTOPages(item.url)">
							<view class="t-icon " :class="item.icon"></view>
								<view class="uni-h6 cell-t-8">{{item.text}}</view>
							</view>
						</uni-grid-item>
					</uni-grid>
			</view>	
			</view>
		</view>
		</scroll-view>
		</view>  
	</view>
</template>

<script setup>
import { onMounted, reactive,toRefs,ref, computed,getCurrentInstance } from "vue";
import MenuJson from '/components/other/menu.json';
import menuApi from "@/api/sys/admin/menuApi.js"
const arrDom = ref([])
	const state=reactive({
		menuData:[],
		subMenuData:[],
		authlist:[],
		scolltoDom:'',
		searchWords:'',
	})
	
	const{
    authlist,
	menuData,
	subMenuData,
	scolltoDom,
	searchWords,
	}=toRefs(state)
	
	async function getData(){
		var menuData=MenuJson.menuData;
		var subMenuData=MenuJson.subMenuData;
		await checkAuthority(menuData,subMenuData);
		state.menuData =menuData;
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
		/*  console.log(data) */
		     setAuthlist(data);
			 var isactive=false;
			 if(menuData&&menuData.length>0){
			 	menuData.forEach(menu=>{
			 		if(state.authlist.includes(menu.menuid)){
			 			if(isactive==false){
			 			   menu.isactive= true;
			 			   isactive=true;
			 			}
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
	function scroll(){
		state.menuData.forEach((item)=>{
	// #ifdef MP-WEIXIN
	const query = wx.createSelectorQuery().in(Instance)
	query.select("#"+item.id).boundingClientRect()
	query.selectViewport().scrollOffset()
		query.exec(function(res){
		if(res[0].top>-20&&res[0].top<20){
			 state.scolltoDom = res[0].id
		}
		})
			// #endif
			// #ifdef H5
			uni.createSelectorQuery().select("#"+item.id).boundingClientRect(res => {
			          if(res.top>-20&&res.top<20){
						  state.scolltoDom = res.id
					  }
			 }).exec()
			 // #endif
			if(state.scolltoDom===item.id){
				item.isactive = true
			}else{
				item.isactive = false
			}
		})
	}
	
	const fliterSubsubMenuData = computed(()=>{
		var result=state.subMenuData.filter(item => {  
		    return item.item.some(subItem => subItem.text.includes(state.searchWords));  
		});  
			if(state.searchWords!=''){
				return result
			}else{
				return state.subMenuData
			}
	})
	function GoTOPages(url){
		uni.navigateTo({
			"url":url
		})
	}
	
	onMounted(async ()=>{
		await getData()
	})
</script>

<style scoped>
	.scroll-h{
		/* #ifdef H5 */
		height:calc(100vh - 158px);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height:calc(100vh - 10px);
		/* #endif */
		background-color: #fff;
	}
	.submenu-wrap{
		padding-bottom:32px;
	}
	.menu-title{
		padding-top:20px;
		padding-bottom:20px;
	}
	.left-menu-list{
		width:80px;
		display: flex;
		flex-direction: column;
	}
	.menu-text{
		align-items: center;
		font-size: 14px;
		color: #666;
		height:44px;
		display: flex;
		justify-content: center;
	}
	.active{
		color: #ff7315;
		font-weight: 700;
		background-color: #fff;
	}
	
	.right-content{
		flex:1;
		padding:0px 16px;
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
		padding:8px 16px;
	}
</style>
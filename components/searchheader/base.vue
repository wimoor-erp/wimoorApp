<template>
	           <SearchIcon ref="fab" 
			                :pattern="pattern" 
			                :content="content" 
							:horizontal="horizontal" 
							:vertical="vertical"
				 			:direction="direction" 
							:popMenu="popMenu"
							@trigger="trigger" 
							@fabClick="showDrawer" />
				 
				<uni-drawer ref="showRight" mode="left" :width="300" :mask-click="true">
					<scroll-view style="height: 100%;" scroll-y="true">
						<uni-icons style="float:right" @click.stop="closeDrawer"  type="closeempty" size="20"></uni-icons>
						<slot> </slot>
					</scroll-view>
				</uni-drawer>
</template>

<script setup>
	import { onMounted, reactive, ref, toRefs,watch} from 'vue';
	import SearchIcon from "./searchicon.vue"
	const state = reactive({horizontal:"right",
	                        vertical:"bottom",
							direction:"vertical",
							popMenu:false,
							pattern:{
								color:"#fff",
								selectedColor:"#FF6700",
								backgroundColor:"#ffffff",
								buttonColor:"#FF6700",
								iconColor : '#fff',
							},
							}); 
	const {horizontal,vertical,direction,popMenu ,pattern } = toRefs(state);
	const showRight=ref();
	function trigger(e){
		
	}
	function showDrawer() {
				showRight.value.open();
				}
	function closeDrawer() {
				showRight.value.close();
				}
	 defineExpose({
		  closeDrawer,showDrawer
	   })
</script>

<style>
</style>
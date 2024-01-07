<template>
<view class="c-herder-wrap">
	<view class="uni-flex">
	<picker @change="handleChangeMarket" :value="index" range-key="name"  :range="optionsMarkets">
		<view class="uni-flex uni-row-center  uni-between uni-select-button">
		<view class="picker-label" v-if="optionsMarkets.length>0">{{optionsMarkets[index].name}}</view>
		<text class="icon-xiala iconfont"></text>
		</view>
	</picker>
	<view class="search-group cell-l-8">
		<view style="padding:0px 2px">
			 <uni-data-select
			         v-model="searchChecked"
			         :localdata="searchData"
			 		 :clear="false"
			         @change="searchType"
			       ></uni-data-select>
				   </view>
			 <uni-easyinput  v-model="searchKeywords" placeholder="请输入内容" >
			 </uni-easyinput>
			 <button
			  @click="handleSerach"
			  :loading="isbutton"
			  :disabled="isbutton"
			  style="padding:0px 12px;font-size: 14px;margin-right:2px" type="primary">查询</button>
	</view>
	</view>
</view>
<view class="c-body-wrap">
	<view class="c-form-wrap">
			<uni-forms ref="baseForm" :modelValue="formData" :rules="rules" label-position="top">
							<uni-forms-item label="计算方案" required>
								<template v-slot:label>
									计算方案
								</template>
								<view class="uni-flex ">
									<view class="uni-flex-item ">
								<picker @change="changePlan" :value="planIndex" range-key="name"  :range="optionsPlan">
									<view class="uni-flex uni-row-center  uni-between uni-select">
									<view class="picker-label" v-if="optionsPlan.length>0">{{optionsPlan[planIndex].name}}</view>
									<text class="icon-xiala iconfont"></text>
									</view>
								</picker>
								</view>
								<!-- <view class="uni-select  "><uni-icons type="gear-filled" color="#999" size="16"></uni-icons></view> -->
								</view>
							</uni-forms-item>
							<uni-forms-item label="采购成本" name="price" required>
							  <view class="uni-flex uni-between">	
							  <view class=" cell-r-8 uni-flex-item">
								<uni-easyinput
								 v-model="formData.price"
								 :clearable="false"
								  @change="params.cost=formData.price"
								   placeholder="请输入" />
								</view>
								<view style="width:60px;">
								<uni-data-select
								        v-model="currencyType"
								        :localdata="currencyData"
										 :clear="false"
								        @change="params.currency =currencyData[currencyType].text"
								      ></uni-data-select></view>
								</view>
							</uni-forms-item>
							<uni-forms-item label="重量" name="weight" required>
								<view class="uni-flex uni-between">
								<view class=" cell-r-8 uni-flex-item">
											<uni-easyinput
											 v-model="formData.weight"
											 :clearable="false"
											 @change="changeWeight"
											  placeholder="请输入" />
											</view>
											<view style="width:60px;">
											<uni-data-select
													v-model="weightType"
													:localdata="weightData"
													 :clear="false"
													@change="weightUnitChange"
												  ></uni-data-select></view>
											</view>
							</uni-forms-item>
							<uni-forms-item label="产品尺寸" name="length" required>
								<view class="uni-flex">
									<view class="cell-r-8">
								<uni-easyinput
								 v-model="formData.length"
								 :clearable="false"
								 @change="changeLength"
								  placeholder="长"
								   />
								</view>
								<view class="cell-r-8">
								<uni-easyinput v-model="formData.width"
								:clearable="false"
								@change="changeLength"
								 placeholder="宽"
								  />
								</view>
								<view class="cell-r-8">
								<uni-easyinput
								:clearable="false"
								 v-model="formData.height"
								 @change="changeLength"
								 placeholder="高" />
								</view>
								<view style="width:110px;">
								<uni-data-select
										v-model="ruleType"
										:localdata="ruleData"
										 :clear="false"
										@change="ruleUnitChange"
									  ></uni-data-select></view>
								</view>
							</uni-forms-item>
							<uni-forms-item label="产品品类" required>
								<picker @change="changeProType" :value="typeIndex" range-key="type"  :range="optionsProductType">
									<view class="uni-flex uni-row-center  uni-between uni-select">
									<view class="picker-label" v-if="optionsProductType.length>0">{{optionsProductType[typeIndex].type}}</view>
									<text class="icon-xiala iconfont"></text>
									</view>
								</picker>
							</uni-forms-item>
							<uni-forms-item label="轻小产品" >
								<uni-data-checkbox v-model="radio" @change="params.isSmlAndLightStr=lightProduct[radio].b"  :localdata="lightProduct"></uni-data-checkbox>
							</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="handleColculator">计算成本利润</button>
	</view>
</view>
  <ProfitLadder ref="popoupRef" @dataChange="dataChange" @rateChange="rateChange" :country="country" :profitData="profitData"/>
</template>

<script setup>
	import ProfitLadder from"./components/profitLadder.vue"
	import calculateApi from "@/api/amazon/profit/calculateApi"
	import materialApi from "@/api/erp/material/materialApi"
	import productinfoApi from "@/api/amazon/product/productinfoApi"
	import {formatFloat} from '@/utils/util';
    import { onMounted, reactive,toRefs,ref } from "vue";
	const baseForm = ref()
	const popoupRef =ref()   
	const state=reactive({
		isbutton:false,
		queryParams:{searchMarket:"",searchType:"SKU"},
		searchKeywords:'',
		country:[],
		profitData:{},
		formData:{
			price:"",
			weight:"",
			length:'',
			width:'',
			height:'',
		},
		optionsPlan:[],
		planIndex:0,
		lightProduct: [{
			text: '否',
			value: 0,
			b:false,
		}, {
			text: '是',
			value: 1,
			b:true, 
		}, ],
		radio:0,
		optionsMarkets:[],
		optionsProductType:[],
		searchData: [
		  { value: 0, text: "SKU" },
		  { value: 1, text: "ASIN" },
		],
		currencyData: [
		  { value: 0, text: "RMB" },
		  { value: 1, text: "USD" },
		],
		weightData: [
		  { value: 0, text: "kg" },
		  { value: 1, text: "lb" },
		  { value: 2, text: "oz" },
		],
		ruleData: [
		  { value: 0, text: "cm" },
		  { value: 1, text: "in" },
		],
		ruleType:0,
		weightType:0,
		currencyType:0,
		searchChecked:0,
		index:0,
		typeIndex:41,
		params:{
			categories:'',
			currency:'RMB',
			wunit:'kg',
			lunit:'cm',
			typeId:41,
			shipmentType:'national',
			profitCfgId:"",
			isSmlAndLightStr:false,
		},
		rules:{
			price:{
				rules:[
					{
					 required: true,
					 errorMessage: '请输入采购成本',
				    },
					{
					  format:"number",
					  errorMessage: '请输入正确的数字',
					},
					{
					  minimum:0,
					  errorMessage: '不能小于0',
					}
                 ]                  
			},
			weight:{
				rules:[
					{
					 required: true,
					 errorMessage: '请输入重量',
				    },
					{
					  format:"number",
					  errorMessage: '请输入正确的数字',
					},
					{
					  minimum:0,
					  errorMessage: '不能小于0',
					}
                 ]                  
			},
			length:{
				rules:[
					{
					 required: true,
					 errorMessage: '请输入长度',
				    },
					{
					  format:"number",
					  errorMessage: '请输入正确的数字',
					},
					{
					  minimum:0,
					  errorMessage: '不能小于0',
					}
                 ]                  
			},
	
		}
	})
	const{
		isbutton,
		queryParams,
		searchKeywords,
		profitData,
		country,
		rules,
		params,
		formData,
		optionsPlan,
		planIndex,
		radio,
		lightProduct,
		searchData,
		weightData,
		weightType,
		currencyData,
		currencyType,
		ruleData,
		ruleType,
		searchChecked,
		optionsMarkets,
		optionsProductType,
		index,
		typeIndex,
	}=toRefs(state)
	function loadData(){
		calculateApi.showProfitPage({"isSmlAndLight":"false"}).then(res=>{
			if(res){
				state.queryParams.searchMarket = res.marketlist[state.index].marketplaceid
				state.optionsMarkets = res.marketlist
				state.optionsPlan = res.profitCfgList
				state.optionsPlan.forEach((item,index)=>{
					if(item.isDefault){
						state.planIndex = index
						state.params.profitCfgId = item.id
					}
				})
				state.optionsProductType=res.typeList
				state.country = res.countryMarketlist
			}
		})
	}
	function handleChangeData(e){
		state.index = e.detail.value
	}
	function changePlan(e){
		state.planIndex =  e.detail.value
		state.params.profitCfgId = state.optionsPlan[state.planIndex].id
		
	}
	function changeProType(e){
		state.typeIndex = e.detail.value
		state.params.typeId = state.optionsProductType[state.typeIndex].id
	}
	function dataChange(val){
		state.params.country = val
		calculateApi.showProfit(state.params).then(res=>{
			state.profitData = res
		})
	}
	function rateChange(params){
		state.params.shipmentType = params.shipmentType
		state.params.referralrate = params.referralrate
		state.params.taxrate = params.taxrate
		state.params.gstrate = params.gstrate
		state.params.sellingGSTRate = params.sellingGSTRate
		handleColculator("in")
	}
	
	function handleColculator(val){
		baseForm.value.validate().then(res=>{
			if(state.params.width>0
			&&state.params.height>0 
			){
				calculateApi.showCost(state.params).then(res=>{
					if(res){
						console.log(res)
						state.profitData = res.country
						if(val!='in'){
							popoupRef.value.show()
						}
					}
				})
			}else{
				showError()
			}
		}).catch(err=>{
			showError()
		})
	}
	function showError(){
		uni.showToast({
			title:'请正确填写！',
			icon:'error',
			duration:2000
		});
	}
	function changeWeight() {//改变重量
		var weight = state.formData.weight;
		state.params.weight= weight;
		var w = state.params.wunit;
		var kg = "kg";
		var lb = "lb";
		var oz = "oz";
		if(weight==""||weight=="0"){
			state.params.weight2= "0lb";
			state.params.weight3= "0oz";
		}
		if (w == kg) {
			//alert(weight);
			state.params.weight2=(weight * 2.2046).toFixed(2) + "lb";
			state.params.weight3=(weight * 2.2046 * 16).toFixed(2) + "oz";
		}
		if (w == lb) {
			state.params.weight2=(weight * 0.4536).toFixed(2) + "kg";
			state.params.weight3=(weight * 16).toFixed(2) + "oz";
		}
		if (w == oz) {
			state.params.weight2=(weight / 16).toFixed(2) + "lb";
			state.params.weight3=(weight / 16 * 0.4536).toFixed(2) + "kg";
		}
	}
function changeLength() {//改变尺寸
	var l =state.params.lunit;
	var length =state.formData.length;
	var width =state.formData.width;
	var height =state.formData.height;
	state.params.width=width
	state.params.height=height
	state.params.length=length
	state.params.lunit = l
	var cm = "cm";
	var i = "in";
	if (l == cm) {
		state.params.length2="长："+(length * 0.3937).toFixed(2) + "in";
		state.params.width2 ="宽："+(width * 0.3937).toFixed(2)  + "in";
		state.params.height2="高："+(height * 0.3937).toFixed(2) + "in";
	}
	if (l == i) {
		state.params.length2 ="长："+(length * 2.54).toFixed(2) + "cm";
		state.params.width2  ="宽："+(width * 2.54).toFixed(2)  + "cm";
		state.params.height2 ="高："+(height * 2.54).toFixed(2) + "cm";
	}
}

function ruleUnitChange(e){
	  state.params.lunit = state.ruleData[e].text
}
	function weightUnitChange(e){
		state.params.wunit = state.weightData[e].text
	}
	
	function handleChangeMarket(e){
		state.index = e.detail.value
		state.queryParams.searchMarket = state.optionsMarkets[state.index].id
	}
	function searchType(e){
		   state.queryParams.searchType = state.searchData[e].text
	}
	function handleSerach(){
		state.isbutton = true
		if(state.queryParams.searchType==='SKU'){
			materialApi.getMaterialInventoryInfo(
			{"sku":state.searchKeywords,
			"warehouseid":""}
			).then(res=>{
				if(res.material){
					state.formData.price =res.material.price 
					state.params.cost = state.formData.price
				}else{
					uni.showToast({
						title:'未找到对应sku！',
						icon:'error',
						duration:2000
					});
					return
				}
				
				if(res.pkgDim){
					state.formData.length=res.pkgDim.length;
					state.formData.width =res.pkgDim.width;
					state.formData.height=res.pkgDim.height;
					state.formData.weight=res.pkgDim.weight;
				}else{
					uni.showToast({
						title:'未找产品对应尺寸！',
						icon:'error',
						duration:2000
					});
					return
				}
				state.params.wunit="kg";
				state.params.lunit="cm";
				changeLength();
				changeWeight();
				state.isbutton = false;
				uni.showToast({
					title:'查询成功！',
					icon:'success',
					duration:2000
				});
			}).catch(e=>{
				uni.showToast({
					title:'请输入正确的SKU！',
					icon:'error',
					duration:2000
				});
				state.isbutton = false
			})
		}else{
			if(state.queryParams.searchMarket){
				productinfoApi.getDim({
					"asin":state.searchKeywords,
				    "marketplaceid":state.queryParams.searchMarket,
					}).then(res=>{
						var size = res.dimensions[0].package
						state.formData.length=formatFloat(size.length.value);
						state.formData.width =formatFloat(size.width.value);
						state.formData.height=formatFloat(size.height.value);			
						state.formData.weight=formatFloat(size.weight.value);
						if(size.height.unit=="inches"){
								state.params.lunit="in";
						}
						if(size.height.unit=="centimeters"){
								 state.params.lunit="cm";
						}
						
						if(size.weight.unit=="pounds"){
								 state.params.wunit="lb";
						}
						if(size.weight.unit=="grams"){
							  state.formData.length=state.formData.length/1000;
							  state.formData.width=state.formData.width/1000;
							  state.formData.height=state.formData.height/1000;
							  state.params.wunit="kg";
							  
						}
						state.weightData.forEach((item,index)=>{
							if(item.text===state.params.wunit){
								state.weightType = index
							}
						})
						state.ruleData.forEach((item,index)=>{
							if(item.text===state.params.lunit){
								state.ruleType = index
							}
						})
						changeLength();
						changeWeight();
						uni.showToast({
							title:'查询成功！',
							icon:'success',
							duration:2000
						});
						state.isbutton = false
					}).catch(e=>{
						uni.showToast({
							title:'请输入正确的ASIN！',
							icon:'error',
							duration:2000
						});
						state.isbutton = false
					})
			}
		}
	}
	
	onMounted(()=>{
		loadData()
	})
	
</script>

<style scoped>
	.c-herder-wrap{
		background-color: #f5f5f5;
		padding-right:8px;
		padding-left:8px;
	}
	.uni-select-button{
		background-color: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
		padding:11px;
	}
	.uni-select{
		border:1px solid #eee;
		padding:8px 10px;
		border-radius: 4px;
	}
	.search-group{
		border: none;
		background-color: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
	}
	.c-form-wrap{
		background-color: #fff;
		border-top-left-radius:16px ;
		border-top-right-radius:16px;
		padding:16px;
	}
.uni-forms-item__label{
	height: 34px;
}
.picker-label{
	max-width: 240px;
}
</style>
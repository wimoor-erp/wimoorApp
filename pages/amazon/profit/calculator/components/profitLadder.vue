<template>
	<uni-popup ref="popup" background-color="#fff" @change="change">
		  <uni-segmented-control
		   :current="current"
			:values="tabsData"
			styleType="text"
			 @clickItem="onClickItem"
			  activeColor="#ff7315">
			  </uni-segmented-control>
		   <scroll-view  scroll-y="true" class="scroll-y">
			   <view v-show="current===0">
					<view class="popoup-wrap">
						<scroll-view scroll-x="true" @scroll="scroll" >
						<view class="uni-flex uni-row-center scoll-x">
							<view class="market-wrap"
							@click="isActive=index"
							 :class="{'active':isActive===index}" 
							 :key="index"
							 v-for="(item,index) in country">
								<image
								style="width:21px;height: 21px;"
								:src="'/pages/amazon/static/flag/'+item.market+'-flag-small.jpg'">
								</image>
								<text class=" uni-h5">{{item.name}}</text>
							</view>
						</view>
						</scroll-view>
						<view v-if="country[isActive]?.market==='IN'" class="marketDIY">
							<uni-collapse >
							<uni-collapse-item title="税率配置">
								<view class="uni-flex uni-column gap16">
								<uni-row :gutter="16">
									<uni-col :span="12">
										<view class="cell-b-8 uni-h6">佣金比率</view>
										<uni-easyinput
										:clearable="false"
										 v-model="inParams.referralrate"
										 placeholder="默认按照所选品类匹配" >
                                          <template v-slot:right>
											<view class="cell-r-8">%</view>
										  </template>											 
										 </uni-easyinput>
									</uni-col>
									<uni-col :span="12">
										<view class="cell-b-8 uni-h6">进口税率</view>
										<uni-easyinput
										:clearable="false"
										 v-model="inParams.taxrate"
										 placeholder="请输入" >
										<template v-slot:right>
											<view class="cell-r-8">%</view>
										 </template>											 
										</uni-easyinput> 
									</uni-col>
								</uni-row>
								<uni-row :gutter="16">
									<uni-col :span="12">
										<view class="cell-b-8 uni-h6">进口GST税率</view>
										<uni-easyinput
										:clearable="false"
										 v-model="inParams.gstrate"
										 placeholder="请输入" >
                                          <template v-slot:right>
											<view class="cell-r-8">%</view>
										  </template>											 
										 </uni-easyinput>
									</uni-col>
									<uni-col :span="12">
										<view class="cell-b-8 uni-h6">销售GST税率</view>
										<uni-easyinput
										:clearable="false"
										 v-model="inParams.sellingGSTRate"
										 placeholder="请输入" >
										<template v-slot:right>
											<view class="cell-r-8">%</view>
										 </template>											 
										</uni-easyinput> 
									</uni-col>
								</uni-row>
								</view>
							</uni-collapse-item>
							</uni-collapse>
							<view class="uni-flex uni-column cell-t-8">
							<uni-data-select
							        v-model="inlocal"
							        :localdata="inlocalData"
									 :clear="false"
							        @change="inParams.shipmentType=inlocalData[inlocal].text"
							      ></uni-data-select>
								  <view class="uni-flex-item cell-t-8 ">
								  <button  type="primary" @click="resetColculator">重现计算</button>
								  </view>
							</view>	  
						</view>
						<view class="cell-t-8">
							<uni-table  stripe emptyText="暂无更多数据" >
								<!-- 表头行 -->
								<uni-tr>
									<uni-th width="120"  align="left">利润率</uni-th>
									<uni-th  width="120" align="right">
										<view class="uni-right uni-flex-item">售价
									({{profitData[country[isActive]?.market]?.currency}})
									</view>
									</uni-th>
									<uni-th width="120" align="right">
										<view class="uni-right uni-flex-item">
										利润	
										</view>
										</uni-th>
								</uni-tr>
								<!-- 表格数据行 -->
								<uni-tr>
									<uni-td  align="left">
									<text class="text-green font-bold">
									{{profitData[country[isActive]?.market]?.margin}}
									</text>	
									</uni-td>
									<uni-td align="right">
										<uni-easyinput
										v-if="isshow"
										:clearable="false"
										v-model="profitData[country[isActive]?.market].sellingPrice"
										 @input="handleInput"
										 placeholder="您的售价" />
									</uni-td>
									<uni-td align="right">
								    <text class="text-red font-bold">
									{{profitData[country[isActive]?.market]?.profit}}
									</text>	
									</uni-td>
								</uni-tr>
								<uni-tr
								:key="index"
								 v-for="(item,index) in profitData[country[isActive]?.market]?.resultList">
									<uni-td  align="left" >
									<text  :class="{'font-bold':item.margin==='30.0%'}">	
									{{item.margin}}
									</text>
									</uni-td>
									<uni-td align="right">
										<text  :class="{'font-bold':item.margin==='30.0%'}">
									{{item.sellingPrice}}
									</text>
									</uni-td>
									<uni-td align="right">
										<text  :class="{'font-bold':item.margin==='30.0%'}">
									{{item.profit}}
									</text>
									</uni-td>
								</uni-tr>
							</uni-table>
							</view>
					</view>
					</view>	
					<view v-show="current===1">
						<view class="popoup-wrap">
							<scroll-view scroll-x="true" @scroll="scroll" >
							<view class="uni-flex uni-row-center scoll-x">
								<view class="market-wrap"
								@click="isActive=index"
								 :class="{'active':isActive===index}" 
								 :key="index"
								 v-for="(item,index) in country">
									<image
									style="width:21px;height: 21px;"
									:src="'/pages/amazon/static/flag/'+item.market+'-flag-small.jpg'">
									</image>
									<text class=" uni-h5">{{item.name}}</text>
								</view>
							</view>
							</scroll-view>
							</view>
						<view class="popoup-wrap"  v-if="profitData[country[isActive]?.market]?.sellingPrice>0">
							<uni-table  stripe emptyText="暂无更多数据" >
								<!-- 表头行 -->
								<uni-tr>
									<uni-th width="60"  align="left">序号</uni-th>
									<uni-th  align="left">费用项
									</uni-th>
									<uni-th width="120" align="right">
									<view class="uni-right uni-flex-item">金额	</view>
										</uni-th>
								</uni-tr>
								<!-- 表格数据行 -->
								<uni-tr v-for="(item,index) in detailsFee" :key="index">
									<uni-td  align="left" >
									<text >	
									   {{index+1}}
									</text>
									</uni-td>
									<uni-td align="left">
										{{item.name}}
									<view class="uni-h7">
										{{item.enName}}
									</view>
									</uni-td>
									<uni-td align="right">
									<text >
										{{profitData[country[isActive]?.market]?.currency}}
										{{item.fee}}
									</text>
									</uni-td>
								</uni-tr>
								<uni-tr>
									<uni-td width="60"  align="left">
										<text class="font-bold">合计</text>
										</uni-td>
									<uni-td  align="left">
									</uni-td>
									<uni-td width="120" align="right">
										<text class="font-bold">
										{{profitData[country[isActive]?.market]?.currency}}
										{{profitData[country[isActive]?.market]?.totalCost}}</text>
									</uni-td>
								</uni-tr>
							</uni-table>
							</view>
							<view v-else class="uni-h6 popoup-wrap">输入对应国家售价后可查看！</view>
					</view>
			<view class="popoup-wrap" v-show="current===2">
				<view class="uni-h5 font-bold">FBA费用各国标准尺寸对照</view>
				<view class="list-wrap">
					<view class=" cell-t-12 "
					 v-for="(item,index) in country" :key="index">
					 <uni-row>
						 <uni-col :span="6">
							 <text >{{item.name}}</text>
						 </uni-col>
						 <uni-col :span="12">
							 {{profitData[item.market]?.productTier}}
						 </uni-col>
						 <uni-col :span="6">
							 <view class="uni-h6 uni-right">
							 {{profitData[item.market]?.currency}}	
							 {{profitData[item.market]?.fba}}
							 </view>
						 </uni-col>
					 </uni-row>
					</view>
				</view>
			</view>
			</scroll-view>

	</uni-popup>
	
</template>

<script setup>
    import { onMounted,ref,toRefs,reactive,computed } from "vue";
	import util from '@/utils/util';
	const props=defineProps({
		country:{},
		profitData:{},
	})
	const emit=defineEmits(['dataChange'])
	const {country,profitData}=toRefs(props)
	const popup = ref()
	const state=reactive({
		current:0,
		inParams:{
			shipmentType:"national",
			referralrate:'',
			taxrate:'',
			gstrate:'',
			sellingGSTRate:'',
			},
			tabsData:['利润阶梯','成本明细', 'FBA费尺寸对照', ],
		isActive:0,
		inlocal:2,
		isshow:false,
		inlocalData:[
			{text:'local',value:0},
			{text:'regional',value:1},
			{text:'national',value:2},
		],
	})
	const{
		current,
		isshow,
		tabsData,
		inParams,
		inlocal,
		inlocalData,
		isActive,
	}=toRefs(state)
	function show(){
		popup.value.open("bottom");
		state.isshow = true
		if(props.profitData[props.country[state.isActive]?.market]?.sellingPrice>0){
			handleInput()
		}
	}
	const handleInput=util.debounce(function(){
		  emit("dataChange",props.profitData)
	}, 500)	
	
	function resetColculator(){
		emit("rateChange",state.inParams)
		handleInput()
	} 
	
	function onClickItem(e){
		state.current = e.currentIndex
	}
	const detailsFee = computed(()=>{
		var arr=[
			{name:"采购成本",enName:'Purchase cost',fee:props.profitData[props.country[state.isActive]?.market]?.purchase},
			{name:"运费",enName:'Shipment',fee:props.profitData[props.country[state.isActive]?.market]?.shipment},
			{name:"平台佣金",enName:'Amazon Referral Fee',fee:props.profitData[props.country[state.isActive]?.market]?.referralFee},
			{name:"变动结算费",enName:'Variable Closing Fee',fee:props.profitData[props.country[state.isActive]?.market]?.vcfee},
			{name:"FBA处理费",enName:'FBA',fee:props.profitData[props.country[state.isActive]?.market]?.fba},
			{name:"仓储费",enName:'Inventory Storage Fee',fee:props.profitData[props.country[state.isActive]?.market]?.storageFee},
			{name:"标签费",enName:'Label Service Fee',fee:props.profitData[props.country[state.isActive]?.market]?.labelServiceFee},
			{name:"进口关税",enName:'Import Duty Tax',fee:props.profitData[props.country[state.isActive]?.market]?.tax},
			{name:"汇率损耗",enName:'Currency Transport Fee',fee:props.profitData[props.country[state.isActive]?.market]?.currencyTransportFee},
			{name:"市场营销费用",enName:'Marketing',fee:props.profitData[props.country[state.isActive]?.market]?.marketing},
			{name:"其它每单销售固定费用",enName:'Others',fee:props.profitData[props.country[state.isActive]?.market]?.others},
			{name:"其它每单销售固定成本",enName:'Other rate Fee',fee:props.profitData[props.country[state.isActive]?.market]?.othersFee},
			{name:"按件收费，适用个人版",enName:'Per-Item Fee',fee:props.profitData[props.country[state.isActive]?.market]?.perItemFee},
			
		]
		var market = props.country[state.isActive]?.market
		if(market==='US'||market==='JP'){
			arr.push({name:"库存配置费",enName:'Inventory Placement Service Fee',fee:props.profitData[props.country[state.isActive]?.market]?.inPlaceFee})
		}
		if(market==='US'){
			arr.push({name:"人工处理费",enName:'Manual Processing Fee',fee:props.profitData[props.country[state.isActive]?.market]?.manualProcessingFee})
		}
		if(market==='IN'||market==='CA'){
			arr.push({name:"FBA GST/HST 税率",enName:'FBA GST/HST Taxes',fee:props.profitData[props.country[state.isActive]?.market]?.fbaTaxFee})
		}
		if(market==='IN'){
			arr.push({name:"固定结算费",enName:'Fixed Closing Fee',fee:props.profitData[props.country[state.isActive]?.market]?.closingFee})
			arr.push({name:"进口GST税率",enName:'Import GST Tax',fee:props.profitData[props.country[state.isActive]?.market]?.import_GST})
			arr.push({name:"销售GST税率",enName:'Import GST Tax',fee:props.profitData[props.country[state.isActive]?.market]?.selling_GST})
			arr.push({name:"企业所得税率",enName:'Import GST Tax',fee:props.profitData[props.country[state.isActive]?.market]?.corporateInFee})
		}
		if(market==='UK'||market==='DE'||market==='IT'||market==='ES'||market==='FR'||market==='NL'){
			arr.push({name:"欧洲增值税",enName:'Vat Tax Fee',fee:props.profitData[props.country[state.isActive]?.market]?.vatFee})
		}
		return arr
	})
	
	onMounted(()=>{

	})
	
	defineExpose({
		show,
	})
</script>

<style scoped>
	.popoup-wrap{
		margin:12px;
	}
	.market-wrap{
		padding: 8px;
		border: 1px solid #eee;
		border-radius: 4px;
		 min-width:80px;
		 display: flex;
		 flex-direction: column;
		 align-items: center;
		 justify-content: center;
	}
	.scoll-x{
		gap:8px;
	}
	.scroll-y{
		max-height:600px;
	}
	.active{
		background-color: rgba(255, 115, 21,0.05);
		border: 1px solid #ff7135;
	}
	.font-bold{
		font-weight: 700!important;
	}
	.marketDIY{
		margin-top: 8px;
	}
	.gap16{
		gap:16px
	}
	.cell-t-12{
		margin-top:16px;
	}
</style>
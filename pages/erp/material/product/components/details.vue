<template>
	<view class="affix-top" :style="{'opacity':bgOpacity}">
	<uni-segmented-control :current="currentItem" :values="navList" style-type="text"
	active-color="#ff6700" @clickItem="changeNav" />
	</view>
	<scroll-view  scroll-y="true" class="scroll-Y"
	 :scroll-into-view="scollTo"
	  @scroll="scrollChange">
		<view class="PD-wrap">
			<view class="PD-bg"
			 :style="{'background-image':'url('+images+')'}">
				<view class="status_bar">
						 <!-- 这里是状态栏 -->
				</view>
				<view class="my-tabbar">
					<view class="round-icon" @click="goBack">
					 <uni-icons type="left" size="24"></uni-icons>
					</view>
				</view>
			  </view>
			  <uni-card margin="8px" padding="16px 0px" class="n-shadow">
				  <view class="uni-title">基础信息</view>
				  <view class="uni-flex flex-gap uni-column">
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">产品名称</text>
					 </uni-col>
					 <uni-col :span="18">
					  <text class="text-black">{{dataList.material?.name}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">SKU</text>
					 </uni-col>
					 <uni-col :span="18">
					  <text class="text-black">{{dataList.material?.sku}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">产品类型</text>
					 </uni-col>
					 <uni-col :span="18">
					   <uni-tag v-show="dataList.material?.issfg==='0'" text="单独成品"
					   size="mini" type="success"
					   ></uni-tag>
					   <uni-tag v-show="dataList.material?.issfg==='1'" text="组合产品"
					   size="mini" type="warning"
					   ></uni-tag>
					   <uni-tag v-show="dataList.material?.issfg==='2'" text="待组"
					   size="mini" 
					   ></uni-tag>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">品牌</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.brand}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">规格</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.specification}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">品类</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.category}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">产品标签</text>
					 </uni-col>
					 <uni-col :span="18">
						<uni-tag
						  v-for="(item,index) in dataList?.tagNameList" 
						 :key="index"
						 inverted
						 size="mini"
						 :type="item.color"
						 :text="item.name">
						 </uni-tag> 
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">负责人</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.ownername}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">生效日期</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{util.dateFormat(dataList.material?.effectivedate)}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">创建日期</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{util.dateFormat(dataList.material?.createdate)}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">创建人</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.creator}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">修改日期</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.opttime}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">修改人</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.operator}}</text>
					 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
					 <uni-col :span="6">
						 <text class="text-light">备注</text>
					 </uni-col>
					 <uni-col :span="18">
						 <text class="text-black">{{dataList.material?.remark}}</text>
					 </uni-col>
				 </uni-row>
				 </view>
			  </uni-card>
			 <uni-card v-show="dataList.assemblyList?.length>0"
			  margin="8px" padding="16px 0px" class="n-shadow"> 
			     <view class="uni-title">子SKU列表</view>
				<view class="uni-flex uni-column flex-gap">
				<view v-for="(item,index) in dataList.assemblyList" :key="index">
				   <view class="uni-flex ">
							<view class="image-60">
							<image v-if="item.image" :src="item.image" ></image>
							<image   v-else src="/static/empty/noimage40.png" ></image>
							</view>
							 <view class="uni-flex uni-column cell-l-8">
								 <view>{{item.mname}}</view>
								 <view class="text-blue">{{item.sku}}</view>
								 <view class="uni-flex uni-h6 cell-t-8 flex-gap">
									 <text>单价:￥{{item.subprice}}</text>
									 <text>关联数量:{{item.subnumber}}</text>
									 <text>可用库存:{{item.fulfillable}}</text>
								 </view>
							 </view>
								</view>
								</view>
					</view>
			 </uni-card>
			  <uni-card margin="8px" padding="16px 0px" class="n-shadow">
				 <view class="uni-title">采购信息</view> 
				 <view class="uni-flex flex-gap uni-column">
				 <uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">采购成本</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text  class="text-black">￥{{dataList.material?.price}}</text>
						 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">其它成本</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text v-if="dataList.material?.otherCost" class="text-black">￥{{dataList.material?.otherCost}}</text>
							 <text v-else class="text-black">￥0.00</text>
						 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">退税率</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text v-if="dataList.material?.vatrate" class="text-black">{{dataList.material?.vatrate}}</text>
							 <text v-else class="text-black">0</text>
						 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">采购加权成本</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text v-if="dataList.material?.priceWavg" class="text-black">￥{{dataList.material?.priceWavg}}</text>
							 <text v-else class="text-black">￥0.00</text>
						 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">采购加权运费</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text v-if="dataList.material?.priceShipWavg" class="text-black">￥{{dataList.material?.priceShipWavg}}</text>
							 <text v-else class="text-black">￥0.00</text>
						 </uni-col>
				 </uni-row>
				 <uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">供货周期</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text v-if="dataList.material?.deliveryCycle" class="text-black">{{dataList.material?.deliveryCycle}} 天</text>
							 <text v-else class="text-black">-</text>
						 </uni-col>
				 </uni-row>
				 <view class="sup-wrap" v-for="(item,index) in dataList.supplierList" :key="index">
					 <view class="uni-flex flex-gap uni-column">
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">供货商</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text class="text-black">{{item.name}}</text>
						 </uni-col>
					</uni-row> 
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">供货周期</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text class="text-black">{{item.deliverycycle}}天</text>
						 </uni-col>
					</uni-row> 
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">采购链接</text>
						 </uni-col>
						 <uni-col :span="18">
							 <view style="overflow: auto;">
							<uni-link :href="item.purchaseUrl" :text="item.purchaseUrl"></uni-link>
							</view>
						 </uni-col>
					</uni-row> 
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">采购阶梯价</text>
						 </uni-col>
						 <uni-col :span="18">
							 <uni-table  stripe emptyText="暂无更多数据" >
							 	<!-- 表头行 -->
							 	<uni-tr>
							 		<uni-th width="80"  align="left">起订量</uni-th>
							 		<uni-th width="80" >
							 			币种
							 		</uni-th>
							 		<uni-th width="80" align="right">
							 			<view class="uni-right uni-flex-item">
							 			采购单价	
							 			</view>
							 		</uni-th>
							 	</uni-tr>
							 	<!-- 表格数据行 -->
							 	<uni-tr
							 	:key="index"
							 	 v-for="(sub,index) in item.stepList">
							 		<uni-td  align="left" >
							 		<text >	
							 		{{sub.amount}}
							 		</text>
							 		</uni-td>
							 		<uni-td >
							 		<text v-if="sub.currency===''">
							 		  RMB
							 		</text>
									<text v-else>
									  {{sub.currency}}
									</text>
							 		</uni-td>
							 		<uni-td align="right">
							 			<text >
							 		{{sub.price}}
							 		</text>
							 		</uni-td>
							 	</uni-tr>
							 </uni-table>
						 </uni-col>
					</uni-row>
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">不良率</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text class="text-black">{{item.badrate}}%</text>
						 </uni-col>
					</uni-row>
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">供应商代码</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text class="text-black">{{item.productCode}}</text>
						 </uni-col>
					</uni-row>
					<uni-row :gutter="16">
						 <uni-col :span="6">
							 <text class="text-light">下单备注</text>
						 </uni-col>
						 <uni-col :span="18">
							 <text class="text-black">{{item.remark}}</text>
						 </uni-col>
					</uni-row>  
					</view>
				 </view>
				 </view>
			  </uni-card>
			  <uni-card margin="8px" padding="16px 0px" class="n-shadow">
				  <view class="uni-title">规格信息</view>
				  <view class="uni-flex flex-gap uni-column">
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">净品规格</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black" v-if="dataList.itemDim">
							 {{dataList.itemDim?.length}}x{{dataList.itemDim?.width}}x{{dataList.itemDim?.height}}cm
							 </text>
					 	 </uni-col>
					 </uni-row> 
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">带包装规格</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black" v-if="dataList.pkgDim">
							 {{dataList.pkgDim?.length}}x{{dataList.pkgDim?.width}}x{{dataList.pkgDim?.height}}cm
							 </text>
					 	 </uni-col>
					 </uni-row>  
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">单箱规格</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black" v-if="dataList.boxDim">
							{{dataList.boxDim?.length}}x{{dataList.boxDim?.width}}x{{dataList.boxDim?.height}}cm
							 </text>
					 	 </uni-col>
					 </uni-row>
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">单箱数量</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black">{{dataList.material?.boxnum}}</text>
					 	 </uni-col>
					 </uni-row>  
				  </view>  
			  </uni-card>
			 <uni-card margin="8px" padding="16px 0px" class="n-shadow"> 
			 <view class="uni-title">辅料关联</view>
			 <view class="uni-flex uni-column flex-gap">
			 <view v-for="(item,index) in dataList.consumableList" :key="index">
			    <view class="uni-flex ">
					<view class="image-60">
					<image v-if="item.image" :src="item.image" ></image>
					<image   v-else src="/static/empty/noimage40.png" ></image>
					</view>
					 <view class="uni-flex uni-column cell-l-8">
						 <view>{{item.name}}</view>
						 <view class="text-blue">{{item.sku}}</view>
						 <view class="uni-flex uni-h6 cell-t-8 flex-gap">
						 	 <text>单价:￥{{item.price}}</text>
						 	 <text>关联数量:{{item.amount}}</text>
						 </view>
					 </view>
				</view>
				</view>
				</view>
			  </uni-card>
			  <uni-card margin="8px" padding="16px 0px" class="n-shadow">
				 <view class="uni-title">物流信息</view>
				 <view class="uni-flex uni-column flex-gap">
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">申报单价</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black">{{dataList.customs?.unitprice}}{{dataList.customs?.currency}}</text>
					 	 </uni-col>
					 </uni-row> 
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">中文报关名</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black">{{dataList.customs?.nameCn}}</text>
					 	 </uni-col>
					 </uni-row> 
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">英文报关名</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		 <text class="text-black">{{dataList.customs?.nameEn}}</text>
					 	 </uni-col>
					 </uni-row> 
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">特殊属性</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		<uni-tag v-if="dataList.customs?.iselectricity==true" type="warning">带电/磁</uni-tag>
					 		<uni-tag v-if="dataList.customs?.isdanger==true"  type="error">危险品</uni-tag>
					 	 </uni-col>
					 </uni-row> 
					 <uni-row :gutter="16">
					 	 <uni-col :span="6">
					 		 <text class="text-light">物流报关</text>
					 	 </uni-col>
					 	 <uni-col :span="18">
					 		<view class="uni-right" @click="handleWuLiu">
								<text class="text-light">查看</text>
								<uni-icons type="right" color="#999" size="16"></uni-icons>
							</view>
					 	 </uni-col>
					 </uni-row> 
				 </view>
			  </uni-card>
				<uni-card margin="8px" padding="16px 0px" class="n-shadow">
					<view class="uni-title">库存信息</view>
					<uni-segmented-control :current="current" :values="invtabs" style-type="text"
					active-color="#ff6700" @clickItem="onClickItem" />
					<view v-show="current===0">
					<view class="cell-t-8" >
					<uni-data-select
					        v-model="shelf"
					        :localdata="invShelf"
							 :clear="false"
					        @change="ivnChange"
					      ></uni-data-select>
					</view>	
					<view class="cell-t-8">
					  <uni-table border stripe emptyText="暂无更多数据" >
					  	<!-- 表头行 -->
					  	<uni-tr>
					  		<uni-th width="100" align="left">仓库</uni-th>
					  		<uni-th width="60" align="left">安全库存周期</uni-th>
					  		<uni-th  width="70" align="left">待入库</uni-th>
					  		<uni-th  width="60" align="left">可用</uni-th>
					  		<uni-th  width="70" align="left">待出库</uni-th>
					  	</uni-tr>
					  	<!-- 表格数据行 -->
					  	<uni-tr v-for="(item,index) in inventoryList" :key="index">
							<uni-td>{{item.warehouse}}</uni-td>
							<uni-td>{{item.stockingCycle}}</uni-td>
					  	<uni-td>{{item.inbound}}</uni-td>
					  	<uni-td>{{item.fulfillable}}</uni-td>
					  	<uni-td>{{item.outbound}}</uni-td>
					  	</uni-tr>
					  </uni-table>
					  </view>
					  </view>
					  <view class="cell-t-8" v-show="current===1">
					    <uni-table border stripe emptyText="暂无更多数据" >
					    	<!-- 表头行 -->
					    	<uni-tr>
					    		<uni-th width="100" align="left">仓库</uni-th>
					    		<uni-th width="120" align="left">店铺</uni-th>
					    		<uni-th  width="110" align="left">安全库存周期</uni-th>
					    		<uni-th  width="80" align="left">发货频率</uni-th>
					    		<uni-th  width="60" align="left">可售</uni-th>
					    		<uni-th  width="90" align="left">正在发货</uni-th>
					    		<uni-th  width="70" align="left">待接收</uni-th>
					    		<uni-th  width="80" align="left">正在接收</uni-th>
					    		<uni-th  width="70" align="left">不可售</uni-th>
					    	</uni-tr>
					    	<!-- 表格数据行 -->
					    	<uni-tr v-for="(item,index) in FBAinventoryList" :key="index">
					  		<uni-td>{{item.name}}</uni-td>
					  		<uni-td>{{item.gname}}</uni-td>
					    	<uni-td>{{item.stockingCycle}}</uni-td>
					    	<uni-td>{{item.mincycle}}</uni-td>
					    	<uni-td>{{item.afnFulfillableQuantity}}</uni-td>
					    	<uni-td>{{item.afnInboundWorkingQuantity}}</uni-td>
					    	<uni-td>{{item.afnInboundShippedQuantity}}</uni-td>
					    	<uni-td>{{item.afnInboundReceivingQuantity}}</uni-td>
					    	<uni-td>{{item.afnUnsellableQuantity}}</uni-td>
					    	</uni-tr>
					    </uni-table>
					    </view>
				</uni-card>
		</view>
	</scroll-view>
	<uni-popup ref="popup" background-color="#fff" >
		<view class="popup-content" > 
		   <uni-table border stripe emptyText="暂无更多数据" >
		   	<!-- 表头行 -->
		   	<uni-tr>
				<uni-th width="100" align="left">仓库</uni-th>
				<uni-th width="60" align="left">安全库存周期</uni-th>
				<uni-th  width="70" align="left">待入库</uni-th>
				<uni-th  width="60" align="left">可用</uni-th>
				<uni-th  width="70" align="left">待出库</uni-th>
		   	</uni-tr>
		   	<!-- 表格数据行 -->
		   	<uni-tr v-for="item in dataList.customsItemList">
		     	<uni-td>{{item.country}}</uni-td>
				<uni-td>{{item.fee}}</uni-td>
				<uni-td>{{item.code}}</uni-td>
				<uni-td>{{item.taxrate}}</uni-td>
		   	</uni-tr>
		   </uni-table>
		</view>
	</uni-popup>
</template>

<script setup>
	import materialApi from '@/api/erp/material/materialApi.js';
	import inventoryApi from '@/api/erp/inventory/inventoryApi.js';
	import inventoryRptApi from '@/api/amazon/inventory/inventoryRptApi.js';
	import {onLoad} from "@dcloudio/uni-app";
    import { reactive,toRefs,ref } from 'vue';
	import util from '@/utils/util.js';
	const popup =ref()
	const state=reactive({
		id:"",
		scollTo:'',
		bgOpacity:0,
		current:0,
		currentItem:0,
		images:'',
		dataList:{},
		shelf:'self_usable',
		inventoryList:[],
		FBAinventoryList:[],
		invShelf:[
		{text:'正品仓',value:'self_usable'},
		{text:'测试仓',value:'self_test'},
		{text:'废品仓',value:'self_unusable'},	
		],
		navList:['产品',"采购","规格","辅料","物流","库存"],
		invtabs:[
			'本地仓', 'FBA仓', 
		],
	})
	const {
		scollTo,
		bgOpacity,
		currentItem,
		navList,
		current,
		FBAinventoryList,
		inventoryList,
		shelf,
		invShelf,
		invtabs,
		id,
		dataList,
		images,
	}=toRefs(state)
	onLoad((event)=>{
		// TODO 后面把参数名替换成 payload
		const payload = event.id || event.payload;
		// 目前在某些平台参数会被主动 decode，暂时这样处理。
		try {
			var row = JSON.parse(decodeURIComponent(payload));
			var splitStr = row.split("-")
			state.id = splitStr[0]
			state.sku = splitStr.slice(1).join("-");
		} catch (error) {
			state.id = JSON.parse(payload);
		}
		
		loadDetails(state.id)
		loadInventory(state.id,state.sku)
	})
	 
  const scrollChange = 	util.debounce(function(e){
	  const currentScoll = e.detail.scrollTop
	  const maxScoll=280
	  if(currentScoll>maxScoll){
		  state.bgOpacity = 1
	  }else{
		  state.bgOpacity = (currentScoll/maxScoll).toFixed(2)
	  }
  },10)
	
	function changeNav(){
		state.scollTo = ""
	}
	function onClickItem(e){
		state.current = e.currentIndex
		
	}
	function loadInventory(id,sku){
	    inventoryApi.list({"id":id,"ftype":state.shelf}).then((res)=>{
			if(res && res.length>0){
				state.inventoryList=res;
			}
		});
		inventoryRptApi.list({"sku":sku}).then((res)=>{
			if(res&& res.length>0){
				state.FBAinventoryList=res;
			}
		});
		}
	function ivnChange(e){
		state.shelf = e
		loadInventory(state.id)
	}	
	function handleWuLiu(){
		popup.value.open('bottom')
	}
	function goBack(){
		uni.navigateBack({
			delta: 1
		});
	}
	function loadDetails(id){
		materialApi.getMaterialInfo({"id":id}).then(res=>{
			if(res){
				state.dataList.material =  res.material
				state.dataList.tagNameList =  res.tagNameList
				state.dataList.supplierList =  res.supplierList
				state.dataList.pkgDim =  res.pkgDim
				state.dataList = res
				state.images = res.material.image
				console.log(res)
			}
		})
	}
	
</script>

<style scoped>
	.scroll-Y{
		height: 100vh;
	}
	.popup-content{
		padding:16px;
	}
	.sup-wrap{
		background-color: #f5f5f5;
		border-radius: 4px;
		padding:8px;
	}
	.uni-title{
		font-size:28rpx;
		color:#333;
		font-weight: 700;
		margin-bottom:12px;
	}
	.text-light{
		color: #999;
	}
	.flex-gap{
		gap:16px;
		
	}
	    .status_bar {
	        height: 25px;
	        width: 100%;
	    }
		.PD-bg{
			  background-size: contain;  
			   background-repeat: no-repeat;  
			  background-position: center; 
			  height:480rpx;
			  width: 100%;
		}
		.my-tabbar{
			height:32px;
           position: fixed;
		   z-index: 3;
			padding-left:8px;
		}
		.round-icon{
			background-color: rgba(255,255,255,0.6);
			height:32px;
			display:flex;
			align-items: center;
			justify-content: center;
			width:32px;
			border-radius: 16px;
		}
	.affix-top{
		padding-top:58px;
		position: fixed;
		z-index:2;
		width: 100%;
		background-color:#fff;
		border-bottom:1px solid #eee;
	}
</style>
<style>
	.image-60 uni-image,.image-60 image{
		width:60px;
		height:60px;
		border-radius:4px;
	}
</style>
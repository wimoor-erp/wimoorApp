<template>
	<view class="uni-container">
		<uni-card isFull >
			<view class="uni-flex uni-row">
			          <view class="flex-item ">
									<image  class="mlogo" :src="material.image"></image>
					  </view>
			          <view class="flex-item  " style="flex: 1;">
									<view class="uni-flex uni-column">
									                <view class="flex-item flex-item-V productname">
														 <text  >{{material.name}}</text>
													</view>
									                <view class="flex-item flex-item-V">
														 <text class='light-font'>{{material.sku}}</text> 
													</view>
									               
										</view>
									</view>
								</view>
							 
					<view class="flex-item flex-item-V flex-between-row bordtop">
									<view v-if="material.brand">
									 <view class="text-center">{{material.brand}}</view>
									 <view class="light-font text-center">品牌</view>
									</view>
									 <view v-if="material.category">
									  <view class="text-center">{{material.category}}</view>
									  <view class="light-font text-center">分类</view>
									 </view>
									 <view >
									  <view class="text-center">
										  <block v-if="material.issfg=='0'">
											<text class="tag tag-green text-center">单独成品</text>
										  </block>
										  <block v-if="material.issfg=='1'">
											<text class="tag tag-orange text-center">组装成品</text>
										  </block>
										  <block v-if="material.issfg=='2'">
											<text class="tag tag-red text-center">待组装半成品</text>
										  </block>
									  </view>
									  <view class="light-font text-center">组装类型</view>
									 </view>
					</view>
							 
			   	<view class="flex-item flex-item-V flex-between-row bordtop">
			   		<view :class="tabs.baseinfo.activeclass" @click="changeType('baseinfo')">基础信息</view>			 
					<view :class="tabs.purchaseinfo.activeclass" @click="changeType('purchaseinfo')">采购信息</view>	
					<view :class="tabs.custominfo.activeclass"  @click="changeType('custominfo')">海关信息</view>	
			   	</view>			
		 </uni-card>
		 <block v-if="tabs.baseinfo.isactive">
			<view style="margin-top:10px;"></view>
			<uni-card isFull title="规格尺寸重量" >
				<uni-table border>
					<uni-tr>
						<uni-td>
						</uni-td>
						<uni-td>长(cm)
						</uni-td>
						<uni-td>宽(cm)
						</uni-td>
						<uni-td>高(cm)
						</uni-td>
						<uni-td>重(kg)
						</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td>
							净产品
						</uni-td>
						<uni-td>
						{{valueFormatter(itemDim.length)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(itemDim.width)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(itemDim.height)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(itemDim.weight)}}
						</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td>
							带包装
						</uni-td>
						<uni-td>
						{{valueFormatter(pkgDim.length)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(pkgDim.width)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(pkgDim.height)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(pkgDim.weight)}}
						</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td>
							箱规
						</uni-td>
						<uni-td>
						{{valueFormatter(boxDim.length)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(boxDim.width)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(boxDim.height)}}
						</uni-td>
						<uni-td>
						{{valueFormatter(boxDim.weight)}}
						</uni-td>
					</uni-tr>
				</uni-table>
			 </uni-card>
			 	<view style="margin-top:10px;"></view>
			<uni-card isFull title="其他信息" >
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">型号</view>			 
					 <view>{{material.specification}}</view>
				</view>		
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">单箱数量</view>			 
					 <view>{{material.boxnum}}</view>
				</view>
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">产品负责人</view>			 
					 <view>{{material.ownername}}</view>
				</view>	
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">生效日期</view>			 
					 <view>{{dateFuc(material.effectivedate)}}</view>
				</view>
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">退税率</view>			 
					 <view>{{material.vatrate}}</view>
				</view>	
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">修改人</view>			 
					 <view>{{material.operator}}</view>
				</view>	
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">修改日期</view>			 
					 <view>{{dateFuc(material.opttime)}}</view>
				</view>	
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">创建人</view>			 
					 <view>{{material.creator}}</view>
				</view>	
				<view class="flex-item flex-item-V flex-between-row ">
					 <view class="light-font">创建日期</view>			 
					 <view>{{dateFuc(material.createdate)}}</view>
				</view>	
			</uni-card>
				<view style="margin-top:10px;"></view>
			<uni-card isFull title="备注" >{{material.remark}}</uni-card>
			<view style="margin-top:10px;"></view>
			<uni-card isFull title="全部名称" >{{material.name}}</uni-card>
			<view style="margin-top:10px;"></view>
			<uni-card isFull title="耗材信息" >
					<uni-table border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th>图片</uni-th>
							<uni-th>产品名称</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in consumableList" :key="index">
								<uni-td>
									 <image class="img" :src="item.image"></image>
								</uni-td>		
								<uni-td> 
									<view>
										SKU:{{ item.sku }} 耗材单位量:{{ item.amount}}
									</view>
									<view style="font-size: 12px;">
										{{ item.name }}
									</view>
								</uni-td>
						</uni-tr>
					</uni-table>
					 </uni-card>
		 
		 
		<block v-if="material.issfg=='1'">
			    <view style="margin-top:10px;"></view>
				<uni-card isFull title="子SKU列表" >
				<view>
					<uni-table border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th>产品信息</uni-th>
							<uni-th>组装信息</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in assemblyList" :key="index">
								<uni-td>
									 <image class="img" :src="item.image"></image>
								</uni-td>	
								<uni-td>
									<view>SKU:{{ item.sku }}</view>
									<view>单位数量:{{ item.subnumber }}</view>
									<view>可用库存:{{ item.fulfillable }}</view>
									<view>采购单价:{{ item.subprice}}</view>
								</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			 </uni-card>
		</block>
		</block>
	<block v-if="tabs.purchaseinfo.isactive">
     <view style="margin-top:10px;"></view>
	 <uni-card isFull title="采购信息" >
	 
		<view><text class="light-font">供应商:</text>{{material.supplier}}</view>
		<view><text class="light-font">供货周期(天):</text>{{material.delivery_cycle}}</view>
		<view><text class="light-font">其他采购成本:</text>{{material.other_cost}}</view>
		<view><text class="light-font">不良率:</text>{{material.badrate}}</view>
		<view><text class="light-font">内部代码:</text>{{material.productCode}}</view>
		<view><text class="light-font">采购链接:</text>
			<view>{{material.purchaseUrl}}</view>
		</view>
		<view>
			<text class="light-font">采购阶梯价:</text>
			<view >
				<uni-table border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th>价格</uni-th>
						<uni-th>起批量</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in stepWisePrice" :key="index">
							<uni-td>
								{{ item.price }}
							</uni-td>
							<uni-td>
								{{ item.amount}}
							</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
		 </uni-card>
	</block>
	 
		 <block v-if="tabs.custominfo.isactive">
		 <view style="margin-top:10px;"></view>
		 <uni-card isFull title="海关信息" >
			<view><text class="light-font">产品英文名:</text>{{customs.nameEn}}</view>
			<view><text class="light-font">产品中文名:</text>{{customs.nameCn}}</view>
			<view><text class="light-font">申报单价:</text>{{customs.unitprice}}</view>
			<view><text class="light-font">产品材质:</text>{{customs.material}}</view>
			<view><text class="light-font">产品型号:</text>{{customs.model}}</view>
			<view><text class="light-font">海关编码:</text>{{customs.customsCode}}</view>
			<view><text class="light-font">产品用途:</text>{{customs.materialUse}}</view>
			<view><text class="light-font">产品品牌:</text>{{customs.brand}}</view>
			<view><text class="light-font">附加费用:</text>{{customs.addfee}}</view>
			<view><text class="light-font">是否带电/磁:</text>{{booleanFuc(customs.iselectricity)}}</view>
			<view><text class="light-font">是否危险品:</text>{{booleanFuc(customs.isdanger)}}</view>
		 </uni-card>
		</block>
	</view>
</template>

<script>
	import materialApi from '@/api/erp/material/material.js'
	export default {
			data() {
				return {
					mid:'',
					material:{},
					itemDim:{},
					pkgDim:{},
					boxDim:{},
					customs:{},
					tabs:{baseinfo:{isactive:true,activeclass:"active"},
						  purchaseinfo:{isactive:false,activeclass:""},
						  custominfo:{isactive:false,activeclass:""}
						 },
					stepWisePrice:[],
					consumableList:[],
					assemblyList:[],
					supplierList:[]
				}
			},
			onLoad(event) {
				// TODO 后面把参数名替换成 payload
				const payload = event.materialid || event.payload;
				// 目前在某些平台参数会被主动 decode，暂时这样处理。
				try {
					this.mid = decodeURIComponent(payload);
				} catch (error) {
					this.mid = '';
				}
				this.getlist();
			},
			methods:{
				booleanFuc(value){
					if(value ==true || value==1 || value=='1'){
						return '是'
					}else{
						return '否'
					}
				},
				changeType(type){
					this.tabs.baseinfo.isactive=false;
					this.tabs.baseinfo.activeclass="";
					this.tabs.purchaseinfo.isactive=false;
					this.tabs.purchaseinfo.activeclass="";
					this.tabs.custominfo.isactive=false;
					this.tabs.custominfo.activeclass="";
				    if(type=="baseinfo"){
						this.tabs.baseinfo.isactive=true;
						this.tabs.baseinfo.activeclass="active";
					}
					if(type=="purchaseinfo"){
						this.tabs.purchaseinfo.isactive=true;
						this.tabs.purchaseinfo.activeclass="active";
					}
					if(type=="custominfo"){
						this.tabs.custominfo.isactive=true;
						this.tabs.custominfo.activeclass="active";
					}
				},
				valueFormatter(value){
					if(value!=undefined && value!=null && value!=""){
						return value;
					}else{
						return '--';
					}
				},
				dateFuc(value){
					if(value!=null && value !=undefined && value!='' &&value>0){
						let date=new Date(value);
						return this.formatDate(date, 'yyyy-MM-dd');
					}else{
						return '--';
					}
				},
				padLeftZero (str) {
				    return ('00' + str).substr(str.length);
				},
				formatDate(date, fmt) {
				    if (/(y+)/.test(fmt)) {
				        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
				    }
				    let o = {
				        'M+': date.getMonth() + 1,
				        'd+': date.getDate(),
				        'h+': date.getHours(),
				        'm+': date.getMinutes(),
				        's+': date.getSeconds()
				    };
				    for (let k in o) {
				        if (new RegExp(`(${k})`).test(fmt)) {
				        let str = o[k] + '';
				        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
				        }
				    }
				    return fmt;
				},
				getlist(){
					let self=this;
					if(self.mid!=''){
						materialApi.getMaterialInfo({id:self.mid}).then(data => {
							if(data){
								var datas=data;
								if(datas.material && datas.material!=null){
									self.material=datas.material;
								}
								if(datas.itemDim && datas.itemDim!=null){
									self.itemDim=datas.itemDim;
								}
								if(datas.pkgDim && datas.pkgDim!=null){
									self.pkgDim=datas.pkgDim;
								}
								if(datas.boxDim && datas.boxDim!=null){
									self.boxDim=datas.boxDim;
								}
								if(datas.customs && datas.customs!=null){
									self.customs=datas.customs;
								}
								if(datas.stepWisePrice && datas.stepWisePrice!=null && datas.stepWisePrice.length>0){
									self.stepWisePrice=datas.stepWisePrice;
								}
								if(datas.consumableList && datas.consumableList!=null && datas.consumableList.length>0){
									self.consumableList=datas.consumableList;
								}
								if(datas.assemblyList && datas.assemblyList!=null && datas.assemblyList.length>0){
									self.assemblyList=datas.assemblyList;
								}
								if(datas.supplierList && datas.supplierList!=null && datas.supplierList.length>0){
									self.supplierList=datas.supplierList;
								}
							}
						});
					}
				}
			}
	}
	
</script>

<style>
	.img{
		width: 100rpx;
		height: 120rpx;
	}
	.mlogo{
		height:64px;
		width:64px;
		margin-right:10px;
	}
	.bordtop{
		border-top: solid #dedede 1px;
		padding-top:10px;
		margin-top:10px;
	}
	.productname{
		    overflow: hidden;
		    display: -webkit-box;
		    -webkit-box-orient: vertical;
		    -webkit-line-clamp: 2;
	}
	.flex-between-row{
		justify-content: space-between;
		flex-direction: row;
		display: flex;
	}
	.active{
		border-bottom:solid #f3a73f 2px;
	}
	.tag{
		padding:2px;
		color: #fff;
		font-size:10px;
		border-radius: 16px;
	}
	.tag-red{
		border:solid #ff557f 4px;
		background-color: #ff557f;
	}
	.tag-orange{
		border:solid #f3a73f 4px;
		background-color: #f3a73f;
	}
	.tag-green{
		border:solid #18bc37 4px; 
		background-color: #18bc37;
	}
	.text-center{
		    text-align: center;
	}
</style>

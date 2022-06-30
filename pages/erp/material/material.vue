<template>
	<view class="uni-container">
		<view>
			<image :src="material.image" ></image>
		</view>
		<view><text class="light-font">产品SKU:</text>{{material.sku}}
			<uni-icons  :color="material.color"  type="smallcircle-filled" style="padding-left: 12px;" size="14"></uni-icons>
		</view>
		<view><text class="light-font">产品名称:</text>{{material.name}}</view>
		<view><text class="light-font">品牌:</text>{{material.brand}}</view>
		<view><text class="light-font">规格:</text>{{material.specification}}</view>
		<view><text class="light-font">分类:</text>{{material.category}}</view>
		<view><text class="light-font">备注:</text>{{material.remark}}</view>
		<view><text class="light-font">产品负责人:</text>{{material.ownername}}</view>
		<view><text class="light-font">生效日期:</text>{{dateFuc(material.effectivedate)}}</view>
		<view><text class="light-font">净产品尺寸:</text>长:{{valueFormatter(itemDim.length)}}cm 宽:{{valueFormatter(itemDim.width)}}cm 高:{{valueFormatter(itemDim.height)}}cm 重:{{valueFormatter(itemDim.weight)}}kg</view>
		<view><text class="light-font">带包装尺寸:</text>长:{{valueFormatter(pkgDim.length)}}cm 宽:{{valueFormatter(pkgDim.width)}}cm 高:{{valueFormatter(pkgDim.height)}}cm 重:{{valueFormatter(pkgDim.weight)}}kg</view>
		<view><text class="light-font">单箱数量:</text>{{material.boxnum}}</view>
		<view><text class="light-font">箱规:</text>长:{{valueFormatter(pkgDim.length)}}cm 宽:{{valueFormatter(pkgDim.width)}}cm 高:{{valueFormatter(pkgDim.height)}}cm 重:{{valueFormatter(pkgDim.weight)}}kg</view>
		<view><text class="light-font">退税率:</text>{{material.vatrate}}</view>
		<view><text class="light-font">修改人:</text>{{material.operator}}</view>
		<view><text class="light-font">修改日期:</text>{{dateFuc(material.opttime)}}</view>
		<view><text class="light-font">创建人:</text>{{material.creator}}</view>
		<view><text class="light-font">创建日期:</text>{{dateFuc(material.createdate)}}</view>
		<view><text>组装类别:</text>
			<block v-if="material.issfg=='0'">
				<text class="text-green">单独成品</text>
			</block>
			<block v-if="material.issfg=='1'">
				<text class="text-orange">组装成品</text>
			</block>
			<block v-if="material.issfg=='2'">
				<text class="text-red">待组装半成品</text>
			</block>
		</view>
		<block v-if="material.issfg=='1'">
			<view>
				<text class="light-font">子SKU列表:</text>
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
			</view>
		</block>
		
		<view style="font-size: 18px;border-top:1px solid #dedede;margin-top: 10px;">采购信息</view>
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
		
		<view style="font-size: 18px;border-top:1px solid #dedede;margin-top: 10px;">耗材信息</view>
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
		<view style="font-size: 18px;border-top:1px solid #dedede;margin-top: 10px;">海关信息</view>
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
									console.log(datas.material);
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
</style>

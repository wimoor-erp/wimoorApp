<template>
		<uni-card :title="data.sku"  :sub-title="suppliernameFuc(data.suppliername)" :extra="statusFuc(data.auditstatus)" :thumbnail="data.image">
					<view class="uni-body"  >
								<view class="uni-media-list-text-bottom">
									<text><text class="light-font">数量:</text>
									<text style="color: #000000;">{{data.amount}}</text>
									</text> 
									<text class="light-font" style="float:right">{{data.warehousename}}</text>
								</view>
							 
								<view>
								<text class="light-font">预计到货日期:</text>{{deliverydateFuc(data.deliverydate)}}
								</view>
								<view>
								<text  class="light-font">付款状态:</text>{{paystatusFuc(data.paystatus)}}
								</view>
								<view  >
									<text  class="light-font">采购订单号:</text>{{data.number}} 
								</view>
								<view class="uni-media-list-text-bottom">
									<text >{{ data.creatorname }}</text>
									<text style="float:right">{{ data.createdate }}</text>
								</view>
							</view>
				 
		</uni-card>
	<uni-card >
		   <WarehousePick  @changeData="warehouseChange" :warehouseid="data.warehouseid"></WarehousePick>
		 <view class="uni-flex uni-row"  >
		                 <view class="flex-item" style="padding-right:20px;">{{amountFunc(entry.amount,entry.totalin,entry.inwhstatus)}}</view>
		                 <view class="flex-item" style="padding-right:20px;">已收货:{{numberFuc(entry.totalin)}}</view>
		                 <view class="flex-item">退货数:{{numberFuc(entry.totalre)}}</view>
		  </view>
		 <block v-if="entry.inwhstatus!=1">
			  <view  >
				收货数量:
				<uni-easyinput type="number" :disabled="ipt" v-model="iptamount" :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入操作的数量" @input="input"></uni-easyinput>
			  </view>
				<view style="margin-top: 10px;"> <button  :disabled="ipt" class="btn btn-orange"  @click="bindsubmitTap" >收 货</button> </view>
		 </block>
	</uni-card>
 	<uni-card  >
		<template v-slot:title>
			<view class="intitle">
				<text>入库记录</text>
					<uni-popup ref="alertDialog" type="dialog">
									<uni-popup-dialog type="warn" cancelText="关闭" 
									confirmText="同意" 
									title="通知"  
									content="您确定要撤销所有入库吗？" @confirm="clearRec"
									@close="dialogClose"></uni-popup-dialog>
					 </uni-popup>		
				<button  style="float:right" size="mini" class="btn btn-red" @click="dialogToggle" >撤销入库</button>  
			    <button  style="float:right;margin-right:10px" v-if="entry.inwhstatus==1"  size="mini" class="btn btn-green" @click="continueRec" >继续入库</button>  
			</view>
		</template>
		 <block v-if="reclist!=null && reclist.length>0 && reclist!=undefined" >
		       <block v-for="(value, index) in reclist" :key="index">
		       <view class="rec-list"  style="border-bottom:1px solid #efefef;padding-bottom:10px;">
				<view>
		         <text    >{{value.operator}}</text>
		         <text   style="padding-left:20px;"  v-if="value.ftype=='in'" >入库 </text>
		         <text  style="padding-left:20px;"  v-if="value.ftype=='out'" >退货</text>
		         <text  style="padding-left:20px;"  v-if="value.ftype=='clear'" >撤销入库</text>
				 <button 
				         v-if="value.ftype=='in'"
				         style="margin-right:20px;float:right" 
				         class="mini-btn" type="default" size="mini"
				 	    @click="goHuoJia(value,data)" >上架</button>
				 </view>
		         <view  >操作数量：
		           <text v-if="value.ftype=='in'"  style="font-size:20px;" >+{{value.amount}}</text>
		           <text v-if="value.ftype=='out'"  style="font-size:20px;" >-{{value.amount}}</text>
		           <text v-if="value.ftype=='clear'"  style="font-size:20px;" >-{{value.amount}}</text>
		         </view>
				  <view>入库仓库：{{value.warehousename}}</view>
		         <view>操作时间：{{dateFuc(value.opttime)}}</view>
		         <view>备注：{{value.remark}}</view>
				   
					  <view class="shelf" v-if="value.shelfInvRecordList&&value.shelfInvRecordList.length>0">
					  		<uni-table border emptyText="暂无操作记录">
					  			<!-- 表头行 -->
					  			<uni-tr>
					  				<uni-th align="left" width="150">操作信息 (已上架:{{value.sumin}})</uni-th>
					  				<uni-th align="left" width="100">操作数量</uni-th>
					  		 
					  			</uni-tr>
					  			<!-- 表格数据行 -->
					  			<uni-tr  v-for="(recItem,index) in value.shelfInvRecordList" :key="index">
					  				<uni-td>
					  				<view style="padding:0px;margin-top:-8px">货架：{{recItem.shelfname}}</view>
					  				<view class="light-font" style="padding:0px;margin-top:-8px"> {{recItem.opttime}}</view>
					  				</uni-td>
					  				<uni-td>
					  				<text class="light-font" v-if="recItem.opt==0">
					  					下架:
					  				</text>
					  				<text class="light-font" v-else-if="recItem.opt==1">
					  					上架:
					  				</text>
					  				<text class="light-font" v-else>
					  					下架:
					  				</text>
					  				{{recItem.quantity}}</uni-td>
					  			</uni-tr>
					  		</uni-table>
					 
				  </view>
		       </view>
		     </block>
		   </block>
		   <block v-else>
		     <view style="border-bottom:1px solid #efefef;">
		      <text>暂无记录！</text>
		     </view>
		   </block>
	</uni-card>
	 <uni-card title="物流记录">
		<block  v-if="data.alibaba_orderid!='undefined' && data.alibaba_orderid!='' && data.alibaba_orderid!=null && data.alibaba_orderid!=undefined" >
		    <block  v-if="LogResult!=null && LogResult!='' && LogResult!='undefined' && LogResult!='undefined' && LogResult.length>0">
		        <block v-for="(value, index) in LogResult" :key="index">
		          <view>物流编号：{{value.logisticsId}}</view>
		          <view>物流公司：{{value.logisticsCompanyName}}</view>
		          <view>运单号码：{{value.logisticsBillNo}}</view>
		          <view>发货时间：{{dateFuc(deliveredTime)}}</view>
		          <view style="background:#f8f8f8;padding:10px;">
		             <text class="row">物流跟踪</text>
		             <block   v-if="traceResult!=null && traceResult.length>0">
		                 <block v-for="(trace, index) in traceResult" :key="index">
		                    <block v-if="value.logisticsId==trace.logisticsId && trace.logisticsSteps!=null && trace.logisticsSteps.length>0">
		                        <block v-for="(logs, index) in trace.logisticsSteps" :key="index">
		                           <view>{{dateFuc(logs["acceptTime"]?logs.acceptTime:"")}}</view>
		                            <view>{{logs.remark}}</view>
		                        </block>
		                    </block>
							<block v-else>--</block>
		                 </block>
		             </block>
		             <block v-else>
		                 <text class="row">对不起,目前暂未查询到该笔运单的物流跟踪信息!建议直接联系物流公司了解详情.</text>
		             </block>
		          </view>
		          <view class="row text-orange" style="margin-top:10px;margin-bottom:10px;">
		            以上信息由物流公司提供,如无跟踪信息或有疑问,请咨询{{value.logisticsCompanyName}}
		          </view>
		          <view class="row">
		            物流单包含如下货品:
		            <block v-if="value.sendGoods!=null && value.sendGoods.length>0">
		               <block v-for="(good, index) in value.sendGoods" :key="index">
		                    <block v-for="(product, index) in orderData.productItems" :key="index">
		                       <block v-if="product.name==good.goodName">
		                         <view   style="border-bottom:1px solid #efefef;padding-bottom:10px;">
		                          <image style="width:100px;height:100px;" :src="product.productImgUrl[0]"></image>
		                          <view>{{good.goodName}}</view>
		                          <view>数量：{{good.quantity}}{{good.unit}}</view>
		                        </view>
		                       </block>
							   <block v-else>--</block>
		                    </block>


		               </block>
		            </block>
		            <block v-else>
		            <view>暂无记录！</view>
		            </block>
		          </view>
		        </block>

		    </block>
			<block v-else></block>


		  </block>
		  <block v-else>
		    <text class="row" style="font-size:16px;padding-bottom:5px;" >物流记录</text>
		     <text>暂无记录</text>
		  </block>
</uni-card>

 

</template>

<script>
	import purchaseApi from '@/api/erp/purchase/purchase.js'
	import WarehousePick from "./components/warehousepick.vue";
 
	export default {
		components:{
			WarehousePick,
		},
		data() {
			return {
				title: '',
				data: {},
				htmlNodes: [],
				entry:{},
				needamount:0,
				placeholderStyle: "color:#ffa400;font-size:14px",
				styles: {
						color: '#ffa400',
						borderColor: '#ffa400'
				},
				reclist:[],
				orderData:[],
				LogResult:[],
				traceResult:[],
				deliveredTime:0,
				iptamount:0,
				ipt:false,
				warehouseid:"",
			}
		},
		onLoad(event) {
			// TODO 后面把参数名替换成 payload
			const payload = event.detailData || event.payload;
			// 目前在某些平台参数会被主动 decode，暂时这样处理。
			try {
				this.data = JSON.parse(decodeURIComponent(payload));
			} catch (error) {
				this.data = JSON.parse(payload);
			}
		    if(this.data){
				this.warehouseid=this.data.warehouseid;
			}
			this.loadRecDetail();
		},
		onShow(){this.loadRecDetail(); },
		methods:{
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
			suppliernameFuc(value){
				if(value==undefined || value==null || value==''){
					return '--';
				}else{
					return value;
				}
			},
			paystatusFuc(value){
				if(value=='1' || value==1){
					return '已付款';
				}else{
					return '未付款';
				}
			},
			deliverydateFuc(value){
				if(value!=null && value !=undefined && value!=''){
					return value.split(" ")[0];
				}else{
					return '--';
				}
			},
			statusFuc(value){
				if(value==0 || value=='0'){
					return '已退回';
				}else if(value==1 || value=='1'){
					return '待审核';
				}else if(value==2 || value=='2'){
					return '执行中';
				}else if(value==3 || value=='3'){
					return '已完成';
				}
			},
			dialogToggle() {
							this.$refs.alertDialog.open()
						},
			padLeftZero (str) {
			    return ('00' + str).substr(str.length);
			},
			warehouseChange(warehouseid){
				this.warehouseid=warehouseid;
			}, 
			loadRecDetail(){
				if(this.data.id){
					purchaseApi.getRecdetail({
										 id:this.data.id,
										 ftype:'rec'
										 }).then(data => {
									if(data && data.entry){
										this.entry=data.entry;
										this.needamount=data.entry.amount-data.entry.totalin;
										this.reclist=data.receivelist;
										if(this.reclist){
											this.reclist.forEach(item=>{
												item.sumin=0;
												if(item.shelfInvRecordList){
													item.shelfInvRecordList.forEach(reitem=>{
														if(reitem.opt==1){
															 item.sumin=item.sumin+reitem.quantity;
														}else{
															 item.sumin=item.sumin-reitem.quantity;
														}
													});
												}
											});
										}
										this.iptamount=this.needamount;
										if(this.data.alibaba_orderid!=null && this.data.alibaba_orderid!=undefined && this.data.alibaba_orderid!='' && this.data.alibaba_orderid!='undefined'){
											this.loadEntryLogist();
										}
									}
								})
				}
			},
			numberFuc(value){
				if(value==undefined || value==null || value==''){
					return '--';
				}else{
					return value;
				}
			},
			amountFunc(value1,value2,status){
				if(value1-value2<=0  || status==1){
					return '待收货:0';
				}else{
					return '待收货:'+this.needamount;
				}
			},
			input(e){
				this.iptamount=parseInt(e);
			},
			loadEntryLogist(){
				purchaseApi.catchLogisticsInfo({
					        purchaseEntryid:this.data.id
					      }).then(data => {
					let orderData=data.orderResult;
					let LogResult=data.LogisticsResult;
					let traceResult=data.TraceResult;
					let deliveredTime=0;
					  if(orderData!=null && orderData!='' && orderData!='undefined' && orderData!='undefined'){
					            if(orderData.result.nativeLogistics.logisticsItems!=null && orderData.result.nativeLogistics.logisticsItems.length>0){
					              deliveredTime =  orderData.result.nativeLogistics.logisticsItems[0].deliveredTime;
					            }
					             this.orderData=orderData.result;
								 this.LogResult=LogResult.result;
								 this.traceResult=traceResult.logisticsTrace;
					             this.deliveredTime=deliveredTime;

					}
				})
			},dateFuc(value){
				if(value!=null && value !=undefined && value!='' &&value>0){
					let date=new Date(value);
					return this.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
				}else{
					return '--';
				}
			},bindsubmitTap(){
				if(this.iptamount>0){
					var status="0";
					purchaseApi.rec({status:status,
									entryid:this.data.id,
									amount:this.iptamount,
									warehouseid:this.warehouseid,
									ftype:"in",
									recid:"",
									status:"0"
					}).then(data => {
							this.ipt=true;
							uni.showToast({
								title:'操作成功！',
								icon:'none',
								duration:2000
							})
						   this.loadRecDetail();
					})
				}else{
					uni.showToast({
						title:'请输入正确的数量！',
						icon:'none',
						duration:2000
					});
				}
				
			},
			clearRec(){
					var entryid=this.data.id;
					purchaseApi.clearRecAll({'entryid':entryid}).then(data => {
							uni.showToast({
								title:'操作成功！',
								icon:'none',
								duration:2000
							})
							this.ipt=false;
						    this.loadRecDetail();
					})
			},
			continueRec(){
				var status="2";
					purchaseApi.rec({status:status,
									entryid:this.data.id,
									amount:this.iptamount,
									warehouseid:this.warehouseid,
									ftype:"in",
									recid:""
					}).then(data => {
							this.ipt=true;
							uni.showToast({
								title:'操作成功！',
								icon:'none',
								duration:2000
							})
						   this.ipt=false;
						   this.loadRecDetail();
					})
			},
			goHuoJia(value,data){
				value.materialid=data.materialid;
				value.opttype="purchase";
				uni.navigateTo({
					"url": '/pages/erp/warehouse/shelf/index?detailData=' +
						encodeURIComponent(JSON.stringify(value))
				});
			},
		}
	}


</script>

<style>
	.pad10{
		padding: 15px;
	}
	 .intitle{
		 padding:15px;
		 border-bottom: solid 1px #dedede;
	 }
	 .uni-tag {
	 		line-height: 14px;
	 		font-size: 10px;
	 		font-weight: 200;
	 		padding: 1px 3px;
	 		color: #fff;
	 		border-radius: 2px;
	 		background-color: #2979ff;
	 		border-width: 1rpx;
	 		border-style: solid;
	 		border-color: #2979ff;
	 		/* #ifdef H5 */
	 		cursor: pointer;
	 		/* #endif */
			border-radius: 4px;
			float:right;
			color: #fff;
	 	}
 .rec-list .uni-table-td,
 .rec-list .uni-table-th {
 	font-size: 22rpx !important;
 	padding: 2px 4px;
 }
 
</style>

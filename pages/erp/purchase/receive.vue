<template>
	    <view class=" uni-flex">
			<image v-if="data.image" class="full-image uni-flex-item" :src="data.image"></image>
			<image v-else src="/static/empty/noimage40.png" class="full-image uni-flex-item"> </image>
		</view>
		<view class="sku-message-box">
			<view class="uni-flex uni-between uni-row-center">
			  <view>
				<view class="uni-h4 text-orange">
					{{data.amount}}
				</view>
				<view class=" light-font">数量</view>
				</view>	
				<view>
				<text class="tag-orange-bg ">{{statusFuc(data.auditstatus)}}</text></view>
			</view>
			<view class="uni-h4 cell-t-8">
				<text>{{data.sku}}</text>
			</view>
			<view class="uni-flex">
				<text class="uni-h6">{{data.mname}}</text>
				<view>
				<uni-tag @click="copy(data)" class="cell-l-8" :inverted="true" :circle="true"   text="复制" type="warning" />
				</view>
			</view>
		</view>
	  <uni-card class="n-shadow "  margin="8px 16px">
		 <uni-row >
			 <uni-col :span="8" >
				 <view class="uni-center">
					 <text class="uni-h6"> 待收货 </text>
					 <view class="font-bold text-black cell-t-8">{{amountFunc(entry.amount,entry.totalin,entry.inwhstatus)}}</view>
				 </view>
			 </uni-col>
			 <uni-col :span="8" >
				 <view class="uni-center">
				 <text class="uni-h6">已收货</text>
				 <view class="font-bold text-black cell-t-8">{{numberFuc(entry.totalin)}}</view>
				 </view>
			 </uni-col>
			 <uni-col :span="8" class="uni-center">
				 <view class="uni-center">
				 <text class="uni-h6">退货数</text>
				 <view class="font-bold text-black cell-t-8">{{numberFuc(entry.totalre)}}</view>
				 </view>
			 </uni-col>
		 </uni-row>
	  </uni-card>
	  <uni-card class="n-shadow  " margin="8px 16px">
		  <view class="line-forms-title">提交收货信息</view>
		  <view class="line-forms" >
			  		<view class="line-forms-item uni-bottom-border" >
			  			<text class="line-forms-label">入库仓库</text>
			  			<WarehousePick class="uni-flex-item"  @changeData="warehouseChange" :warehousename="data.warehousename" :warehouseid="data.warehouseid"></WarehousePick>
			  		</view>
			  		<view class="line-forms-item uni-bottom-border" >
			  			<text class="line-forms-label">收货数量</text>
			  			<input class="uni-input" type="number"  @input="input" :disabled="ipt" v-model="iptamount" confirm-type="search" placeholder="请输入" />
			  		</view>
		  </view>
	  </uni-card>
	  <view class="uni-affix " v-if="entry.inwhstatus!=1">
		  <view class="uni-flex uni-between uni-row-center uni-nav-footer">
		  <view>
			  <view class="uni-h4">{{iptamount}}</view>
			  <text class="uni-h6">数量</text>
		  </view>
		  <view>
		  <button style="width: 160px;" type="primary" :disabled="ipt"  @click="bindsubmitTap">确认收货</button>
		  </view>
		  </view>
	  </view>
	  <uni-card class="n-shadow  " margin="8px 16px">
		  <view class="uni-ui-list">
			  <view class="uni-ui-list-item">
				  <text class="uni-ui-list-label">采购订单号</text>
				  <text class="uni-ui-list-value">{{data.number}}</text>
			  </view>
			  <view class="uni-ui-list-item">
			  				  <text class="uni-ui-list-label">供应商</text>
			  				  <text class="uni-ui-list-value">{{suppliernameFuc(data.suppliername)}}</text>
			  </view>
			  <view class="uni-ui-list-item">
			  				  <text class="uni-ui-list-label">付款状态</text>
			  				  <text class="uni-ui-list-value">{{paystatusFuc(data.paystatus)}}</text>
			  </view>
			  <view class="uni-ui-list-item">
			  				  <text class="uni-ui-list-label">创建人</text>
			  				  <text class="uni-ui-list-value">{{data.creatorname}}</text>
			  </view>
		  </view>
		  <view class="uni-flex uni-between border-top">
			  <view >
				  <text>
					  <text class="icon-shijian iconfont"></text>
					  创建日期</text>
				  <view  class="cell-t-8">{{deliverydateFuc(data.createdate)}}</view>
			  </view>
			  <view class="dash-line"></view>
			  <view >
				  <text><text class="icon-shijian iconfont"></text> 预计到货日期</text>
				  <view class="cell-t-8">{{deliverydateFuc(data.deliverydate)}}</view>
			  </view>
		  </view>
	  </uni-card>  
	  <uni-card class="n-shadow " v-if="reclist!=null && reclist.length>0 && reclist!=undefined"  margin="8px 16px">
	  <view class="uni-flex uni-between">
		  <view class="uni-title-other">入库记录</view>
		  <view>
			  <uni-tag text="继续入库" class="cell-r-8" :inverted="true"  :circle="true" v-if="entry.inwhstatus==1"  @click="continueRec" />
			  <uni-tag text="撤销入库"  :inverted="true"  :circle="true"    @click="dialogToggle" />
		  </view>
		  </view>
		  <view class="history " v-for="(value, index) in reclist" :key="index">
			  <view class="uni-flex uni-between">
				  <view>
			  <text class="uni-h5 font-bold">{{value.operator}}
			  </text>
			   <view class="uni-h6 cell-t-8">{{value.opttime}}</view></view>
			  <text>
				  <text   v-if="value.ftype=='in'" >入库 </text>
				  <text   v-if="value.ftype=='out'" >退货</text>
				  <text    v-if="value.ftype=='clear'" >撤销入库</text>
				  <text v-if="value.ftype=='in'"   >+{{value.amount}}</text>
				  <text v-if="value.ftype=='out'"  >-{{value.amount}}</text>
				  <text v-if="value.ftype=='clear'"  >-{{value.amount}}</text>
			  </text>
			  </view>
			  <view class="cell-t-8">
				  <view class="uni-flex uni-between">
					  <text>入库仓库
					  </text>
					  <text>{{value.warehousename}}</text>
				  </view>
				  <view class="uni-flex uni-between cell-t-8">
					  <text>备注</text>
					  <text v-if="value.remark">{{value.remark}}</text>
					  <text v-else>--</text>
				  </view>
			  </view>
			  <view class="uni-right cell-t-8">
			  <button
			          v-if="value.ftype=='in'"
			            size="mini"
						type="primary"
			  	      @click="goHuoJia(value,data)" >上架</button></view>
		  </view>
		  <template v-slot:title>
		  			<uni-popup ref="alertDialog" type="dialog">
		  							<uni-popup-dialog type="warn" cancelText="关闭" 
		  							confirmText="确认" 
		  							title="通知"  
		  							content="您确定要撤销所有入库吗？" @confirm="clearRec"
		  							@close="dialogClose"></uni-popup-dialog>
		  			 </uni-popup>		
		  </template>
		   <block v-if="reclist!=null && reclist.length>0 && reclist!=undefined" >
		         <block v-for="(value, index) in reclist" :key="index">
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
		       </block>
		     </block>
		     <block v-else>
		       <view style="border-bottom:1px solid #efefef;">
		        <text>暂无记录！</text>
		       </view>
		     </block>
	  </uni-card>
	 <uni-card title="物流记录" class="n-shadow  " margin="8px 16px">
		<block  v-if="data.alibaba_orderid!='undefined' && data.alibaba_orderid!='' && data.alibaba_orderid!=null && data.alibaba_orderid!=undefined" >
		    <block  v-if="LogResult!=null && LogResult!='' && LogResult!='undefined' && LogResult!='undefined' && LogResult.length>0">
		        <block v-for="(value, index) in LogResult" :key="index">
					<view class="uni-ui-list">
								  <view class="uni-ui-list-item">
									  <text class="uni-ui-list-label">物流编号</text>
									  <text class="uni-ui-list-value">{{value.logisticsId}}</text>
								  </view>
								  <view class="uni-ui-list-item">
								  				  <text class="uni-ui-list-label">物流公司</text>
								  				  <text class="uni-ui-list-value">{{value.logisticsCompanyName}}</text>
								  </view>
								  <view class="uni-ui-list-item">
								  				  <text class="uni-ui-list-label">运单号码</text>
								  				  <text class="uni-ui-list-value">{{value.logisticsBillNo}}</text>
								  </view>
								  <view class="uni-ui-list-item">
								  				  <text class="uni-ui-list-label">发货时间</text>
								  				  <text class="uni-ui-list-value">{{deliveredTime}}</text>
								  </view>
					</view>
		          <view style="background:#f5f5f5;padding:8px;" class="cell-t-8">
		             <text class="row">物流跟踪</text>
		             <block   v-if="traceResult!=null && traceResult.length>0">
					 <uni-steps :options="traceResult" active-color="#ff7315" :active="traceResult.length-1" direction="column" />
		              </block>
		             <block v-else>
		                 <text class="row">对不起,目前暂未查询到该笔运单的物流跟踪信息!建议直接联系物流公司了解详情.</text>
		             </block>
		          </view>
		          <view class="uni-h6 cell-t-8" >
		            以上信息由物流公司提供,如无跟踪信息或有疑问,请咨询{{value.logisticsCompanyName}}
		          </view>
		          <view class="cell-t-8">
		            物流单包含如下货品:
		            <block  v-if="value.sendGoods!=null && value.sendGoods.length>0">
		               <block v-for="(good, index) in value.sendGoods" :key="index">
		                    <block v-for="(product, index) in orderData.productItems" :key="index">
		                       <block v-if="product.name==good.goodName">
		                         <view class="uni-flex uni-row cell-t-8">
									 <view class="cell-r-8">
		                          <image class="image60" :src="product.productImgUrl[0]"></image></view>
								  <view>
		                          <view class="text-black">{{good.goodName}}</view>
		                          <view>数量：{{good.quantity}}{{good.unit}}</view>
								  </view>
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
			<block v-else><text class="uni-h6">暂无记录</text></block>


		  </block>
		  <block v-else>
		    <text class="row"  >物流记录</text>
		     <text>暂无记录</text>
		  </block>
</uni-card>
<view style="height:54px;width: 100%;"></view>
 

</template>

<script>
	import purchaseApi from '@/api/erp/purchase/purchase.js'
	import WarehousePick from "./components/warehousepick.vue";
    import util from '@/utils/util';
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
			copy(data){
				var copyvalue=data.sku;
				copyvalue=copyvalue+"\n"+ data.number;
				copyvalue=copyvalue+"\n"+ data.amount+"套";
				uni.setClipboardData({
				  data:copyvalue,
				  success: function() {
				    console.log('复制成功');
				  }
				})
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
										if(this.entry.auditstatus===3||this.entry.auditstatus===0){
											this.ipt = true
										}
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
					return '0';
				}else{
					return value;
				}
			},
			amountFunc(value1,value2,status){
				if(value1-value2<=0  || status==1){
					return '0';
				}else{
					return this.needamount;
				}
			},
			input(e){
				if(e.detail.value){
					this.iptamount=parseInt(e.detail.value);
				} else{
					this.iptamount=0;
				}
			},
			loadEntryLogist(){
				purchaseApi.catchLogisticsInfo({
					        purchaseEntryid:this.data.id
					      }).then(data => {
					let orderData=data.orderResult;
					let LogResult=data.LogisticsResult;
					const traceResult=data.TraceResult;
					let deliveredTime=0;
					  if(orderData!=null && orderData!='' && orderData!='undefined' && orderData!='undefined'){
					            if(orderData.result.nativeLogistics.logisticsItems!=null && orderData.result.nativeLogistics.logisticsItems.length>0){
					              deliveredTime =  orderData.result.nativeLogistics.logisticsItems[0].deliveredTime;
					            }
					             this.orderData=orderData.result;
								 this.LogResult=LogResult.result;
									 var arr=[];
									 if(traceResult.logisticsTrace[0].logisticsSteps.length>0){
									 traceResult.logisticsTrace[0].logisticsSteps.forEach((item)=>{
										  var obj={};
										 obj.desc=item.acceptTime
										 obj.title=item.remark
										 arr.push(obj)
									 })
									 }
									 console.log(arr,"arr")
								 this.traceResult=arr;
								 console.log("a",traceResult.logisticsTrace)
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
			},
			
		bindsubmitTap:util.throttle(function(){
				if(this.iptamount>0){
					var status="0";
					purchaseApi.rec({
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
			},3000),
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
				value.warehouseid=this.warehouseid;
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
	.full-image{
		height:300px;
		margin:8px 16px;
		border-radius: 8px;
	}
	.sku-message-box{
		padding:0px 16px;
	}
	.uni-bottom-border{
		border-bottom:1px solid #eee; 
	}
	.border-top{
		margin-top:16px;
		font-size: 12px;
		padding-top:16px;
		color:#54bd34;
		border-top: solid 1px #dedede;
	}
	.dash-line{
		margin: 8px 16px;
		border-top: 1px dashed #38ab2f;
		flex: 1;
	}
	.uni-title-other{
		font-size: 12px;
		color:#333;
		font-weight: 700;
		margin-bottom: 8px;
	}
	.history{
		border-top:1px solid #eee;
	  padding-top:8px;
	  margin-top:8px;
	}
	.image60{
		width: 60px;
		height:60px;
	}
</style>

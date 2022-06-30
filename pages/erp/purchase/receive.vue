<template>
	<view class="pad10">

		<view>货款退收({{data.sku}})</view>
		<view class="text-green">入库仓库:{{data.warehousename}} </view>
		<view>{{amountFunc(entry.amount,entry.totalin,entry.inwhstatus)}}</view>
	    <view  >
	      <text>已收货物数:{{numberFuc(entry.totalin)}}　退货数:{{numberFuc(entry.totalre)}}</text>
	    </view>
		<block v-if="entry.inwhstatus!=1">
			  <view  >
				收货数量:
				<uni-easyinput type="number" :disabled="ipt" v-model="iptamount" :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入操作的数量" @input="input"></uni-easyinput>
			  </view>
			    <view style="margin-top: 10px;"> <button  :disabled="ipt" class="btn btn-orange"  @click="bindsubmitTap" >收货并完成</button> </view>


		</block>
		<block v-else></block>
		 <view  style="font-size:16px;padding-bottom:5px;margin-top: 15px;" >入库记录</view>
		 <block v-if="reclist!=null && reclist.length>0 && reclist!=undefined" >
		       <block v-for="(value, index) in reclist" :key="index">
		       <view   style="border-bottom:1px solid #efefef;padding-bottom:10px;">
		         <text>{{value.operator}}</text>
		         <text v-if="value.ftype=='in'" >入库</text>
		         <text v-if="value.ftype=='out'" >退货</text>
		         <text v-if="value.ftype=='clear'" >撤销入库</text>
		         <text>[{{value.warehousename}}]</text>
		         <view  >操作数量：
		           <text v-if="value.ftype=='in'"  style="font-size:20px;" >+{{value.amount}}</text>
		           <text v-if="value.ftype=='out'"  style="font-size:20px;" >-{{value.amount}}</text>
		           <text v-if="value.ftype=='clear'"  style="font-size:20px;" >-{{value.amount}}</text>
		         </view>
		         <view>操作时间：{{dateFuc(value.opttime)}}</view>
		         <view>备注：{{value.remark}}</view>

		       </view>
		     </block>
		   </block>
		   <block v-else>
		     <view style="border-bottom:1px solid #efefef;">
		      <text>暂无记录！</text>
		     </view>
		   </block>

		<block  v-if="data.alibaba_orderid!='undefined' && data.alibaba_orderid!='' && data.alibaba_orderid!=null && data.alibaba_orderid!=undefined" >
		   <text class="row" style="font-size:16px;padding-bottom:5px;" >物流记录</text>
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


	  </view>

</template>

<script>
	import purchaseApi from '@/api/erp/purchase/purchase.js'
	export default {
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
			}
		},
		onLoad(event) {
			// TODO 后面把参数名替换成 payload
			const payload = event.detailDate || event.payload;
			// 目前在某些平台参数会被主动 decode，暂时这样处理。
			try {
				this.data = JSON.parse(decodeURIComponent(payload));
			} catch (error) {
				this.data = JSON.parse(payload);
			}
			this.loadRecDetail();
		},
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
			padLeftZero (str) {
			    return ('00' + str).substr(str.length);
			},
			loadRecDetail(){
				if(this.data.entryid){
					purchaseApi.getRecdetail({
										 id:this.data.entryid,
										 ftype:'rec'
										 }).then(data => {
									if(data && data.entry){
										this.entry=data.entry;
										this.needamount=data.entry.amount-data.entry.totalin;
										this.reclist=data.receivelist;
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
					return '待收货物数:0';
				}else{
					return '待收货物数:'+this.needamount;
				}
			},
			input(e){
				this.iptamount=parseInt(e);
			},
			loadEntryLogist(){
				purchaseApi.catchLogisticsInfo({
					        alibabaAuthid:this.data.alibaba_auth,
					        alibabaOrderid:this.data.alibaba_orderid,
					        purchaseEntryid:this.data.entryid
					      }).then(data => {
					let orderData=JSON.parse(data.orderResult);
					let LogResult=JSON.parse(data.LogisticsResult);
					let traceResult=JSON.parse(data.TraceResult);
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
					purchaseApi.rec({status:'0',
									entryid:this.data.entryid,
									amount:this.iptamount,
									warehouse:this.data.warehouseid,
									ftype:"in",
									recid:""
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
				
			}
		}
	}


</script>

<style>
	.pad10{
		padding: 15px;
	}
</style>

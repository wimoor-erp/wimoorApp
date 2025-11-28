import request from "@/utils/request";
const getQuotainfo=(shipmentid)=>{
	return request({url:'/erp/api/v1/shipForm/quotainfo/'+shipmentid,method:"GET"});
}
function getQuotainfoV2(id){
	return request.get('/amazon/api/v2/shipInboundPlan/quota/info/'+id);
}
function subShelfInventory(data){
	return request({url:"/erp/api/v1/warehoue/shelfInventory/sub",method:"POST","data":data})
}
function getShipFromList(data){ 
	return request({url:'/erp/api/v1/shipForm/list',method:"POST","data":data})
}
export default {
	getQuotainfo,
	getQuotainfoV2,
	subShelfInventory,
	getShipFromList,
	};
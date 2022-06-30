import request from '@/common/request.js'
const getQuotainfo=(shipmentid)=>{
	return request({url:'/erp/api/v1/shipForm/quotainfo/'+shipmentid,method:"GET"});
}
function subShelfInventory(data){
	return request({url:"/erp/api/v1/warehoue/shelfInventory/sub",method:"POST","data":data})
}
function getShipFromList(data){ 
	return request({url:'/erp/api/v1/shipForm/list',method:"POST","data":data})
}
export default {
	getQuotainfo,
	subShelfInventory,
	getShipFromList,
	};
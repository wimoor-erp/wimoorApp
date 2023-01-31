import request from "@/utils/request";
function getOrderList(data){
	 return request.post('/amazon/api/v0/orders/manager/list',data);
}
function getOrderInvoinceList(data){
	 return request.post('/amazon/api/v0/orders/invoince/list',data);
}
function getOrderReturnList(data){
	 return request.post("/amazon/api/v0/orders/return/returnlist",data)
}
function getOrderRemoveList(data){
	 return request.post("/amazon/api/v0/orders/remove/removelist",data)
}
function getOrderShipList(data){ 
	 return request.post("/amazon/api/v0/orders/ship/shiplist",data)
}
function showOrderDetail(data){
	 return request.get("/amazon/api/v0/orders/manager/showOrderDetail",{params:data })
}
function selectVatInfoByGroup(data){
	 return request.get("/amazon/api/v0/orders/invoince/selectVatInfoByGroup",{params:data })
}
  
function sendAmzVatInvoince(data){
	return request.get("/amazon/api/v0/orders/invoince/sendAmzVatInvoince",{params:data })
}
function todaylist(data){
	  return request.post('/amazon/api/v0/orders/today/todaylist',data);
}
function getParamOfTodayOrder(data){
	  return request.post('/amazon/api/v0/orders/today/getParamOfTodayOrder',data);
}






export default{
	getOrderList,
	getOrderReturnList,
	getOrderRemoveList,
	getOrderShipList,
	showOrderDetail,
	selectVatInfoByGroup,
	sendAmzVatInvoince,
	getOrderInvoinceList,
	todaylist,
	getParamOfTodayOrder,
}
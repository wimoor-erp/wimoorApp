import request from "@/utils/request";
 
function list(data){
	return request.post("/erp/api/v1/purchase_form/list",data)
}
function getRecdetail(data){
 	return request.get('/erp/api/v1/purchase_form/getRecdetail',{params:data});
}
function clearRecAll(data){
	return request.get('/erp/api/v1/purchase_form/clearRecAll',{params:data});
}
function catchLogisticsInfo(data){
return request({url:"/erp/api/v1/purchase/alibaba/entry/alibabainfo/catchLogisticsInfo",method:"GET","data":data})
}
function rec(data){
	return request.post('/erp/api/v1/purchase_form/rec',data);
}
export default {
       list,getRecdetail,catchLogisticsInfo,rec,clearRecAll
	};
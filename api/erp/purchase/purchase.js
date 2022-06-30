import request from '@/common/request.js'
 
function list(data){
	return request({url:"/erp/api/v1/purchase_form/list",method:"GET","data":data})
}
function getRecdetail(data){
 	return request({url:"/erp/api/v1/purchase_form/getRecdetail",method:"GET","data":data})
 }
function catchLogisticsInfo(data){
return request({url:"/erp/api/v1/purchase_form/catchLogisticsInfo",method:"GET","data":data})
}
function rec(data){
return request({url:"/erp/api/v1/purchase_form/rec",method:"GET","data":data})
}
 
export default {
       list,getRecdetail,catchLogisticsInfo,rec
	};
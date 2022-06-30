import request from '@/common/request.js'
const getShelfList=(data)=>{
	return request({url:'/erp/api/v1/warehoue/shelfInventory/getShelfList',method:"POST","data":data});
}
const getShelfInventoryList=(data)=>{
	return request({url:'/erp/api/v1/warehoue/shelfInventory/getShelfInventoryList',method:"POST","data":data});
}
const getShelfInfo=(data)=>{
	return request({url:'/erp/api/v1/warehouse/shelf/getShelfInfo',method:"GET","data":data});
}
const invAdd=(data)=>{
 	return request({url:'/erp/api/v1/warehoue/shelfInventory/add',method:"POST","data":data});
}
const invSub=(data)=>{
  	return request({url:'/erp/api/v1/warehoue/shelfInventory/sub',method:"POST","data":data});
 }
 
export default {getShelfList,getShelfInventoryList,getShelfInfo,invAdd,invSub};
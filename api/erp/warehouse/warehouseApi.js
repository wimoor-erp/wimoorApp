import request from "@/utils/request";
const getShelfList=(data)=>{
	return request({url:'/erp/api/v1/warehoue/shelfInventory/getShelfList',method:"POST","data":data});
}
const getShelfInventoryList=(data)=>{
	return request({url:'/erp/api/v1/warehoue/shelfInventory/getShelfInventoryList',method:"POST","data":data});
}
const shelfInventoryOptRecord=(data)=>{
	return request({url:'/erp/api/v1/warehouse/shelfInventoryOptRecord',method:"GET","data":data});
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
 function getWarehouseList(data){
 	 return request.get("/erp/api/v1/warehouse/list",{params:data})
 }
 function getWarehouseUseable(){
 	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_usable"} })
 }
 function getWarehouseUnUseable(){
 	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_unusable"} })
 }
 function getWarehouseTest(){
 	 return request.get("/erp/api/v1/warehouse/getlist",{params:{"ftype":"self_test"} })
 }
 function getSelfWarehouseById(data){
 	 return request.get("/erp/api/v1/warehouse/getSelfWarehouseById",{params:data})
 }
 function getWarehouseNameList(data){
 	 return request.get("/erp/api/v1/warehouse/getNamelist",{params:data})
 }
 
 export default{
	getShelfList,getShelfInventoryList,getShelfInfo,invAdd,invSub,
 	getWarehouseList,getWarehouseUseable,
	getWarehouseUnUseable,getWarehouseTest,
	getSelfWarehouseById,getWarehouseNameList,
	shelfInventoryOptRecord
 }
 
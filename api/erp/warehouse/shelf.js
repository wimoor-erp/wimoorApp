import request from "@/utils/request";
function getWarehouseShelf(warehouseid) {
  var param={"warehouseid":warehouseid};
  return request.get('/erp/api/v1/warehouse/shelf/list',{params:param});
}
function saveWarehouseShelf(data) {
  return request.post('/erp/api/v1/warehouse/shelf/add',data); 
}
function detailWarehouseShelf(parentid) {
  return request.get('/erp/api/v1/warehouse/shelf/'+parentid+'/detail');
}
function deleteWarehouseShelf(ids) {
  return request.delete('/erp/api/v1/warehouse/shelf/del',{params:{"ids":ids} });
}
function modifyWarehouseShelf(data) {
  return request.put('/erp/api/v1/warehouse/shelf/modify',data);
}
const getShelfInfo=(data)=>{
	return request.get('/erp/api/v1/warehouse/shelf/getShelfInfo',{params:data });
}
function detailWarehouse(warehouseid) {
  return request.get('/erp/api/v1/warehouse/shelf/'+warehouseid+'/detailwarehouse');
}
function getWarehouseSum(warehouseid) {
  return request.get('/erp/api/v1/warehouse/shelf/'+warehouseid+'/warehousesum');
}
function getOptList(data){
  return request.post('/erp/api/v1/warehouse/shelfInventoryOptRecord/getOptList',data);
}
 
export default{getWarehouseShelf ,saveWarehouseShelf,detailWarehouse,getWarehouseSum,getOptList,
detailWarehouseShelf,deleteWarehouseShelf,modifyWarehouseShelf,getShelfInfo}
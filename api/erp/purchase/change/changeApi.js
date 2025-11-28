import request from "@/utils/request.js";
import downloadhandler from "@/utils/download-handler.js";

function list(data){
	 return request.post('/erp/api/v1/purchase/purchaseFormEntryChange/list', data);
}
function getData(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/getData', {params:data});
}
function deleteData(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/deleteData', {params:data});
}
function saveData(formData,filePath){
	return request({'method':'POST',
	                'url':"/erp/api/v1/purchase/purchaseFormEntryChange/saveData",
				    'formData':formData,
					'name':"file",
					'filePath':filePath,
					'isfile':true,
	});
	 
}
function saveRecord(data){
 	return request.get('/erp/api/v1/purchase/purchaseFormEntryChangeReceive/saveRecord',{params:data});
}
function examine(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/examine',{params:data});
}
function cancelInstock(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChangeReceive/cancelInstock',{params:data});
}
function resetForm(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/resetForm',{params:data});
}
function changeform(data){
	return request.post('/erp/api/v1/purchase/purchaseFormEntryChange/changeform',data);
}
function purchaseapply(data){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/purchaseapply',{params:data});
}
function uploadAttachment(formData,filePath){
	return request({'method':'POST',
	                'url':"/erp/api/v1/purchase/purchaseFormEntryChange/uploadAttachment",
				     'formData':formData,
					 'name':"file",
					'filePath':filePath,
					'isfile':true,
				
	});
}

function deleteAttachment(id){
	return request.get('/erp/api/v1/purchase/purchaseFormEntryChange/deleteAttachment',{params:{"id":id}});
	}
export default{
	 list,getData,deleteData,saveData,saveRecord,examine,cancelInstock,resetForm,changeform,purchaseapply,uploadAttachment,deleteAttachment
}
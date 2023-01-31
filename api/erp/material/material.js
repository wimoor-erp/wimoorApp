
import request from "@/utils/request";
 
function getMaterialInfo(data){
	return request({url:"/erp/api/v1/material/getMaterialInfo",method:"GET","data":data})
}
export default {
      getMaterialInfo
	};
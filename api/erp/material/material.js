
import request from '@/common/request.js'
 
function getMaterialInfo(data){
	return request({url:"/erp/api/v1/material/getMaterialInfo",method:"GET","data":data})
}
export default {
      getMaterialInfo
	};
 
 import request from "@/utils/request";
 function getRoute(){
	     		return request.get("/admin/api/v1/menus/route");
	    } 
 function cleanUserCache(){
			    return request.get("/admin/api/v1/menus/cleanUserCache");
		} 
		
export default{
			getRoute,
		}
	 
  
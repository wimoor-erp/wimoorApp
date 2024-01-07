import request from "@/utils/request";
const loginWechat=(data)=>{
	return request({url:'/auth/loginWechat',method:"GET","data":data});
}
const getOpenUserlist=(data)=>{
	return request({url:'/auth/getOpenUserlist',method:"GET","data":data});
}
const unbindWechat=(data)=>{
	return request({url:'/admin/api/v1/users/unbindWechat',method:"GET","data":data});
}
const verifyWechatApp=(data)=>{
	return request({url:'/auth/verifyWechatApp',method:"GET","data":data});
}
const changeLoginWechatApp=(data)=>{
	return request({url:'/auth/changeLoginWechatApp',method:"GET","data":data});
}
const loginH5=(data)=>{
	var url="";
	if(process.env.NODE_ENV === 'development'){
	   url="/auth/login";
	}else{
	   url="/api/auth/login";
	}
	return  request.post(url,data);
}
function findbindlist(){
	 return request.get('/admin/api/v1/users/findbindlist')
}
const getAppType=()=>{
	var appType="app";//app默认是微信
	//#ifdef  MP-WEIXIN 
	appType="app";
	//#endif
	//#ifdef  MP-LARK
	appType="feiapp";
	//#endif
	//#ifdef  H5
	appType="h5";
	//#endif
	return appType;
}
export default {loginWechat,getOpenUserlist,unbindWechat,loginH5,findbindlist,
verifyWechatApp,changeLoginWechatApp,getAppType};

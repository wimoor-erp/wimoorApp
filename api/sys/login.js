import request from '@/common/request.js'
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
 
export default {loginWechat,getOpenUserlist,unbindWechat,verifyWechatApp,changeLoginWechatApp};

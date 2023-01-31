import store from '@/store/index.js';//需要引入store
const base=function(options={url:"",method:"GET",data:{},header:{}}){
	// var that=this
	//https://api.wimoor.com
	//http://192.168.0.252:8099
	//http://localhost:8099
	var sessionid=store.state.sessionid;
	return new Promise((reslove,reject)=>{
		uni.request({
			url:'https://api.wimoor.com'+options.url, 
			method:options.method,
			header: {
				'content-type': 'application/json',
				'JSessionId':sessionid,
				...options.header,
			},
			data:options.data,
			success:(res)=>{
				if (res.data && res.data.code=="201") {
				   reslove(res.data.data)
				}else if(res.data &&res.data.code=="B0001"){
					uni.showToast({
						title: res.data.msg,
						duration:2000,
						icon:'none'
					})
				}else if(res.data && res.data.code=="401"){
				    uni.clearStorageSync();
					uni.navigateTo({
						url: '/pages/sys/validate/index'
					})
				}else if(res.statusCode=="500" && res.data.status=="500"){
					uni.showToast({
						title:'系统出错了,请联系管理员！',
						duration:2000,
						icon:'none'
					})
				}else if(res.status=="500"){
					uni.showToast({
						title:'系统无法正常请求,请联系管理员！',
						duration:2000,
						icon:'none'
					})
				}else if(res.statusCode=="400"){
					uni.showToast({
						title:'系统出错了,请联系管理员！',
						duration:2000,
						icon:'none'
					})
				}else{
					if(options.url!="/auth/verifyWechatApp"){
						uni.navigateTo({
							url: '/pages/sys/validate/index'
						})
						
					}
					reslove(res.data)
				}
			},
			fail:(parmas)=>{
					 uni.showToast({
						title:'系统出错了,请联系管理员！',
						duration:2000,
						icon:'none'
					 })
			}
		 
		}
		) 
	})
};
base.get=  function(url,params){
	var options={url:url,method:"GET",data:{},header:{}}
	if(params&&params["data"]){
		options.data=params.data;
	}
	if(params&&params["params"]){
		options.data=params.params;
	}
	return  base(options);
};
base.post= function(url,data){
	var options={url:url,method:"POST",data:{},header:{}}
	if(data){
		options.data=data;
	}
	return  base(options);
};
base.put=  function(url,data){
	var options={url:url,method:"PUT",data:{},header:{}}
	if(data){
		options.data=data;
	}
	return  base(options);
};
base.delete=  function(url,data){
	var options={url:url,method:"DELETE",data:{},header:{}}
	if(params&&params["data"]){
		options.data=params.data;
	}
	return  base(options);
};
export default base;
 

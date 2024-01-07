function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}
	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n 
	}).join(':')
}
  
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分  
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
	//yyyy-MM-dd hh:mm:ss日期格式
}     
function getCurrentSevenDay(){
	var end = new Date()
	var start = new Date()
	end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
	 start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
	return [dateFormat(start),dateFormat(end)]
}
//节流函数
function throttle(func, delay) {  
  let lastCall = 0;  
  return function(...args) {  
    const now = new Date().getTime();  
    if (now - lastCall < delay) {  
      return;  
    }  
    lastCall = now;  
    return func.apply(this, args);  
  };  
}

//防抖函数
function debounce(func, delay) {
  let timeout;
   return function(){
     const context = this;
     const args = arguments;
     clearTimeout(timeout);
     timeout = setTimeout(function() {
       func.apply(context, args);
     }, delay);
   };
} 

function dateFormat(time){
	if (('' + time).length === 10) {
	  time = parseInt(time) * 1000;
	} else if(('' + time).indexOf("-")>0||('' + time).indexOf("/")>0){
	  return time;
	}
	const d = new Date(time); 
	return d.format("yyyy-MM-dd");  
}
export default{
	dateFormat,
	formatTime,
	formatLocation,
	getCurrentSevenDay,
	debounce,
	throttle,
}
export function formatFloat(src,pos){   //四舍五入,保留2位小数 
   if(src==""||src==undefined){
   	return "";
   }else{
		if(pos==null){
			pos=2;
		}
		return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);      
   }
} 

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

function getCurrentDefineDay(star,days){
	if(days ===''||star===""){
		days=1;
		star=0;
	}
	var end = new Date()
	var start = new Date()
	end.setTime(end.getTime() - 3600 * 1000 * 24 * star)
	 start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
	return [dateFormat(start),dateFormat(end)]
}

function getCurrentMonth(){
	var end = new Date()
	var start = new Date()
	end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
	 start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
	return [dateFormat(start),dateFormat(end)]
}

function getCurrentDate() {  
    // 创建一个新的Date对象，表示当前日期和时间  
    const now = new Date();  
  
    // 获取当前年份  
    const year = now.getFullYear();  
  
    // 获取当前月份（0-11），并转换为1-12的格式  
    const month = String(now.getMonth() + 1).padStart(2, '0');  
  
    // 获取当前日期（1-31）  
    const day = String(now.getDate()).padStart(2, '0');  
  
    // 格式化日期字符串为 YYYY-MM-DD  
    const formattedDate = `${year}-${month}-${day}`;  
  
    return formattedDate;  
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
//货币转换
function currency(val){
	if(val==='美国'){
		return "$"
	}else if(val==='法国'||val==='德国'||val==='意大利'||val==='西班牙'||val==="荷兰"||val==='比利时'){
		return "€"
	}else if(val==='加拿大'){
		return "C$"
	}else if(val==='英国'){
		return "￡"
	}else if(val==='日本'){
		return "¥"
	}else if(val==='澳大利亚'){
		return "A$"
	}else if(val==='印度'){
		return "₹"
	}else if(val==='墨西哥'){
		return "Mex$"
	}else if(val==='阿联酋'){
		return "AE$"
	}else if(val==='沙特'){
		return "S$"
	}else if(val==='波兰'){
		return "zł"
	}else if(val==='瑞典'){
		return "Kr"
	}
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

function nullValueTran(val){
	return val===null||val===undefined||val===''?"-":val.toFixed(2)
}
export default{
	dateFormat,
	formatTime,
	formatLocation,
	getCurrentSevenDay,
	getCurrentMonth,
	getCurrentDefineDay,
	debounce,
	throttle,
	numberFormat,
	currency,
	nullValueTran,
	getCurrentDate,
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

function numberFormat(num) {
	  var res=num.toString().replace(/\d+/, function(n){ // 先提取整数部分
	       return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
	          return $1+",";
	        });
	  })
	  return res;
}
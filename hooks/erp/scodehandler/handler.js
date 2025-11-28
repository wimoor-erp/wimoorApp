export function handleScode(result,backurl){
	let url=result;
	if(url.indexOf("ws/")>=0){
		if(url.indexOf("http")>=0){
			var param = url.split("ws/")[1];
			var params=param.split("/");
			var addressnum=params[0];
			var shelftreepath=params[1];
			var detail = {
				'addressnum': addressnum,
				'shelftreepath':shelftreepath,
			};
		}else{
			var param = url.split("/");
			var addressnum=param[1];
			var shelftreepath=param[2];
			var detail = {
				'addressnum': addressnum,
				'shelftreepath':shelftreepath,
			};
		}
        if(backurl){
			uni.redirectTo({
				"url":(backurl.indexOf("?")>=0?backurl+"&":backurl+"?")+ 'detailData=' +
					encodeURIComponent(JSON.stringify(detail))
			});
		}else{
			uni.redirectTo({
				"url": '/pages/erp/warehouse/inventory/shelf/index?detailData=' +
					encodeURIComponent(JSON.stringify(detail))
			});
		}
		
	}else if(url.indexOf("wxsc/")>=0){
		let shipmentid = null;
		if(url.indexOf("http")>=0){
			shipmentid = result.split("wxsc/")[1];
		}else{
			shipmentid = result.split("/")[1];
		}
		if(backurl){
			uni.redirectTo({
				"url":(backurl.indexOf("?")>=0?backurl+"&":backurl+"?")+ 'shipmentid=' +shipmentid
			});
		}else{
			uni.redirectTo({
				"url": '/pages/erp/ship/quota/index?shipmentid=' +shipmentid
			});
		}
		
	}else if(url.indexOf("rec/")>=0){
		let param = null;
		if(url.indexOf("http")>=0){
			param=result.split("rec/")[1]
		}else{
			param=result.split("/")[1]
		}
		var recid=param;
		if(backurl){
			uni.redirectTo({
				"url":(backurl.indexOf("?")>=0?backurl+"&":backurl+"?")+ 'recid='+recid
			});
		}else{
			uni.redirectTo({
				"url": '/pages/erp/purchase/scan_shelf/index?recid='+recid
			});
		}
		
	}
}
					
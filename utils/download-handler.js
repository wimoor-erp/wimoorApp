function downloadSuccess(res,filename){
	uni.showToast({
		title:'导出成功',
		icon:'none',
		duration:3000
	});
	const blob = new Blob([res]);
	if(window.navigator["msSaveOrOpenBlob"]&&window.navigator.msSaveOrOpenBlob()){
		 navigator.msSaveBlob(blob, filename)
	}else{
		 var link=document.createElement("a");
		 link.href=window.URL.createObjectURL(blob);
		 link.download=filename;
		 link.click();
		 window.URL.revokeObjectURL(link.href);
	}
}
function downloadFail(res,filename){
	if(res&&res.response.data){
		var reader = new FileReader();
		reader.readAsText(res.response.data, 'utf-8');
		reader.onload = function (e) {
			 var result=JSON.parse(reader.result);
			 uni.showToast({
			 	title:'导出失败',
			 	icon:'none',
			 	duration:3000
			 });
			 
		}
	}
	else if(res&&res.msg){
		uni.showToast({
			title:'导出失败',
			icon:'none',
			duration:3000
		});
	}else if(res&&res.message){
	   uni.showToast({
	   	title:'导出失败',
	   	icon:'none',
	   	duration:3000
	   });
	}else{
	    uni.showToast({
	    	title:'导出失败',
	    	icon:'none',
	    	duration:3000
	    });
	}
	
}
export default{
	downloadSuccess,downloadFail
}
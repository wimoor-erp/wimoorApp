/* 复制文本 */
export default function(text){
	// #ifdef H5
	 var input = document.createElement("textarea");
	 document.body.appendChild(input)
	 input.value = text
	 input.select()
	 document.execCommand('copy')
	 document.body.removeChild(input);
	  uni.showToast({
		title:'复制成功！',
		icon:'none',
		duration:2000
	})
	// #endif
	// #ifdef MP-WEIXIN
	wx.setClipboardData({
	 data: text,
	 success: function (res) {
	  wx.showModal({
	   title: '提示',
	   content: '复制成功',
	  })
	 }
	});
	// #endif

} 
 
 
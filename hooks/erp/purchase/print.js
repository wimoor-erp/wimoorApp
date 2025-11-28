var socketOpen,defaultPrinter;
import purchaselistApi from '@/api/erp/purchase/form/listApi.js';
function initSocket(){
	purchaselistApi.getPrintIp().then(res=>{
	 uni.connectSocket({
			url: 'wss://'+res+':13529',
		});
	   //服务器消息
	   uni.onSocketMessage(function (event) {
	     defaultPrinter = JSON.parse(event.data).defaultPrinter;
	   });
	   
	   uni.onSocketOpen(function (res) {
		 socketOpen = true;
		 getPrintList();
	   /*  console.log('WebSocket连接已打开！'); */
	   });
	   
	    //服务器关闭
	   uni.onSocketClose(function (event) {
	     console.log('Client notified socket has closed',event);
	   });
	
	})
	// 打开Socket
}
/**
 * 请求打印机列表
 * */
function getPrintList(){
    var request = getRequestObject("getPrinters"); 
    if (socketOpen) {
		uni.sendSocketMessage({data:JSON.stringify(request)});
    }
}

//打印电子面单
function doPrint(body){
    var request = getRequestObject("print");    
    request.task = new Object();
    request.task.taskID = getUUID(8,10);
    request.task.preview = false;
    request.task.printer = defaultPrinter;
    var num=parseInt(body.num);
    var documents = new Array();
    for(var i=0;i<num;i++){
        body.index=i+1;
       	var doc = new Object();
        doc.documentID =(body.id?body.id:body.sku+body.order)+i;
       	var contents = getJson(body);
       	doc.contents = contents;
       	documents.push(doc);
	}
    request.task.documents = documents;
    uni.sendSocketMessage({data:JSON.stringify(request)});
}

/***
 * 
 * 获取请求的UUID，指定长度和进制,如 
 * getUUID(8, 2)   //"01001010" 8 character (base=2)
 * getUUID(8, 10) // "47473046" 8 character ID (base=10)
 * getUUID(8, 16) // "098F4D35"。 8 character ID (base=16)
 *   
 */
function getUUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length; 
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
}

/***
 * 构造request对象
 */
function getRequestObject(cmd) {
    var request  = new Object();
    request.requestID=getUUID(8, 16);
    request.version="1.0";
    request.cmd=cmd;
    return request;
}



//获取运单数据 waybillNO 电子面单号
function getJson(body){
    var ret = {
        content: [
        {
            "data":
				{"amount":body.amount,
				"orderNumber":body.orderNumber,
				"buyamount":body.buyamount,
				"operator":body.operator,
				"opttime":body.opttime,
				"sku":body.sku,
				"barCode":body.barCode,
				"index":body.index,
				"num":body.num,
				},
            "signature": "19d6f7759487e556ddcdd3d499af087080403277b7deed1a951cc3d9a93c42a7e22ccba94ff609976c5d3ceb069b641f541bc9906098438d362cae002dfd823a8654b2b4f655e96317d7f60eef1372bb983a4e3174cc8d321668c49068071eaea873071ed683dd24810e51afc0bc925b7a2445fdbc2034cdffb12cb4719ca6b7",
            "templateURL": "https://cloudprint.cainiao.com/template/standard/777103/9"
        },
        ]
    };
    return ret.content;
}


export default{
	doPrint,initSocket
	 
}
var PORT = 9529;
var http = require('http');
var qs = require('qs');

var TOKEN = 'sspku';

function checkSignature(params,token){
	var key = [token,params.timestamp,params.nonce].sort().join('');
 	var sha1 = require('crypto').createHash('sha1');
 	sha1.update(key);

 	return sha1.digest('hex') == params.signature;
}

var server = http.createServer(function(request,response){
	var query = require('url').parse(request.url).query;
	var params = qs.parse(query);

	if(!checkSignature(params,TOKEN)){
		//如果签名不对，结束请求返回
		response.end('signature end');
		return;
	}
	if(request.method == "GET"){
    	//如果请求是GET，返回echostr用于通过服务器有效校验
    	response.end(params.echostr);
	}else{
	    //否则是微信给开发者服务器的POST请求
	    var postdata = "";

	    request.addListener("data",function(postchunk){
	      postdata += postchunk;
	    });

	    //获取到了POST数据
	    request.addListener("end",function(){
	      console.log(postdata);
	      response.end('success');
	    });
	}


});

server.listen(PORT);
console.log("Server running at port: " + PORT + ".");
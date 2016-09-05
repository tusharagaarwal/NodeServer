var http = require('http'),
url = require('url'),
	Q = require('q');

function init(dispatch, handle){
	http.createServer(function (request, response) {
		var path = url.parse(request.url).pathname;
		console.log('Request for ' + path + ' from ' + request.connection.remoteAddress);
	    //response.writeHead(200, {'Content-Type': 'text/plain'});
		// set the response header as text/html so that the passed data is rendered as an html page
		response.writeHead(200, {'content-type' : 'text/html'});
		
		var myPromise = dispatch(path,handle);
		console.log('promise state : ' + myPromise);
		myPromise.then(function(data){
			console.log('success');
			content = data;
			console.log(content + ' ' + path+' '+typeof(handle));
			response.write(content);
			response.end();
		}, function(err){
			console.log(err); 
		});
		
		
		
		/*var content = dispatch(path, handle);
		console.log(content + ' ' + path+' '+typeof(handle));
		response.write(content);
	    response.end();*/
	}).listen(8080, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:8080/');
}
exports.init=init;


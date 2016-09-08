var http = require('http'),
url = require('url'),
	Q = require('q');

function init(dispatch, handle){
try{
	http.createServer(function (request, response) {
		var path = url.parse(request.url).pathname;
		console.log('Request for ' + path + ' from ' + request.connection.remoteAddress);
		// set the response header as text/html so that the passed data is rendered as an html page
		response.writeHead(200, {'content-type' : 'text/html'});
		debugger;
		var myPromise = dispatch(path,handle);
		console.log('promise state : ' + myPromise);
		if(typeof myPromise == 'string' || myPromise == null){
			console.log('Something went wrong');
		}
		else{
			myPromise.then(function(data){
				console.log('success');
				content = data;
				// for test purposes
				//console.log(content + ' ' + path+' '+typeof(handle));
				response.write(content);
				response.end();
			}, function(err){
				console.log('Error occurred:' + err); 
				url.parse(request.url).pathname = 'error';
				response.write('Oops some error occurred, please try again later!');
				response.end();
			});
		}
	}).listen(8080, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:8080/');
} catch(ex) {
	console.log(ex);
}
}
exports.init=init;


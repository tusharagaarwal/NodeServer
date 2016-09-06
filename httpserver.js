var http = require("http");
var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var port = 12311;

var reqListener = function (request, response) {
	console.log("Incoming request from: " + request.connection.remoteAddress);
	response.writeHead(200, {'Content-Type': 'text/html'});
	var pathn = url.parse(request.url).pathname;
	var footer = '<br><hr><i>server running at 127.0.0.1:12311 - tushar agarwal</i>';
	if(pathn=='/'){
		var data = '';
		var cmd = 'dir /b';
		exec(cmd, function(error, stdout, strerr){
			//command output is in stdout
			data = stdout;
			data=data.split("\r\n");
			var filename = data.indexOf("index.html");
			if(filename!=-1){
			// index file is present
				var rstream = fs.createReadStream('./index.html');
				rstream.pipe(response);
				/*fs.readFile('./'+filename, 'utf-8', function(content, err){
					if(err) { response.write('Some error'); response.end('Please try again later.');}
					else {
						data = content;
						response.write(data);
						response.end();
					}
				});*/
			}
			else{
				response.write('<h1>Index of /</h1><br>' + data + footer);
				response.end();
			}
		});
	}
	else{
		var data = '';
		var cmd = 'dir /b';
		exec(cmd, function(error, stdout, strerr){
			data = stdout;
			data = data.split('\r\n');
			var fileloc = data.indexOf(path.basename(pathn));
			console.log('\nRequest for ' + path.basename(pathn));
			if(fileloc!=-1){
				var rstream = fs.createReadStream('./' + path.basename(pathn));
				rstream.pipe(response);
			}
			else {
				response.write('<h1>404 Not Found</h1>' + footer);
				response.end();
			}
		});
	}
}
http.createServer(reqListener).listen(port);
console.log("Listening to: " + port);

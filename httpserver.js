var http = require("http");
var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var port = 12311;
var datahandler = require('./datahandler.js');
var querystring = require('querystring');

var reqListener = function (request, response) {
	console.log(Date()+":Incoming request from: " + request.connection.remoteAddress);
	response.writeHead(200, {'Content-Type': 'text/html'});
	var pathn = url.parse(request.url).pathname;
	var footer = '<br><hr><i>server running at 127.0.0.1:12311 - tushar agarwal</i>';
	console.log(Date()+':Request for ' + pathn);
	if(pathn=='/'){
	// handler for the base index (ROOT)
		var data = '';
		var cmd = 'dir /b';
		exec(cmd, function(error, stdout, strerr){
			//command output is in stdout
			data = stdout;
			data=data.split("\r\n");
			var filename = data.indexOf("index.html");
			if(filename!=-1){
			// if index file exists
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
			// if index file is absent
				data = data.join("<br>");
				response.write('<h1>Index of /</h1><br>' + data + footer);
				response.end();
			}
		});
	}
	else if(pathn == '/login'){
		// handler for login
		var query = url.parse(request.url).query;
		var username = querystring.parse(query)['username'];
		var password = querystring.parse(query)['password'];
		console.log(Date()+":Login request for "+username+","+password);
		// fetch the data from users.json and check if credentials are valid
		fs.readFile('./data/users.json', 'utf-8', function(err, data){
			if(err) {console.log(Date()+":"+err);}
			else {
				var obj = JSON.parse(data);
				if(typeof obj.users[username] == 'object'){
					if(obj.users[username].password == password){
						// valid credentials redirect to home according to role
						var role = obj.users[username].role;
						if(role == "admin"){
							// redirect to admin home
							response.writeHead("302", {"Location":"./adminhome.html"});
							/*response.statuscode="302";
							response.setHeader("Location", "/adminhome.html");*/
						} else if(role == "user") {
							//redirect to the user home
							response.writeHead("302", {"Location":"./index1.html"});
							/*response.statuscode="302";
							response.setHeader("Location", "/index1.html");*/
						} else {
							console.log(Date()+":Invalid conf in users.json for the user - "+username);
							response.write("Invalid configuration in users.json! Contact the admin.");
						}
					} else {
						// invalid password
						response.write("invalid password");
					}
				}
				else {
					response.write("Invalid username");
				}				
				response.end();
			}
		});
		// data submit from the login.html
		/*
		else if (path == '/getresponse') {
	
		
		var query = url.parse(request.url).query;
		var username = querystring.parse(query)['username'];
		var email = querystring.parse(query)['email'];
		response.write("Username: " + username + " and email: " + email);
		response.end();
	}
	else if (path == '/postresponse') {
	
		var data1 = '';
		request.on('data', function(chunk) {
			console.log(chunk);
			data1 += chunk;
		});
		request.on('end', function() {
			qs = querystring.parse(data1);
			name = qs['username'];
			email = qs['email'];
			response.write("Username: " + name + " post email: " + email);
		});
		
	}
		*/
	}
	else{
		// handler for everythign other than root
		var data = '';
		pathn = path.normalize(pathn);
		/*var cmd = 'dir .' + pathn.split('/').join('\\') + ' /b';
		console.log(Date()+':'+cmd);
		exec(cmd, function(error, stdout, strerr){
			data = stdout;
			console.log(data);
			data = data.split("\r\n");
			//var fileloc = data.indexOf(path.basename(pathn));
			console.log(Date()+':Request for ' + pathn);
			// fs.exists(pathn,callback) checked and replacing cmd based logic
			
			if(fileloc!=-1){
				//if file in the path exists
				if(!fs.lstatSync('./' + pathn).isDirectory()){
					var rstream = fs.createReadStream('./' + pathn);
					rstream.pipe(response);
				}
				else {
					cmd = 'dir .' + pathn.split('/').join('\\').substr(1) + ' /b';
					exec(cmd, function(error, stdout, stderr){
						data = stdout;
						data = data.split('\r\n');
						data = data.join('<br/>');
						console.log(cmd +':'+data);
						response.write('<h1>Index of ' + pathn + '</h1><br>' + data + footer);
						response.end();
					});
				}
			}
			else {
			//if file does not exist
				response.write('<h1>404 Not Found</h1>' + footer);
				response.end();
			}
		});*/
		
		// fs.exists(pathn,callback) checked and replacing cmd based logic
		fs.exists('.'+pathn, function(exists){
			console.error(exists ? fileExistsCallback() : fileNotExistsCallback());
		});
		// callback function when the file/folder exists
		function fileExistsCallback(){
			console.log(Date()+":Dispatching-"+pathn);
			if(!fs.lstatSync('./' + pathn).isDirectory()){
				var rstream = fs.createReadStream('./' + pathn);
				rstream.pipe(response);
				return Date()+":Success";
			}
			else{
				var cmd = 'dir .\\' + pathn.split('/').join('\\').substr(1) + ' /b';
				exec(cmd, function(error, stdout, stderr){
					data = stdout;
					data = data.split('\r\n');
					data = data.join('<br/>');
					console.log(cmd +':'+data);
					response.write('<h1>Index of ' + pathn + '</h1><br>' + data + footer);
					response.end();
				});
			}
		}
		// callback function when the file/folder does not exists
		function fileNotExistsCallback(){
			console.log(Date()+':ERROR[404]: NOT FOUND.');
			response.write('<h1>404 Not Found</h1>' + footer);
			response.end();
		}
	}
}
http.createServer(reqListener).listen(port);
console.log("Listening to: " + port);

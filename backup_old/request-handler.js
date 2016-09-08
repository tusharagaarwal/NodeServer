var fs = require('fs'),
	myWay = require('./readFileMyWay.js'),
	Q = require('q');

function handlerequest(path) {
try{
	var content = '';
	var defer = Q.defer();
	var filename = '';
	switch(path){
		case '/': filename = './index.html'; break;
		case '/index' : filename = './index.html'; break;
		case '/login' : filename = './login.html'; break;
	}
	fs.readFile(filename, 'utf-8', function(err, data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
}
catch (ex) {
	console.log(ex);
}
}

function home(){
try{
	var content='';
	var defer = Q.defer();
	
	fs.readFile('./index.html', 'utf-8', function(err,data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
} catch (ex) {
	console.log(ex);
}
}


function css(){
try {
	var content='';
	var defer = Q.defer();
	
	fs.readFile('./main.css', 'utf-8', function(err,data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
} catch (ex) {
	console.log(ex);
}
}

function login(){
try {
	return 'Login Page';
} catch (ex) {
	console.log(ex);
}
}

function notfound(){
try{
	var content='';
	var defer = Q.defer();
	
	fs.readFile('./404.html', 'utf-8', function(err,data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
} catch(ex) {
	console.log(ex);
}
}

exports.home = home;
exports.login = login;
exports.handlerequest = handlerequest;
exports.notfound = notfound;

var fs = require('fs'),
	myWay = require('./readFileMyWay.js'),
	Q = require('q');

function home(){
	var content='';
	var defer = Q.defer();
	
	fs.readFile('./layout.html', 'utf-8', function(err,data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
}


function css(){
	var content='';
	var defer = Q.defer();
	
	fs.readFile('./main.css', 'utf-8', function(err,data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
}

function login(){
	return 'Login Page';
}

exports.home = home;
exports.login = login;

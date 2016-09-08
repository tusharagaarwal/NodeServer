#!/usr/bin/env node

var
app = require('express')(),
clientSessions = require("client-sessions"),
fs = require('fs'),
url = require('url'),
exec = require('child_process').exec,
path = require('path'),
querystring = require('querystring');

var footer = '<br><hr><i>server running at 127.0.0.1:12311 - tushar agarwal</i>';

app.use(clientSessions({
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // CHANGE THIS!
}));

function home(req, res){
  if (req.session_state.username) {
    //res.send('Welcome ' + req.session_state.username + '! (<a href="/logout">logout</a>)');
	loadFile('./index1.html', req, res);
  } else {
    //res.send('You need to <a href="/login">login</a>.');
	res.redirect('/login');
  }
}

function login(req, res){
//req.session_state.username = 'JohnDoe';
  var query = url.parse(req.url).query;
  var username = querystring.parse(query)['username'];
  var password = querystring.parse(query)['password'];
  if(typeof username == 'string' && typeof password == 'string') {
	  console.log(Date() + ': Login Request for ' + username + ',' + password);
	  // fetch the data from the users.json and check the authentication
	  fs.readFile('./data/users.json', 'utf-8', function(err, data){
		if(err) console.log(Date() + ":" + err);
		else {
			var userObj = JSON.parse(data);
			if(typeof userObj.users[username] == 'object') {
				if(userObj.users[username].password == password) {
					// create client session_state
					req.session_state.username = username;
					req.session_state.role = userObj.users[username].role;
					if(req.session_state.role == 'admin') {
						//redirect to admin home
						res.redirect('/');
					} else if(req.session_state.role == 'user') {
						//redirect to user home
						res.redirect('/');
					} else {
						// incorrect configuration
						console.log(Date() + ": Incorrect configuration in user file for " + username);
					}
				} else {
					// invalid password
					res.send("Invalid password. Goto <a href='/login'>Login</a>");
				}
			} else {
				// invalid username
				res.send("Invalid username. Goto <a href='/login'>Login</a>");
			}
		}
	  });
	  
	  //console.log(req.session_state.username + ' logged in.');
	  //res.redirect('/');
	} else {
		loadFile('login.html',req, res);
	}
}

function loadFile(filename, req, res) {
	var data = '';
	fs.exists('./' + filename, function(exists) {
		console.error(exists ? fileExistsCallback() : fileNotExistsCallback());
	});
	// call back function when file exists
	function fileExistsCallback(){
		console.log(Date()+": Dispatching "+filename);
		// check if the path given is directory or file
		if(!fs.lstatSync('./' + filename).isDirectory()){
			// if not a directory
			var rstream = fs.createReadStream('./' + filename);
			rstream.pipe(res);
			return Date()+":Success";
		}
		else{
			// if directory, print the index
			var cmd = 'dir .\\' + filename.split('/').join('\\').substr(1) + ' /b';
			exec(cmd, function(error, stdout, stderr){
				data = stdout;
				data = data.split('\r\n');
				data = data.join('<br/>');
				res.send('<h1>Index of ' + filename + '</h1><br>' + data + footer);
			});
		}
	}
	// callback function when the file/folder does not exists
	function fileNotExistsCallback(){
		console.log(Date()+':ERROR[404]: NOT FOUND.');
		res.send('<h1>404 Not Found</h1>' + footer);
	}
	
}

function everything(req, res) {
	if (req.session_state.username) {
		//res.send('Welcome ' + req.session_state.username + '! (<a href="/logout">logout</a>)');
		var pathname = url.parse(req.url).pathname;
		pathname = path.normalize(pathname);
		loadFile(pathname, req, res);
	} else {
		//res.send('You need to <a href="/login">login</a>.');
		res.redirect('/login');
	}
}

//handlers for index-home
app.get(['/', '/index', '/index*'], function(req,res){home(req,res);});

//handlers for login
app.get(['/login','/login*'], function (req, res){login(req,res);});

//handler for logout
app.get('/logout', function (req, res) {
  req.session_state.reset();
  res.redirect('/');
});

//handlers for everything else
app.get(['*'], function (req, res){everything(req, res);});


try{
	app.listen(3000);
	console.log(Date() + ': Strted listening to port 3000');
} catch(ex) {
	console.log(Date() + ': Error: ' +ex);
}

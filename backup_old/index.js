var server = require('./server'),
	requesthandler = require('./request-handler'),
	dispatcher = require('./dispatcher');


var handle = {};
handle['/'] = requesthandler.home;
handle['/main.css'] = requesthandler.css;
handle['/login'] = requesthandler.login;

server.init(dispatcher.dispatch, handle);
var server = require('./server'),
	requesthandler = require('./request-handler'),
	dispatcher = require('./dispatcher');


var handle = {};
//handle['/'] = requesthandler.home;
handle['/'] = requesthandler.handlerequest;
handle['/index'] = requesthandler.handlerequest;
handle['/main.css'] = requesthandler.css;
handle['/login'] = requesthandler.handlerequest;
//handle['/login'] = requesthandler.login;
handle['/404'] = requesthandler.notfound;

server.init(dispatcher.dispatch, handle);

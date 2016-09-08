function dispatch(path, handle){
try{
	console.log("Dispatching " + path);
	if(typeof handle[path] === 'function'){
		return handle[path](path);
	}
	else{
		return handle['/404']();
	}
} catch (ex) {
	console.log(ex);
}
}

exports.dispatch = dispatch;

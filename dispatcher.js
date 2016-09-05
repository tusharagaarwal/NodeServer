function dispatch(path, handle){
	console.log("Dispatching " + path);
	if(typeof handle[path] === 'function'){
		console.log(typeof handle['path']);
		return handle[path]();
	}
	else{
		//return '404 not found';
	}
}

exports.dispatch = dispatch;
var Q = require('q'),
	fs = require('fs');

function readFileMyWay(filename) {
try {
	var defer = Q.defer();
	fs.readFile(filename, 'utf-8', function(err,data){
		if(err) defer.reject(new Error(err));
		else defer.resolve(data);
	});
	return defer.promise;
} catch (ex) {
	console.log(ex);
}
}

exports.readFileMyWay = readFileMyWay;

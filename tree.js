
var path = require('path');
var fs = require('fs');
var async = require('async');

var tree_list={files: [], dirs:[]};
var console_path='./';

if (process.argv.length > 2) {
	console_path=process.argv[2];
}

tree_list.dirs.push(path.parse(console_path).name);

function getTree (dirPath, callback) {

    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);
        
        async.each(files, function (fileName, eachCallback) {
            
        	var filePath = path.join(dirPath, fileName);
        	
        	
            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                	tree_list.dirs.push(filePath);
                	
                    getTree(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);
                        eachCallback(null);
                    });
                }
                
                if (stat.isFile()) {
                	tree_list.files.push(filePath);
                 	eachCallback(null);
                }
                
            });
        }, function (err) {
            callback(err, tree_list);
        });

    });
}


getTree(console_path, function (err, tree) {
	if (err) {console.log(err); return}
	console.log(tree);
	console.log(JSON.stringify(tree));
	
});






var path = require('path');
var fs = require('fs');
var async = require('async');
let tree_list, console_path;


const init = () => {
    
    tree_list={files: [], dirs:[]};

    console_path = process.argv.length > 2 ? console_path=process.argv[2] : console_path='./';

    tree_list.dirs.push(path.parse(console_path).name);
}


let getTree = (dirPath, callback) => {

    fs.readdir(dirPath, (err, files) => {
        if (err) return callback(err);
        
        async.each(files, (fileName, eachCallback) => {
            
        	let filePath = path.join(dirPath, fileName);
        	
            fs.stat(filePath, (err, stat) => {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                	tree_list.dirs.push(filePath);
                	
                    getTree(filePath, (err, subDirFiles) => {
                        if (err) return eachCallback(err);
                        eachCallback(null);
                    });
                }
                
                if (stat.isFile()) {
                	tree_list.files.push(filePath);
                 	eachCallback(null);
                }
                
            });

        }, (err) => callback(err, tree_list)
        );

    });
}



init();

getTree(console_path, (err, tree) => {
    if (err) {console.log(err); return}
    console.log(tree);
    console.log(JSON.stringify(tree));
});


/* start project*/
// npm install
// npm run tree -- foo/


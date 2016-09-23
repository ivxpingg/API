const path = require('path');
const fs = require('fs');
const nodeJsZip = require('nodeJs-zip');
const modulesUrl = __dirname;
var modules = fs.readdirSync(modulesUrl)


//压缩
var file = path.join(__dirname, '/json/data.json');

var dir = path.join(__dirname, '/');

nodeJsZip.zip(dir, {
    name: 'ziptest',
    dir: __dirname,
    filter: true
}, function(e) {
    //过滤掉js文件
    return !/.js$/.test(e);
});

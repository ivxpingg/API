const targz = require('targz');

console.log(__dirname);
console.log(__dirname + '/json');
//压缩
targz.compress({
    src: 'test/json',
    dest: 'test/t.tar.gz',
    gz: {
        level: 6,
        memLevel: 6
    }
},function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
});

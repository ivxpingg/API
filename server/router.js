import Router from'koa-router';
import url from 'url';
import querystring from 'querystring';
import request from 'koa-request';
import fs from 'fs';
import path from 'path';

const debug = require('debug')('router:local');

const router = new Router({});


//调用外部API
router.get('/get',  function *() {
    const query = url.parse(this.url,true).query;
    const apiurl = querystring.unescape(query.apiurl);
    debug(`get ${apiurl}`);
    delete query.apiurl;
    const options = {
    	url: apiurl,
        method: 'GET',
        qs: query,
        headers: { 'User-Agent': 'request' }
    };

    const response = yield request(options);
    const info = JSON.parse(response.body);
    this.body = info;
});


/**
 * [调用本地模拟数据]
 * @param  {[String]} fileUrl [文件路径,相对路径]
 * @param  {[Int]} ms      [延迟时间，毫秒]
 * @return {[Object]}         [description]
 */
var fn = function(fileUrl,ms){
    var ms = ms || 0
    return new Promise((resolve, reject) =>{
        try{
            setTimeout(function(){
                const response = fs.readFileSync(fileUrl , 'utf8');
                //const response = yield request(options);
                let info = JSON.parse(response);
                resolve(info);
            }, ms);

        } catch(e) {
            reject();
        }

    });
}

router.get('/get/custom',  function *() {
    const query = url.parse(this.url,true).query;
    const fileUrl = querystring.unescape(query.apiurl);
    const ms = querystring.unescape(query.ms);
    const relval = yield fn(fileUrl,ms);

    this.body = relval;


});

router.get('/get/custom/page',  function *() {
    const query = url.parse(this.url,true).query;
    const fileUrl = querystring.unescape(query.apiurl);
    var page = query.page || 1;
    var pageCount = query.pageCount || 10;
    var count = 0;

    const response = fs.readFileSync(fileUrl , 'utf8');

    //const response = yield request(options);
     const arr = JSON.parse(response);

     count = arr.length;

     const relValue = arr.slice((page-1) * pageCount, page * pageCount);


     this.body = relValue;
});


let getStaticMenu = function(){
    return new Promise((resolve, reject) => {
        try{
            let paths = "../src";  // 要获取的目录
            let dirs = [];  //存储目录变量

            let traversal = function(url,dir){
                let moduleFile = path.join(__dirname, url);
                let modules = fs.readdirSync(moduleFile);
                console.log(modules);
                modules.forEach(item => {
                    let file = {
                        name: "",
                        isFolder: true,
                        url: url,
                        dir: []
                    };
                    file.name = item;
                    if(item.indexOf('.') == -1) {
                        file.isFolder = true;
                        traversal(url + '/' + item, file.dir);
                    } else {
                        file.isFolder = false;
                    }
                    dir.push(file);
                });
            };

            traversal(paths, dirs);
              console.log(dirs);
            resolve(dirs);
        } catch(e) {
            reject();
        }

    });
};
/**
 * 获取浏览目录
 * @return {[Object]}
 * [
 *   {
 *     name: 'item1',
 *     isFolder: true,
 *     url: '../src',
 *     dir: [
 *            {
 *              name: index.html,
 *              isFolder: false,
 *              url: '../src/item1'
 *            }
 *          ]
 *   }, {
 *     name:
 *     ..
 *   }
 * ]
 */
router.get('/menu', function *(){
    console.log(11);
    let reVal = yield getStaticMenu();
    this.body = reVal;
});



export default router;

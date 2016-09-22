import Router from'koa-router';
import url from 'url';
import querystring from 'querystring';
import request from 'koa-request';
import fs from 'fs';

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

//调用本地模拟数据
//
var fn = function(fileUrl,ms){
    return new Promise((resolve, reject) =>{
        try{
            setTimeout(function(){
                const response = fs.readFileSync(fileUrl , 'utf8');
                //const response = yield request(options);
                let info = JSON.parse(response);
                resolve(info);
            }, 5000);

        } catch(e) {
            reject();
        }

    });
}
router.get('/get/custom',  function *() {
    const query = url.parse(this.url,true).query;
    const fileUrl = querystring.unescape(query.apiurl);

    const relval = yield fn(fileUrl);

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

export default router;

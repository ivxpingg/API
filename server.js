var koa = require('koa');
var url = require('url');
var router = require('koa-router')();
var request = require('koa-request');

var app = koa();

router.get('/get',function *(){
    var options = {
    	url: 'http://www.lccwifi.cn/api/mobile/goods!list.do',
        headers: { 'User-Agent': 'request' }
    };

    var response = yield request(options); //Yay, HTTP requests with no callbacks!
    var info = JSON.parse(response.body);
    this.body = info;

});

router.get('/api1',function *(tex,req,res){
    var options = {
        url: 'http://www.lccwifi.cn/api/mobile/goods!list.do',
        headers: {
          'User-Agent': 'request'
        }
      };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          this.body= body;
      } else {
          console.log(1112);
      }
    }
    yield request(options, callback);
});

router.get('/',function *(){
    this.body = "hello";
});
router.get('/test',function *(){
    this.redirect('./test/test');
    this.status = 200;
});

app.use(router.routes());



app.listen(3001);

export default app;

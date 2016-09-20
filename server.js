var koa = require('koa');
var url = require('url');
var Router = require('koa-router');
var router = new Router({});
var request = require('koa-request');
var mountHtml = require('koa-mount-html');
var server = require('koa-static');


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


app.use(router.routes());
app.use(mountHtml(function *sendHtml(){
    yield send(this, '/test.html', { root: __dirname+'/test'},{ defer: true })
}));

app.use(server('test/'));


app.listen(3001);

export default app;

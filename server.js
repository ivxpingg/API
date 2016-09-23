import koa from 'koa';
import statics from 'koa-static';
import router from './server/router';
import Boom from 'boom';
import {port,host} from './config';

const app = koa();

var debug = require('debug')('API:server');

debug('test');

const DEBUG = !process.argv.includes('--release');
process.env.NODE_ENV = DEBUG ? '"development"' : '"production"';

console.log(process.env.NODE_ENV);

app.use(router.routes(), router.allowedMethods({
    throw: true,
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed()
}));   //

app.use(function *(next){
    console.log('进入');
    yield next;
});

app.use(statics('test/'));  //设置静态目录

app.on('error', function(err, ctx){
    console.error(err);
    log.error("server error", err, ctx);
});

app.listen(port,() => {
    console.log(`The server is running at ${host}`);
  });

export default app;

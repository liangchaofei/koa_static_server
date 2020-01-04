// 0.导入需要的资源包
const Koa = require('koa');
const app = new Koa();
const path = require('path')
const route = require('koa-route');
const serve = require('koa-static');

// 1.主页静态网页 把静态页统一放到public中管理
const home   = serve(path.join(__dirname)+'/static/');
// 2.hello接口
const hello = ctx => {
  ctx.response.body = 'Hello World';
};

// 3.分配路由
app.use(home); 
app.use(route.get('/', hello));
app.listen(3000,() => {
    console.log('success in 3000')
});

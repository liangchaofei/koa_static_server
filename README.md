# koa_static_server
koa 快速搭建静态文件服务器

### 初始化项目
```js
    npm init -y
```

### 安装需要的依赖包
```js
 npm install koa koa-route koa-static --save-dev
```

### 创建启动入口app.js
```js
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

```

### 创建static文件夹，用于放置静态文件
+ static/index.html 是静态文件根目录
+ static/component/xxx.html 放其他静态html文件
+ css,js,img同上

### 开启服务
```js
    node app.js
```

### 访问 127.0.0.1:3000 可以看到是首页

### 访问 127.0.0.1:3000/component/page.html 可以看到是page页面
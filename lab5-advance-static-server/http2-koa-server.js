'use strict';
const fs = require('fs');
const http2 = require('http2');
const koa = require('koa');
const path = require('path');
// const Router = require('koa-router');

const app = new koa();
// const router = new Router();

const router = require('koa-router')();
const koaBody = require('koa-body');

const options = {
    key: fs.readFileSync('cert/node-localhost-privkey.pem'),
    cert: fs.readFileSync('cert/node-localhost-cert.pem')
    // passphrase: 'password'
};


const dir = path.join(__dirname, 'static');
console.log(dir)
const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp:'image/webp',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

function getFile(path) {
    const filePath = `${__dirname}/static/${path}`;
    try {
        const content = fs.openSync(filePath, 'r');
        const contentType = 'text/html';
        return {
            content,
            headers: {
                'content-type': contentType
            }
        };
    } catch (e) {
        return null;
    }
}

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});


// response
// app.use(ctx => {
//     if (ctx.request.url === '/file') {
//         const file = getFile('thefile.html');
//         ctx.res.stream.respondWithFD(file.content, file.headers);
//     } else {
//         ctx.body = 'OK' ;
//     }
// });

router.get('/file/:gpg/(.*)',
    async (ctx) => {
        console.log(ctx.params)
        let req = ctx.request
        let res = ctx.response
        console.log(req.path)
        // let file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
        let file = path.join(dir, req.path.replace(/\/file\/([0-9].|[A-Za-z].|[A-Za-z][0-9].)/, ''));
        if (file.indexOf(dir + path.sep) !== 0) {
            return ctx.response.status(403).end('Forbidden');
        }
        console.log('file=============')
        console.log(file)
        let type = mime[path.extname(file).slice(1)] || 'text/plain';
        let s = fs.createReadStream(file);
        s.on('open', await function () {
            res.set('Content-Type', type);
            // s.pipe(res);
            console.log("Opened")
            res.status = 200
            // res.body = {'file': 'res body'}
            // console.log(res)
            // s.pipe(ctx.body);
            // console.log(s.pipe())
            res.body = s
        });
        s.on('error', await function () {
            console.log("fs error")
            res.set('Content-Type', 'text/plain');
            res.status = 404
            res.body = 'Not found!!!'
            ctx.body = 'ctx: Not found'
        });
        res.set('Content-Type', type);
        res.status = 200
        res.body = s
})
.post('/user', koaBody(),
    (ctx) => {
        console.log(ctx.request.body);
        // => POST body
        console.log(ctx)
        ctx.response.status = 200
        ctx.body = JSON.stringify(ctx.request.body);

    }
)
.post('/:id/:lol', async (ctx) => {
    console.log(ctx.request.body)
    console.log(ctx.request.query)
    console.log(ctx.params)
    ctx.body = {a: 1}
})
.get('/get/:id/:lol', async (ctx) => {
    console.log(ctx.request.body)
    console.log(ctx.request.query)
    console.log(ctx.params)
    ctx.body = {a: 2}
})
.get("/api", (ctx) => {
    // console.log(ctx);
    // console.log(ctx.request);
    const params = ctx.request.query;
    console.log(params);
    // ctx.body = "hello Api";
    ctx.body = {
        name: params.name,
        age: params.age,
    };
});

app.use(router.routes()).use(router.allowedMethods());

const server = http2.createSecureServer(options, app.callback());
console.log('Listening on port 8080');
server.listen(8080);
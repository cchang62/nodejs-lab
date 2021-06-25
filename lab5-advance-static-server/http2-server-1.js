const http2 = require('http2');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const dir = path.join(__dirname, 'static');
const gzipTypes='csv|html|txt|js|css'
const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    csv: 'text/csv',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp:'image/webp',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

OnRequestHandler = (req, res) => {
    // const re = /\/(\w+)*/;
    // const re = /\/(\w+)*\/(\w+\.\w+)*/gm;
    const re = /\/(\w+\.\w+)*/gm;
    // /\/(\w+)*\/(\w+\.\w+)*/gm => match `/group1/group2.html` 
    // while $1 = group1 and $2 = group2.html
    isDownload = req.headers[":path"].includes('download')
    let reqPath = req.headers[":path"].replace(/\/download/, "")
    console.log(reqPath)
    let filename = reqPath.replace(re, "$1");
    if (filename === "" || filename === "/") {
        filename = 'index.html';
    }
    // let filename = req.headers[':path'].replace(/\/$/, '/index.html');
    let file = path.join(dir, filename);
    console.log(file)
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not Found');
    }
    let typeKey = path.extname(file).slice(1)
    let type = mime[typeKey] || 'text/plain';

    const raw = fs.createReadStream(file);

    let acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding) {
        acceptEncoding = '';
    }

    // https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-read-stream/
    // https://nodejs.org/api/stream.html#stream_writable_writablehighwatermark
    // https://www.eebreakdown.com/2016/10/nodejs-streams.html
    // Download Big CSV https://stackoverflow.com/questions/4771614/download-large-file-with-node-js-avoiding-high-memory-consumption/4785200 
    // Split Big Gzip File https://www.systutorials.com/how-to-split-a-gzip-file-to-several-small-ones-on-linux/ 
    // Process Large File https://www.vinaybhinde.in/2020/04/processing-large-files-in-node-js/ 
    // File Descriptor https://nodejs.dev/learn/working-with-file-descriptors-in-nodejs 
    raw.on('open', function () {
        if (isDownload){
            resHeaders = {
                'content-type': `${type}; charset=utf-8`,
                'content-disposition':  `attachment; filename= ${filename}`
            }
        }
        else {
            resHeaders = {
                'content-type': `${type}; charset=utf-8`
            }
        }
        
        
        if (gzipTypes.includes(typeKey)) {
            if (/\bgzip\b/.test(acceptEncoding)) {
                res.writeHead(200, Object.assign(resHeaders, { 'content-encoding': 'gzip' }));
                raw.pipe(zlib.createGzip()).pipe(res);
            } else {
                res.writeHead(200, Object.assign(resHeaders, { 'content-encoding': 'deflate' }));
                raw.pipe(zlib.createDeflate()).pipe(res);
            }
        }
        else {
            res.writeHead(200, resHeaders);
            /*
            res.writeHead(200, Object.assign(resHeaders, { 
                'content-encoding': 'deflate',
                // 'content-disposition':  `attachment; filename= ${filename}`  // For download 
            }));
            */
            raw.pipe(res);
            // raw.pipe(zlib.createDeflate()).pipe(res);
        }
        // raw.pipe(zlib.createGzip()).pipe(res);
    }).on('error', function () {
        // , { 'Content-Type': 'text/plain; charset=utf-8' }
        // res.writeHead(404)
        res.end('Not Found')
    });
}


const server = http2.createSecureServer(
    {
        key: fs.readFileSync('cert/node-localhost-privkey.pem'),
        cert: fs.readFileSync('cert/node-localhost-cert.pem'),
        allowHTTP1: true
    },
    OnRequestHandler
).listen(8443);
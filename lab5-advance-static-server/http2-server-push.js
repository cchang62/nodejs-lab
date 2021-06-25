//Ref. ***** from https://github.com/RisingStack/http2-push-example


const http2 = require('http2');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const helper = require('./helper');
const PORT = process.env.PORT || 8443;
const { HTTP2_HEADER_PATH } = http2.constants

const dir = path.join(__dirname, 'static');
const staticFiles = helper.getFiles(dir);
const gzipTypes='csv|html|txt|js|css';
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
    // console.log(reqPath)
    let filename = reqPath.replace(re, "$1");
    if (filename === "" || filename === "/") {
        // filename = 'index.html';
        onIndexRequest(req, res)
    } else {
        // let filename = req.headers[':path'].replace(/\/$/, '/index.html');
        let file = path.join(dir, filename);
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
        // Pushe Stream https://www.lmonkey.com/t/2QL7wdjLk 
        // Node.js Push Stream https://github.com/RisingStack/http2-push-example
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
                raw.pipe(res);
            }
        }).on('error', function () {
            res.end('Not Found')
        });

    }
    
}

function push(stream, filePath) { 
    const file = staticFiles.get(filePath);

    if (!file) {
        return
    }
    // const { file, headers } = getFile(filePath)
    
    const pushHeaders = { [HTTP2_HEADER_PATH]: filePath }
    // console.log(pushHeaders)

    stream.pushStream(pushHeaders, (err, pushStream) => {
        console.log("push")
        // console.log(pushStream)
        pushStream.respondWithFD(file.fileDescriptor, file.headers)
    })
}

function onIndexRequest (req, res) { 
    const file = staticFiles.get('/index.html');
    // console.log(file)
    // File not found
    console.log("echo")
    if (!file) {
        console.log("not found")
        res.statusCode = 404
        res.end()
        return
    }
    push(res.stream, '/script.js')
    push(res.stream, '/style.css')
    push(res.stream, '/mountain_view.jpg')
    push(res.stream, '/big-image.jpeg')

    // Serve file
    res.stream.respondWithFD(file.fileDescriptor, file.headers)
}

const server = http2.createSecureServer(
    {
        key: fs.readFileSync('cert/node-localhost-privkey.pem'),
        cert: fs.readFileSync('cert/node-localhost-cert.pem'),
        allowHTTP1: true
    },
    OnRequestHandler
); // .listen(8443);

server.listen(PORT, (err) => {
    if (err) {
    console.error(err)
    return
}

console.log(`Server listening on ${PORT}`)
})
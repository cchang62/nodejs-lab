const http2 = require('http2');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
// const { pipeline } = require('stream');


function myMiddleware(req, res) {
    // console.log(req)
    console.log("Hi middleware")
    console.log(res)
}

const server = http2.createSecureServer(
    {
        key: fs.readFileSync('cert/node-localhost-privkey.pem'),
        cert: fs.readFileSync('cert/node-localhost-cert.pem'),
        allowHTTP1: true
    },
    myMiddleware
);
const dir = path.join(__dirname, 'static');
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

server.on('error', (err) => {
    console.error(err);

});

server.on('stream', (stream, headers) => {
    // stream is a Duplex
    /*
    stream.respond({
        'content-type': 'text/html; charset=utf-8',
        ':status': 200
    });
    stream.end('<h1>Hello World</h1>');
    */


    function statCheck(stat, headers) {
        headers['last-modified'] = stat.mtime.toUTCString();
    }
    
    function onError(err) {
        // stream.respond() can throw if the stream has been destroyed by
        // the other side.
        try {
            if (err.code === 'ENOENT') {
                stream.respond({ ':status': 404 });
            } else {
                stream.respond({ ':status': 500 });
            }
        } catch (err) {
            // Perform actual error handling.
            console.log(err);
        }
        stream.end();
    }

    /*
    stream.respondWithFile('/some/file',
                            { 'content-type': 'text/plain; charset=utf-8' },
                            { statCheck, onError });
    */
    let acceptEncoding = headers['accept-encoding'];
    if (headers[":path"] === "/") {
        // https://nodejs.org/api/zlib.html#zlib_compressing_http_requests_and_responses
        
        
        if (/\bgzip\b/.test(acceptEncoding)) {
            /* 
            zlib.gzip(buffer, function(err, decoded) {
                console.log(decoded.toString());// gzip解压后的html文本
            })*/

            const fsResder = fs.createReadStream('./static/index.html');
            let bufs = [];
            fsResder.on("data", function(chunk) {
                bufs.push(chunk);
            });
            
            fsResder.on("end", function() {
                stream.respond({
                    'status': 200,
                    'content-type': 'text/html; charset=utf-8',
                    'content-encoding': 'gzip'
                });
                /*
                zlib.gzip(Buffer.concat(bufs), function(err, encoded) {
                    console.log(typeof(encoded))
                    console.log(err)
                    stream.end(encoded)
                })
                */
                const unzip = zlib.createGzip();
                fsResder.pipe(unzip).pipe(writeStream);
                // stream.end(Buffer.concat(bufs));

            });
        } else {
            stream.respondWithFile("./static/index.html");
        }
        
        // console.log(headers)
    }
    else {
        const re = /\/(\w+)*/;
        // /\/(\w+)*\/(\w+\.\w+)*/gm => match `/group1/group2.html` 
        // while $1 = group1 and $2 = group2.html
        const filename = headers[":path"].replace(re, "$1"); 
        // remove / in string so "/tree.webp" will become "tree.webp"
        console.log(filename);
        // console.log(headers)
        /*
        if (filename.indexOf(dir + path.sep) !== 0) {
            stream.respond({
                'content-type': 'text/plain; charset=utf-8',
                ':status': 403
            });
            stream.end(`err msg: Forbidden`);
            // return ctx.response.status(403).end('Forbidden');
        }
        */


        /** 
            const {Storage} = require('@google-cloud/storage');
            const storage = new Storage();
            const bucket = storage.bucket('my-bucket');

            const fs = require('fs');
            const remoteFile = bucket.file('image.png');
            const localFilename = '/Users/stephen/Photos/image.png';

            remoteFile.createReadStream()
            .on('error', function(err) {})
            .on('response', function(response) {
                // Server connected and responded with the specified status and headers.
            })
            .on('end', function() {
                // The file is fully downloaded.
            })
            .pipe(fs.createWriteStream(localFilename));
        */

        let type = mime[path.extname(filename).slice(1)] || 'text/plain';
        if (type === 'image/webp') {
            // https://ithelp.ithome.com.tw/articles/10221119
            const fsResder = fs.createReadStream(`./static/${filename}`);
            // let inputdata = '';
            let bufs = [];
            fsResder.on("data", function(chunk) {
                // inputdata += chunk;
                bufs.push(chunk);
                // https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer
                // https://ithelp.ithome.com.tw/articles/10221119
                /*
                stream.respond({
                    'content-type': `${type}; charset=utf-8`
                });
                stream.end(chunk);
                */  //OK but over the buffer size
            });
            
            fsResder.on("end", function() {
                // console.log(inputdata);
                /*
                stream.respondWithFile(
                    `./static/${filename}`, // failed: inputdata,
                    {
                        'content-type': `${type}; charset=utf-8`,
                    },
                    { statCheck, onError }
                )
                
                stream.respond({
                    'content-type': `${type}; charset=utf-8`
                });
                stream.end(inputdata);
                */
                stream.respond({
                    'content-type': `${type}; charset=utf-8`
                });
                // stream.pipe()
                stream.end(Buffer.concat(bufs));
                console.log("completed!!")
            });
            
            fsResder.on("error", function(err) {
                console.log("Get error in file read stream!!")
                console.log(err.stack);
                onError(err)
            });
        } else {
            stream.respondWithFile(
                `./static/${filename}`,
                {
                    'content-type': `${type}; charset=utf-8`,
                },
                { statCheck, onError }
            )
        }
    }
    /*
    stream.on('error', (error) => {
        console.error(error);
        stream.respond({
            'content-type': 'text/plain; charset=utf-8',
            ':status': 500
        });
        stream.end(`err msg: ${error}`);
    });
    */
});

server.listen(8443);
// const http2 = require('http2');
const { createSocket } = require('quic'); // Node.js is not ready for QUIC
const fs = require('fs');
const path = require('path');

const certOptions = ({
    key: fs.readFileSync('cert/node-localhost-privkey.pem'),
    cert: fs.readFileSync('cert/node-localhost-cert.pem')
});


const server = createSocket({
    // Bind to local UDP port 5678
    endpoint: { port: 5678 },
})
server.listen(certOptions)
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

server.on('session', (session) => {
    session.on('stream', (stream) => {
      // Echo server!
        stream.pipe(stream) 
    })
    const stream = session.openStream()
    stream.end('hello from the server')
})


// server.on('stream', (stream, headers) => {
//     function statCheck(stat, headers) {
//         headers['last-modified'] = stat.mtime.toUTCString();
//     }
//     
//     function onError(err) {
//         try {
//             if (err.code === 'ENOENT') {
//                 stream.respond({ ':status': 404 });
//             } else {
//                 stream.respond({ ':status': 500 });
//             }
//         } catch (err) {
//             // Perform actual error handling.
//             console.log(err);
//         }
//         stream.end();
//     }
// 
//     if (headers[":path"] === "/") {
//         stream.respondWithFile("./static/index.html");
//         console.log(headers)
//     }
//     else {
//         const re = /\/(\w+)*/;
//         // /\/(\w+)*\/(\w+\.\w+)*/gm => match `/group1/group2.html` 
//         // while $1 = group1 and $2 = group2.html
//         const filename = headers[":path"].replace(re, "$1"); 
//         // remove / in string so "/tree.webp" will become "tree.webp"
//         console.log(filename);
//         let type = mime[path.extname(filename).slice(1)] || 'text/plain';
//         if (type === 'image/webp') {
//             // https://ithelp.ithome.com.tw/articles/10221119
//             const fsResder = fs.createReadStream(`./static/${filename}`);
//             let bufs = [];
//             fsResder.on("data", function(chunk) {
//                 bufs.push(chunk);
//             });
//             
//             fsResder.on("end", function() {
//                 stream.respond({
//                     'content-type': `${type}; charset=utf-8`
//                 });
//                 stream.end(Buffer.concat(bufs));
//                 console.log("completed!!")
//             });
//             
//             fsResder.on("error", function(err) {
//                 console.log("Get error in file read stream!!")
//                 console.log(err.stack);
//                 onError(err)
//             });
//         } else {
//             stream.respondWithFile(
//                 `./static/${filename}`,
//                 {
//                     'content-type': `${type}; charset=utf-8`,
//                 },
//                 { statCheck, onError }
//             )
//         }
//     }
// });
// 
// server.listen(8443);

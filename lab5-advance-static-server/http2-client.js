const http2 = require('http2');
const fs = require('fs');
const client = http2.connect('https://localhost:8443', {
    ca: fs.readFileSync('cert/node-localhost-cert.pem')
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
    for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
    }
});

# Static-File Service in Node.js

## Pre-requisites

1. Node v12.18.4+
2. koa  v2.13.1

## Create key

```sh
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout node-localhost-privkey.pem -out node-localhost-cert.pem

# Generate public key
openssl rsa -in node-localhost-privkey.pem -out node-localhost-public.pem -pubout -outform PEM
```

## Ref

1. [Koa on GAP](https://cloud.google.com/community/tutorials/run-koajs-on-google-app-engine)
2. [Node exmaple on GCP](https://github.com/GoogleCloudPlatform/nodejs-docs-samples)
3. [Koa's Onion concept](https://medium.com/@rorast.power.game/%E5%9F%BA%E6%96%BCnodejs%E7%9A%84koa2%E5%9F%BA%E6%9C%AC%E6%95%99%E5%AD%B8-67d1ce0bb59a)
4. [koa tutorial](https://www.tutorialspoint.com/koajs/index.htm)
5. [express vs koa flow](https://www.huaweicloud.com/articles/7aa1e645bfde97aace9e8263d1319fd3.html)
6. [node-http2](https://github.com/nodejs/http2)
7. [js regex](https://stackoverflow.com/questions/56514040/javascript-regex-combinations-of-numbers-and-letters-i-except-1)
8. [Koa router with wildcard](https://github.com/koajs/router/pull/77/commits/69fc06f6c38704fc02166ee1d2102316e31d385b)
9. [Important - Http2 readStream example](https://nodejs.org/api/http2.html#http2_class_serverhttp2stream)
10. [Very Important - HTTP2/3 Tutorial](https://youtu.be/Kqgv4Xs8yDI?t=903)
11. [Node.js GCS client](https://googleapis.dev/nodejs/storage/latest/Bucket.html#getFilesStream)
12. [Node.js GCS client - CreateReadStream](https://googleapis.dev/nodejs/storage/latest/File.html#createReadStream)
13. [Node ReadStream](https://ithelp.ithome.com.tw/articles/10221119)
14. [Node.js Stream](https://nodesource.com/blog/understanding-streams-in-nodejs/)
15. [PGP Encryption](https://blog.xuite.net/towns/hc/402767236)
16. [Node PGP](https://www.npmjs.com/package/gpg)
17. [OpenPGP.js](https://github.com/openpgpjs/openpgpjs)


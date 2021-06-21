// Ref. 
// https://www.itread01.com/content/1529076015.html
// https://stackoverflow.com/questions/25172527/attempting-to-decrypt-using-crypto-js-and-nodejs 
// https://www.npmjs.com/package/simple-encryptor


var crypto = require('crypto');
//'aes192': crypto.randomBytes(192/8);
//'aes256': crypto.randomBytes(256/8);
var key = crypto.randomBytes(128/8);
var key_hex_str = key.toString('hex');
// var key1 = crypto.randomBytes(128/8);
var iv = crypto.randomBytes(128/8);
var algorithm = 'aes128';
console.log(key)
console.log(typeof(key))
console.log(`${key.length} bytes of key random data: ${key.toString('hex')}`);
console.log(`Verify key random data: ${key_hex_str}`);
console.log(iv)
console.log(`${iv.length} bytes of iv random data: ${iv.toString('hex')}`);
var key1 = Buffer.from(key_hex_str, "hex")

function encrypt(text){
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    // var crypted = cipher.update(text, 'utf-8', 'hex');
    var crypted = cipher.update(text, 'utf-8', 'base64');
    // return cipher.final('hex');
    // crypted += cipher.final('hex');
    crypted += cipher.final('base64');
    return crypted;
}

function decrypt(encrypted){
    var decipher = crypto.createDecipheriv(algorithm, key1, iv);
    // let decrypted = decipher.update(encrypted, 'hex','utf-8');
    let decrypted = decipher.update(encrypted, 'base64','utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

var content = 'hello';
let cont_json = {
    origin: "www.example.com",
    email: "user@example.com",
    path: "/bucket_1/xxx.webp"
}
var crypted = encrypt(content);
console.log( crypted );

var decrypted = decrypt( crypted );
console.log( decrypted );  // 輸出：utf8

var cryptedJson = encrypt(JSON.stringify(cont_json));
console.log(JSON.stringify(cont_json));
console.log( cryptedJson );
let urlEncoded = encodeURIComponent(cryptedJson) 
console.log(urlEncoded)
let urlDecoded = decodeURIComponent(urlEncoded)
console.log(urlDecoded)

var decryptedJson = decrypt( cryptedJson );
console.log( decryptedJson );  // 輸出：utf8

/*
Result:

<Buffer 2f f6 fc 1a 37 99 a6 46 70 ac a8 99 54 5d 05 19 b5 65 3e 9a 6b ab 01 90>
<Buffer 6e f5 f2 d9 1d 21 71 51 2f bf 98 26 dd 1c 8c f0>
6c79f30e525677b6d1da0a8505f253a7
hello
{"origin":"www.example.com","email":"user@example.com","path":"/bucket_1/xxx.webp"}
b9af70ed3992a56cc1f5f3ccace266526470a4ac947c2cfef16873931c339d616a26aa41d1172928df5c7fbd1c8191330b55b4434bd7f9f76499799afac1d62472345091e34b2ac17ba810a56799f71bb8a3bcd207574296da8ce7acf656528f
{"origin":"www.example.com","email":"user@example.com","path":"/bucket_1/xxx.webp"}
*/
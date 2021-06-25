// Ref. 
// https://www.itread01.com/content/1529076015.html
// https://stackoverflow.com/questions/25172527/attempting-to-decrypt-using-crypto-js-and-nodejs 
// https://www.npmjs.com/package/simple-encryptor


// Encryptor
var crypto = require('crypto');
var secret = 'secret';


var cipher = crypto.createCipher('aes192', secret); // (node:31890) [DEP0106] DeprecationWarning: crypto.createCipher is deprecated.
var content = 'hello';
var cryptedContent;

cipher.update(content);
// cryptedContent = cipher.final('hex');
cryptedContent = cipher.final('base64');
console.log(cryptedContent);
// 輸出：
// 71d30ec9bc926b5dbbd5150bf9d3e5fb // hex

// Decryptor
var decipher = crypto.createDecipher('aes192', secret); // (node:31890) [DEP0106] DeprecationWarning: crypto.createCipher is deprecated.
var decryptedContent;

// decipher.update(cryptedContent, 'hex');
decipher.update(cryptedContent, 'base64');
decryptedContent = decipher.final('utf8');
console.log(decryptedContent);


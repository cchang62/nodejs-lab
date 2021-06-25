// Ref. 
// https://www.itread01.com/content/1529076015.html
// https://stackoverflow.com/questions/25172527/attempting-to-decrypt-using-crypto-js-and-nodejs 

var crypto = require('crypto');
var fs = require('fs');
var privateKey = fs.readFileSync('cert/node-localhost-privkey.pem');  // 私鑰
var publicKey = fs.readFileSync('cert/node-localhost-public.pem');  // 公鑰
var algorithm = 'RSA-SHA256';  // 加密算法 vs 摘要算法

// 數字簽名
function sign(text){
    var sign = crypto.createSign(algorithm);
    sign.update(text);
    return sign.sign(privateKey, 'hex');    
}

// 校驗簽名
function verify(oriContent, signature){
    var verifier = crypto.createVerify(algorithm);
    verifier.update(oriContent);
    return verifier.verify(publicKey, signature, 'hex');
}

// 對內容進行簽名
var content = 'hello world xxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxxworldxxxxxxxxxxx';
var signature = sign(content);
console.log(signature);
// 0a9fc2a48268f3b191ce90a61fd1757c8b5795cea1213fc92422b337d7a93adb922364a221c491ad869f59fae471666d86045cc02cf45d2076cd3840dac7f3db69ad428f43461c8bc462cf86e7539126c9b36536f2f1d03e9a3a5e3e035bfdb80b1634c208f6c0d292b96277c54d5506e67d2b15b5e9090caa3f06e748917c5b72838281b73225e691dde92e13ff228a018de5f8a675fd25a1805f13d86197cd255c7dbe2a58045e6488ce14912eb30c541f80c6e4f9120208cb3908b4ea10e3618ce0e36bdd7ac7e3a4949d22a4199f6dd6d48a4837e1ee35b2597d37e399b625504321f05625311291fbfeff7b9b862761f569c2c4f48d51db76a9b33cb404

// 校驗簽名，如果通過，返回true
var verified = verify(content, signature);
console.log(verified);

/*
Result: 
0a9fc2a48268f3b191ce90a61fd1757c8b5795cea1213fc92422b337d7a93adb922364a221c491ad869f59fae471666d86045cc02cf45d2076cd3840dac7f3db69ad428f43461c8bc462cf86e7539126c9b36536f2f1d03e9a3a5e3e035bfdb80b1634c208f6c0d292b96277c54d5506e67d2b15b5e9090caa3f06e748917c5b72838281b73225e691dde92e13ff228a018de5f8a675fd25a1805f13d86197cd255c7dbe2a58045e6488ce14912eb30c541f80c6e4f9120208cb3908b4ea10e3618ce0e36bdd7ac7e3a4949d22a4199f6dd6d48a4837e1ee35b2597d37e399b625504321f05625311291fbfeff7b9b862761f569c2c4f48d51db76a9b33cb404
true
*/

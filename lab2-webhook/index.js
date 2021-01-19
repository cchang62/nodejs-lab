/**
 * {@link https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads github payloads}
 * {@link https://gist.github.com/stigok/57d075c1cf2a609cb758898c0b202428 githook.js}
 * {@link https://sendgrid.com/docs/for-developers/tracking-events/nodejs-code-example/}
 * {@link https://codingsans.com/blog/node-config-best-practices}
 * {@link https://gist.github.com/millermedeiros/4724047 shell helper}
 * {@link https://www.npmjs.com/package/shelljs shelljs}
 */

// Import libs
const express = require("express")
const bodyParser = require("body-parser");
const config = require('config');
const crypto = require('crypto');
const projectEnv = require('dotenv').config().parsed;

// Initialize vars and config
const app = express()
/*
//app.configure() is no longer part of Express 4.
app.configure(function(){ 
    app.set('PORT', process.env.PORT || 3000);
    app.use(bodyParser.json());
});
*/

const PORT = process.env.PORT || 3000;  // `PORT=8080 node index.js`, Node will use process.env.PORT which equals to 8080 in this example
/*let { hashAlgo, sigHeaderName } = config.get('AlgoFamily.sha1');
if (process.env.NODE_ENV == 'production') { // without the specific setting, the default of NODE_ENV is 'development'
    let { hashAlgo, sigHeaderName } = config.get('AlgoFamily.sha256');
    // OR 
    // const { sha256: { hashAlgo, sigHeaderName } } = config.get('AlgoFamily');
}
else {
    let { hashAlgo, sigHeaderName } = config.get('AlgoFamily.sha1');
}
*/
const { hashAlgo, sigHeaderName } = process.env.NODE_ENV == 'production' ? config.get('AlgoFamily.sha256') : config.get('AlgoFamily.sha1');
const webhookSecret = projectEnv['webhook_secret']
const userAgent = projectEnv['user_agent']
const repoName = projectEnv['repo_name']
const appRoot = projectEnv['app_root']


// Set up using body-parser to parse request body to a json object
app.use(bodyParser.json())

function verifyRequest(req, res, next) {
    const payload = JSON.stringify(req.body)
    if (!payload) {
        return next('The request has empty body.')
    }
    const reqUserAgent = req.get('User-Agent')
    if (!reqUserAgent.includes(userAgent)) {
        return next('The request is not allowed!!')
    }
    const reqRepo = req.body.repository.name
    if (!reqRepo.includes(repoName)) {
        return next('The repo is not matched!!')
    }

    const sig = req.get(sigHeaderName) || ''
    const hmac = crypto.createHmac(hashAlgo, webhookSecret)
    const digest = Buffer.from( hashAlgo + '=' + hmac.update(payload).digest('hex'), 'utf8')
    const checksum = Buffer.from(sig, 'utf8')
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`)
    }
    return next()
}

function singleCmdExecutor(cmd, cb){
    let child_process = require('child_process');
    let parts = cmd.split(/\s+/g);
    let p = child_process.spawn(parts[0], parts.slice(1), {stdio: 'inherit'});
    p.on('exit', function(code){
        let err = null;
        if (code) {
            err = new Error('command "'+ cmd +'" exited with wrong status code "'+ code +'"');
            err.code = code;
            err.cmd = cmd;
        }
        if (cb) {
            cb(err);
        }
    });
};

function seriesCmdExecutor(cmds, cb) {
    let execNext = () => {
        singleCmdExecutor(cmds.shift(), function(err) {
            if (err) {
                cb(err);
            } 
            else {
                if (cmds.length) {
                    execNext();
                } else {
                    cb(null);
                }
            }
        });
    };
    execNext();
};


app.post("/webhook", verifyRequest, (req, res) => {
    console.log(req.headers)
    console.log(req.body)
    seriesCmdExecutor([
        `cd ${appRoot}`,
        'ls -alh .',
        'cat ./jsconfig-1.json'
    ], (err) => {   // callback function
        if (err) {
            console.log(`\nExecuting cmds are failed at ${err}`);
            res.status(500).end()
        }
        else {
            console.log(`\nexit 0`); 
            res.status(200).end()
        }
    });
    // res.status(200).end()
})


app.use((err, req, res, next) => {
    if (err) console.error(err)
    res.status(403).send('Request body was not signed or verification failed')
})

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
// app.listen(app.get('PORT'), () => console.log(`🚀 Server running on port ${app.get('PORT')}`))
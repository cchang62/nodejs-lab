// Import libs

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
/*
seriesCmdExecutor([
    `cd /Users/Jibamy/Projects/nodejs-lab/lab2-webhook/config
    pwd
    ls -alh .`,
    'ls -alh .',
    'cat ./default.json'
], (err) => {   // callback function
    if (err) {
        console.log(`\nExecuting cmds are failed at ${err}`); 
    }
    else {
        console.log(`\nexit 0`); 
    }
});
*/

let testCmd = `cd /Users/Jibamy/Projects/nodejs-lab/lab2-webhook/config
pwd
ls -alh .`;

const cmdExecutor = require('child_process').exec;
/**
cmdExecutor(testCmd, function(err, stdout, stderr) {
    console.log(stdout);
})

*/
const { execFile } = require('child_process');
const child = execFile('bash', ['./cmd/app_cd.sh', '/Users/Jibamy/.ssh/webhook_demo_rsa', '/Users/Jibamy/Projects/webhook-demo'], (error, stdout, stderr) => {
    if (error) {
        console.error('stderr',  stderr);
        throw error;
    }
    console.log(stdout);
});
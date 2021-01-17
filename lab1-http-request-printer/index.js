
const http = require('http');

const server = http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF

        response.on('error', (err) => {
            console.error(err);
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        console.log({ headers, method, url, body })
        const responseBody = { headers, method, url, body };
        // const responseBody = { body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))

        // END OF NEW STUFF
    });
}).listen(8080,  process.argv[2] || "0.0.0.0", ()=> {
    console.log(`Server is listening at http://${server.address().address}, \nPort is ${server.address().port}`)
    // console.log('Listening on port ' + server.address().port);
});

// OK // console.log('Server listening:', `http://${server.address().address}:${server.address().port}`);


/*
Ref. https://stackoverflow.com/questions/29412303/how-to-bind-http-server-with-express-object-to-a-specific-ip-address

0.0.0.0 is not an actual IP that you can reach. Although it means bind to all IPs, or any IP. So no wonder it works for 127.0.0.1. If you have set an IP address on one of your network devices (LAN, WiFi, virtual) it'll listen on those too.

In python you can simply type runserver 0.0.0.0 or something, so in Node.js is there an alternative?

process.argv gives you a list of arguments passed to node.

So if you run
$ node server.js 0.0.0.0
You'll get
> process.argv[0] //=> "node" 
> process.argv[1] //=> "server.js" 
> process.argv[2] //=> "0.0.0.0" 
Note that it's an array, so as long as you're sure you'll be running your file like that you can use process.argv[2] to specify that as the IP address you want to listen to.

http.listen(3000, process.argv[2]);
Generally though, you should set environment variable IP.

http.listen(3000, process.env[IP]);
Or all of them

http.listen(3000, process.argv[2] || process.env[IP] || "0.0.0.0");
*/
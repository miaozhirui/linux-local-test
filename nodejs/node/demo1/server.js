var http = require('http');
var url = require('url');


function start (router, handle) {
    http.createServer(onRequest).listen(8080);

    function onRequest(req, res) {
        res.writeHead(200,{'Content-type':'text/plain'});
        var pathname = url.parse(req.url).pathname;
        var content = router(handle,pathname)
        res.write(content);
        res.end();
    }
}

exports.start = start;

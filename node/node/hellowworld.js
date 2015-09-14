
var http = require('http');
                  require('./test');
var fs = require('fs');
fs.mkdirSync('a.js', 0755);
fs.open('text.txt','w')
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end();

}).listen(8888);
// console.log(http)
console.log('Server running at http://127.0.0.1:8888/');

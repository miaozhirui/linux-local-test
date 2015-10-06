var server = require('./server');
var router = require('./router');
var requestHandles = require('./requestHandles');

var handles = {}
handles['/'] = requestHandles.start;
handles['/start'] = requestHandles.start;
handles['/upload'] = requestHandles.upload;

server.start(router.router, handles);
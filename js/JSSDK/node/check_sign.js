var sign = require('./sign.js');

// console.log(sign('jsapi_ticket', 'http://example.com'));
console.log(sign('sM4AOVdWfPE4DxkXGEs8VMISHwA9mkpGYabcZG4CpXAs0Mo6eVzq_jr3JkQzBXCb39ekE0fDJLXjMajETnvN2Q', 'http://purple-local.com/activity/mother_day/index.html'));
/*
 *something like this
 *{
 *  jsapi_ticket: 'jsapi_ticket',
 *  nonceStr: '82zklqj7ycoywrk',
 *  timestamp: '1415171822',
 *  url: 'http://example.com',
 *  signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
 *}
 */

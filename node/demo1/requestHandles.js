function start() {
    console.log('start');
    return 'hello start';
}
function upload() {
    console.log('upload')
    return 'hello upload'
}

exports.start = start;
exports.upload = upload;
function router(handle, pathname) {
    console.log('about a route a request for'+ pathname);
    if(typeof handle[pathname] === 'function'){
       return  handle[pathname]();
    } else {
        console.log('request for '+pathname+'not found');
        return '404 not fund';
    }
}

exports.router = router;
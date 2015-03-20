var _ = {
    isFunction: function(value) {
        return typeof value === 'function';
    },
    isArray: function(obj) {
        //这个方法可以判断具体的数据类型
        return Object.prototype.toString.call(obj) === '[object Array]'
    }
}
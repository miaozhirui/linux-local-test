(function() {
    var parseScript, getQuery, getBase;

    parseScript = (function() {
        var scripts = document.getElementsByTagName('script'),
            configSrc;
        for (var i = 0; i < scripts.length; i++) {
            configSrc = scripts[i].getAttribute('data-config');
            if (configSrc) break;
        }
        return function(callback) {
            if (typeof callback == 'function') {
                return callback(configSrc);
            }
        }
    })();

    getQuery = (function() {

        var temp = parseScript(function(configSrc) {
            var queryIndex = configSrc.indexOf('?');
            var query = configSrc.slice(queryIndex + 1);
            if (!query) return '';
            var querys = query.split('=');
            if (querys.length < 2) {
                return '';
            }
            var temp = {};
            temp[querys[0]] = querys[1];
            return temp;
        });

        return function(name) {
            return name ? (temp[name] || '') : temp;
        }
    })();

    getBase = (function() {
        var value = parseScript(function(configSrc) {
            var url;
            if (~configSrc.indexOf('//')) {
                url = configSrc.split('//');
                return url[0] + '//' + url[1].split('/')[0];
            } else {
                return '';
            }
        });

        return function() {
            return value;
        }
    })();

    var config = {
        plugins: ['shim'],
        debug: true,
        base:getBase() + '/js/',
        map: [
        ],
        vars: {
        },
        alias: {
            'jquery': 'libs/jquery-1.8.3',
            'ept': 'libs/ept_all',
            'lodash': 'libs/lodash',
            'ko': 'libs/knockout-3.2.0',
            'juicer': 'libs/juicer'
    },
     preload: ['jquery','lodash']

}
    seajs.config(config);
})();


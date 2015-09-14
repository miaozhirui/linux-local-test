define(function(require) {

    //设置默认zPREFACE，防止报错
    var zPREFACE = this['zPREFACE'] || {};

    zPREFACE['NAME'] = zPREFACE['NAME'] || '';
    zPREFACE['API'] = zPREFACE['API'] || {};
    zPREFACE['DATA'] = zPREFACE['DATA'] || {};
    zPREFACE['LOADJS'] = typeof zPREFACE['LOADJS'] == 'undefined' ? true : !!zPREFACE['LOADJS']; //是否加载js

    this['zPREFACE'] = zPREFACE;
    var boot;
    boot = {
        _mapping   : {},
        pageKey    : function (key) {
            key = key || 'NAME';
            return zPREFACE[key];
        },
        pageValue  : function (value) {
            value = value || this.pageKey();
            return value;
        },
        file       : 'init',
        prefix     : './pages',
        setPath    : function (key, value) {
            this._mapping[key] = value;
        },
        getPath    : function (key) {
            return this._mapping[key];
        },
        addSlash   : function (str) {
            str = $.trim(str);
            var endChar = str.charAt(str.length - 1);
            return endChar.indexOf('/') == -1 ? str + '/' : str;
        },
        addPrefix  : function (prefix) {
            prefix = prefix || this.prefix;
            return this.addSlash(prefix);
        },
        getPagePath: function (path, prefix) {
            path = path || this.getPath(this.pageKey());

            if (!path) {
                return false;
            }

            return this.addPrefix(prefix) + this.addSlash(path);
        },
        init       : function () {
            this.setPath(this.pageKey(), this.pageValue());
            return this;
        },
        run        : function () {
            var path = this.getPagePath();
            if (!path || !zPREFACE['LOADJS']) {
                return false;
            }

            var boot = path + this.file;
            require.async(boot, function (initCallback) {
                typeof initCallback == 'function' && initCallback();
            });
        }
    };
    boot.init();

    boot.run();
});

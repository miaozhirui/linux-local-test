/**
 * @author _your_name
 * @description App Framework plugin template
 * @copyright _your_company
 *
 * wusheng: you must implement your plugin like this
 */
// please replace _plugin_ with the name of your plugin
;(function($) {
    //internal cache of objects
    var cache = {};
    //Plugin constructor for AF
    $.fn["_plugin_"] = function(opts) {
        if (this.length == 0) return;
        opts = opts || {};
        //Loop through the AF object and setup each item
        for (var i = 0; i < this.length; i++) {
            this[i]._plugin_id = this[i]._plugin_id || $.uuid();
            if (!cache[this[i]._plugin_id])
                cache[this[i]._plugin_id] = new _plugin_(this[i], opts);
            tmp = cache[this[i]._plugin_id];
        }
        return this.length == 1 ? tmp : this;
    }
    //Actual plugin object
    var _plugin_ = function(el, opts) {
        this.el = el;
        this.$el = $(el);
        var self = this;
        //destroy gets called on DOM nodes so we can clean up
        //the JS object
        $(this.$el).one("destroy", function(e) {
            if (cache[self._plugin_id])
                delete cache[self._plugin_id];
        });
    };
    //Prototype for the plugin
    _plugin_.prototype = {
    };
})(af); 
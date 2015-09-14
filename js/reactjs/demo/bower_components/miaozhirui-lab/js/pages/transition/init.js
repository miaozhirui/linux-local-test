define(function(require) {
    var when = require('libs/when');
    $('.box div').each(function(i, ele) {
        var $ele = $(ele);
        $ele.addClass('transition');
    });

})
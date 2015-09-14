define(function(require) {
    var $ele = $('.box a');

    var Prompt = function(ele, opt) {
        this.ele = ele;
        this.opt = opt;

        this.init();

        this.$ele.on('mouseover', $.proxy(this.showInfo, this))
    }

    Prompt.prototype = {
        constructor : Prompt,
        init: function() {
            this.$ele = $(this.ele);
        },
        showInfo: function() {
            this.createBox();
        },
        createBox: function() {
            var Prompt = $('<div></div>');
            
            
        }
    }

    $.extend($.fn, {
        prompt: function(opt) {
            var defautl = {

            };
            var opt = $.extend(defautl, opt);

            this.each(function() {
                new Prompt(this, opt)
            })
        }
    })


    $('a').prompt()
})
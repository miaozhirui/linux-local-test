// require jquery.ui, juicer
/**
 * <div class="dialog">dialog</div>
 * @type {[type]}
 */
$.fn.dialogbox = function(options, context) {

    options = options || {};

    var defaults = {
        theme: 'fashion-dialog-box', //'m-dialog-box'|'fashion-dialog-box'
        autoOpen: false,
        useForm: false,
        position: 'center', // 'center'|function($dialog) {}
        modal: true, //是否是模态
        draggable: true,
        title: 'Title',
        btnOK: 'Ok', //如果是false不出现
        btnCancel: 'Cancel', //如果是false不出现
        btnReset: false, //默认没有reset
        overlay: '<div class="dialog-overlay"></div>',
        template: 
            '<div class="${theme}">\
                <div class="box-header">\
                    <h3 class="title">${title}</h3>\
                    <a class="close" href="javascript://;">\
                        <span class="i16 ico-delete"></span>\
                    </a>\
                </div>\
                <div class="box-body">\
                    <div class="box-inner">$${content}</div>\
                </div>\
                <div class="box-footer">\
                    {@if ok}\
                        <button type="submit" class="btn-26 primary btn-ok">$${ok}</button>\
                    {@/if}\
                    {@if cancel}\
                        <button type="button" class="btn-26 btn-cancel">$${cancel}</button>\
                    {@/if}\
                    {@if reset}\
                        <button type="button" class="btn-26 btn-reset">${reset}</button>\
                    {@/if}\
                </div>\
            </div>',
        open: function($dialog) {},
        close: function($dialog) {},
        ok: function(e, $dialog) {},
        cancel: function(e, $dialog) {},
        reset: function(e, $dialog) {}
    };

    if ($.isPlainObject(options)) {
        options = $.extend(true, defaults, options);
    }


    function updateDialog($dialog, options, updatePosition) {
        var $header = $dialog.find('.box-header');
        var $content = $dialog.find('.box-body');
        var $footer = $dialog.find('.box-footer');

        var outHeight = $content.outerHeight(true) 
            + $header.outerHeight(true) 
            + $footer.outerHeight(true);
        var outWidth = $content.outerWidth(true);

        updatePosition = typeof updatePosition === 'undefined' ? true : !!updatePosition;
      
        $dialog.css({
            'width': outWidth,
            'height': outHeight
        });

        if (options.position === 'center' && updatePosition) {
            $dialog.css({
                'left': document.documentElement.clientWidth / 2 - $dialog.width() / 2,
                // 'top': document.documentElement.clientHeight / 2 - $dialog.height() / 2,
                'top': $(window).height() /2 - $dialog.height() / 2
            });
        }
        if (typeof options.position === 'function') {
            $dialog.css(options.position($dialog));
        }

    }

    var triggerEvent = {
        close: function($dialog, $overlay, options, context) {
            $overlay.hide();
            $dialog.hide();
            options.close($dialog, context);

            return this;
        },
        open: function($dialog, $overlay, options, context) {
            $overlay.show();
            $dialog.show();

            updateDialog($dialog, options);

            options.open($dialog, context);

            return this;
        },
        resize: function($dialog, $overlay, options, context) {
            
            updateDialog($dialog, options, false);

            return this;
        }
    };

    this.each(function() {

        var $this = $(this);
        var $overlay = $this.data('overlay') || $.fn;
        var $dialog = $this.data('dialog') || $.fn;

        if (typeof options === 'string') {
            return triggerEvent[options]($dialog, $overlay, $this.data('options'), context);
        }

        var title = options.title;
        var ok = options.btnOK;
        var cancel = options.btnCancel;
        var reset = options.btnReset;
        var theme = options.theme;

        var html = juicer(options.template, {
            title: title,
            ok: ok,
            cancel: cancel,
            reset: reset,
            theme: theme
        });

        if (options.modal) {
            $overlay = $(options.overlay).appendTo('body').hide();
            $overlay.css({
                'position': 'fixed',
                'background': '#000',
                'left': 0,
                'top': 0,
                'width': '100%',
                'height': '100%',
                'opacity': '0.2',
                'filter': 'opacity(alpha=20)',
                'z-index': '9200'
            });
        }
        
        var $dialog = $(html).appendTo('body').hide();

        $dialog.css({
            'position': 'fixed',
            'left': 0,
            'top': 0,
            'z-index': '9201'

        });

        $dialog.find('.box-inner').html($this); //用元素直接替换

        if (options.draggable) {
            $dialog.draggable({
                containment: 'parent',
                handle: $dialog.find('.title')
            });
        }
        //如果使用form，则在模板中添加form表单，并且将事件ok回调绑定form的submit事件上。
        if(options.useForm){
            $dialog.children().wrapAll('<form/>');
            $dialog.children('form').on('submit', function(e){
                options.ok(e, $dialog);
                return false;
            });
        }else{
            $dialog.on('click', '.btn-ok', function(e) {
                options.ok(e, $dialog);
            });
        }
        $dialog.on('click', '.btn-cancel, .close', function(e) {
            triggerEvent.close($dialog, $overlay, options);
            options.cancel(e, $dialog);
        });

        $dialog.on('click', '.btn-reset', function(e) {
            options.reset(e, $dialog);
        });

        if (options.autoOpen) {
            triggerEvent.open($dialog, $overlay, options);
        }

        //数据存起来给open, close用
        $this.data('dialog', $dialog);
        $this.data('options', options);
        $this.data('overlay', $overlay); 

    });

    return this;

};
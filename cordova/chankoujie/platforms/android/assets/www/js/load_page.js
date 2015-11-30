/**
 * load one page cnt:
 * ajax return:
 * {title:'xxx', cnt: 'xxx', cache_time:xxx}
 */
(function($) {
    $.loadPage = {
        cfg: {
            pageKey:'',
            key:null,
            panelInited:false
        },

        init: function(options) {
            $("#load_page").bind("loadpanel",function(e) {
                $.ui.setTitle('');
                
                $.loadPage.panelInit();
                var params = $.query("#load_page").data('params'),
                    key  = params[0];
                $.loadPage.cfg.pageKey = 'load_page_' + key;
                
                $.loadPage.cfg.key = key;
                
                var page = null;
                if(!$.vv.cfg.debug) page = $.vv.ls.get($.loadPage.cfg.pageKey);
                
                if(page && page.info && page.info.length > 100) { 
                    renderPage(page, true);
                    $('#load_page').css('opacity', '1');
                } else {
                    $.vv.tip({icon:'loading'}); 
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=loadpage&a=index&key='+key,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                renderPage(r.data);
                            } else {
                                $.loadPage.cfg.key = null; //make use it will load this page again
                                $('#load_page .page_cnt').html('');
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.loadPage.cfg.key = null;
                            $('#load_page .page_cnt').html('');
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                }
            });
            
            $("#load_page").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
            
            function renderPage (page, nocache) {
                if(!page) {
                    $('#load_page .page_cnt').html('内容不存在!');
                } else {
                    $.ui.setTitle(page.title);
                    $('#load_page .page_cnt').attr('class', 'page_cnt '+page.cntClass).html(page.info);
                    $('#load_page').css('opacity', '1');
                    
                    if(!nocache) $.vv.ls.set($.loadPage.cfg.pageKey, page, page.cache);
                    $('#load_page').scroller().scrollToTop(); 
                }
            }
        },
        
        panelInit: function() {
            if( $.loadPage.cfg.panelInited === true ) return;
            $.query('#load_page').attr('scrollTgt', '#load_page').addClass('scroll_nobar');            
            $.loadPage.cfg.panelInited = true;
        },
    };
    $.loadPage.init();
})(af);
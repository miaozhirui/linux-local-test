(function($){
    $.settingIdx = {
        cfg: {
            id: 0,
            panelInited: false,
            loadingEitem: 'n'
        },

        init: function(options) {
            $("#setting_index").bind("loadpanel",function(e) {
                 if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                $.settingIdx.panelInit();
                $.query("#setting_index").scroller().scrollToTop(0);
                $.settingIdx.setSet();
            });
        },
        
        panelInit:function() {
            if( $.settingIdx.cfg.panelInited === true ) return;
            
            $('#setting_index').attr('scrollTgt', '#setting_index');
            $('#setting_index').on('click', '#JclearDataCache', function(e){
                e.stopPropagation();e.preventDefault();
                $.ui.popup( {
                    title:"清除缓存",
                    message:"确定清除缓存的应用数据吗？",
                    cancelText:"取消",
                    cancelCallback: null,
                    doneText:"清除",
                    supressFooter:false,
                    cancelClass:'button',
                    doneClass:'button',
                    doneCallback: function () {
                        if(window.cache) window.cache.clear( 
                            function(){$.vv.tip({content:'清除缓存数据成功', icon:'success'});}, 
                            function(){$.vv.tip({content:'清除缓存数据失败', icon:'error'});}
                        );
                    },
                    cancelOnly:false,
                    blockUI:true
                });
            });
            
            $.settingIdx.cfg.panelInited = true;
        },
        setSet:function() {
           
        }
    };
    $.settingIdx.init();
})(af);
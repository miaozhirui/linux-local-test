//diary publish
(function($) {
    $.diaryPublish = {
        cfg: {
            dryId:0,
            panelInited:false,
            needReset: true
        },

        init: function(options) {
            $("#diary_publish").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#diary_publish").data('params'),
                    dotData={}, diaryId = numOnly(params[0]); 
                    
                $.diaryPublish.panelInit();
                
                if(diaryId > 0 && !e.data.goBack) {
                    $.diaryPublish.cfg.dryId = diaryId;
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JdiaryPublishForm').get(0), false, true);
                    $.diaryPublish.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=diary&a=publish&did='+diaryId,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                $.diaryPublish.resetForm(r.data);
                                if(r.data.diary['intro']) {
                                    var intro = $('#JdiaryPublishForm textarea[name=cnt]').get(0);
                                    if(intro.scrollHeight > 45) intro.style.height=intro.scrollHeight + 'px';
                                }
                            } else {
                                $.diaryPublish.resetForm({});
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.diaryPublish.resetForm({});
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                } else if(!diaryId && $.diaryPublish.cfg.dryId) {
                    $.diaryPublish.cfg.dryId = 0;
                    $.diaryPublish.cfg.needReset = true;
                }
                
                if($.diaryPublish.cfg.needReset) $.diaryPublish.resetForm({});
            });
            $("#diary_publish").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.diaryPublish.cfg.panelInited === true ) return;
            $.query('#diary_publish').attr('scrollTgt', '#diary_publish').addClass('scroll_nobar');
            $.diaryPublish.publishFormInit($.query('#JdiaryPublishForm'), '#diary_publish');
            $.vv.ui.onPressed('#diary_publish');
            
            $.diaryPublish.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            $.cleanUpContent($('#JdiaryPublishForm').get(0), false, true);
            if(!$.isFunction($.diaryPublish.dotRenderPublishDiaryFrm)) {
                $.diaryPublish.dotRenderPublishDiaryFrm = doT.template(document.getElementById('JdotPublishDiary').text);
            } 
            data.dryId = $.diaryPublish.cfg.dryId;
            $('#JdiaryPublishForm').html($.diaryPublish.dotRenderPublishDiaryFrm(data));
            if($.os.android && $.os.androidVersion < 4.4) $("#diary_publish .ipt_box .ipt").css('width', ($.vv.cfg.cWidth - 50) + 'px'); //>>> workaround
            $.diaryPublish.cfg.needReset = false;
        },
        
        publishFormInit: function(form, ctx) {            
            var uploading = false;
            //upload diary
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JdiaryPublishForm');
                if(!f.find('*[name=title]').val().trim()){$.vv.tip({content:'请输入标题', icon:'error'});return false;}
                if(!f.find('*[name=cnt]').val().trim()){$.vv.tip({content:'请输入主题内容', icon:'error'});return false;}

                if(uploading) return;
                else uploading = true;
                $.vv.tip({icon:'loading'});

                $.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    dataType: "json",
                    success: function(r){
                        $.vv.tip({close:true}); 
                        if(r.status == 0){
                            $.diaryPublish.cfg.needReset = true;
                            $.vv.tip({content:r.msg, icon:'success'}); 
                            window.setTimeout(function(){$.ui.loadContent(r.data.href, false, false, $.ckj.cfg.formTrans);}, 2000);
                        } else {
                            $.vv.tip({content:r.msg, icon:'error'}); 
                        }
                        uploading = false;
                    },
                    error: function(xhr, why) {
                        if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        uploading = false;
                    }
               });
            });
        }
    };
    $.diaryPublish.init();
})(af);
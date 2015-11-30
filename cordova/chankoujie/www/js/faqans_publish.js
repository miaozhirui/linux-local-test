//faqans publish
(function($) {
    $.faqansPublish = {
        cfg: {
            aid:0,
            fid:0,
            panelInited:false,
            needReset: true
        },

        init: function(options) {
            $("#faqans_publish").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#faqans_publish").data('params'),
                    dotData={}, idType = params[0], faqId=0, faqansId=0;
                if(idType == 'fid') faqId = numOnly(params[1]);
                else faqansId = numOnly(params[1]);
               
                $.faqansPublish.cfg.fid = faqId; 
                    
                $.faqansPublish.panelInit();
                
                if(faqansId > 0 && !e.data.goBack) {
                    $.faqansPublish.cfg.aid = faqansId;
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JfaqansPublishForm').get(0), false, true);
                    $.faqansPublish.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=faqans&a=publish&aid='+faqansId,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                $.faqansPublish.resetForm(r.data);
                                if(r.data.faqans['intro']) {
                                    var intro = $('#JfaqansPublishForm textarea[name=cnt]').get(0);
                                    if(intro.scrollHeight > 45) intro.style.height=intro.scrollHeight + 'px';
                                }
                            } else {
                                $.faqansPublish.resetForm({});
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.faqansPublish.resetForm({});
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                } else if(!faqansId && $.faqansPublish.cfg.aid) {
                    $.faqansPublish.cfg.aid = 0;
                    $.faqansPublish.cfg.needReset = true;
                }
                
                if($.faqansPublish.cfg.needReset) $.faqansPublish.resetForm({});
            });
            $("#faqans_publish").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.faqansPublish.cfg.panelInited === true ) return;
            $.query('#faqans_publish').attr('scrollTgt', '#faqans_publish').addClass('scroll_nobar');
            $.faqansPublish.publishFormInit($.query('#JfaqansPublishForm'), '#faqans_publish');
            $.vv.ui.onPressed('#faqans_publish');
            
            $.faqansPublish.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            $.cleanUpContent($('#JfaqansPublishForm').get(0), false, true);
            if(!$.isFunction($.faqansPublish.dotRenderPublishFaqansFrm)) {
                $.faqansPublish.dotRenderPublishFaqansFrm = doT.template(document.getElementById('JdotPublishFaqans').text);
            } 
            data.fid = $.faqansPublish.cfg.fid;
            data.aid = $.faqansPublish.cfg.aid;
            $('#JfaqansPublishForm').html($.faqansPublish.dotRenderPublishFaqansFrm(data));
            if($.os.android && $.os.androidVersion < 4.4) $("#faqans_publish .ipt_box .ipt").css('width', ($.vv.cfg.cWidth - 50) + 'px'); //>>> workaround
            $.faqansPublish.cfg.needReset = false;
        },
        
        publishFormInit: function(form, ctx) {            
            var uploading = false;
            //upload faqans
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JfaqansPublishForm');
                if(!f.find('*[name=info]').val().trim()){$.vv.tip({content:'请输入答案', icon:'error'});return false;}

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
                            $.faqansPublish.cfg.needReset = true;
                            $.vv.tip({content:r.msg, icon:'success'}); 
                            $.faqDtl.needRefresh = true;
                            window.setTimeout(function(){$.ui.goBack();}, 2000);
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
    $.faqansPublish.init();
})(af);
//faq publish
(function($) {
    $.faqPublish = {
        cfg: {
            subId:0,
            panelInited:false,
            needReset: true
        },

        init: function(options) {
            $("#faq_publish").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#faq_publish").data('params'),
                    dotData={},  faqId = numOnly(params[0]);
                    
                $.faqPublish.panelInit();
                
                if(faqId > 0 && !e.data.goBack) {
                    $.faqPublish.cfg.subId = faqId;
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JfaqPublishForm').get(0), false, true);
                    $.faqPublish.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=faq&a=publish&id='+faqId,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                //console.log(r.data);
                                $.faqPublish.resetForm(r.data);
                                if(r.data.faq['src_desc']) {
                                    var desc = $('#JfaqPublishForm textarea[name=desc]').get(0);
                                    if(desc.scrollHeight > 250) desc.style.height=desc.scrollHeight + 'px';
                                }
                            } else {
                                $.faqPublish.resetForm({});
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.faqPublish.resetForm({});
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                } else if(!faqId && $.faqPublish.cfg.subId) {
                    $.faqPublish.cfg.subId = 0;
                    $.faqPublish.cfg.needReset = true;
                }
                
                if($.faqPublish.cfg.needReset) $.faqPublish.resetForm({});
            });
            $("#faq_publish").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.faqPublish.cfg.panelInited === true ) return;
            $.query('#faq_publish').attr('scrollTgt', '#faq_publish').addClass('scroll_nobar');
            $.faqPublish.publishFormInit($.query('#JfaqPublishForm'), '#faq_publish');
            $.vv.ui.onPressed('#faq_publish');
            
            $.faqPublish.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            $.cleanUpContent($('#JfaqPublishForm').get(0), false, true);
            if(!$.isFunction($.faqPublish.dotRenderPublishFaqFrm)) {
                $.faqPublish.dotRenderPublishFaqFrm = doT.template(document.getElementById('JdotPublishFaq').text);
            } 
            data.grpId = $.faqPublish.cfg.grpId;
            data.subId = $.faqPublish.cfg.subId;
            $('#JfaqPublishForm').html($.faqPublish.dotRenderPublishFaqFrm(data));
            if($.os.android && $.os.androidVersion < 4.4) $("#faq_publish .ipt_box .ipt").css('width', ($.vv.cfg.cWidth - 50) + 'px'); //>>> workaround
            $.faqPublish.cfg.needReset = false;
        },
        
        publishFormInit: function(form, ctx) {            
            var uploading = false;
            //upload faq
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JfaqPublishForm');
                if(!f.find('*[name=title]').val().trim()){
                    $.vv.tip({content:'请输入标题', icon:'error'});
                    return false;
                }
                var rewards = f.find('*[name=rewards]').val().trim();
                if(rewards && !/^\d+$/.test(rewards)){
                    $.vv.tip({content:'奖赏必须为数字', icon:'error'});
                    return false;
                }

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
                            $.faqPublish.cfg.needReset = true;
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
    $.faqPublish.init();
})(af);

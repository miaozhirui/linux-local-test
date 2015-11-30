//subject share
(function($) {
    $.subjectShare = {
        cfg: {
            subId:0,
            grpId:0,
            panelInited:false,
            needReset: true
        },

        init: function(options) {
            $("#subject_share").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#subject_share").data('params'),
                    dotData={}, idType = params[0], groupId=0, subjectId=0;
                if(idType == 'gid') groupId = numOnly(params[1]);
                else subjectId = numOnly(params[1]);
               
                $.subjectShare.cfg.grpId = groupId; 
                    
                $.subjectShare.panelInit();
                
                if(subjectId > 0 && !e.data.goBack) {
                    $.subjectShare.cfg.subId = subjectId;
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JsubjectShareform').get(0), false, true);
                    $.subjectShare.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=subject&a=share&sid='+subjectId,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                //console.log(r.data);
                                $.subjectShare.resetForm(r.data);
                                if(r.data.subject['src_cnt']) {
                                    var cnt = $('#JsubjectShareform textarea[name=cnt]').get(0);
                                    if(cnt.scrollHeight > 250) cnt.style.height=cnt.scrollHeight + 'px';
                                }
                            } else {
                                $.subjectShare.resetForm({});
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.subjectShare.resetForm({});
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                } else if(!subjectId && $.subjectShare.cfg.subId) {
                    $.subjectShare.cfg.subId = 0;
                    $.subjectShare.cfg.needReset = true;
                }
                
                if($.subjectShare.cfg.needReset) $.subjectShare.resetForm({});
            });
            $("#subject_share").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.subjectShare.cfg.panelInited === true ) return;
            $.query('#subject_share').attr('scrollTgt', '#subject_share').addClass('scroll_nobar');
            $.subjectShare.shareFormInit($.query('#JsubjectShareform'), '#subject_share');
            $.vv.ui.onPressed('#subject_share');
            
            $.subjectShare.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            $.cleanUpContent($('#JsubjectShareform').get(0), false, true);
            if(!$.isFunction($.subjectShare.dotRenderShareSubjectFrm)) {
                $.subjectShare.dotRenderShareSubjectFrm = doT.template(document.getElementById('JdotShareSubject').text);
            } 
            data.grpId = $.subjectShare.cfg.grpId;
            data.subId = $.subjectShare.cfg.subId;
            $('#JsubjectShareform').html($.subjectShare.dotRenderShareSubjectFrm(data));
            if($.os.android && $.os.androidVersion < 4.4) $("#subject_share .ipt_box .ipt").css('width', ($.vv.cfg.cWidth - 50) + 'px'); //>>> workaround
            $.subjectShare.cfg.needReset = false;
        },
        
        shareFormInit: function(form, ctx) {            
            var uploading = false;
            //upload subject
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JsubjectShareform');
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
                            $.subjectShare.cfg.needReset = true;
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
    $.subjectShare.init();
})(af);

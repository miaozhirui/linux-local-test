//setting cover
(function($) {
    $.settingCover = {
        cfg: {
            panelInited:false,
            needReset: true
        },

        init: function(options) {
            $("#setting_cover").bind("loadpanel",function(e) {
                $.settingCover.panelInit();
                
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the first loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }

                if($.settingCover.cfg.needReset) {
                    $.settingCover.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=user&a=cover',
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            if(r.status == 0) {
                                //console.log(r.data);
                                var url = r.data, upBtn = $('#setting_cover #JuserCoverUpBox'), absWrap = upBtn.closest('.JuserCoverUpAbs');
                                $.vv.log('>>>>>>>>>>>>>>>> url:: '+url);
                                if(url){
                                    if(!absWrap.hasClass('up_img_renew')){
                                        absWrap.removeClass('up_img_abs');
                                        absWrap.addClass('up_img_renew');
                                        upBtn.find('span').html('<i class="fa fa-rotate-left pink"></i>');
                                    }
                                    upBtn.closest('.J_upImgWrap').find('.J_preview').html('<img src="'+url+'" />');
                                } else {
                                    if(absWrap.hasClass('up_img_renew')){
                                        absWrap.removeClass('up_img_renew');
                                        absWrap.addClass('up_img_abs');
                                        upBtn.find('span').html('+上传个人封面');
                                    }
                                    upBtn.closest('.J_upImgWrap').find('.J_preview').html('');
                                }
                            } else {
                                $.vv.tip({content:r.msg, icon:'error'});
                            }
                        },
                        error: function(xhr, why) {
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                }
            });
            $("#setting_cover").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.settingCover.cfg.panelInited === true ) return;
            
            $.ckj.hooks.logout.push(function(){
                if($.settingCover)
                    $.settingCover.cfg.needReset = true;
            });
            
            var canceling = false;
            //cancel cover
            $('#setting_cover').on('click', '.cancel_cover', function () {
                if(canceling) return;
                else canceling = true;
                $.ajax({
                    url: $.ckj.cfg.mapi + '/?m=user&a=cancle_cover',
                    type:'GET',
                    dataType: "json",
                    success: function(r) {
                        if(r.status == 0) {
                            $.vv.tip({content:'成功取消', icon:'success'});
                            var upBtn = $('#setting_cover #JuserCoverUpBox'), absWrap = upBtn.closest('.JuserCoverUpAbs');
                            if(absWrap.hasClass('up_img_renew')) {
                                absWrap.removeClass('up_img_renew');
                                absWrap.addClass('up_img_abs');
                                upBtn.find('span').html('+上传个人封面');
                            }
                            upBtn.closest('.J_upImgWrap').find('.J_preview').html('');
                        } else {
                            $.vv.tip({content:r.msg, icon:'error'});
                        }
                        canceling = false;
                    },
                    error: function(xhr, why) {
                        if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        canceling = false;
                    }
                });
            });
            
            $.settingCover.upUserCover($('#setting_cover #JuserCoverUpBox'), 'cover');
            $.settingCover.cfg.panelInited = true;
        },
        
        upUserCover: function(ele) {
            //console.log('>>>>>>>>>>>>>>upUserCover:: '+$(ele).next('input').attr('id'));
            $(ele).uploader({
                actionUrl: $.ckj.cfg.mapi + '/?m=user&a=upload_cover',
                btnId: $(ele).attr('id'),
                upFileName:'cover',
                ctx:'#afui',
                progressBox: $(ele).closest('.J_upImgWrap').find('.J_preview'),
                onSubmit: function(){
                    //this refer to this uploader
                    var upBtn = $(this.upBtnEl), absWrap = upBtn.closest('.JuserCoverUpAbs');
                    if(!absWrap.hasClass('up_img_renew')){
                        absWrap.removeClass('up_img_abs');
                        absWrap.addClass('up_img_renew');
                        upBtn.find('span').html('<i class="fa fa-rotate-left pink"></i>');
                    }
                },
                onComplete: function(r) {
                    //console.log('>>>>>>>>>>>>>>this.inputId:: '+this.inputId);
                    //this refer to this uploader
                    var upBtn = $(this.upBtnEl);
                    if(r.status == 0) {
                        upBtn.closest('.J_upImgWrap').find('.J_preview').html('<img src="'+r.data+'?rnd='+(new Date()).getTime()+'" />');
                        $.ckj.refresh.cover = true;
                        if(window.cache)window.cache.clear(null, null);
                    }else{
                        $.vv.tip({content:r.msg, icon:'error', ctx:'#setting_cover'});
                        upBtn.closest('.J_upImgWrap').find('.J_preview').html('');
                    }
                },
                onProgress: function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                      this.progressBox.html(parseInt((progressEvent.loaded / progressEvent.total)*100) + '%');
                    } else {
                        this.progressBox.html((progressEvent.loaded));
                    }
                },
                onError: function(msg){
                     $.vv.tip({content:msg, icon:'error'});
                }
            });
        }
    };
    $.settingCover.init();
})(af);
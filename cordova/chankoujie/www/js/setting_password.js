//setting password
(function($) {
    $.settingPassword = {
        cfg: {
            panelInited:false
        },

        init: function(options) {
            $("#setting_password").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                $.settingPassword.panelInit();
            });
        },
        
        panelInit: function() {
            if( $.settingPassword.cfg.panelInited === true ) return;
            $.settingPassword.passwordFormInit($.query('#JsettingPasswordForm'), '#setting_password');
            $.vv.ui.onPressed('#setting_password');
            
            $.settingPassword.cfg.panelInited = true;
        },
        
        passwordFormInit: function(form, ctx) {            
            var uploading = false;
            //upload setting
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JsettingPasswordForm');
                var oldP = f.find('*[name=oldpassword]').val().trim(),
                    newP = f.find('*[name=password]').val().trim(), 
                    reP = f.find('*[name=repassword]').val().trim();
                if(oldP.length < 6 || oldP.length > 20){$.vv.tip({content:'请输入正确的旧密码', icon:'error'}); return false;}
                if(newP.length < 6 || newP.length > 20){$.vv.tip({content:'新密码格式不正确', icon:'error'}); return false;}
                if(newP != reP){$.vv.tip({content:'新旧密码不一致', icon:'error'}); return false;}

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
                            var f = $('#JsettingPasswordForm');
                            f.find('*[name=oldpassword]').val('');
                            f.find('*[name=password]').val('');
                            f.find('*[name=repassword]').val('');
                            $.settingPassword.cfg.needReset = true;
                            $.vv.tip({content:r.msg, icon:'success'}); 
                            window.setTimeout(function(){
                                $.ckj.logOut(true, 2);
                            }, 2000);
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
    $.settingPassword.init();
})(af);
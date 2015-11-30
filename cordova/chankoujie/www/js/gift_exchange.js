//gift exchange
(function($) {
    $.giftExchange = {
        cfg: {
            id:0,
            num:0,
            panelInited: false
        },

        init: function(options) {
            $("#gift_exchange").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the fisub loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#gift_exchange").data('params'),
                    dotData={}, id = numOnly(params[0]), num = numOnly(params[1]), title = params[2];
               
                $.giftExchange.cfg.id   = id; 
                $.giftExchange.cfg.num  = num; 
                $.ui.setTitle('兑换'+decodeURIComponent(title));
                //console.log(title);
                $.giftExchange.panelInit();
                
                if(!e.data.goBack) {
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JgiftExchangeForm').get(0), false, true);
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=exchange&a=get_address',
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                //console.log(r.data);
                                $.giftExchange.resetForm(r.data);
                                
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
            
            $("#gift_exchange").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.giftExchange.cfg.panelInited === true ) return;
            $.query('#gift_exchange').attr('scrollTgt', '#gift_exchange');
            $.giftExchange.exchangeFormInit($.query('#JgiftExchangeForm'), '#gift_exchange');
            
            $.giftExchange.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            $.cleanUpContent($('#JgiftExchangeForm').get(0), false, true);
            if(!$.isFunction($.giftExchange.dotRenderExchangeGiftFrm)) {
                $.giftExchange.dotRenderExchangeGiftFrm = doT.template(document.getElementById('JdotGiftExchange').text);
            } 
            $('#JgiftExchangeForm').html($.giftExchange.dotRenderExchangeGiftFrm(data));
        },
        
        exchangeFormInit: function(form, ctx) {            
            var uploading = false;
            //upload gift
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JgiftExchangeForm');
                if(numOnly(f.find('*[name=address_id]:checked').val()) < 1){
                    if(!/^[a-zA-Z\u4E00-\u9FA5\s]+$/.test(f.find('*[name=consignee]').val().trim())){ //中文、字母、空格
                        $.vv.tip({content:'收件人只能是中文,字母,空格组成', icon:'error'});
                        return false;
                    }
                    if(!/^(1)[0-9]{10}$/.test(f.find('*[name=mobile]').val().trim())){
                        $.vv.tip({content:'手机号为11位数字', icon:'error'});
                        return false;
                    }
                    if(!/^\d{6}$/.test(f.find('*[name=zip]').val().trim())){
                        $.vv.tip({content:'6位数字邮编格式不正确', icon:'error'});
                        return false;
                    }
                    if(!/^[a-zA-Z0-9\u4E00-\u9FA5\s_-]+$/.test(f.find('*[name=address]').val().trim())){
                        $.vv.tip({content:'地址不正确', icon:'error'});
                        return false;
                    }
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
                            $.vv.tip({content:r.msg, icon:'success'}); 
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
    $.giftExchange.init();
})(af);

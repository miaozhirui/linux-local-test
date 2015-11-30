//rstrnt share
(function($) {
    $.rstrntShare = {
        cfg: {
            rstId:0,
            panelInited:false,
            needReset: true
        },

        init: function(options) {
            $("#rstrnt_share").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the first loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#rstrnt_share").data('params'),
                    rstrntId = numOnly(params[0]), dotData={};
                
                $.rstrntShare.panelInit();
                
                if(rstrntId > 0 && !e.data.goBack) {
                    $.rstrntShare.cfg.rstId = rstrntId;
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JrstrntShareForm').get(0), false, true);
                    $.rstrntShare.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=rstrnt&a=share&id='+rstrntId,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0) {
                                //console.log(r.data);
                                $.rstrntShare.resetForm(r.data);
                                if(r.data.rstrnt['intro']) {
                                    var intro = $('#JrstrntShareForm textarea[name=intro]').get(0);
                                    if(intro.scrollHeight > 45) intro.style.height=intro.scrollHeight + 'px';
                                }
                            } else {
                                $.rstrntShare.resetForm({});
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.rstrntShare.resetForm({});
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                } else if(!rstrntId && $.rstrntShare.cfg.rstId) {
                    $.rstrntShare.cfg.rstId = 0;
                    $.rstrntShare.cfg.needReset = true;
                }
                
                if($.rstrntShare.cfg.needReset) $.rstrntShare.resetForm({});
            });
            $("#rstrnt_share").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
            });
        },
        
        panelInit: function() {
            if( $.rstrntShare.cfg.panelInited === true ) return;
            
            if(!$.fn.nextAll){
                $.fn.nextAll = function() {
                    var arr = new Array(),
                        idx = 0,
                        node = this[0].nextSibling;
                    for (; node; node = node.nextSibling) {
                        arr.push(node);
                        //console.log('nextSibling Loop:: '+idx);
                        idx++;
                    }
                    return $(arr);
                };
            }
            
            //multilevel-linkage-menu
            $.fn.cateSelect = function(options) {
                var cfg = {
                    field: 'JshareRstrntCateId',
                    top_option: '-请选择-',
                    ctx:'#rstrnt_share'
                };
                if(options) {
                    $.extend(cfg, options);
                }
                var self = $(this),
                    pid = self.attr('data-pid'),
                    uri = self.attr('data-uri'),
                    selected = self.attr('data-selected'),
                    selected_arr = [];
                if(selected != undefined && selected != '0'){
                    if(selected.indexOf('|')){
                        selected_arr = selected.split('|');
                    }else{
                        selected_arr = [];
                    }
                }

                self.nextAll().remove();
                $.getJSON(uri, {id:pid}, function(r){//>>>1 init top select option
                    if(r.status == 0){
                        var optHtml = '', selId = 0;
                        if(selected_arr.length > 0 && selected_arr[0] > 0) selId = selected_arr[0];
                        else optHtml = '<option value="0" selected="true">'+cfg.top_option+'</option>';
                        for(var i=0; i < r.data.length; i++) {
                            if(selId == r.data[i].id)
                                optHtml += '<option value="'+r.data[i].id+'" selected="true">'+r.data[i].name+'</option>';
                            else 
                                optHtml += '<option value="'+r.data[i].id+'">'+r.data[i].name+'</option>';
                            self.html(optHtml);
                        }
                    }
                    
                    if(selected_arr.length > 0 && selected_arr[0] > 0){
                        setTimeout(function(){
                            self.trigger('change');
                        }, 5);
                    }
                });
        
                var j = 1;
                $(cfg.ctx).off('change').on('change', '.J_cate_select', function(){
                    var _this = $(this),
                        _pid = _this.val();
                        _this.nextAll().remove();
                    var opt = _this.find('option[value="'+_pid+'"]'),
                              addr = opt.text();
                              _this.css('width', (13*addr.length+24)+'px');
                    //console.log('======triggerSelectedAddr:: '+opt.text() + '====triggerSelectedVal:: '+_pid);
                    if(_pid != ''){
                        $.getJSON(uri, {id:_pid}, function(r){
                            if(r.status == 0) {
                                var _optHtml = '<select class="J_cate_select mr10" data-pid="'+_pid+'" data-preseed="true">',
                                    _selId   = 0,
                                    _select  = null;
                                    
                                if(selected_arr[j]) _selId = selected_arr[j];
                                else _optHtml += '<option value="0" selected="true">'+cfg.top_option+'</option>'; 

                                for(var i=0; i<r.data.length; i++){
                                    if(_selId == r.data[i].id)
                                        _optHtml += '<option value="'+r.data[i].id+'" selected="true">'+r.data[i].name+'</option>';
                                    else 
                                        _optHtml += '<option value="'+r.data[i].id+'">'+r.data[i].name+'</option>';
                                }
                                
                                _optHtml+='</selected>';
                              
                                _select = $(_optHtml);
                                _select.insertAfter(_this);
                                
                                if(selected_arr[j] != undefined){
                                    setTimeout(function() {
                                        _select.trigger('change'); //>>>3 continue to trigger
                                    }, 5);
                                }
                                j++;
                            }
                        });
                        $('#'+cfg.field).val(_pid);
                    }else{
                        $('#'+cfg.field).val(_this.attr('data-pid'));
                    }
                });
            }
            
            $.query('#rstrnt_share').attr('scrollTgt', '#rstrnt_share').addClass('scroll_nobar');
            $.rstrntShare.shareFormInit($.query('#JrstrntShareForm'), '#rstrnt_share');
            $.vv.ui.onPressed('#rstrnt_share');

            $.rstrntShare.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            data.ajaxAddrsUrl = $.ckj.cfg.mapi + '/?m=rstrnt&a=childaddrs';
            $.cleanUpContent($('#JrstrntShareForm').get(0), false, true);
            if(!$.isFunction($.rstrntShare.dotRenderShareRstrntFrm)) {
                $.rstrntShare.dotRenderShareRstrntFrm = doT.template(document.getElementById('JdotShareRstrnt').text);
            } 
            $('#JrstrntShareForm').html($.rstrntShare.dotRenderShareRstrntFrm(data));
            $('#JrstrntShareForm .J_cate_select').cateSelect();
            
            $.rstrntShare.upRstrntPic($('#rstrnt_share #J_shareRstrntCover'), 'cover');
            $('#rstrnt_share #JrstrntAttachsList .J_attach .J_shareRstrntAttach').each(function(){
                $.rstrntShare.upRstrntPic(this, 'attach');
            });
            if($.os.android && $.os.androidVersion < 4.4) $("#rstrnt_share .rst_attr .ipt").css('width', ($.vv.cfg.cWidth - 50) + 'px'); //>>> workaround
            
            $.rstrntShare.cfg.needReset = false;
        },
        
        shareFormInit: function(form, ctx) {            
            function addRstrntAttach(idx) {
                //save the max img num
                var attachWrap     = $('#JrstrntShareForm .J_attachs');
                idx = numOnly(idx);
                if(idx < 1) {
                    idx = numOnly(attachWrap.attr('nextidx'));
                    idx = idx < 1 ? 1 : idx;
                }
                
                attachWrap.attr('nextidx', idx + 1);
                var attach   = $.query('#rstrnt_share #JshareRstrntAttachCopy > li').clone();
                attach.appendTo(attachWrap);
                //uploader
                var upPicBtn = attach.find('.J_shareRstrntAttach');
                upPicBtn.attr('id', 'J_shareRstrntAttach_'+idx);
                attach.find('input').attr('id', 'J_shareRstrntAttachIpt_'+idx);
                $.rstrntShare.upRstrntPic(upPicBtn);
                setAttachAddDel();
                
                return;
            }

            function delRstrntAttach(attach){
                attach = $(attach);
                if($('#rstrnt_share #JrstrntAttachsList .J_attach').length < 2) {
                    $.vv.tip({content:'没有步骤街友怎么学呢？', icon:'warning'});
                    return false;
                }
                if(attach.find('textarea').val().trim()){
                    $.ui.popup( {
                        title:"删除附图",
                        message:"您确定要删除该餐馆附图吗？",
                        cancelText:"取消",
                        cancelCallback: null,
                        doneText:"确定",
                        supressFooter:false,
                        cancelClass:'button',
                        doneClass:'button',
                        doneCallback: function (){
                            $.cleanUpContent(attach, true, true);
                            $(attach).css3Animate({
                                x: "-"+$.vv.cfg.cWidth+"px",
                                time: "350ms",
                                complete: function () {
                                    $(attach).remove();
                                    $('#rstrnt_share').scroller().correctScroll();
                                    setAttachAddDel();
                                }
                            });
                        },
                        cancelOnly:false,
                        blockUI:true
                    });
                }
            }
            
            function setAttachAddDel() {
                var attachs = $('#rstrnt_share #JrstrntAttachsList .J_attach'), len = attachs.length - 1;
                $.each(attachs, function(i, attach){
                    //console.log('>>>>>>>>>>>>>>>i:: '+i+' >>>> len:: '+len);
                    if(i != len) $(attach).find('.JaddDelAttach').removeClass('fa-plus').addClass('fa-times');
                    else $(attach).find('.JaddDelAttach').removeClass('fa-times').addClass('fa-plus');
                });
            }
                  
            $(ctx).on('swipeLeft', '.J_attachs > .J_attach', function(e){
                e.stopPropagation();e.preventDefault();
                if($(this).find('.JaddDelAttach').hasClass('fa-times'))delRstrntAttach(this);
            });
            
            $(ctx).on('click', '.JaddDelAttach', function(e) {
                e.stopPropagation();e.preventDefault();
                if($(this).hasClass('fa-times')){
                    delRstrntAttach($(this).closest('.J_attach'));
                } else {
                    addRstrntAttach();
                    //$('#rstrnt_share').scroller().scrollToBottom(200);
                }
            });

            var uploading = false;
            //upload rstrnt
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JrstrntShareForm');

                if(!f.find('*[name=name]').val().trim()){$.vv.tip({content:'餐馆名不能为空：最多32字符', icon:'error'});return false;}
                if(!f.find('*[name=addr_id]').val().trim()){$.vv.tip({content:'必须选择餐馆地址', icon:'error'});return false;}
                if(f.find('*[name=branch]').val().length > 32){$.vv.tip({content:'分店名最多32字符', icon:'error'});return false;}
                if(f.find('*[name=alias]').val().length > 32){$.vv.tip({content:'别名最多32字符', icon:'error'});return false;}
                if(f.find('*[name=street_addr]').val().length < 4 ){$.vv.tip({content:'街道地址必填(4-32个字符)', icon:'error'});return false;}
                if(f.find('*[name=near]').val().length > 64){$.vv.tip({content:'餐馆靠近最多64字符', icon:'error'});return false;}
                if(f.find('*[name=cost]').val().length > 8){$.vv.tip({content:'人均消费最多8字符', icon:'error'});return false;}
                if(f.find('*[name=phone]').val().length > 64){$.vv.tip({content:'电话最多64字符', icon:'error'});return false;}
                if(f.find('*[name=intro]').val().length > 512){$.vv.tip({content:'餐馆介绍最多512字符', icon:'error'});return false;}

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
                            $.rstrntShare.cfg.needReset = true;
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
        },
        
        upRstrntPic: function(ele, type){
            type = type || 'attach';
            //console.log('>>>>>>>>>>>>>>upRstrntPic:: '+$(ele).next('input').attr('id'));
            $(ele).uploader({
                actionUrl: $.ckj.cfg.mapi + '/?m=rstrnt&a=upimg&t='+type,
                btnId: $(ele).attr('id'),
                inputId: $(ele).next('input').attr('id'), //for record the img url from server
                upFileName:'img',
                ctx:'#afui',
                progressBox: $(ele).closest('.J_upImgWrap').find('.J_preview'),
                onSubmit: function(){
                    //this refer to this uploader
                    var upBtn = $(this.upBtnEl), absWrap = upBtn.closest('.J_shareRstrntImg_abs');
                    if(!absWrap.hasClass('up_img_renew')){
                        absWrap.removeClass('up_img_abs');
                        absWrap.addClass('up_img_renew');
                        upBtn.find('span').html('<i class="fa fa-rotate-left pink"></i>');
                    }
                    
                    //upBtn.closest('.J_upImgWrap').find('.J_preview').html('<i class="fa fa-spinner fa-spin" style=" font-size:22px; color:#666;"/>');
                },
                onComplete: function(r) {
                    //console.log('>>>>>>>>>>>>>>this.inputId:: '+this.inputId);
                    //this refer to this uploader
                    var upBtn = $(this.upBtnEl);
                    if(r.status == '0') {
                        $.query('#'+this.inputId).val(r.data.img);
                        if(type == 'cover')
                            upBtn.closest('.J_upImgWrap').find('.J_preview').html('<img onload="$.ckj.centerImg(this, 200);" src="'+r.data.src+'" />');
                        else 
                            upBtn.closest('.J_upImgWrap').find('.J_preview').html('<img onload="$.ckj.centerImg(this, 90);" src="'+r.data.src+'" />');
                    }else{
                        $.vv.tip({content:r.msg, icon:'error', ctx:'#rstrnt_share'});
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
    $.rstrntShare.init();
})(af);

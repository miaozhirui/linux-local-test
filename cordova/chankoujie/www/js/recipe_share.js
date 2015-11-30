//recipe share
(function($) {
    $.recipeShare = {
        cfg: {
            rciId:0,
            panelInited:false,
            needReset: true
        },
        
        rciAttr: {
            cook_time:{'lt15':'1刻钟左右', 'lt30':'2刻钟左右', 'lt45':'3刻钟左右', 'lt60':'1小时左右', 'gt60':'大于1小时'},
            difficulty:{'easy':'初级', 'normal':'普通', 'advanced':'高级', 'expert':'专家'},
            taste:{ "1":"酸", "2":"甜", "3":"辣", "4":"咸", "5":"香", "6":"苦", "7":"鲜", "8":"咖喱", "9":"麻辣", "10":"孜然", "11":"清淡", 
                    "12":"酸辣", "13":"香辣", "14":"酸甜", "15":"香酥", "16":"奶香", "17":"鱼香", "18":"蒜香", "19":"五香", "20":"椒盐", 
                    "21":"变态辣", "22":"怪味", "23":"甜辣", "24":"爽口", "25":"微辣", "26":"香甜"},
            tech:{ "1":"煎", "2":"炒", "3":"炸", "4":"红烧", "5":"煮", "6":"蒸", "7":"烧烤", "8":"焖", "9":"炖", "10":"拌", "11":"烙",
                   "12":"腌", "13":"焗", "14":"卤", "15":"榨汁", "16":"烤", "17":"烩", "18":"煲", "19":"免烤"},
            tools:{ "1":"烤箱", "2":"微波炉", "3":"电饭煲", "4":"豆浆机", "5":"电饼铛", "6":"高压锅", "7":"料理盒", "8":"塔吉锅", "9":"炒锅", 
                    "10":"煮锅", "11":"平底锅", "12":"蒸锅", "13":"不粘锅", "14":"汤锅", "15":"砂锅", "17":"压力锅", "18":"焖烧锅", "19":"搅拌机", 
                    "20":"瓦煲", "21":"电磁炉", "22":"烤炉", "23":"炖盅", "24":"咖啡机", "25":"酸奶机", "26":"吐司炉", 
                    "27":"面包机", "28":"调酒器", "29":"果冻模", "30":"奶泡机", "31":"模具锅", "32":"打蛋器", "33":"榨汁机"}
        },
    
        init: function(options) {
            $("#recipe_share").bind("loadpanel",function(e) {
                if(!$.ckj.user.id) { 
                    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the first loadpanel 
                        return;
                    }
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return;
                }
                
                var params   = $.query("#recipe_share").data('params'),
                    recipeId = numOnly(params[0]), dotData={};
                
                $.recipeShare.panelInit();
                
                if(recipeId > 0 && !e.data.goBack) {
                    $.recipeShare.cfg.rciId = recipeId;
                    $.vv.tip({icon:'loading'}); 
                    $.cleanUpContent($('#JrecipeShareform').get(0), false, true);
                    $.recipeShare.cfg.needReset = false;
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=recipe&a=share&id='+recipeId,
                        type:'GET',
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status == 0){
                                //console.log(r.data);
                                $.recipeShare.resetForm(r.data);
                                if(r.data.recipe['intro']) {
                                    var intro = $('#JrecipeShareform textarea[name=intro]').get(0);
                                    if(intro.scrollHeight > 45) intro.style.height=intro.scrollHeight + 'px';
                                }
                                if(r.data.recipe['tips']) {
                                    var tips = $('#JrecipeShareform textarea[name=tips]').get(0);
                                    if(tips.scrollHeight > 45) tips.style.height=tips.scrollHeight + 'px';
                                }
                                
                            } else {
                                $.recipeShare.resetForm({});
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                        },
                        error: function(xhr, why) {
                            $.recipeShare.resetForm({});
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
                } else if(!recipeId && $.recipeShare.cfg.rciId) {
                    $.recipeShare.cfg.rciId = 0;
                    $.recipeShare.cfg.needReset = true;
                }
                
                if($.recipeShare.cfg.needReset) $.recipeShare.resetForm({});
                
                $.recipeShare.setAttrClick();
            });
            $("#recipe_share").bind("unloadpanel",function(e) {
                var sheet = $.ui.actionsheet();
                if(sheet){sheet.hide();}
                $.vv.ui.toggleTrans3dBlk(true);
                $.recipeShare.offAttrClick();
            });
        },
        
        panelInit: function() {
            if( $.recipeShare.cfg.panelInited === true ) return;
            $.query('#recipe_share').attr('scrollTgt', '#recipe_share').addClass('scroll_nobar');
            $.recipeShare.shareFormInit($.query('#JrecipeShareform'), '#recipe_share');
            $.vv.ui.onPressed('#recipe_share');
            $.recipeShare.cfg.panelInited = true;
        },
        
        resetForm:function(data) {
            $.cleanUpContent($('#JrecipeShareform').get(0), false, true);
            if(!$.isFunction($.recipeShare.dotRenderShareRecipeFrm)) {
                $.recipeShare.dotRenderShareRecipeFrm = doT.template(document.getElementById('JdotShareRecipe').text);
            } 
            $('#JrecipeShareform').html($.recipeShare.dotRenderShareRecipeFrm(data));
            
            $.recipeShare.upRecipePic($('#recipe_share #J_shareRecipeCover'), 'cover');
            $('#recipe_share #JrecipeStepsList .J_step .J_shareRecipeStep').each(function(){
                $.recipeShare.upRecipePic(this, 'step');
            });
            
            $.recipeShare.cfg.needReset = false;
        },
            
        shareFormInit: function(form, ctx) {            
            function addRecipeStep(idx) {
                //save the max img num
                var stepWrap     = $('#JrecipeShareform .J_steps');
                idx = numOnly(idx);
                if(idx < 1) {
                    idx = numOnly(stepWrap.attr('nextidx'));
                    idx = idx < 1 ? 1 : idx;
                }
                
                stepWrap.attr('nextidx', idx + 1);
                var step   = $.query('#recipe_share #JshareRecipeStepCopy > li').clone();
                step.appendTo(stepWrap);
                //uploader
                var upPicBtn = step.find('.J_shareRecipeStep');
                upPicBtn.attr('id', 'J_shareRecipeStep_'+idx);
                step.find('input').attr('id', 'J_shareRecipeStepIpt_'+idx);
                $.recipeShare.upRecipePic(upPicBtn);
                setStepAddDel();
                
                return;
            }

            function delRecipeStep(step){
                step = $(step);
                if($('#recipe_share #JrecipeStepsList .J_step').length < 2) {
                    $.vv.tip({content:'没有步骤街友怎么学呢？', icon:'warning'});
                    return false;
                }
                if(step.find('textarea').val().trim()){                    
                    $.ui.popup( {
                        title:"删除步骤",
                        message:"你确定要删除该步骤吗？",
                        cancelText:"取消",
                        cancelCallback: null,
                        doneText:"确定",
                        supressFooter:false,
                        cancelClass:'button',
                        doneClass:'button',
                        doneCallback: function () {
                            $.cleanUpContent(step, true, true);
                            $(step).css3Animate({
                                x: "-"+$.vv.cfg.cWidth+"px",
                                time: "350ms",
                                complete: function () {
                                    $(step).remove();
                                    $('#recipe_share').scroller().correctScroll();
                                    setStepAddDel();
                                }
                            });
                        },
                        cancelOnly:false,
                        blockUI:true
                    });
                }
            }
            
            function setStepAddDel() {
                var steps = $('#recipe_share #JrecipeStepsList .J_step'), len = steps.length - 1;
                $.each(steps, function(i, step){
                    //console.log('>>>>>>>>>>>>>>>i:: '+i+' >>>> len:: '+len);
                    if(i != len) $(step).find('.JaddDelStep').removeClass('fa-plus').addClass('fa-times');
                    else $(step).find('.JaddDelStep').removeClass('fa-times').addClass('fa-plus');
                });
            }
                  
            function addRecipestuff(type) {
                type = type || 'main';
                if(type == 'main') {
                    $('#JrecipeShareform .m_stuffs').append($.query('#JmainStuffCopy > li').clone());  
                } else {
                    $('#JrecipeShareform .s_stuffs').append($.query('#JsubStuffCopy > li').clone());
                }
                setstuffAddDel(type);
            }
            
            function delRecipestuff(stuff, type){
                type = type || 'main';
                stuff = $(stuff);
                if(type == 'main' && $('#JrecipeShareform .m_stuffs .stuff').length < 2) {
                    $.vv.tip({content:'至少有一个主料吧？', icon:'warning'});
                    return false;
                }
                $.cleanUpContent(stuff, true, true);
                $(stuff).css3Animate({
                    x: "-"+$.vv.cfg.cWidth+"px",
                    time: "350ms",
                    complete: function () {
                        $(stuff).remove();
                        $('#recipe_share').scroller().correctScroll();
                        setstuffAddDel(type);
                    }
                });
            }
            
            function setstuffAddDel(type){
                type = type || 'main';
                if(type == 'main') {
                    var stuffs = $('#JrecipeShareform .m_stuffs .stuff'), len = stuffs.length - 1;
                } else {
                    var stuffs = $('#JrecipeShareform .s_stuffs .stuff'), len = stuffs.length - 1;
                }
                $.each(stuffs, function(i, step){
                    //console.log('>>>>>>>>>>>>>>>i:: '+i+' >>>> len:: '+len);
                    if(i != len) $(step).find('.JaddDelStuff').removeClass('fa-plus').addClass('fa-times');
                    else $(step).find('.JaddDelStuff').removeClass('fa-times').addClass('fa-plus');
                });
            }
          
            $(ctx).on('swipeLeft', '.J_steps > .J_step', function(e){
                e.stopPropagation();e.preventDefault();
                if($(this).find('.JaddDelStep').hasClass('fa-times'))delRecipeStep(this);
            });
            
            $(ctx).on('click', '.JaddDelStep', function(e) {
                e.stopPropagation();e.preventDefault();
                if($(this).hasClass('fa-times')){
                    delRecipeStep($(this).closest('.J_step'));
                } else {
                    addRecipeStep();
                    $('#recipe_share').scroller().scrollToBottom(200);
                }
            });
            
            $(ctx).on('click', ".J_stepup", function(){
                var step = $(this).closest('.J_step');
                var prev = step.prev('li');
                if(step.is(":first-child")){$.vv.tip({content:'已经是第一步了！', icon:'warning'}); return false;} 
                step.insertBefore(prev);
                setStepAddDel();
                return false;
            });
            
            $(ctx).on('click', ".J_stepdown", function(){
                var step = $(this).closest('.J_step');
                var next = step.next('li');
                if(step.is(":last-child")){$.vv.tip({content:'已经是最后一步了！', icon:'warning'}); return false;} 
                step.insertAfter(next);
                setStepAddDel();
                return false;
            });
            
            $(ctx).on('click', '.JaddDelStuff', function(e) {
                e.stopPropagation();e.preventDefault();
                var type = $(this).closest('.stuffs').hasClass('m_stuffs') ? 'main' : 'sub';
                if($(this).hasClass('fa-times')){
                    delRecipestuff($(this).closest('.stuff'), type);
                } else {
                    addRecipestuff(type);
                }
            });
            
            $.recipeShare.initRecipeAttrIpts(ctx);
            
            var uploading = false;
            //upload recipe
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                var f = $('#JrecipeShareform');
                if(!f.find('*[name=name]').val().trim()){$.vv.tip({content:'菜谱名称必填哦，最多32个字符~', icon:'error'});return false;}
                if(!f.find('*[name=intro]').val().length > 1024){$.vv.tip({content:'菜谱故事最多1024字符撒~', icon:'error'});return false;}
                if(!f.find('*[name=tips]').val().length > 1024){$.vv.tip({content:'小贴士最多1024字符撒~', icon:'error'});return false;}
                if(!f.find('*[name=img]').val().trim()){$.vv.tip({content:'必须上传成品图哦~', icon:'error'});return false;}
                var has_m_stuff = false;
                var has_step = false;
                var has_step_state = false;
                f.find('.m_stuffs input[name*=m_stuff]').each(function(){if($(this).val().trim()) has_m_stuff = true; return false;});
                if(!has_m_stuff) {$.vv.tip({content:'至少填写一个主料哦~', icon:'error'}); return false;};
                /*
                $('input[name*=stepimg]').each(function(){if($.trim($(this).val())) has_step = true; return false;});
                if(!has_step) {$.vv.tip({content:'没有上传步骤图哦~', icon:'error'}); return false;};
                */
                f.find('textarea[name*=stepstate]').each(function(i){
                    if($(this).val().trim() && $(this).val().trim() != '步骤说明') has_step_state = true; return false;});
                if(!has_step_state) {$.vv.tip({content:'没有步骤哦~', icon:'error'}); return false;};

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
                            $.recipeShare.cfg.needReset = true;
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
        
        upRecipePic: function(ele, type){
            type = type || 'step';
            //console.log('>>>>>>>>>>>>>>upRecipePic:: '+$(ele).next('input').attr('id'));
            $(ele).uploader({
                actionUrl: $.ckj.cfg.mapi + '/?m=recipe&a=upimg&t='+type,
                btnId: $(ele).attr('id'),
                inputId: $(ele).next('input').attr('id'), //for record the img url from server
                upFileName:'img',
                ctx:'#afui',
                progressBox: $(ele).closest('.J_upImgWrap').find('.J_preview'),
                onSubmit: function(){
                    //this refer to this uploader
                    var upBtn = $(this.upBtnEl), absWrap = upBtn.closest('.J_shareRecipeImg_abs');
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
                        $.vv.tip({content:r.msg, icon:'error', ctx:'#recipe_share'});
                        upBtn.closest('.J_upImgWrap').find('.J_preview').html('');
                    }
                },
                onProgress: function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                      this.progressBox.html(parseInt((progressEvent.loaded / progressEvent.total)*100) + '%');
                    } else {
                        this.progressBox.html((progressEvent.loaded));
                    }
                }
            });
        },
        initRecipeAttrIpts: function (ctx) {
            $(ctx).on('click', '#JrecipeShareform .rci_attr', function(){
                if($.os.android && $.os.androidVersion > 4.3)$('#Jtrans3dBlock').css('height', 'auto');
                var html = '', iptEle = $(this).find('input'), type=$(iptEle).attr('name'), valStr=iptEle.val(), valArr = [];
                    attrObj = $.recipeShare.rciAttr[type];
                if(valStr) valArr = valStr.split(',');
                for(var prob in attrObj) 
                    html += '<a val="'+prob+'"'+((valStr && valArr.indexOf(prob) != -1) ? 'class="on"' : '')+'>'+attrObj[prob]+'</a>';
                $('#Jtrans3dBlock').html(html).attr('vv-type', type);
                if($.os.android && $.os.androidVersion > 4.3)$('#Jtrans3dBlock').height($('#Jtrans3dBlock').height());
                window.setTimeout(function(){$.vv.ui.toggleTrans3dBlk();}, 80);
            });
        },
        setAttrClick: function () {
            $('#Jtrans3dBlock').on('click', 'a', function(e){
                e.stopPropagation(); e.preventDefault();
                var blk = $('#Jtrans3dBlock'), type = blk.attr('vv-type'), ipt=$('#JrecipeShareform input[name='+type+']'), $this=$(this);
                if(type != 'tools') {
                    blk.find('a').removeClass('on');
                    $this.addClass('on');
                    ipt.val($this.attr('val'));
                    ipt.prev('p').text($this.text());
                    $.vv.ui.toggleTrans3dBlk();
                } else {
                    if(!$this.hasClass('on') && blk.find('a.on').length >= 5) {
                        $.vv.tip({content:'最多选5个厨具哦!', icon: 'warning'});
                        return false;
                    }
                    
                    var kStr = '', tStr = '';  
                    $this.toggleClass('on');
                    blk.find('a.on').each(function(){
                        kStr += $(this).attr('val')+',';
                        tStr += $(this).text()+',';
                    });
                    kStr = kStr.substring(0, kStr.lastIndexOf(','));
                    tStr = tStr.substring(0, tStr.lastIndexOf(','));
                    ipt.val(kStr);
                    ipt.prev('p').text(tStr);
                }
            });
        },
        offAttrClick: function () {
            $('#Jtrans3dBlock').off('click');
        }
    };
    $.recipeShare.init();
})(af);
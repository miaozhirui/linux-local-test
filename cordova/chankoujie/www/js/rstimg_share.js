//rstimg share
(function($) {
    $.rstimgShare = {
		cfg: {
			id:0,
			panelInited:false
		},
	
        init: function(options) {
        	$("#rstimg_share").bind("loadpanel",function(e) {
        		if(!$.ckj.user.id) { 
        			if(e.data.goBack){
        				//$.vv.log('e.data.goBack::'+e.data.goBack);
        				window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the first loadpanel 
        				return;
        			}
        			$.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
        			return;
        		}
        		var params 	 = $.query("#rstimg_share").data('params'),
        			recipeId = params[0];
        		
        		$.rstimgShare.panelInit();
        		
        		if($.rstimgShare.cfg.id != recipeId) {
        			$.rstimgShare.cfg.id = recipeId;//return;
        			$.query('#J_sharerstimg_form input[name=rid]').val(recipeId); //>>>
        		}
    		});
        	$("#rstimg_share").bind("unloadpanel",function(e) {
        	    var sheet = $.ui.actionsheet();
                if(sheet){
                    sheet.hide();
                }
    		});
        },
        
        panelInit: function() {
        	if( $.rstimgShare.cfg.panelInited === true ) return;
        	$.query('#rstimg_share').attr('scrollTgt', '#rstimg_share');
        	$.rstimgShare.resetForm('#rstimg_share');
        	$.rstimgShare.shareFormInit($.query('#J_sharerstimg_form'), '#rstimg_share');
        	$.vv.ui.onPressed('#rstimg_share');
        	$.rstimgShare.cfg.panelInited = true;
        },
        
        resetForm: function(ctx){
            $.cleanUpContent($('#J_sharerstimg_form .J_imgs').get(0), false, true);
            $('#J_sharerstimg_form .J_imgs').empty().attr(3);
            for(var idx =1; idx < 3; idx++) {
                $.rstimgShare.addRstimgInput(idx);
            }
        },
        
        addRstimgInput: function (idx) {
            //save the max img num
            var imgWrap     = $('#J_sharerstimg_form .J_imgs');
            idx = numOnly(idx);
            if(idx < 1) {
                idx = numOnly(imgWrap.attr('nextidx'));
                idx = idx < 1 ? 1 : idx;
            }
            
            imgWrap.attr('nextidx', idx + 1);
            var img   = $.query('#J_sharerstimg_copy > li').clone();
            img.appendTo(imgWrap);
            //uploader
            var upPicBtn = img.find('.J_sharerstimg');
            upPicBtn.attr('id', 'J_sharerstimg_'+idx);
            img.find('input').attr('id', 'J_sharerstimg_ipt_'+idx);
            $.rstimgShare.uprstimgPic(upPicBtn);
            return;
        },
        
        shareFormInit: function(form, ctx) {
            function delrstimgItem(img){
                img = $(img);
                if(img.find('textarea').val().trim()){
                    $.ui.popup( {
                        title:"删除附图",
                        message:"你确定要删除该餐馆图片吗？",
                        cancelText:"取消",
                        cancelCallback: null,
                        doneText:"确定",
                        supressFooter:false,
                        cancelClass:'button',
                        doneClass:'button',
                        doneCallback: function () {
                            $.cleanUpContent(img, true, true);
                            $(img).css3Animate({
                                x: "-"+$.vv.cfg.cWidth+"px",
                                time: "350ms",
                                complete: function () {
                                    $(img).remove();
                                    $('#rstimg_share').scroller().correctScroll();
                                }
                            });
                        },
                        cancelOnly:false,
                        blockUI:true
                    }); 
                }
            }
            
            $(ctx).on('swipeLeft', '.J_imgs > .J_img', function(e){
                e.stopPropagation();e.preventDefault();
                delrstimgItem(this);
            });
            
        	$(ctx).on('click', '.J_delimg', function(e) {
        		e.stopPropagation();e.preventDefault();
            	var img = $(this).closest('.J_img');
            	delrstimgItem(img);
            });
            
            $(ctx).on('click', '.J_addimg', function(e){
            	e.stopPropagation(); e.preventDefault();
            	$.rstimgShare.addRstimgInput();
            	$('#rstimg_share').scroller().scrollToBottom(200);
            });
            
            var uploading = false;
            //upload rstimg
        	form.submit(function(e){
        	    e.preventDefault(); e.stopPropagation();
        	    if(uploading) return;
        	    else uploading = true;
            	
            	$.vv.tip({icon:'loading', ctx:"#rstimg_share"}); 
    			$.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    dataType: "json",
                    success: function(r){
                    	$.vv.tip({close:true}); 
                    	if(r.status == 0){
                    	    $.rstimgShare.resetForm('#rstimg_share');
                    		//$.ui.goBack();
                    	} else {
                    		$.vv.tip({content:r.msg, icon:'error', ctx:"#rstimg_share"}); 
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
        
        uprstimgPic: function(ele){
        	$(ele).uploader({
                actionUrl: $.ckj.cfg.mapi + '/?m=rstrnt&a=upimg',
                btnId: $(ele).attr('id'),
                inputId: $(ele).next('input').attr('id'), //for record the img url from server
                upFileName:'img',
                ctx:'#afui',
                progressBox: $(ele).closest('.J_upwrap').find('.J_preview'),
				onSubmit: function(){
					//this refer to this uploader
					var upBtn = $(this.upBtnEl), absWrap = upBtn.closest('.J_sharerstimg_abs');
					if(!absWrap.hasClass('upimgpic_renew')){
						absWrap.removeClass('upimgpic_abs');
						absWrap.addClass('upimgpic_renew');
						upBtn.find('span').html('<i class="fa fa-rotate-left pink"></i>');
					}
					
					//upBtn.closest('.J_upwrap').find('.J_preview').html('<i class="fa fa-spinner fa-spin" style=" font-size:22px; color:#666;"/>');
				},
                onComplete: function(r) {
                    $.vv.log('uploadfile onComplete===============>'+JSON.stringify(r));
                	//this refer to this uploader
                	var upBtn = $(this.upBtnEl);
                    if(r.status == '0') {
                        $.query('#'+this.inputId).val(r.data.img);
                        upBtn.closest('.J_upwrap').find('.J_preview').html('<img src="'+r.data.src+'" />');
                    }else{
                        $.vv.tip({content:r.msg, icon:'error', ctx:'#rstimg_share'});
                        upBtn.closest('.J_upwrap').find('.J_preview').html('');
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
	};
    $.rstimgShare.init();
})(af);
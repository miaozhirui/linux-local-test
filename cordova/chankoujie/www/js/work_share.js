//work share
(function($) {
    $.workShare = {
		cfg: {
			id:0,
			panelInited:false
		},
	
        init: function(options) {
        	$("#work_share").bind("loadpanel",function(e) {
        		if(!$.ckj.user.id) { 
        			if(e.data.goBack){
        				//$.vv.log('e.data.goBack::'+e.data.goBack);
        				window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the first loadpanel 
        				return;
        			}
        			$.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
        			return;
        		}
        		var params 	 = $.query("#work_share").data('params'),
        			recipeId = params[0];
        		
        		$.workShare.panelInit();
        		
        		if($.workShare.cfg.id != recipeId) {
        			$.workShare.cfg.id = recipeId;//return;
        			$.query('#J_sharework_form input[name=rid]').val(recipeId); //>>>
        		}
    		});
        	$("#work_share").bind("unloadpanel",function(e) {
        	    var sheet = $.ui.actionsheet();
                if(sheet){
                    sheet.hide();
                }
    		});
        },
        
        panelInit: function() {
        	if( $.workShare.cfg.panelInited === true ) return;
        	$.query('#work_share').attr('scrollTgt', '#work_share');
        	$.workShare.resetForm('#work_share');
        	$.workShare.shareFormInit($.query('#J_sharework_form'), '#work_share');
        	$.vv.ui.onPressed('#work_share');
        	$.workShare.cfg.panelInited = true;
        },
        
        resetForm: function(ctx){
            $.cleanUpContent($('#J_sharework_form .J_imgs').get(0), false, true);
            $('#J_sharework_form .J_imgs').empty().attr(3);
            for(var idx =1; idx < 3; idx++) {
                $.workShare.addWorkInput(idx);
            }
        },
        
        addWorkInput: function (idx) {
            //save the max img num
            var imgWrap     = $('#J_sharework_form .J_imgs');
            idx = numOnly(idx);
            if(idx < 1) {
                idx = numOnly(imgWrap.attr('nextidx'));
                idx = idx < 1 ? 1 : idx;
            }
            
            imgWrap.attr('nextidx', idx + 1);
            var img   = $.query('#J_sharework_copy > li').clone();
            img.appendTo(imgWrap);
            //uploader
            var upPicBtn = img.find('.J_sharework');
            upPicBtn.attr('id', 'J_sharework_'+idx);
            img.find('input').attr('id', 'J_sharework_ipt_'+idx);
            $.workShare.upWorkPic(upPicBtn);
            return;
        },
        
        shareFormInit: function(form, ctx) {
            function delWorkItem(img){
                img = $(img);
                if(img.find('textarea').val().trim()){
                    $.ui.popup( {
                        title:"删除作品",
                        message:"您确定要删除该作品吗？",
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
                                    $('#work_share').scroller().correctScroll();
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
                delWorkItem(this);
            });
            
        	$(ctx).on('click', '.J_delimg', function(e) {
        		e.stopPropagation();e.preventDefault();
            	var img = $(this).closest('.J_img');
            	delWorkItem(img);
            });
            
            $(ctx).on('click', '.J_addimg', function(e){
            	e.stopPropagation(); e.preventDefault();
            	$.workShare.addWorkInput();
            	$('#work_share').scroller().scrollToBottom(200);
            });
            
            var uploading = false;
            //upload work
        	form.submit(function(e){
        	    e.preventDefault(); e.stopPropagation();
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
                    	    $.workShare.resetForm('#work_share');
                    	    $.vv.tip({content:'作品上传成功啦', icon:'success'}); 
                    		//$.ui.goBack();
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
        
        upWorkPic: function(ele){
            //console.log('>>>>>>>>>>>>>>upWorkPic:: '+$(ele).next('input').attr('id'));
        	$(ele).uploader({
                actionUrl: $.ckj.cfg.mapi + '/?m=work&a=upimg',
                btnId: $(ele).attr('id'),
                inputId: $(ele).next('input').attr('id'), //for record the img url from server
                upFileName:'img',
                ctx:'#afui',
                progressBox: $(ele).closest('.J_upwrap').find('.J_preview'),
				onSubmit: function(){
					//this refer to this uploader
					var upBtn = $(this.upBtnEl), absWrap = upBtn.closest('.J_sharework_abs');
					if(!absWrap.hasClass('upimgpic_renew')){
						absWrap.removeClass('upimgpic_abs');
						absWrap.addClass('upimgpic_renew');
						upBtn.find('span').html('<i class="fa fa-rotate-left pink"></i>');
					}
					
					//upBtn.closest('.J_upwrap').find('.J_preview').html('<i class="fa fa-spinner fa-spin" style=" font-size:22px; color:#666;"/>');
				},
                onComplete: function(r) {
                    //console.log('>>>>>>>>>>>>>>this.inputId:: '+this.inputId);
                	//this refer to this uploader
                	var upBtn = $(this.upBtnEl);
                    if(r.status == '0') {
                        $.query('#'+this.inputId).val(r.data.img);
                        upBtn.closest('.J_upwrap').find('.J_preview').html('<img src="'+r.data.src+'" />');
                    }else{
                        $.vv.tip({content:r.msg, icon:'error', ctx:'#work_share'});
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
    $.workShare.init();
})(af);
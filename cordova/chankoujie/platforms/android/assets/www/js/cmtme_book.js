(function($) {
    $.cmtmeBook = {
        cfg: {
        	panelInited:false
        },
        init: function(options) {
        	$("#cmtme_book").bind("loadpanel",function(e){
        		$.query('#cmtme_book').on('click', '.note_f', function(e) {
        			e.preventDefault(); e.stopPropagation();
             		var wall = $.query('#J_cmtme_wall');
                    var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), $this=$(this),
                     	did=$this.attr('did'), aUrl=$this.attr('aUrl'), rTip='回复@'+$this.closest('.note_f').find('.n').text()+':';
                    
             		jpop.setCnt('<div id="J_listCmtOpts" class="listOpsBtn" rId="'+did+'" iType=".note_f" wallId="J_cmtme_wall">\
             						<p data-pressed="true" class="J_lopGoHash" aUrl="'+aUrl+'">查看原文<i class="fa fa-angle-right"></i></p>\
             						<p data-pressed="true" class="J_replyCmtme" rTip="'+rTip+'">答复消息<i class="fa fa-angle-right"></i></p>\
		            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=space&a=tipcmt_del&id='+did+'" \
		            					tipTit="删除" tipMsg="确定要删除该条回应消息么？">删除消息<i class="fa fa-angle-right"></i></p>\
		            				<p data-pressed="true" class="J_lopCel">取消</p>\
		            			</div>');
             		
             		$.query('#afui').on('click', '#J_listCmtOpts > p', function(e){
             			e.stopPropagation(); e.preventDefault();
             			var listOp = $.query('#J_listCmtOpts'), $this=$(this);//>>> listOp must captured here
                		
                		if($this.hasClass('J_lopCel')){ $.ui.popup().hide(); return; }
                		if($this.hasClass('J_lopGoHash')){ $.ui.loadContent($(this).attr('aUrl'),false,false); return; }

                		if($this.hasClass('J_lopDoAjax')){
                			var tiptit=$(this).attr('tipTit'), tipmsg=$(this).attr('tipMsg'), acturl = $(this).attr('aUrl');
                				
                    		$.ui.popup({
                        	    title:tiptit,  message:tipmsg, cancelText:"取消", cancelCallback: null,
                        	    doneText:"确定", supressFooter:false, cancelClass:'button',  doneClass:'button',
                        	    doneCallback: function () {
                        	    	$.vv.tip({icon:'loading'});
                        	    	$.ajax({
                                        url: $.ckj.cfg.mapi + acturl,
                                        success: function(rst){
                                        	$.vv.tip({close:true});
                                        	if(rst.status != 0 && rst.status != 8){ //error happened
                                        		$.vv.tip({ content:rst.msg, icon:'error', time:3000}); 
                                        	} else {
                                        		var wallId = listOp.attr('wallId'), iType = listOp.attr('iType'),
                                        			delEle = $('#'+wallId+' '+iType+'[did="'+listOp.attr('rId')+'"]');
                                            	$(delEle).css3Animate({
                                            		x: "-"+$.vv.cfg.cWidth+"px",
                                            	    time: "350ms",
                                            	    complete: function () {
                                            	    	$(delEle).remove();
                                                    	if($.query('#'+wallId).attr('masonry') == 'y') $.feed.reMasonry('#'+wallId);
                                            	    }
                                            	});
                                        	}
                                        	listOp = null;
                                        },
                                        dataType: "json"
                                   });
                        	    },
                        	    cancelOnly:false,
                        	    blockUI:true
                        	});
                			return;
                		}
                		
                		if($this.hasClass('J_replyCmtme')) {
                			var nf = $($('#'+listOp.attr('wallId')+' '+listOp.attr('iType')+'[did="'+listOp.attr('rId')+'"]')), 
                				cid = listOp.attr('rId'), tip=$this.attr('rTip');
                            var jpop = $.ui.popup({ id:"J_rplyCmtme", title:'<i class="fa fa-share"></i>答复回应',blockUI:true, addCssClass:'popBottom'});
                            jpop.setCnt('<div class="dlg_rplycmtme">\
    									    <form id="J_rplyCmtmeFrm" action="/?m=space&a=tipcmt_reply" method="post">\
    									    	<input type="hidden" name="id" value="'+cid+'">\
    										    <textarea class="J_content fw_content" name="content">'+tip+'</textarea>\
    										    <div class="fw_submit_box cfx">\
    										        <input type="submit" class="btn gbtn fr" value="确定">\
    										    </div>\
    									    </form>\
    									</div>');
                            $.cmtmeBook.replyCmtmeFrm($('#J_rplyCmtmeFrm'), jpop);
                		}
                	});
                });
        		
        		if(e.data.goBack)return;
        		if(!$.ckj.user.id) { $.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}//must login
        		var params = $.query("#cmtme_book").data('params'),
    				atid = params[0];//atid
        		
        		$.cmtmeBook.panelInit();
        		$.feed.resetWall('#J_cmtme_wall', true);
        		$.cmtmeBook.loadCmtmes();
    		});
        	
        	$("#cmtme_book").bind("unloadpanel",function(e){
        		$.query('#cmtme_book').off('click', '.note_f');
        		$.query('#afui').off('click', '#J_listCmtOpts > p');
        	});
        },
        panelInit:function() {
        	if( $.cmtmeBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_cmtme_wall_wrap"), wall = $.query('#J_cmtme_wall'), padding=0;
            padding = parseInt($.vv.cfg.cWidth*0.0);
            padding = padding >= 20 ? 20 : padding;
            wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-90});

            $.feed.init('#J_cmtme_wall');
            var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
            
            if($.ckj.cfg.useInfinite) {
                scroller.addInfinite();
                $.bind(scroller, "infinite-scroll", function () {
                    $.asap(function(r){
                        if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                            $.query(wall.attr('pageBar')).css('display') != 'none') return;
                        $.query(wall.attr('triggerBar')).trigger('click');
                    }, null, []);
                });
            }
        	
            $.query('#cmtme_book').attr('scrollTgt', '#J_cmtme_wall_wrap');

        	$.cmtmeBook.cfg.panelInited = true;
        },
        loadCmtmes: function(){
        	var wall = $.query('#J_cmtme_wall');
        	var uri  =  '/?m=space&a=cmtme&atid='+wall.attr('atid');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        renderCmtmes:function(data){
        	var html   = '';
        	if(data.rlist.length > 0){
        		html = data.html;
        	}
        	return html;
        },
     
        replyCmtmeFrm: function(form, jpop){
            form.submit(function(e){
            	e.preventDefault(); e.stopPropagation();
            	
            	var content = form.find('.J_content').val();
                if(content == ''){
                    $.vv.tip({content:'请输入转发内容', icon:'error'});
                    return false;
                }
                jpop.setTitle('<i class="fa fa-spinner fa-spin"></i>提交中...');
    			$.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    success: function(r){
                    	   if(r.status == 0){
                               $.vv.tip({content:r.msg, icon:'success'});
                           } else {
                               $.vv.tip({content:r.msg, icon:'error'});
                           }
                    	   jpop.hide();
                    },
                    dataType: "json"
               });
            });
        }
    };
    
    $.cmtmeBook.init();
})(af);
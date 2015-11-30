(function($){
    $.faqAns = {
    	cfg: {
    		id:0,
    		loadingFaqans:'y',
    		panelInited:false
    	},
        init: function(options){
        	$.query("#faq_answer").bind("loadpanel",function(e){
        		if(e.data.goBack) {
        		    $('#faq_answer').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#faq_answer").data('params'),
        			ansId  = params[0];
        		if($.faqAns.cfg.id == ansId) {
        		    $('#faq_answer').css('opacity', '1');
        		    return; //avoid loading the same ...
        		}
        		else $.faqAns.cfg.id = ansId;
        		
        		$.faqAns.panelInit();
        		$.faqAns.loadFaqans();
    		});
        },
        panelInit: function(){
        	if( $.faqAns.cfg.panelInited === true ) return;
        	var wallWrap = $.query('#J_faqans_wrap');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
            wallWrap.addClass('scroll_nobar');
            
        	$.user.follow('#faq_answer');
        	$.user.unFollow('#faq_answer');
        	$.faqAns.agree('#faq_answer');
        	$.faqAns.disagree('#faq_answer');
        	$.faqAns.help('#faq_answer');
        	$.faqAns.nohelp('#faq_answer');
        	$.faqAns.collect('#faq_answer');
        	$.faqAns.uncollect('#faq_answer');
        	
        	$.query("#faq_answer").on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,$.ckj.cfg.cmtTrans);
        	});
        	
        	$.vv.ui.onPressed('#J_faqans_ops');
        	
            $.query('#faq_answer').attr('scrollTgt', '#J_faqans_wrap');
            
            //bad report
            $('#faq_answer').on('click', '.J_moreOps', function(e){
                e.stopPropagation();e.preventDefault();
                $('#afui').actionsheet(
                    [{
                        text: '评论...',
                        cssClasses: '',
                        handler: function () {
                            setTimeout(
                                function(){
                                    $.ui.loadContent('#comment_book/faq_ans/'+$.faqAns.cfg.id, false, false);
                                }, 
                                20
                            ); //ios workaround
                        }
                    },
                    {
                        text: '答谢...',
                        cssClasses: '',
                        handler: function () {
                            $.faqAns.thanks();
                        }
                    }, {
                        text: '举报...',
                        cssClasses: '',
                        handler: function () {
                            $.ckj.badReport('举报答案', 'faq_ans', $.faqAns.cfg.id);
                        }
                    }]
                );
            });
            
        	$.faqAns.cfg.panelInited = true;
        },
        
        loadFaqans:function() {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=faq_ans&a=detail&id='+$.faqAns.cfg.id,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var ans = rst.data.ans, html ='', flag =0;
                		
                		html ='<div class="qtitle">'+ans.faq_title+'</div>\
								<div class="uinfo">\
								    <a class="avatar" href="#space_index/'+ans.uid+'"><img src="'+ans.uavatar+'"></a>\
								    <p class="uname plw">'+ans.uname+'</p>\
								    <p class="uintro plw">'+ans.uintro+'</p>'
								    +$.ckj.renderFollowShipBtn(ans.uid, $.ckj.user.id, ans.author_ship)+'\
								</div>\
								<div id="J_faqans_cnt" class="anscnt">'+ans.info+'</div>\
								<div class="misc">'
								    +(ans.getscores > 0 ? '<p class="scores">已获 '+ans.getscores+' 颗馋豆奖励</p>' :'')+'\
								    <p class="atime">'+ans.add_time.split(' ')[1]+'</p>\
								</div>';
                		
                		if(!$.feat.nativeTouchScroll)$.query('#J_faqans_wrap > div').html(html);
                		else $.query('#J_faqans_wrap').html(html);

                		html = '<a class="J_ans_nohelp vv-pressed" data-id="'+ans.id+'"><i class="fa fa-heart-break"></i><span class="J_tip">没用</span></a>\
                				<a class="J_agree_ans vv-pressed" data-id="'+ans.id+'"><i class="fa fa-thumbs-o-up"><e class="J_n">'+ans.agrees+'</e></i><span>赞同</span></a>\
								<a class="J_disagree_ans vv-pressed" data-id="'+ans.id+'"><i class="fa fa-thumbs-o-up fa-flip-vertical"></i><span>反对</span></a>\
								<a class="J_collect_ans vv-pressed" data-id="'+ans.id+'"><i class="fa fa-bookmark"></i><span class="J_tip">收藏</span></a>\
								<a class="J_moreOps vv-pressed"><span>• • •</span></a>';
                		
                		$.query('#J_faqans_ops').html(html);
                		$('#faq_answer').css('opacity', '1');
                	}
                	$.faqAns.cfg.loadingFaqans = 'n';
                },
                dataType: "json"
            });
        },
        nohelp: function(ctx) {
        	$(ctx).on('click', '.J_ans_nohelp', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var aid = $this.attr('data-id');
	                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=nohelp', {id:aid}, function(rst){
	                    	if(rst.status == 0){
	                            $this.find('.J_tip').html('有用');
	                            $this.removeClass('J_ans_nohelp').addClass('J_ans_help');
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon:'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        help: function(ctx) {
        	$(ctx).on('click', '.J_ans_help', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                		var aid = $this.attr('data-id');
	                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=help', {id:aid}, function(rst){
	                        if(rst.status == 0){
	                            $this.find('.J_tip').html('没用');
	                            $this.removeClass('J_ans_help').addClass('J_ans_nohelp');
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon:'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        agree: function(ctx){
        	$(ctx).on('click', '.J_agree_ans', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var aid = $this.attr('data-id');
	                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=agree', {id:aid}, function(rst){
	                        if(rst.status == 0 || rst.status == 7){
	                        		$.vv.tip({content:rst.msg, icon: (rst.status == 0 ? 'success' : 'info'), time:3000});
	                        		if(rst.status == 0)$this.find('.J_n').text(parseInt($this.find('.J_n').text()) + 1);
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon:'error', time:3000});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        disagree: function(ctx) {
        	$(ctx).on('click', '.J_disagree_ans', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                		var aid = $this.attr('data-id');
 	                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=disagree', {id:aid}, function(rst){
 	                    	if(rst.status == 0 || rst.status == 7){
	                        	$.vv.tip({content:rst.msg, icon: (rst.status == 0 ? 'success' : 'info'), time:3000});
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon:'error', time:3000});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        collect: function(ctx) {
        	$(ctx).on('click', '.J_collect_ans', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                		var aid = $this.attr('data-id');
                		$.vv.tip({icon:'loading'});
	                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=collect', {id:aid}, function(rst){
	                    	if(rst.status == 0 || rst.status == 7){
	                    	    if(rst.status == 0)$.vv.tip({content:'收藏成功'});
	                    	    else $.vv.tip({content:'已经收藏过'});
	                        	if(rst.status == 0 && $this.find('.J_n').length > 0) 
	                        		$this.find('.J_n').text(parseInt($this.find('.J_n').text()) + 1);
	                            //change button and add amount
	                            $this.find('.J_tip').html('取消');
	                            $this.removeClass('J_collect_ans').addClass('J_uncollect_ans');
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon:'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        uncollect: function(ctx) {
        	$(ctx).on('click', '.J_uncollect_ans', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var aid = $this.attr('data-id');
	                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=uncollect', {id:aid}, function(rst){
	                    	if(rst.status == 0 || rst.status == 7){
	                        	if(rst.status == 0 && $this.find('.J_n').length > 0 && parseInt($this.find('.J_n').text()) > 0) 
	                        		$this.find('.J_n').text(parseInt($this.find('.J_n').text()) - 1);
	                            //change button and add amount
	                            $this.find('.J_tip').html('收藏');
	                            $this.removeClass('J_uncollect_ans').addClass('J_collect_ans');
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon:'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        //thanks an faq answer
        thanks: function(){
            if(!$.user.isLogin({
            	okFunc:function(){
                    var aid = $.faqAns.cfg.id;
                    var jpop = $.query('#afui').popup({ 
                        id:"J_fRwd_box", 
                        title:"奖赏馋豆",
                        supressFooter:false,
                        cancelClass:'button',
                        doneClass:'button',
                        cancelText:"取消",
                        doneText:"打赏",
                        doneCallback: function () {
                            var frm = $('#J_fRwd_frm'),
                                score = numOnly(frm.find('*[name=score]').val().trim());
                            if(score <= 0) {
                                $.vv.tip({content:'答谢金额必须大于0', icon:'error'});
                                return false;
                            }
                            frm.submit();
                            jpop.hide();
                        },
                        autoCloseDone:false,
                        cancelOnly:false,
                        blockUI:true
                    });
                    
                    $.getJSON($.ckj.cfg.mapi + '/?m=faq_ans&a=thanks', {id:aid}, function(rst){
                        if(rst.status == 0 || rst.status == 7){
                        	jpop.setCnt(rst.data);
                        	$.faqAns.fRwd.setForm(jpop);
                        }else{
                            jpop.hide();
                            $.vv.tip({content:rst.msg, icon:'error'});
                        }
                    });
            	}
            })) return false;
        },
        fRwd:{
        	timeout_handler:null,
        	remove_box: function(){var popup = $.ui.popup();if(popup)popup.hide();},
        	setForm: function(jpop){
            	var form = $.query('#J_fRwd_frm');
            	form.submit(function(e) {
                	e.preventDefault(); e.stopPropagation();
                	if(parseInt($.query('#J_fRwd_close').val()) < 1) { 
                		$.vv.tip({content:'您想奖励多少馋豆呢？', icon:'error'});
                		return false;
                	}
                    $.vv.tip({icon:'loading'});
                	$.ajax({
                        url: $.ckj.cfg.mapi + '/?m=faq_ans&a=reward',
                        type:'post',
                        data:form.serialize(),
                        success: function(rst){
                        		$.vv.tip({close:true});
                        	  if(rst.status == 0){
                              	$.vv.tip({content:rst.msg, icon:'success'});
                              	clearTimeout($.faqAns.fRwd.timeout_handler);
                              	$.faqAns.fRwd.remove_box();
                              } else {
                                  $.vv.tip({content:rst.msg, icon:'error'});
                              }
                        	  return false;
                        },
                        dataType: "json",
                        timeout:10000,
                        error:function(xhr, err) {
                        	if(err == 'timeout')$.vv.tip({ content:'请求超时，请稍后再试!', icon:'error'});
                        	else $.vv.tip({ content:'请求出错，请稍后再试!', icon:'error'});
                        }
                	});
                	return false;
                });
                
                clearTimeout($.faqAns.fRwd.timeout_handler); //avoid forget timehandler binded to fRwdbox
                $.faqAns.fRwd.timeout_handler = setTimeout($.faqAns.fRwd.remove_box, 300000);
                $.query('#J_fRwd_score').on('focus', function(){ clearTimeout($.faqAns.fRwd.timeout_handler);});
                $.query('#J_fRwd_score').on('blur', function(){ $.faqAns.fRwd.timeout_handler = setTimeout($.faqAns.fRwd.remove_box, 300000);});
        	}
        }
    };
    $.faqAns.init();
})(af);

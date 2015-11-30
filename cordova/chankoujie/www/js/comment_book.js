(function($) {
    $.commentBook = {
		cfg: {
        	panelInited:false
        },
        objMap: {
        	'item':'食品评论', 'album':'吃柜评论', 'brand':'品牌评论', 'store':'好吃店评论', 
        	'recipe':'菜谱评论', 'rmenu':'菜单评论', 'work':'作品评论', 
        	'rstrnt':'餐馆评论', 'rstimg':'餐馆附图评论', 
        	'space':'留言簿', 'diary':'美食日记评论', 'subject':'主题回应',
			'faq':'问题评论', 'faq_ans':'答案评论','topic':'动态评论'
        },
        //update detail info
        commentedCbs:{
            'item': function(cmt){
                if($('#item_detail .J_tocmt').length < 1) return;
                $('#item_detail .J_tocmt .num').text(numOnly($('#item_detail .J_tocmt .num').text())+1);
                $('#item_detail #J_item_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'album': function(cmt){
                if($('#J_album_dt_comments').length < 1) return;
                $('#J_album_dt_comments').text(numOnly($('#J_album_dt_comments').text())+1);
            },
            'store': function(cmt){
                if($('#store_detail .J_tocmt .ltip e').length < 1) return;
                $('#store_detail .J_tocmt .ltip e').text(numOnly($('#store_detail .J_tocmt .ltip e').text())+1);
            },
            'brand': function(cmt){
                if($('#brand_detail #J_brand_dt_comments').length < 1) return;
                $('#brand_detail #J_brand_dt_comments').text(numOnly($('#brand_detail #J_brand_dt_comments').text())+1);
            },
            'recipe': function(cmt){
                if($('#recipe_detail .J_tocmt').length < 1) return;
                $('#recipe_detail .J_tocmt .num').text(numOnly($('#recipe_detail .J_tocmt .num').text())+1);
                $('#recipe_detail .J_tocmt .J_n').text(numOnly($('#recipe_detail .J_tocmt .J_n').text())+1);
                $('#recipe_detail #J_rci_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'work': function(cmt){
                if($('#work_detail .J_tocmt').length < 1) return;
                $('#work_detail .J_tocmt .num').text(numOnly($('#work_detail .J_tocmt .num').text())+1);
                $('#work_detail #J_work_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'rmenu': function(cmt){
                if($('#J_rmenu_dt_comments').length < 1) return;
                $('#J_rmenu_dt_comments').text(numOnly($('#J_rmenu_dt_comments').text())+1);
            },
            'rstrnt': function(cmt){
                if($('#rstrnt_detail .J_tocmt').length < 1) return;
                $('#rstrnt_detail .J_tocmt .num').text(numOnly($('#rstrnt_detail .J_tocmt .num').text())+1);
                $('#rstrnt_detail .J_tocmt .J_n').text(numOnly($('#rstrnt_detail .J_tocmt .J_n').text())+1);
                $('#rstrnt_detail #J_rstrnt_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();;
            },
            'rstimg': function(cmt){
                if($('#rstimg_detail .J_tocmt').length < 1) return;
                $('#rstimg_detail .J_tocmt .num').text(numOnly($('#rstimg_detail .J_tocmt .num').text())+1);
                $('#rstimg_detail #J_rstimg_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'space': function(cmt){
                if($('#space_detail .J_tocmt').length < 1) return;
                $('#space_detail .J_tocmt .num').text(numOnly($('#space_detail .J_tocmt .num').text())+1);
                $('#space_detail #J_space_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'diary': function(cmt){
                if($('#diary_detail .J_tocmt').length < 1) return;
                $('#diary_detail .J_tocmt .num').text(numOnly($('#diary_detail .J_tocmt .num').text())+1);
                $('#diary_detail .J_tocmt .J_n').text(numOnly($('#diary_detail .J_tocmt .J_n').text())+1);
                $('#diary_detail #J_diary_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'subject': function(cmt){
                if($('#subject_detail .J_tocmt').length < 1) return;
                $('#subject_detail .J_tocmt .num').text(numOnly($('#subject_detail .J_tocmt .num').text())+1);
                $('#subject_detail #J_sub_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            },
            'faq': function(cmt){
                if($('#faq_detail .J_tocmt').length < 1) return;
                $('#faq_detail .J_tocmt .num').text(numOnly($('#faq_detail .J_tocmt .num').text())+1);
            },
            'faq_ans': function(cmt){
                if($('#faq_answer .J_tocmt').length < 1) return;
                $('#faq_answer .J_tocmt .J_tip').text(numOnly($('#faq_answer .J_tocmt .J_tip').text())+1);
            },
            'topic': function(cmt){
                if($('#topic_detail .J_tocmt').length < 1) return;
                $('#topic_detail .J_tocmt .J_n').text(numOnly($('#topic_detail .J_tocmt .J_n').text())+1);
                $('#topic_detail #J_topic_dt_cmts').prepend($.commentBook.renderTipCmt(cmt)).show();
            }
        },
    
        init: function(options) {
        	$("#comment_book").bind("loadpanel", function(e) {
        		$.commentBook.panelInit();
        		if(e.data.goBack)return;
        		//page params
        		var params = $.query("#comment_book").data('params'),
        		   type  = params[0],
        		   oid   = params[1],
        	       ctid  = params[2] ? params[2] : 0,
        	       wall = $.query('#J_comment_wall');
        		
                if(!$.ckj.cfg.backResetPanel && type == wall.attr('type') && oid ==  wall.attr('oid')) {
                    if(wall.find('.comment_rcd').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') return; 
                }
        		
        		$('#JcmtMsgSend').attr('rcid', 0);
        		$('#JcmtMsgCnt').val('').height(34);
        		
        		wall.attr({'type':type, 'oid': oid, 'ctid': ctid});
        		$.feed.resetWall('#J_comment_wall', true);
        		$.commentBook.loadComments();
                
        		if(ctid > 0) $.query('#J_comment_wall_triggerAll').show();
        		else $.query('#J_comment_wall_triggerAll').hide();
        		$.query('#J_comment_trigger').css('top', ($.vv.cfg.cHeight - 40)+'px');
        		$.ui.setTitle($.commentBook.objMap[type]);
    		});
    		
            $.query("#comment_book").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_comment_wall', true);
                }
            });
        },
        
        panelInit: function() {
        	if( $.commentBook.cfg.panelInited === true ) return;
        	//wall scroller: scroll to load comments
        	var wallWrap = $.query("#J_comment_wall_wrap"), wall = $.query('#J_comment_wall');
        	wall.attr({'initHeight':$.vv.cfg.cHeight-130});
        	$.feed.init('#J_comment_wall');
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar", useJsScroll:false});
            
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

            if(1) {
                scroller.addPullToRefresh();
                $.bind(scroller, "refresh-trigger", function () {
                    //TODO: it's a synchronized callback, so you should return as soon as possible, use $.asap or setTimeout to ...
                });
                
                var hideCloseTimer;
                $.bind(scroller, "refresh-release", function () {
                    var that = this;
                    clearTimeout(hideCloseTimer);
                    hideCloseTimer = setTimeout(function () {
                        that.hideRefresh();
                    }, Math.floor(Math.random() * 2000 + 1000));
                });
            }
        	
        	$.commentBook.pubCmtMsg();
        	$.commentBook.cmtReply();
        	$.commentBook.cmtReport();
        	
        	$.query('#comment_book').attr('scrollTgt', '#J_comment_wall_wrap');
        	
        	$.commentBook.cfg.panelInited = true;
        },
        
        loadComments: function() {
        	var wall = $.query('#J_comment_wall'), type=wall.attr('type'), oid=wall.attr('oid'), ctid=wall.attr('ctid');
        	var uri  =  '/?m='+type+'&a=comment_list&oid='+oid+'&ctid='+ctid;
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        cmtReply: function() {
        	$.query('#comment_book').on('click', '.J_cmt_reply', function(e) {
        		e.stopPropagation();e.preventDefault();
                if(!$.user.isLogin({
                	okFunc:function($this){
                		var cmt_li 	= $this.closest('li');
                		var rcid = cmt_li.attr('data-id'), replyTip = "回复@"+cmt_li.find('.uname').text()+":";
                		$('#JcmtMsgCnt').val(replyTip);
                		$('#JcmtMsgSend').attr('rcid', rcid);
                		setTimeout(function(){$('#JcmtMsgCnt').click().focus();}, 300); 
                	},
                	okData:$(this)
                })) return false;
        	});
        },
        
        cmtReport: function() {
            $.query('#comment_book').on('click', '.J_cmt_report', function(e) {
                e.stopPropagation();e.preventDefault();
                if(!$.user.isLogin({
                    okFunc:function($this){
                        var cmt_li  = $this.closest('li');
                        var rcid = cmt_li.attr('data-id');
                        $.ckj.badReport('举报评论', $.query('#J_comment_wall').attr('type')+'_cmt', rcid);
                    },
                    okData:$(this)
                })) return false;
            });
        },

        pubCmtMsg: function() {
            $('#JcmtMsgSend').on('click', function (e) {
                e.preventDefault();
                if($.commentBook.sendingMsg) {
                    $.vv.tip({'content':'当前有评论提交中，请不要重复提交'});
                    return;
                }
                $.commentBook.sendingMsg = true;
                
                var wall = $.query('#J_comment_wall'), type = wall.attr('type'), oid = wall.attr('oid'),
                    infoEle = $('#JcmtMsgCnt'),  cnt = infoEle.val().trim(), $this = $(this),
                    rcid = $this.attr('rcid');
                if(!cnt) {
                    $.vv.tip({content:'请输入想说的话哦!', icon:'error'}); 
                    infoEle.focus(); 
                    return;
                }
                
                $.vv.tip({'content':'', icon:'loading'});
                $.ajax({
                    url: $.ckj.cfg.mapi + '/?m='+type+'&a=comment&id='+oid,
                    type:'post',
                    data:{'content':cnt, 'rcid': rcid},
                    dataType: "json",
                    success: function(result) {
                        //$.vv.log(result);
                        if(result.status != 0){ 
                            $.vv.tip({content:result.msg, icon:'error'});
                        } else { 
                            if(wall.find('.comment_rcd').length < 1) {
                                $.query(wall.attr('triggerBar')).html($.feed.noMoreDataMsg);   
                            }
                            
                            var html = $.ckj.renderComments({rlist:result.data.cmts});
                            wall.prepend(html);
                            infoEle.val('').height(34);
                            $.vv.tip({content:'发布成功!', icon:'error'}); 
                            $.commentBook.commentedCbs[type](result.data.cmts[0]);
                        }
                        
                        $.commentBook.sendingMsg = false;
                        $this.attr('rcid', 0);
                    },
                    error: function(xhr, why) {
                        $.commentBook.sendingMsg = false;
                        if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                    },
                    
               }); 
               
            });
        },
        renderTipCmt: function(cmt){
            if(!cmt) return;
            return '<li>\
                        <a class="uname" href="#space_index/'+cmt.uid+'">'+cmt.uname+':</a>\
                        '+cmt.info+'<span class="atime">'+cmt.add_time+'</span>\
                   </li>';
        }
    };
    
    $.commentBook.init();
})(af);

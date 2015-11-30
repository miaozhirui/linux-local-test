(function($) {
    $.privmsgTalk = {
            cfg: {
            	ftId: 0,
                panelInited: false,
                readId:0
            },
            refresh: false,
            
            sendingMsg:false,
            pollingMsg:false,

            init: function(options) {
                $("#privmsg_talk").bind("loadpanel",function(e) {
                    if(!$.ckj.user.id) { 
                        $.ui.loadContent('#user_login', false, 0, $.ckj.cfg.formTrans); return; //must login
                    }
                    
                    $.query('#privmsg_talk').on('click', '.privmsg .msgcnt', function(e) {
                        e.preventDefault(); e.stopPropagation();
                        var wall = $.query('#J_privmsg_wall');
                        var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                            did=$(this).closest('.privmsg').attr('did');
    
                        jpop.setCnt('<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".privmsg" wallId="J_privmsg_wall">\
                                        <p class="J_lopDoAjax" aUrl="/?m=message&a=del&id='+did+'" \
                                            tipTit="删除私信" tipMsg="确定要删除该条私信么？"  data-pressed=true>删除私信<i class="fa fa-angle-right"></i></p>\
                                        <p class="J_lopCel" data-pressed=true>取消</p>\
                                    </div>');
                    });
                    
                    if(!$.privmsgTalk.refresh && e.data.goBack) {
                        $.privmsgTalk.finishLoadFunc();
                        return;
                    }
                    
                    $.privmsgTalk.panelInit();

                    var params = $.query("#privmsg_talk").data('params'),
    					ftId  = params[0];
    				
    				$('#J_privmsgsum_wall li[ftid="'+ftId+'"]').removeClass('new');
    					
		    		if(!$.privmsgTalk.refresh && $.privmsgTalk.cfg.ftId == ftId) {
		    		    $.privmsgTalk.finishLoadFunc();
		    		    return; //avoid loading the same ...
		    		}
		    		else $.privmsgTalk.cfg.ftId = ftId;
		    		
		    		$.query("#J_privmsg_wall").attr('ftId', ftId);
                    
                    $.feed.resetWall('#J_privmsg_wall', true);
                    $.privmsgTalk.loadTalk();
                    $.query('#J_privmsg_wall_wrap').scroller().scrollToBottom(0);
                    
                    $.privmsgTalk.refresh = false;
                });
                
             	$("#privmsg_talk").bind("unloadpanel", function(e) {
             		$.query('#privmsg_talk').off('click', '.privmsg');
             		//clear poll msg timer
                    clearTimeout($.privmsgTalk.msgPoll.timer);
                    $.privmsgTalk.msgPoll.timer = null;
                    $.privmsgTalk.pollingMsg = false;
                    $.privmsgTalk.msgPoll.interval = $.privmsgTalk.msgPoll.minInterval;
             	});
             	
             	$.ckj.hooks.logout.push( function(){
             	    $.vv.log('--------------$.privmsgTalk.ftId = 0---------------');
                    $.privmsgTalk.refresh = true;
                });
            },
            
            panelInit: function(){
                if( $.privmsgTalk.cfg.panelInited === true ) return;
                             
                var wallWrap = $.query('#J_privmsg_wall_wrap'),
                    scroller = wallWrap.scroller({
                        verticalScroll: true, 
                        scrollBars: $.ckj.cfg.scrollBar, 
                        vScrollCSS: "afScrollbar",
                        pullRefreshTip:'<i class="fa fa-arrow-down" ' +($.os.android ? 'style="display:none;"' : '')+ '></i><e>下拉加载...</e>',
                        releaseRefreshTip:'释放加载...'
                     });
                     
                $.feed.init('#J_privmsg_wall');
                
                scroller.addPullToRefresh();
                //pull2refresh
                $.bind(scroller, "refresh-release", function () {
                    if($('#J_privmsg_wall_pageBar').css('display') != 'none') {
                        this.hideRefresh();
                        return;
                    }
                    if($('#J_privmsg_wall').attr('isLoading') == 'y' || $('#J_privmsg_wall').attr('allLoaded') == 'y') return;
                    $.feed.wallLoadData($('#J_privmsg_wall'));
                });

                $.privmsgTalk.sendPrivMsg();
   
                $.query('#privmsg_talk').attr('scrollTgt', '#J_privmsg_wall_wrap');
                $.privmsgTalk.cfg.panelInited = true;
            },
            
            loadTalk: function(){
            	var wall = $.query('#J_privmsg_wall');
            	var uri = '/?m=message&a=talk&ftid='+wall.attr('ftId');
            	wall.attr('dataUri', uri);
            	$.feed.wallLoadData($('#J_privmsg_wall'));
            },
            
            finishLoadFunc: function(){
                if($.privmsgTalk.msgPoll.timer) return;
                var wall = $('#J_privmsg_wall'), lastMsgLi = wall.find('li:last-child');
                if(lastMsgLi.length > 0) wall.attr('minMsgId', lastMsgLi.attr('did'));
                else wall.attr('minMsgId', 0);
                
                $.privmsgTalk.setMsgPollTimer();
            },
            
            renderPrivmsg: function(data) {
            	var html = '';
            	if(data.rlist.length > 0) {
    				$.each(data.rlist, function(idx, m){
    					if(m.from_id == $.ckj.user.id){
        					html += '<li did="'+m.id+'" class="privmsg f-f f-ve">\
					    	            <div class="msgcnt f-al">'+m.info+'\
				    	                    <div class="utime">'+m.add_time+'</div>\
					    	            </div>\
					    	            <a href="#space_index/'+m.from_id+'">\
					    	                <img src="'+m.avatar+'">\
					    	            </a>\
					    	        </li>';	
    					}else{
        					html += '<li did="'+m.id+'" class="privmsg oppsi f-f">\
					    			    <a href="#space_index/'+m.from_id+'">\
					    	                <img src="'+m.avatar+'">\
					    	            </a>\
					    	            <div class="msgcnt f-al">'+m.info+'\
				    	                    <div class="utime">'+m.add_time+'</div>\
					    	            </div>\
					    	        </li>';
    					}
        			});
            	} 
            	return html;
            },
            sendPrivMsg: function() {
            	$('#JprivMsgSend').on('click', function () {
            	    if($.privmsgTalk.sendingMsg) return;
            	    $.privmsgTalk.sendingMsg = true; 
            	    
            	    var content = $('#JprivMsgCnt').val().trim();
            	    if(content.length < 1) {
            	        $.vv.tip({content:'请输入聊天内容', icon:'error'});
            	        $.privmsgTalk.sendingMsg = false;
            	        return; 
            	    }
            	    var uid = $.privmsgTalk.cfg.ftId - $.ckj.user.id;
            	    $.vv.tip({icon:'loading'});
            	    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=message&a=publish&to_id='+uid,
                        type:'post',
                        data:{content:content},
                        dataType: "json",
                        success: function(r){
                            $.vv.tip({close:true}); 
                            if(r.status != 0) {
                                $.vv.tip({content:r.msg, icon:'error'}); 
                            }
                            
                            clearTimeout($.privmsgTalk.msgPoll.timer);
                            $.privmsgTalk.msgPoll.timer = null;
                            $.privmsgTalk.pollMsgs();
                            
                            $.privmsgTalk.sendingMsg = false;
                            
                            $('#JprivMsgCnt').val('').height(34);
                            window.setTimeout(function(){$('#J_privmsg_wall_wrap').scroller().scrollToBottom(100);}, 750);//android > 4.3 bug
                        },
                        error: function(xhr, why) {
                            $.privmsgTalk.sendingMsg = false;
                            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                        }
                    });
				});
            },
            
            msgPoll:{interval:3, minInterval:3, maxInterval:8, timer:null, noMsgCntr:0},
            
            setMsgPollTimer: function (txt){
                $.vv.log(txt, 'poll interval:: '+$.privmsgTalk.msgPoll.interval); //>>>
                if($.privmsgTalk.msgPoll.timer) {
                    clearTimeout($.privmsgTalk.msgPoll.timer);
                    $.privmsgTalk.msgPoll.timer = null;
                    $.privmsgTalk.pollingMsg    = false;
                }
                $.privmsgTalk.msgPoll.timer = setTimeout($.privmsgTalk.pollMsgs, $.privmsgTalk.msgPoll.interval * 1000); 
            },
            
            //function used to poll field new msgs; TODO: use websocket and flash to implement this
            pollMsgs: function(){
                var wall=$('#J_privmsg_wall'), minId = wall.attr('minMsgId');
                $.ajax({
                    url: $.ckj.cfg.mapi + '/?m=message&a=poll&ftid='+$.privmsgTalk.cfg.ftId+'&minid='+minId,
                    dataType: 'json',
                    noQueue: true,
                    success: function(r) {
                        if(r.status == 0) {
                            var msgs = r.data.rlist, html = '';
                            if(msgs.length > 0){
                                wall.attr('minMsgId', msgs[msgs.length - 1].id);
                                html = $.privmsgTalk.renderPrivmsg(r.data);
                                wall.append(html);
                                $('#J_privmsg_wall_wrap').scroller().scrollToBottom(300);              
                                $.privmsgTalk.msgPoll.interval = $.privmsgTalk.msgPoll.minInterval; //if we have msgs, we should poll quickly
                                $.privmsgTalk.msgPoll.noMsgCntr = 0;
                            } else {
                                //no msgs, slow down the poll speed
                                if($.privmsgTalk.msgPoll.interval < $.privmsgTalk.msgPoll.maxInterval) $.privmsgTalk.msgPoll.interval++;  
                                else $.privmsgTalk.msgPoll.interval = $.privmsgTalk.msgPoll.maxInterval;
                                $.privmsgTalk.msgPoll.noMsgCntr++; //log the on msg poll times
                            }
                        } else {
                            
                        }
                        
                        $.privmsgTalk.setMsgPollTimer('setMsgPollTimer:: success poll minid:: '+minId);//>>> poll new msgs again 
                    },
                    error: function(){
                        //error, slow down the poll speed
                        if($.privmsgTalk.msgPoll.interval < $.privmsgTalk.msgPoll.maxInterval) $.privmsgTalk.msgPoll.interval++; 
                        else $.privmsgTalk.msgPoll.interval = $.privmsgTalk.msgPoll.maxInterval;
                        $.privmsgTalk.setMsgPollTimer('setMsgPollTimer:: error poll minid:: '+minId); //>>> even error, we still to poll new msgs again 
                    }
                });
            }
        };
        $.privmsgTalk.init();
})(af);
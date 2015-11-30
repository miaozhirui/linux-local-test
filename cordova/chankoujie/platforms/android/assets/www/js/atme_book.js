(function($) {
    $.atmeBook = {
        cfg: {
        	panelInited:false
        },
        init: function(options) {
        	$("#atme_book").bind("loadpanel",function(e){
        		$.query('#atme_book').on('click', '.note_f', function(e) {
        			e.preventDefault(); e.stopPropagation();
             		var wall = $.query('#J_atme_wall');
                    var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                     	did=$(this).attr('did'), aUrl=$(this).attr('aUrl');

             		jpop.setCnt('<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".note_f" wallId="J_atme_wall">\
             						<p data-pressed="true" class="J_lopGoHash" aUrl="'+aUrl+'">查看原文<i class="fa fa-angle-right"></i></p>\
		            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=space&a=tipat_del&id='+did+'" \
		            					tipTit="删除" tipMsg="确定要删除该条消息么？">删除@提醒<i class="fa fa-angle-right"></i></p>\
		            				<p data-pressed="true" class="J_lopCel">取消</p>\
		            			</div>');
                });

        		if(e.data.goBack)return;
        		
        		if(!$.ckj.user.id) { $.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}//must login
        		var params = $.query("#atme_book").data('params'),
    				atid = params[0];//atid

        		$.atmeBook.panelInit();
        		$.feed.resetWall('#J_atme_wall', true);
        		$.atmeBook.loadAtmes();
    		});
        	
         	$("#space_album").bind("unloadpanel", function(e) {
         		$.query('#atme_book').off('click', '.note_f');
         	});
        },
        
        panelInit:function() {
        	if( $.atmeBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_atme_wall_wrap"), wall = $.query('#J_atme_wall'), padding=0;
            padding = parseInt($.vv.cfg.cWidth*0.0);
            padding = padding >= 20 ? 20 : padding;
            wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-90});

            $.feed.init('#J_atme_wall');
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
        	
            $.query('#atme_book').attr('scrollTgt', '#J_atme_wall_wrap');

        	$.atmeBook.cfg.panelInited = true;
        },
        
        loadAtmes: function() {
        	var wall = $.query('#J_atme_wall');
        	var uri  =  '/?m=space&a=atme&atid='+wall.attr('atid');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        renderAtmes:function(data){
        	var html   = '';
        	if(data.rlist.length > 0){
        		html = data.html;
        	} 
        	return html;
        },
    };
    
    $.atmeBook.init();
})(af);

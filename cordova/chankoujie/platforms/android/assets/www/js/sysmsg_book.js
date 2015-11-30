(function($) {
    $.sysmsgBook = {
        cfg: {
            panelInited: false
        },
        init: function(options) {
            $("#sysmsg_book").bind("loadpanel",function(e) {
            	$.query('#sysmsg_book').on('click', '.sysmsg.new', function(e) {
        			e.preventDefault(); e.stopPropagation();
             		var wall = $.query('#J_sysmsg_wall');
                    var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), $this=$(this),
                     	did=$this.attr('did');
                    
             		jpop.setCnt('<div id="J_listSysmsgOpts" class="listOpsBtn" rId="'+did+'" iType=".sysmsg" wallId="J_sysmsg_wall">\
		            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=message&a=read&type=sys&id='+did+'" >标记为已读</p>\
		            				<p data-pressed="true" class="J_lopCel">取消</p>\
		            			</div>');
             		
             		$.query('#afui').on('click', '#J_listSysmsgOpts > p', function(e){
             			e.stopPropagation(); e.preventDefault();
             			var listOp = $.query('#J_listSysmsgOpts'), $this=$(this);//>>> listOp must captured here
                		
                		if($this.hasClass('J_lopCel')){ $.ui.popup().hide(); return; }
                		if($this.hasClass('J_lopDoAjax')){
                		    $.vv.tip({icon:'loading'});
	            	    	$.ajax({
	                            url: $.ckj.cfg.mapi + $this.attr('aUrl'),
	                            success: function(rst){
	                            	$.vv.tip({close:true});
	                            	if(rst.status != 0 && rst.status != 8){ //error happened
	                            		$.vv.tip({ content:rst.msg, icon:'error', time:3000}); 
	                            	} else {
	                            		var wallId = listOp.attr('wallId'), iType = listOp.attr('iType');
	                            			$('#'+wallId+' '+iType+'[did="'+listOp.attr('rId')+'"]').removeClass('new');
	                            	}
	                            	$.ui.popup().hide();
	                            	listOp = null;
	                            },
	                            dataType: "json"
	            	    	});
 
                			return;
                		}
                		
                		if($this.hasClass('J_replySysmsg')) {
                			var nf = $($('#'+listOp.attr('wallId')+' '+listOp.attr('iType')+'[did="'+listOp.attr('rId')+'"]')), 
                				cid = listOp.attr('rId'), tip=$this.attr('rTip');
                            var jpop = $.ui.popup({ id:"J_rplySysmsg", title:'<i class="fa fa-share"></i>答复回应',blockUI:true, addCssClass:'popBottom'});
                            jpop.setCnt('<div class="dlg_rplysysmsg">\
    									    <form id="J_rplySysmsgFrm" action="/?m=space&a=tipcmt_reply" method="post">\
    									    	<input type="hidden" name="id" value="'+cid+'">\
    										    <textarea class="J_content fw_content" name="content">'+tip+'</textarea>\
    										    <div class="fw_submit_box cfx">\
    										        <input type="submit" class="btn gbtn fr" value="确定">\
    										    </div>\
    									    </form>\
    									</div>');
                            $.sysmsgBook.replySysmsgFrm($('#J_rplySysmsgFrm'), jpop);
                		}
                	});
                });
            	
                if(e.data.goBack)return;
                if(!$.ckj.user.id) { $.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}//must login
                $.sysmsgBook.panelInit();
                $.feed.resetWall('#J_sysmsg_wall', true);
                $.sysmsgBook.loadSysmsg();
            });
        },
        panelInit:function() {
            if( $.sysmsgBook.cfg.panelInited === true ) return;
            
            var wallWrap = $.query('#J_sysmsg_wall_wrap'), wall = $.query('#J_sysmsg_wall'), padding=0;
            wall.attr({'masonry':'n','cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-100});
            $.feed.init('#J_sysmsg_wall');
            var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, useJsScroll:false});
            
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
            
            $.query('#sysmsg_book').attr('scrollTgt', '#J_sysmsg_wall_wrap');
            
            $.query('#J_sysmsg_wall').on('longTap', '.sysmsg', function(e){
                e.preventDefault(); e.stopPropagation();
            	alert('hi');
            });
            $.sysmsgBook.cfg.panelInited = true;
        },
        loadSysmsg:function() {
        	var wall = $.query('#J_sysmsg_wall');
        	var uri  =  '/?m=message&a=system';
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        renderSysmsg:function(data){
        	var html = '';
        	if(data.rlist.length > 0) {
				$.each(data.rlist, function(idx, m){
					html += '<li did="'+m.id+'" class="sysmsg '+( m.status==1 ? '' : 'new' )+'">\
					            <p>'+m.info+'</p>\
					            <p class="time">'+m.add_time+'</p>\
					        </li>';
    			});
        	} 
        	return html;
        },
    };
    $.sysmsgBook.init();
})(af);

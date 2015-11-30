(function($){
    $.groupDtl = {
    	cfg: {
    		id:0,
    		panelInited:false,
    		
    		groupLoaded:false,
    		grpSubLoaded:false,
    		grpMemLoaded:false
    	},
        
        init: function(options) {
        	$("#group_detail").bind("loadpanel",function(e){
        	    $.groupDtl.panelInit();
        	    
        		var params = $.query("#group_detail").data('params'), 
        		    groupId = params[0];
        		    
        		if(e.data.goBack) {
        		    $('#group_detail').css('opacity', '1');
        		    return;
        		}
        		
                $.groupDtl.cfg.groupLoaded  = false;
                $.groupDtl.cfg.grpSubLoaded = false;
                $.groupDtl.cfg.grpMemLoaded = false;
        		
        		$.groupDtl.cfg.id = groupId;

        		$.query("#group_detail .angle_tabs *[t=home]").trigger('click');
    		});
    		
    		$.query("#group_detail").bind('unloadpanel', function(e) {
                if(e.data.goBack) {
                    $.feed.resetWall('#J_grp_dt_subs_wall', true);
                    $.feed.resetWall('#J_grp_dt_mems_wall', true);
                }
            });
        },
        
        panelInit: function() {
        	if( $.groupDtl.cfg.panelInited === true ) return;
        	//tab switch
            $("#group_detail .angle_tabs").on("click", "a", function(e) {
            	e.stopPropagation();e.preventDefault();
            	
            	var type = $(this).attr('t'), wall = null, wallWrap = '';
            	
                $.query("#group_detail .angle_tabs *").removeClass('cur');
                $(this).addClass('cur');
                $.query("#group_detail .J_tab_panel").hide();

                if( type == 'home' ){
                	wallWrap = $.query('#J_grp_dt_home_wrap');
                	wallWrap.show();
                    if(!$.groupDtl.infoScroller) {
                    	$.groupDtl.infoScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
                    }
                    if(!$.groupDtl.cfg.groupLoaded){
                    	wallWrap.scroller().scrollToTop(0);
                    	$.groupDtl.loadGroup($.groupDtl.cfg.id);
                    }
                    $.query('#group_detail').attr('scrollTgt', '#J_grp_dt_home_wrap');
                } else if( type == 'grpsub' ) {
                	wall = $.query('#J_grp_dt_subs_wall');
                	wallWrap = $.query('#J_grp_dt_subs_wrap');
                	wallWrap.show();
                    if(!$.groupDtl.grpSubScroller) {
                    	var padding = 0;
                    	wall.attr({ 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'masonry': 'n',
                    				'initHeight': $.vv.cfg.cHeight-(parseInt(wallWrap.find('.grp_dt_top').height()) + 135)});
                    	$.feed.init('#J_grp_dt_subs_wall');
                    	$.groupDtl.grpSubScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                    	            
                        if($.ckj.cfg.useInfinite) {
                            $.groupDtl.grpSubScroller.addInfinite();
                            $.bind($.groupDtl.grpSubScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        } 
                    }
                    if(!$.groupDtl.cfg.grpSubLoaded){
                    	wall.attr('gid', $.groupDtl.cfg.id);
                    	$.feed.resetWall('#J_grp_dt_subs_wall', true);
                    	$.groupDtl.loadGrpsubs();
                    }
                    $.query('#group_detail').attr('scrollTgt', '#J_grp_dt_subs_wrap');
                } else if( type == 'grpmem' ) {
                	wall = $.query('#J_grp_dt_mems_wall');
                	wallWrap = $.query('#J_grp_dt_mems_wrap');
                	wallWrap.show();
                	//grpSubScroller.unlock(); cmtScroller.lock();
                    if(!$.groupDtl.grpMemScroller) {
                    	var padding = 0;
                    	wall.attr({ 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'masonry': 'n',
                    				'initHeight': $.vv.cfg.cHeight-(parseInt(wallWrap.find('.grp_dt_top').height()) + 135)});
                    	$.feed.init('#J_grp_dt_mems_wall');
                    	$.groupDtl.grpMemScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                    	if($.ckj.cfg.useInfinite) {
                            $.groupDtl.grpMemScroller.addInfinite();
                            $.bind($.groupDtl.grpMemScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        } 
                    }
                    if(!$.groupDtl.cfg.grpMemLoaded){
                    	wall.attr('gid', $.groupDtl.cfg.id);
                    	$.feed.resetWall('#J_grp_dt_mems_wall', true);
                    	$.groupDtl.loadGrpmems();
                    }
                    $.query('#group_detail').attr('scrollTgt', '#J_grp_dt_mems_wrap');
                }
            });
        	
        	/**** join/quitout group *****/
        	$.query('#group_detail').on('click', '.J_quit_grpbtn', function(e){
        		e.stopPropagation();e.preventDefault();
        		var $that=$(this);
        		$.ui.popup({
            	    title:"退出吃群",
            	    message:"退出吃群后您将不能在该群发表主题和评论了哦！确定退出吗？",
            	    cancelText:"取消",
            	    cancelCallback: null,
            	    doneText:"退出",
            	    supressFooter:false,
            	    cancelClass:'button',
            	    doneClass:'button',
            	    doneCallback: function () {
            	        $.vv.tip({icon:'loading'});
            	    	$.ajax({
                            url: $.ckj.cfg.mapi+'/?m=group&a=quitout&id='+$that.attr('data-id'),
                            type:'get',
                            dataType: "json",
                            success: function(rst){
                            	//$.vv.log('logout_user_info::', JSON.stringify(rst.data));
                            	if(rst.status != 0 && rst.status != 8){ //error happened
                            		$.vv.tip({ content:rst.msg, icon:'error', time:3000}); 
                            	} else {
                            		$.vv.tip({ content:rst.msg, time:2000});
                            		$that.removeClass('J_quit_grpbtn').addClass('J_join_grpbtn');
                            		$that.find('.fa').removeClass('fa-minus').addClass('fa-plus');
                            		$that.find('.tip').text('加入吃群');
                            		
                                    var nb = $('#group_detail .JgrpMemNum');
                                    nb.text(parseInt(nb.text())-1);
                            	}
                            }
                       });
            	    },
            	    blockUI:true,
            	    cancelOnly:false
            	});
        	});
        	
        	$.query('#group_detail').on('click', '.J_join_grpbtn', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.user.isLogin({
                	okFunc: function($this){
                        var id = $this.attr('data-id');
                        $.vv.tip({icon:'loading'});
    	                $.getJSON($.ckj.cfg.mapi + '/?m=group&a=join', {id:id}, function(rst){
    	                	if(rst.status == 0 || rst.status == 8){
    	                		var status = rst.data;
    	                		$.vv.tip({ content:rst.msg, time:2000});
    	                		if(status == 'joined') {
    	                			$this.removeClass('J_join_grpbtn').addClass('J_quit_grpbtn');
    	                			$this.find('.fa').removeClass('fa-plus').addClass('fa-minus');
    	                			$this.find('.tip').text('退出吃群');
    	                			
    	                			var nb = $('#group_detail .JgrpMemNum');
    	                			nb.text(parseInt(nb.text())+1);
    	                		} else {
    	                			$this.removeClass('J_join_grpbtn J_quit_grpbtn');
    	                			$this.find('.fa').removeClass('fa-plus fa-minus');
    	                			$this.find('.tip').text('等待审核中...');
    	                		}
	                        }else{
	                            $.vv.tip({content:result.msg, icon:'error'});
	                        }
    	                });
                	},
                	okData:$(this)
                });
                return false;
            });
        	
        	$.query('#J_grp_dt_pubsub').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.user.isLogin({
                	okFunc: function($this){
                        var id = $this.attr('data-id');
    	                $.getJSON($.ckj.cfg.mapi + '/?m=group&a=isingroup', {id:id}, function(rst){
    	                	if(rst.status == 0 || rst.status == 8){
    	                		//$.vv.log('status::'.status);
    	                		var status = rst.data;
    	                		if(status=='tocheck') {
    	                			$.vv.tip({content:'管理员还未通过您的群加入申请， 请耐心等待哦~', icon:'info', time:3000});
    	                		} else if(status=='notjoined'){
    	                			$.ui.popup({
    	                        	    title:"加入吃群",
    	                        	    message:"还未加入该吃群不能发表主题， 您确定要加入吃群？",
    	                        	    cancelText:"取消",
    	                        	    cancelCallback: null,
    	                        	    doneText:"加入",
    	                        	    supressFooter:false,
    	                        	    cancelClass:'button',
    	                        	    doneClass:'button',
    	                        	    doneCallback: function () {
    	                        	    	$.ajax({
    	                                        url: $.ckj.cfg.mapi+'/?m=group&a=join&id='+id,
    	                                        type:'get',
    	                                        success: function(rst){
    	                                        	if(rst.status == 0 || rst.status == 8){
    	                    	                		var status = rst.data;
    	                    	                		$.vv.tip({ content:rst.msg, time:2000});
    	                    	                		if(status == 'joined') {
    	                    	                			//$.vv.log('loadContent 222');
    	                    	                			$.ui.loadContent('#subject_share/gid/'+id, false, false,$.ckj.cfg.formTrans);
    	                    	                		} else {
    	                    	                			$.vv.tip({content:'管理员需要审核您的申请， 请耐心等待哦~', icon:'info'});
    	                    	                		}
    	                	                        }else{
    	                	                            $.vv.tip({content:result.msg, icon:'error'});
    	                	                        }
    	                                        },
    	                                        dataType: "json"
    	                                   });
    	                        	    },
    	                        	    blockUI:true,
    	                        	    cancelOnly:false
    	                        	});
    	                		} else if(status=='joined') {
    	                			//$.vv.log('loadContent 111');
    	                			$.ui.loadContent('#subject_share/gid/'+id, false, false, $.ckj.cfg.formTrans);
    	                		}
	                        }else{
	                            $.vv.tip({content:result.msg, icon:'error'});
	                        }
    	                });
                	},
                	okData:$(this)
                });
                return false;
            });
            
        	//$.vv.ui.fixed_nav('#group_detail', '#J_grp_dt_tabs');
        	$.groupDtl.cfg.panelInited = true;
        },

        loadGroup:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=group&a=home&id='+id,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var group = rst.data.group, likeGroups = rst.data.likeGroups, memStatus=rst.data.memStatus, html='';
                		//top cover
                		html = '<img class="cover" errimg="data/default/gcover_600.jpg" src="'+group.cover+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);" />\
		                			<div class="topbox pabs">\
		                		<img class="logo pabs" src="'+group.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>\
		                		<div class="info">\
		                			<span class="title">'+group.name+'</span>\
		                			<div class="time">创建于:'+group.add_time.split(' ')[0]+'</div>\
		                		</div>\
		                	</div>';
                		
                		$.query('#group_detail .grp_dt_top').html(html);
                		
                		//group meta
                		html = '<p><span class="label">主题：</span><span class="val">'+group.subjects+'</span></p>\
	                		    <p><span class="label">成员：</span><span class="val JgrpMemNum">'+group.members+'</span></p>\
	                		    <p class="jgroup">\
	                		    	<a  data-pressed="true" data-id="'+group.id+'" class="'+( memStatus=='joined' ? 'J_quit_grpbtn' : memStatus=='notjoined' ? 'J_join_grpbtn' : '' )+'">\
		                		    	<i class="fa '+( memStatus=='joined' ? 'fa-minus' : memStatus=='notjoined' ? 'fa-plus' : '' )+'"></i>\
		                		    	<e class="tip">'+( memStatus=='joined' ? '退出该群' : memStatus=='notjoined' ? '加入该群' : '审核中...' )+'</e>\
	                		    	</a>\
	                		    </p>';
                		$.query('#J_grp_dt_meta').html(html);
                		
                		//group intro 
                		$.query('#J_grp_dt_intro').html(group.intro);
                		$.query('#J_grp_dt_intro').cntTrans({urlTrans:true, origTrans:true});
                		//pub sub
                		html = '<a data-id="'+group.id+'" class="btn gbtn fr" data-pressed="true"><i class="fa fa-pencil"></i>发表主题</a>';
                		$.query('#J_grp_dt_pubsub').html(html);
                		
                		//else groups
            			if(likeGroups.length > 0){
            				html = '<h1 class="title">这个群的人也喜欢：</h1>\
            							<ul class="like_list cfx">';
            				html += $.ckj.renderSgroups({'rlist':likeGroups});
            				html += '</ul>';
            				
            				$.query('#J_grp_dt_relgrps').html(html).show();
            			} else {
            				$.query('#J_grp_dt_relgrps').hide();
            			}
            			
            			$('#group_detail').css('opacity', '1');
            			
            			$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':11, 'title':r.name, 'img':r.avatar});}, null, [group]);
                	}
                	
                	$.groupDtl.cfg.groupLoaded = true;
                },
                dataType: "json"
            });
        },

        loadGrpsubs: function() {
        	var wall = $.query('#J_grp_dt_subs_wall'),
        		uri = '/?m=subject&a=book&gid='+wall.attr('gid');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.groupDtl.cfg.grpSubLoaded = true;
        },
        
        loadGrpmems: function() {
        	var wall = $.query('#J_grp_dt_mems_wall'),
        	  	uri = '/?m=group&a=member&gid='+wall.attr('gid');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.groupDtl.cfg.grpMemLoaded = true;
        },
    };
    $.groupDtl.init();
})(af);

(function($){
    $.subjectDtl = {
    	cfg: {
    		id: 0,
    		panelInited: false,
    		loadingSubject: 'n',
    		swipeInited: false
    	},
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	shareMsg: [	 {'pre':'挺好的一篇文章：', 'suf':'有兴趣的可以看看哦！'}, 
	    	         {'pre':'', 'suf':'，这篇文章不错，涨姿势啦！'}
    	         ],
        init: function(options) {
        	$("#subject_detail").bind("loadpanel",function(e) {
        		if(e.data.goBack) {
        		    $('#subject_detail').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#subject_detail").data('params'),
    				subId  = params[0];
	    		if($.subjectDtl.cfg.id == subId) {
	    		    $('#subject_detail').css('opacity', '1');
	    		    return; //avoid loading the same ...
	    		}
	    		else $.subjectDtl.cfg.id = subId;
	    		
	    		$.subjectDtl.panelInit();
	    		
	    		$.query("#subject_detail").scroller().scrollToTop(0);
	    		$.subjectDtl.loadSubject($.subjectDtl.cfg.id);
    		});
        },
        
        panelInit:function() {
        	if( $.subjectDtl.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query('#subject_detail');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
        	wallWrap.addClass('scroll_nobar');
        	
        	wallWrap.on('click', '.J_sharesub', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ckj.sShare($.subjectDtl.shareInfo, $.subjectDtl.shareMsg);
        	});
        	
        	$.user.follow('#subject_detail');
        	$.user.unFollow('#subject_detail');
        	$.comOp.follow('#subject_detail');
        	$.comOp.unFollow('#subject_detail');

        	wallWrap.on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.user.isLogin({
                	okFunc: function($this){
                        var id = $this.attr('group-id');
    	                $.getJSON($.ckj.cfg.mapi + '/?m=group&a=isingroup', {id:id}, function(rst){
    	                	if(rst.status == 0 || rst.status == 8){
    	                		//$.vv.log('status::'.status);
    	                		var status = rst.data;
    	                		if(status=='tocheck') {
    	                			$.vv.tip({content:'管理员还未通过您的群加入申请， 请耐心等待哦~', icon:'info', time:3000});
    	                		} else if(status=='notjoined'){
    	                			$.ui.popup({
    	                        	    title:"加入吃群",
    	                        	    message:"不是该群成员不能发表回应哦， 要加入该吃吃群么？",
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
    	                    	                			$.ui.loadContent($this.attr('tourl'),false,false,$.ckj.cfg.formTrans);
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
    	                			$.ui.loadContent($this.attr('tourl'),false,false,$.ckj.cfg.formTrans);
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
        	
        	/*
            $("#J_sub_dt_swipes").swipe({ //bug on iOS
                delay: 0, //don't auto loop
                sTime: 300,
                idxSelector: '#J_sub_dt_swipetabs > li',
                wrap : false,
            });
            */
           
            $('#subject_detail').on('click', '#J_subjectBadReport', function(){
                $.ckj.badReport('举报吃群主题', 'subject', $.subjectDtl.cfg.id);
            });

            $.vv.ui.onPressed('#J_sub_dt_ops');
            
            $.query('#subject_detail').attr('scrollTgt', '#subject_detail');
            $.subjectDtl.cfg.panelInited = true;
        },
        loadSubject:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax( {
                url: $.ckj.cfg.mapi+'/?m=subject&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var sub 	= rst.data.subject,  authorShip = rst.data.authorShip, cmts = rst.data.cmts, sHtml=''; 
                			//relSubs = rst.data.relStuff.subject, relFaqs = rst.data.relStuff.faq, html='';
                		//top info
                		html = '<div class="submeta">\
							    	<div class="title">'+sub.title+'\
							    		<a class="fgroup" href="#group_detail/'+sub.group_id+'">(<i class="fa fa-group">'+sub.group_name+'</i>)</a>\
							    	</div>\
							    </div>\
							    <div class="sinfo prel">\
							    <a href="#space_index/'+sub.uid+'"><img src="'+sub.avatar+'" class="avatar" /></a>\
							        <a href="#space_index/'+sub.uid+'" class="uname">'+sub.uname+'</a>\
							        '+$.ckj.renderFollowShipBtn(sub.uid, $.ckj.user.id, authorShip)+'\
							    </div>';
                		$.query('#J_sub_dt_top').html(html);
                		$.query('#J_sub_dt_misc').html(
                		    '<span class="hits"><i class="fa fa-eye"></i><e>'+sub.hits+'</e>\
                		    </span> <span class="atime">'+sub.add_time.split(' ')[0]+'</span>'
                		);
                		$.query('#J_sub_dt_cnt').html(sub.cnt);
                		
                		$.query('#subject_detail *[data-id]').attr('data-id', sub.id);
                		$.query('#subject_detail .J_tocmt .num').html(sub.replys);
                		$.query('#J_sub_dt_ops .jfollow .num').html(sub.collects);
                		$.query('#subject_detail .J_tocmt').attr({'tourl': '#comment_book/subject/'+sub.id, 'group-id':sub.group_id});
                		
                		//sum_cmts
            			html='';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                			$.query('#J_sub_dt_cmts').html(html).show();
                		} else {
                			$.query('#J_sub_dt_cmts').html(html).hide();
                		}
                		
                		//relsubs
                		if(false && relSubs.length > 0) {
                			$.query('#J_sub_dt_relsubs').html($.ckj.renderGrpSubs(relSubs));
                		} else {
                			//$.query('#J_sub_dt_relsubs').html('<li class="norecords">没有类似主题撒~</div>');
                		}
                		
                		//relsubs
                		if(false && relFaqs.length > 0) {
                			html='';
                			$.each(relFaqs, function(idx, f){
                				html += '<li class="cfx">\
                							<a href="#faq_detail/'+f.id+'">\
                								<i class="fa fa-question-circle"></i>\
                								<span class="mid ofh">'+f.title+'</span>\
                								<span class="last">'+f.ans+'回答</span>\
                							</a>\
                						</li>';
                			});
                			$.query('#J_sub_dt_relfaqs').html(html);
                		} else {
                			//$.query('#J_sub_dt_relfaqs').html('<li class="norecords">没有类似问题撒~</div>');
                		}
                		
                		$.query('#J_sub_dt_cnt').cntTrans({urlTrans:true, origTrans:true});
                		var shareImg = sub.gavatar, subImgs = $.query('#J_sub_dt_cnt').find('img[src*=subject]');
                		if(subImgs.length > 0) shareImg = subImgs[0].src;
                		
                		$('#subject_detail').css('opacity', '1');
                		
                		$.subjectDtl.shareInfo = {'stitle': sub.title+'【'+sub.group_name+'】', 'sname':sub.title, 
								 'imgUrl':shareImg, 'dtlUrl':$.ckj.cfg.siteUrl+'/subject/'+sub.id};
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':12, 'title':r.title, 'img':''});}, null, [sub]);
                	}
                	
                	$.subjectDtl.cfg.loadingSubject = 'n';
                },
                dataType: "json",
                timeout:$.ckj.cfg.timeOut,
                error:function(xhr, err){
                	if(err == 'timeout')$.vv.tip({ content:'请求超时，请稍后再试!'});
                	else $.vv.tip({ content:'请求出错，请稍后再试!'});
                }
            });
        }
    };
    $.subjectDtl.init();
})(af);

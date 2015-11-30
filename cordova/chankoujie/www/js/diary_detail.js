(function($){
    $.diaryDtl = {
    	cfg: {
    		id:0,
    		loadingDiary:'y',
    		panelInited:false
    	},
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	shareMsg: [	 {'pre':'太赞啦：', 'suf':'有兴趣的可以看看哦！'}, 
	    	         {'pre':'', 'suf':'，这篇文章不错，涨姿势啦！'}
    	         ],
        init: function(options){
        	$.query("#diary_detail").bind("loadpanel",function(e){
        		if(e.data.goBack) {
        		    $('#diary_detail').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#diary_detail").data('params'),
        			did  = params[0];
        		if($.diaryDtl.cfg.id == did) {
        		    $('#diary_detail').css('opacity', '1');
        		    return; //avoid loading the same ...
        		}
        		else $.diaryDtl.cfg.id = did;
        		$.diaryDtl.panelInit();
        		$.diaryDtl.loadDiary();
    		});
        },
        panelInit: function(){
        	if( $.diaryDtl.cfg.panelInited === true ) return;
        	var wallWrap = $.query('#J_diary_wrap');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
            wallWrap.addClass('scroll_nobar');
            
        	$.user.follow('#diary_detail');
        	$.user.unFollow('#diary_detail');
        	$.comOp.follow('#diary_detail');
        	$.comOp.unFollow('#diary_detail');
        	$.comOp.praise('#diary_detail');
        	$.comOp.unPraise('#diary_detail');
        	
        	$.query("#diary_detail").on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,$.ckj.cfg.cmtTrans);
        	});
        	
        	$.query("#diary_detail").on('click', '.J_share_diary', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ckj.sShare($.diaryDtl.shareInfo, $.diaryDtl.shareMsg);
        	});
        	
            $.query('#diary_detail').attr('scrollTgt', '#J_diary_wrap');
            $.vv.ui.onPressed('#J_diary_ops');
        	$.diaryDtl.cfg.panelInited = true;
        },
        loadDiary:function() {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=diary&a=detail&id='+$.diaryDtl.cfg.id,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var d = rst.data.diary, authorShip = rst.data.authorShip, cmts = rst.data.cmts,
                			tArr = d.add_time.split(/[:\s-]+/), html = '';
                		
                		//$.vv.log('ship::'+$.ckj.renderFollowShipBtn(d.uid, $.ckj.user.id, authorShip));
                		html = '<div class="ltime">\
				                    <div class="year">'+tArr[0]+'</div>\
				                    <div class="mday">'+tArr[1]+'/'+tArr[2]+'</div>\
				                    <div class="hmin">'+tArr[3]+':'+tArr[4]+'</div>\
				                </div>\
		                    	<div class="meta f-al">\
		                    		<p class="title">'+d.title+'</p>\
		                            <div class="metainfo cfx">浏览:<i class="pink">'+d.hits+'</i></div>\
		                            <a class="avatar" href="#space_index/'+d.uid+'">\
		                               <img class="pic r3" src="'+d.avatar+'">'+d.uname+'\
		                            </a>'
		                            +$.ckj.renderFollowShipBtn(d.uid, $.ckj.user.id, authorShip)+
		                    	'</div>';
                		
                		$.query('#J_diary_top').html(html);

                		html = '<pre class="detail_intro">'+d.cnt+'</pre>\
            			        <div class="mt10 cfx">\
            			            <a href="#diary_publish" class="J_creatediary_btn btn gbtn r2" data-pressed="true"><i class="fa fa-pencil"></i>去写日记</a>\
            			        </div>';
                		$.query('#J_diary_dtl').html(html);
                		$.query('#J_diary_dtl .detail_intro').cntTrans({urlTrans:true, origTrans:true});
                		//sum_cmts
            			html='';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                			$.query('#J_diary_dt_cmts').html(html).show();
                		} else {
                			$.query('#J_diary_dt_cmts').html(html).hide();
                		}
                		
                		html = '<a class="J_follow vv-pressed" itype="diary" data-id="'+d.id+'"><i class="fa fa-bookmark"><e class="J_n">'+d.collects+'</e></i><span>收藏</span></a>\
							    <a class="J_praise vv-pressed" itype="diary" data-id="'+d.id+'"><i class="fa fa-thumbs-o-up"><e class="J_n">'+d.praises+'</e></i><span>赞同</span></a>\
							    <a class="J_tocmt vv-pressed" data-id="'+d.id+'"><i class="fa fa-comments1"><e class="J_n">'+d.comments+'</e></i><span>评论</span></a>\
							    <a class="J_share_diary vv-pressed" data-id="'+d.id+'"><i class="fa fa-share2"></i><span>分享给...</span></a>';

                		$.query('#J_diary_ops').html(html);
                		$('#diary_detail').css('opacity', '1');
                		
                		$.query('#diary_detail .J_tocmt').attr({'tourl': '#comment_book/diary/'+d.id}).find('.J_n').text(d.comments);
                		
                		var shareImg = d.shareimg, dryImgs = $.query('#J_diary_dtl').find('img[src*=diary]');
                		if(dryImgs.length > 0) shareImg = dryImgs[0].src;
                		
                		$.diaryDtl.shareInfo = {'stitle': d.title, 'sname':d.title, 
								 'imgUrl':shareImg, 'dtlUrl':$.ckj.cfg.siteUrl+'/diary/'+d.id};
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':14, 'title':r.title, 'img':''});}, null, [d]);
                	}
                	$.diaryDtl.cfg.loadingDiary = 'n';
                },
                dataType: "json"
            });
        }
    };
    $.diaryDtl.init();
})(af);

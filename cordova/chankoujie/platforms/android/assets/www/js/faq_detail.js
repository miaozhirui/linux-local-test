(function($) {
    $.faqDtl = {
    	cfg: {
    		id: 0,
    		panelInited: false,
    		loadingFaq: 'n',
    		faqLoaded: false
    	},
    	needRefresh: false,
    	
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	
    	shareMsg:[ {'pre':'好问题：', 'suf':'有兴趣的可以看看哦！'},
    	           {'pre':'', 'suf':'可以看看哦'}
    	         ],
    	         
        init: function(options) {
        	$("#faq_detail").bind("loadpanel",function(e) {
        		var params = $.query("#faq_detail").data('params'),
    				faqId  = params[0];
    			$.vv.log('$.faqDtl.cfg.id:: '+$.faqDtl.cfg.id, 'faqId:: '+faqId, '$.faqDtl.needRefresh:: '+$.faqDtl.needRefresh);
	    		if($.faqDtl.cfg.id == faqId && $.faqDtl.cfg.faqLoaded && !$.faqDtl.needRefresh) {
	    		    $('#faq_detail').css('opacity', '1');
	    		    return; //avoid loading the same ...
	    		}
	    		$.faqDtl.cfg.id = faqId;
	    		$.faqDtl.cfg.faqLoaded = false;
	    		
	    		$.faqDtl.panelInit();
	    		$.feed.resetWall('#J_faqans_wall', true);
	    		
	    		if($.vv.needEvenHeight)$('#J_faqdtl_cnt').css('height', 'auto');
	    		$.faqDtl.loadFaq();
	    		$.faqDtl.loadFaqAns();
    		});
        },
        
        panelInit:function() {
        	if( $.faqDtl.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#faq_detail"), wall = $.query('#J_faqans_wall'), padding=0;
    		padding = parseInt($.vv.cfg.cWidth*0);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':200});
        	
        	$.feed.init('#J_faqans_wall');
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
            
            $('#faq_detail').on('click', '#J_faqBadReport', function(){
                $.ckj.badReport('举报美食问题', 'faq', $.faqDtl.cfg.id);
            });
            
        	$.query('#faq_detail').attr('scrollTgt', '#faq_detail');

        	$.comOp.follow('#faq_detail');
        	$.comOp.unFollow('#faq_detail');
        	
        	$.query('#faq_detail').on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,$.ckj.cfg.cmtTrans);
        	});
        	
            $.faqDtl.cfg.panelInited = true;
        },
        
        loadFaqAns: function() {
        	var wall = $.query('#J_faqans_wall');
        	var uri = '/?m=faq&a=getans&fid='+$.faqDtl.cfg.id;
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        renderFaqAns:function(data) {
        	var html = '';
        	if(data.rlist.length > 0) {
        		$.each(data.rlist, function(idx, ans) {
        	         html += '<li class="J_ans">\
				                 <a class="agrees J_agree_ans"><i class="fa fa-thumbs-o-up cfx"></i> <em class="J_n">'+ans.agrees+'</em></a>\
				                 <div class="aname plw cfx">\
				                     <a href="/space/?uid='+ans.uid+'">\
				                        <img src="'+ans.avatar+'" \
				                             onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);" />\
				                     </a>\
				                     <a href="/space/?uid='+ans.uid+'" class="n">'+ans.uname+'回答说：</a>\
				                 </div>\
				                 <div class="answer plw J_expr">'+ans.info+'</div>\
				                 <div class="plw atime">'+ans.add_time.split(' ')[1]+'</div>\
				                 <a href="#faq_answer/'+ans.id+'" class="goto" data-dpressed="true"></a>\
				              </li>';
            	});
        	} 
        	return html;
        },
        
        loadFaq:function() {
            if(!$.faqDtl.needRefresh) $.vv.tip({icon:'loading'}); 
        	$.ajax( {
                url: $.ckj.cfg.mapi+'/?m=faq&a=detail&id='+$.faqDtl.cfg.id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var faq 	= rst.data.faq, tag_cache = faq.tag_cache, html='', sHtml='', metaEl = $.query('#J_faqdtl_cnt'), tmpHeight;
                		//faq tags
            			html='';
                		if(tag_cache) {
                			$.each(tag_cache, function(idx, t){
                				html += '<a href="#faq_book/'+t+'">'+t+'</a>';
                			});
                			
                		}
                		if(html) $.query('#J_faqdtl_tags').html(html).show();
                		else $.query('#J_faqdtl_tags').html(html).hide();
                		
                		//top info
                		html = '<div class="qtitle">'+faq.title+'</div>'
                				+(faq.desc ? '<div class="supple"> <strong class="label">问题补充：</strong>'+faq.desc+'</div>' : '')
                			    +(faq.rewards > 0 ? '<div class="rwd"><i class="fa fa-moneybag"></i>悬赏<i class="num">'+faq.rewards+'</i>颗馋豆</div>' : '');
                		
                		metaEl.html(html);
                		if($.vv.needEvenHeight) {
                		    tmpHeight = metaEl.height();
                            if(tmpHeight % 2 != 0) metaEl.height(tmpHeight+1);
                		}
                		
                        $.query('#J_faqdtl_cnt .supple').cntTrans({urlTrans:true, origTrans:true});
                		html = '<a><i class="fa fa-eye"></i>'+faq.hits+'</a>\
                	    		<a class="cmt J_tocmt" tourl="#comment_book/faq/'+faq.id+'">\
                	    			<i class="fa fa-comments1"></i><e class="num">'+faq.comments+'</e>\
                	    		</a>\
                	    		<a id="J_faqBadReport"><i class="fa fa-flag2"></i>举报</a>';
                		$.query('#J_faqdtl_meta').html(html);
                		
                		html = '<a id="J_answer" data-pressed="true" data-transition="slide" href="#faqans_publish/fid/'+faq.id+'"><i class="fa fa-key"></i>我来回答</a>\
                				<a class="'+(faq.isFollowed ? 'J_unfollow' : 'J_follow')+'" data-pressed="true" itype="faq" faType="plus" data-id="'+faq.id+'">\
                					<i class="fa '+(faq.isFollowed ? 'fa-minus' : 'fa-plus')+'"></i>\
                					<e class="ltip">'+(faq.isFollowed ? '取消关注' : '关注问题')+'</e>\
                				</a>';
                		$.query('#J_faqdtl_ops').html(html);
                		
                		$('#faq_detail').css('opacity', '1');
                		
                		var shareImg = faq.cover, subImgs = $.query('#J_faqdtl_cnt').find('img[src*=faq]');
                		if(subImgs.length > 0) shareImg = subImgs[0].src;
                		
                		$.faqDtl.shareInfo = {'stitle': faq.title, 'sname':faq.title, 
								 'imgUrl':shareImg, 'dtlUrl':$.ckj.cfg.siteUrl+'/faq/'+faq.id};
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':13, 'title':r.title, 'img':''});}, null, [faq]);
                		$.faqDtl.cfg.faqLoaded = true;
                	}
                	$.faqDtl.needRefresh = false;
                	$.faqDtl.cfg.loadingFaq = 'n';
                },
                dataType: "json",
                timeout:$.ckj.cfg.timeOut
            });
        }
    };
    
    $.faqDtl.init();
    
})(af);

(function($){
    $.rstrntDtl = {
    	cfg:{
    		panelInited:false,
    		id:0,
    		loadingRst:'n'
    	},
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	shareMsg: [	 {'pre':'', 'suf':'这家餐馆不错，喜欢尝鲜的朋友可以去吃吃哦！'}, 
    	         ],
        init: function(options) {
        	$("#rstrnt_detail").bind("loadpanel",function(e) {
        		if(e.data.goBack){
        		    $('#rstrnt_detail').css('opacity', '1');
        		    return;
        		}
        		var id = $.query("#rstrnt_detail").data('params')[0];
        		if($.rstrntDtl.cfg.id == id) {
        		    $('#rstrnt_detail').css('opacity', '1');
        		    return; //avoid loading the same ...
        		}
        		$.rstrntDtl.cfg.id = id;
        		$.rstrntDtl.panelInit();
        		
        		$.query("#J_rstdt_wrap").scroller().scrollToTop(0);
        		
        		$.rstrntDtl.cfg.loadingRst == 'y';
        		$.rstrntDtl.loadRstrnt(id);
    		});
    		
            //bad report
            $('#rstrnt_detail').on('click', '.J_moreOps', function(e){
                e.stopPropagation();e.preventDefault();
                $('#afui').actionsheet(
                    [{
                        text: '分享...',
                        cssClasses: '',
                        handler: function () {
                            setTimeout(
                                function(){
                                    $.ckj.sShare($.rstrntDtl.shareInfo, $.rstrntDtl.shareMsg);
                                }, 
                                8
                            ); //ios workaround
                        }
                    }, {
                        text: '举报...',
                        cssClasses: '',
                        handler: function () {
                            $.ckj.badReport('举报餐馆', 'rstrnt', $.rstrntDtl.cfg.id);
                        }
                    }]
                );
            });
        },
        
        panelInit:function() {
        	if( $.rstrntDtl.cfg.panelInited === true ) return;
        	var wallWrap = $.query("#J_rstdt_wrap"), panel = $.query('#rstrnt_detail');
        	wallWrap.addClass('scroll_nobar');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
        	
        	panel.on('click', '.J_shareRstimg', function(e){
        		e.preventDefault();e.stopPropagation();
        		if(!$.user.isLogin({
 	            	okFunc:function(){
 	            		$.ui.loadContent('#rstimg_share/'+$.rstrntDtl.cfg.id,false,false,$.ckj.cfg.formTrans);
 	            	},
 	            })) return false;
        	});
        	
        	panel.on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,$.ckj.cfg.cmtTrans);
        	});
        	
        	$.user.follow('#rstrnt_detail');
        	$.user.unFollow('#rstrnt_detail');
        	$.comOp.like('#rstrnt_detail');
        	$.comOp.unLike('#rstrnt_detail');
        	$.rstrntDtl.wantgo('#rstrnt_detail');
        	$.rstrntDtl.went('#rstrnt_detail');
        	
        	$.query('#rstrnt_detail').attr('scrollTgt', '#J_rstdt_wrap');
        	$.vv.ui.onPressed('#rstrnt_detail');
        	$.rstrntDtl.cfg.panelInited = true;
        },
        wantgo: function(ctx) {
        	$(ctx).on('click', '.J_want', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var aid = $this.attr('data-id');
                        $.vv.tip({icon:'loading'});
	                    $.getJSON($.ckj.cfg.mapi + '/?m=rstrnt&a=wantgo', {id:aid}, function(rst){
	                    	if(rst.status == 0){
	                    		$.vv.tip({content:rst.msg,  time:3});
	                            var nel = $this.find('.J_n');
	                            nel.text(parseInt(nel.text())+1);
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon: rst.status == 8 ? 'info' :'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        went: function(ctx) {
        	$(ctx).on('click', '.J_went', function(){
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var aid = $this.attr('data-id');
                        $.vv.tip({icon:'loading'});
	                    $.getJSON($.ckj.cfg.mapi + '/?m=rstrnt&a=went', {id:aid}, function(rst){
	                    	if(rst.status == 0){
	                    		$.vv.tip({content:rst.msg,  time:3});
	                            var nel = $this.find('.J_n');
	                            nel.text(parseInt(nel.text())+1);
	                        }else{
	                            $.vv.tip({content:rst.msg,  icon: rst.status == 8 ? 'info' :'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        loadRstrnt:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax( {
                url: $.ckj.cfg.mapi+'/?m=rstrnt&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var rstrnt 	= rst.data.rstrnt, wents = rst.data.wents, wantgos = rst.data.wantgos,
                			rstimgs = rst.data.rstimgs, cmts = rst.data.cmts, html = '', tHtml='';
                		
                		//imginfo mod
                		tHtml += '<div class="imginfo f-f">\
						    		<a class="palbum vv-pressed J_shareRstimg">\
							            <img src="'+rstrnt.cover+'" onload="$.ckj.centerImg(this, 100, 100);" onerror="$.ckj.onImgError(this);" />\
							            <i class="fa fa-camera"></i>\
							        </a>\
							        <div class="meta f-al">\
							            <h1>'+rstrnt.name + (rstrnt.branch ? "("+rstrnt.branch+")" : '')+'</h1>'
							            +(rstrnt.alias ? '<div><span class="h">别名：</span><span class="val">'+rstrnt.alias+'</span></div>' : '')+'\
							            <div class="cost"><span class="h">人均：</span><span class="val">￥ '+rstrnt.cost+'</span></div>\
							            <div class="uinfo">\
							                <a href="#space_index/'+rstrnt.id+'">\
							                    <img src="'+rstrnt.avatar+'" \
							                         onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>'+rstrnt.uname+'<span>分享</span>\
							                </a>'
							            +$.ckj.renderFollowShipBtn(rstrnt.uid, $.ckj.user.id, rst.data.author_ship)+'</div>\
							        </div>\
						    	</div>';
                		
                		//>>> addr
                		tHtml +='<a href="#rstrnt_map/'+rstrnt.name+'/'+rstrnt.lng+'/'+rstrnt.lat+'" class="sheadbox addr f-f f-vc vv-pressed">\
		                	        <i class="head fa fa-map-marker"></i>\
		                	        <span class="cnt f-al">\
		                	           <i>'+rstrnt.street_addr+'</i>'
		                	           +(rstrnt.near ? '<i class="near">靠近: '+rstrnt.near+'</i>' : '')+'\
		                	        </span>\
		                	        <i class="go fa fa-angle-right"></i>\
		                	    </a>';
                		
                		//>>> phones
                		if(rstrnt.phone){
                			$.vv.log('rstrnt.phone::'+rstrnt.phone);
                            var phones = rstrnt.phone.split(/\s+/), phtml='';
                            phones = $.isArray(phones) ? phones : [phones] ; //split bug
                            if(phones) {
                            	var num = '';
                            	$.each(phones, function(idx, p){
                            		num = p.trim();
                            		if(num){
                            			phtml += '<a href="tel:'+num+'">'+num+'</a>';
                            		}
                            	});
                            }
                            
                            if(phtml){
                            	tHtml += '<div class="sheadbox f-f f-vc vv-pressed">\
		                        	        <i class="head fa fa-phone"></i>\
		                        	        <div class="cnt phones f-al">'+phtml+'</div>\
		                        	        <i class="go fa fa-angle-right"></i>\
		                        	    </div>';
                            }
                		}
                		
                		//open time 
                		if(rstrnt.opentime){
                			tHtml += '<div class="sheadbox f-f f-vc">\
		                	            <i class="head fa fa-alarm"></i>\
		                	            <a class="cnt f-al">'+rstrnt.opentime+'</a>\
		                	        </div>';
                		}
                		
                		html += tHtml ? '<div class="rst_top">'+tHtml+'</div>' : '';
                		
                		tHtml = '';
                		//rst intro
                		if(rstrnt.intro){
                			tHtml += ' <div class="bheadbox">\
				                		        <p class="head">餐馆介绍：</p>\
				                		        <p class="cnt">'+rstrnt.intro+'</p>\
				                		    </div>';
                		}
                		
                		//rst features
                		if(rstrnt.features){
                			tHtml += ' <div class="bheadbox">\
				                		        <p class="head">特色菜肴：</p>\
				                		        <p class="cnt">'+rstrnt.features+'</p>\
				                		    </div>';
                		}
                		
                		//rst suits
                		if(rstrnt.suits){
                			tHtml += ' <div class="bheadbox">\
				                		        <p class="head">餐馆适合：</p>\
				                		        <p class="cnt">'+rstrnt.suits+'</p>\
				                		    </div>';
                		}
                		
                		//rst extsrvs
                		if(rstrnt.extsrvs){
                			tHtml += ' <div class="bheadbox">\
				                		        <p class="head">额外服务：</p>\
				                		        <p class="cnt">'+rstrnt.extsrvs+'</p>\
				                		    </div>';
                		}
                		
                		html += tHtml ? '<div class="minfo">'+tHtml+'</div>' : '';
                		
                		tHtml = '';
                		//wenters 
                   		if(wents.length > 0){
                			var imgStr = '';
                			$.each(wents, function(idx, w){ imgStr += '<img src="'+w.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>';});
                			tHtml += '	<div class="title">\
                							<p>去过该餐馆的街友</p>\
                							<a href="#user_book/rstrnt_wenters/'+rstrnt.id+'" class="vv-pressed">全部<i class="fa fa-angle-right"></i></a>\
                						</div>\
                		        		<a href="#user_book/rstrnt_wenters/'+rstrnt.id+'" class="uimgs">'+imgStr+'</a>';
                		}
                   		
                		//wenters 
                   		if(wantgos.length > 0){
                			var imgStr = '';
                			$.each(wantgos, function(idx, w){ imgStr += '<img src="'+w.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>';});
                			tHtml += '	<div class="title">\
                							<p>想去该餐馆的街友</p>\
                							<a href="#user_book/rstrnt_wantgos/'+rstrnt.id+'" class="vv-pressed">全部<i class="fa fa-angle-right"></i></a>\
                						</div>\
                		        		<a href="#user_book/rstrnt_wantgos/'+rstrnt.id+'" class="uimgs">'+imgStr+'</a>';
                		}
                   		
                		//rstimgs
                   		if(rstimgs.length > 0){
                			var imgStr = '';
                			$.each(rstimgs, function(idx, img){ imgStr += '<img src="'+img+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>';});
                			tHtml += '	<div class="title">\
                							<p>餐馆附图</p>\
                							<a href="#rstimg_book/rstrnt/'+rstrnt.id+'" class="vv-pressed">全部<i class="fa fa-angle-right"></i></a>\
                						</div>\
				                	    <a href="#rstimg_book/rstrnt/'+rstrnt.id+'" class="rimgs">'+imgStr+'</a>';
                		}
                		
                   		html += tHtml ? '<div class="rstbox">'+tHtml+'</div>' : '';
                   		
                   		//sum_cmts
                   		tHtml=''; var cStr = '';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				cStr += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                		}

            			tHtml += '<div class="ckjbox sumcmts">\
								    <ul id="J_rstrnt_dt_cmts">'+cStr+'</ul>\
								    <a class="J_tocmt vv-pressed" tourl="#comment_book/rstrnt/'+rstrnt.id+'">'
								    +('查看所有<i class="num">'+rstrnt.comments+'</i>条评论')+'</a>\
								</div>';
                		html += tHtml ? tHtml : '';
                		if(!$.feat.nativeTouchScroll)$.query('#J_rstdt_wrap > div').empty().html(html);
                		else $.query('#J_rstdt_wrap').empty().html(html);
                		$.query('#rstrnt_detail .J_tocmt').attr('tourl', '#comment_book/rstrnt/'+rstrnt.id);
                		$.query('#rstrnt_detail > .rstops > a').attr('data-id', rstrnt.id);
                		
                		$('#rstrnt_detail').css('opacity', '1');
                		
                		$.query('#J_rstdt_ops .J_want .J_n').html(rstrnt.wantgos);
                		$.query('#J_rstdt_ops .J_went .J_n').html(rstrnt.wents);
                		$.query('#J_rstdt_ops .J_like .J_like_n').html(rstrnt.likes);
                		$.query('#J_rstdt_ops .J_tocmt .J_n').html(rstrnt.comments);
                		
                		$.rstrntDtl.shareInfo = {'stitle': rstrnt.name+'餐馆分享', 'sname':rstrnt.name, 
								 'imgUrl':rstrnt.shareimg, 'dtlUrl':$.ckj.cfg.siteUrl+'/rstrnt/'+rstrnt.id};
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':9, 'title':r.name, 'img':r.cover});}, null, [rstrnt]);
                	}
                	
                	$.rstrntDtl.cfg.loadingRst = 'n';
                },
                dataType: "json"
            });
        }
    };
    $.rstrntDtl.init();
})(af);

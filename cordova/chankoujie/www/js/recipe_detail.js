(function($){
    $.recipeDtl = {
    	cfg: {
    		id:0,
    		loadingRecipe:'y',
    		panelInited:false,
    		
    		joinRmenuBtn: '.J_joinrmenu',
    		selectRmenuBtn: '#J_select_rmenu',
    		recipeUnit: '.J_recipe'
    	},
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	shareMsg: [	 {'pre':'这个', 'suf':'看起来挺不错的哦！想吃的朋友也可以看看啊，馋口街这里有详细的做法， 想自己动手的可以去学学撒！'}, 
	    	         {'pre':'想吃', 'suf':'很久了，今天照馋口街的菜谱做做看问道咋样。有同求的转走！'}, 
	    	         {'pre':'(*^__^*) 嘻嘻……， 这个', 'suf':'是俺的最爱啦！转给和我一样喜欢的童鞋~v~'}, 
	    	         {'pre':'', 'suf':'的这个做法貌似不错，吃货的同学可以收藏馋口街的这个菜谱，吼吼吼~'}, 
	    	         {'pre':'上的了厅堂，下不了厨房？ 姑奶奶今天就露一手给你们看看！', 'suf':'杠杠滴做起， 想比划比划的吃货也可以看看！'}, 
	    	         {'pre':'馋口街，让生活更有味道！ 说滴好， 我来做做这个', 'suf':'是啥味道？ O(∩_∩)O哈哈~'}
    	         ],
        init: function(options){
        	$.query('#recipe_detail').bind("loadpanel",function(e){
        		if(e.data.goBack) {
        		    $('#recipe_detail').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#recipe_detail").data('params'),
        			rciId  = params[0];
        		if($.recipeDtl.cfg.id == rciId) {
        		    $('#recipe_detail').css('opacity', '1');
        		    return; //avoid loading the same ...
        		}
        		else $.recipeDtl.cfg.id = rciId;
        		
        		$.recipeDtl.panelInit();
        		
        		$.query("#J_rci_dt_wrap").scroller().scrollToTop(0);
        		$.recipeDtl.loadRecipe($.recipeDtl.cfg.id);
    		});
    		
    		//bad report
            $('#recipe_detail').on('click', '.J_moreOps', function(e){
                e.stopPropagation();e.preventDefault();
                $('#afui').actionsheet(
                    [{
                        text: '分享...',
                        cssClasses: '',
                        handler: function () {
                            setTimeout(function(){
                                $.ckj.sShare($.recipeDtl.shareInfo, $.recipeDtl.shareMsg);}, 
                                8
                            ); //ios workaround
                        }
                    }, {
                        text: '举报...',
                        cssClasses: '',
                        handler: function () {
                            $.ckj.badReport('举报菜谱', 'recipe', $.recipeDtl.cfg.id);
                        }
                    }]
                );
            });
        },
        panelInit: function(){
        	if( $.recipeDtl.cfg.panelInited === true ) return;
        	var wallWrap = $('#J_rci_dt_wrap');
        	wallWrap.addClass('scroll_nobar');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});

        	$.query('#recipe_detail').on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false, $.ckj.cfg.cmtTrans);
        	});
        	
        	$.query('#recipe_detail').on('click', '.J_buy_stuff', function(e){
        		var stfArr = $.query('#J_rci_dt_stuff i'), rcd = {'name':'', 'amount':'', 'stype':1, 'buystat':0};
        		//console.log(stfArr);
        		if(stfArr.length > 0) {
        			for(var i = 0, l=stfArr.length; i < l; i++ ){
        				rcd.name 	= $(stfArr[i]).text();
        				rcd.name 	= rcd.name.replace(/[:：]/, '');
        				rcd.amount 	= $(stfArr[i+1]).text();
        				i++;
        	    		$.vv.db.insert('shop', rcd, null,
			            	    		function(){ $.vv.tip({icon:'error', content:'Sorry， 保存失败，请稍后重试！', time:3000}); }
        	    		);
        			}
        			
        			$.vv.tip({icon:'success', content:'加入食材预购清单成功！', time:3000});
        		}
        	});
        	
        	$.comOp.like('#recipe_detail');
            $.comOp.unLike('#recipe_detail');
            
        	$.user.follow('#recipe_detail');
        	$.user.unFollow('#recipe_detail');

            $.recipeDtl.joinRmenu('#afui');
            $.recipeDtl.selectRmenu('#afui');
        	
            $.vv.ui.onPressed('#recipe_detail');
            
            $.query('#recipe_detail').attr('scrollTgt', '#J_rci_dt_wrap');
            
            $.vv.ui.onPressed('#J_recipe_ops');
        	$.recipeDtl.cfg.panelInited = true;
        },
        
        loadRecipe:function(id) {
            $.query('#J_rci_dt_bimg').attr('src', 'data/default/1_1.jpg');
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=recipe&a=detail&id='+id,
                dataType: "json",
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000, icon:'error'}); 
                	} else {
                		$.vv.tip({close:true});
                		var recipe = rst.data.recipe, m_stuffs = rst.data.m_stuffs, s_stuffs = rst.data.s_stuffs,
                			tags = rst.data.recipe.tag_cache, steps = rst.data.steps, works = rst.data.works, cmts = rst.data.cmts,
                			html ='', uhtml='', flag =0;
                		
                		//big img
                		$.query('#J_rci_dt_bimg').attr('src', recipe.img);
                		//author info
                		uhtml = '<a href="#space_index/'+recipe.uid+'"><img class="avatar pabs" src="'+recipe.avatar+'" \
                		              onload="$.ckj.onImgLoad(this);"  onerror="$.ckj.onImgError(this);"/></a>\
	                	         <p class="uname">'+recipe.uname+' 分享</p>\
	                	         <p class="addtime">'+recipe.add_time.split(' ')[0]+'</p>';
                		uhtml += $.ckj.renderFollowShipBtn(recipe.uid, $.ckj.user.id, rst.data.author_ship);
                		$.query('#J_rci_dt_author').html(uhtml);

                		//recipe name
                		$.query('#J_rci_dt_rname').html(recipe.name);
                		
                		//cook info
                		var tmpArr = [], k = 0;
                		if(recipe.difficulty) tmpArr.push('<i class="head">难度:</i><i class="val">'+recipe.difficulty+'</i>');
                		if(recipe.cook_time) tmpArr.push('<i class="head">时间:</i><i class="val">'+recipe.cook_time+'</i>');
                		if(recipe.taste) tmpArr.push('<i class="head">口味:</i><i class="val">'+recipe.taste+'</i>');
                		if(recipe.tech) tmpArr.push('<i class="head">工艺:</i><i class="val">'+recipe.tech+'</i>');
                		
                		if(tmpArr.length>0){
                			$.each(tmpArr, function(idx, h){
                				if(idx == 0){html+='<li>';}else if(idx%2 == 0){html+='</li><li>';}
	                			html += h;
                			});
                			html+='</li>';
                		}
                		if(recipe.tools) html += '<li class="tools"><i class="head">工具:</i><i class="val">'+recipe.tools+'</i></li>'
                		
                		if(recipe.tools || tmpArr.length > 1) $.query('#J_rci_dt_ckinfo').html(html).show();
                		else $.query('#J_rci_dt_ckinfo').hide();
                		
                		//intro
                		if(recipe.intro)$.query('#J_rci_dt_intro').html('<strong>“</strong>' + recipe.intro + '<strong>”</strong>').show();
                		else $.query('#J_rci_dt_intro').hide();
                		
                		//tags
                		if(tags) {
                			html = '<a class="tag lead">标签:</a>';
                			$.each(tags, function(idx, tag){
                				html += '<a class="tag">'+ tag +'</a>';
                			});
                			
                			$.query('#J_rci_dt_tags').html(html).show();
                		} else $.query('#J_rci_dt_tags').hide();
                		
                		//ops btn
                		$.query('#recipe_detail *[data-id]').attr('data-id', recipe.id);
                		
                		$.recipeDtl.shareInfo = {'stitle': recipe.name+'的做法', 'sname':recipe.name, 
                								 'imgUrl':recipe.img, 'dtlUrl':$.ckj.cfg.siteUrl+'/recipe/'+recipe.id};

                		//stuff
                		html = '';
                		if(m_stuffs.length > 0) {
                			html = '<h2>主料：</h2><ul>';
                			$.each(m_stuffs, function(idx, s){
                				if(idx==0){html+='<li class="f-f">';}else if(idx%2 == 0){html+='</li><li class="f-f">';}
	                			html += '<i class="head">'+s.name+':</i><i class="val">'+s.amount+'</i>';
                			});
                			html+='</li></ul>';
                		}

                		if(s_stuffs.length > 0){
                			html += '<h2 class="mt5">辅料：</h2><ul>';
                			$.each(s_stuffs, function(idx, s) {
                				if(idx==0){html+='<li  class="f-f">';}else if(idx%2 == 0){html+='</li><li class="f-f">';}
	                			html += '<i class="head">'+s.name+':</i><i class="val">'+s.amount+'</i>';
                			});
                			html+='</li></ul>';
                		}
                		
                		if( m_stuffs.length > 0|| s_stuffs.length > 0 ) {
                			html = '<h1>食材用料</h1>'+html;
                			$.query('#J_rci_dt_stuff').html(html).show();
                		} else $.query('#J_rci_dt_stuff').hide();
                		
                		//steps
                		html = '<h1>做法步骤</h1> ';
            			$.each(steps, function(idx, s){
            				html += '<div class="step">\
		            			        <span>'+(idx+1)+'.</span>\
		            			        <div>'+(s.img ? '<img src="'+s.img+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>': '')+'<p>'+s.state+'</p></div>\
		            			    </div> ';
            			});
            			$.query('#J_rci_dt_steps').html(html);
                		
            			//tips
            			html = '';
            			if(recipe.tips) {
            				html = '<h1>小贴士</h1> <div class="tips">' + recipe.tips + '</div>';
            				$.query('#J_rci_dt_tips').html(html).show();
            			} else {
            				$.query('#J_rci_dt_tips').html(html).hide();
            			}

            			//works
            			html='', imgHtml = '';
                		if(works.length > 0) {
                			html = '<h1 class="works_tit">菜谱作品 <a href="#work_book/rid/'+recipe.id+'" data-pressed="true">全部作品 <i class="fa fa-chevron-right"></i></a></h1>  ';
                			$.each(works, function(idx, w) {
                				imgHtml += '<img onload="$.ckj.centerImg(this, 80);" src="'+w+'" onerror="$.ckj.onImgError(this);"/>';
                			});
                			html += '<a href="#work_book/'+recipe.id+'" class="works cfx"> '+ imgHtml +'</a>';
                			
                		}
                		
                		html += '<a id="J_sharework" href="'+'#work_share/'+$.recipeDtl.cfg.id+'" class="up_work" data-pressed="true" data-transition="'+$.ckj.cfg.formTrans+'"><i class="fa fa-camera"></i>晒晒我的作品</a>';
                		$.query('#J_rci_dt_works').html(html);
                		
                		//sum_cmts
            			html='';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                			$.query('#J_rci_dt_cmts').html(html).show();
                		} else {
                			$.query('#J_rci_dt_cmts').empty().hide();
                		}
                		
                		$.query('#recipe_detail .J_tocmt').attr('tourl', '#comment_book/recipe/'+recipe.id).find('.num').text(recipe.comments);
                		
                		html = '<a class="J_like vv-pressed" itype="recipe" data-id="'+recipe.id+'"><i class="fa fa-heart-add"><e class="J_like_n">'+recipe.likes+'</e></i><span>喜欢</span></a>\
							    <a class="J_joinrmenu vv-pressed" itype="recipe" data-id="'+recipe.id+'"><i class="fa fa-file-add"><e class="J_n">'+recipe.collects+'</e></i><span>收入菜单</span></a>\
							    <a class="J_tocmt vv-pressed" tourl="'+'#comment_book/recipe/'+recipe.id+'"><i class="fa fa-comments1"><e class="J_n">'+recipe.comments+'</e></i><span>评论</span></a>\
							    <a class="J_buy_stuff vv-pressed"><i class="fa fa-add-shopping-cart"></i><span>预购食材</span></a>\
							    <a class="J_moreOps vv-pressed"><span>• • •</span></a>';

                		$.query('#J_recipe_ops').html(html);
                        
                        $('#recipe_detail').css('opacity', '1');
                		
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':1, 'title':r.name, 'img':r.img});}, null, [recipe]);
                		
                	}
                	$.recipeDtl.cfg.loadingRecipe = 'n';
                },
                error: function(xhr, why) {
                    $.ckj.ajaxError(xhr, why);
                    $.recipeDtl.cfg.id = 0;
                }
            });
        },
        
        //join the recipe to an rmenu
        joinRmenu: function(ctx) {
            var s = $.recipeDtl.cfg;
            $(ctx).on('click', s.joinRmenuBtn,  function(e) {
            	e.stopPropagation();e.preventDefault();
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var id = $this.attr('data-id');
                        var jpop = $.query('#afui').popup({ id:"join_rmenu", title:'<i class="fa fa-file-add"></i>加入菜单',blockUI:true, addCssClass:'popBottom'});
                        $.getJSON($.ckj.cfg.mapi + '/?m=rmenu&a=join', {id:id}, function(result){
                            if(result.status == 0){
                            	jpop.setCnt(result.data);
                                $.recipeDtl.joinRmenuForm($.query('#J_join_rmenu'), jpop);
                            }else{
                                $.vv.tip({content:result.msg, icon:'error'});
                            }
                        });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        
        joinRmenuForm: function(form, jpop) {
        	var s = $.recipeDtl.cfg;
            form.submit(function(e){
            	e.preventDefault();
            	jpop.setTitle('<i class="fa fa-spinner fa-spin"></i>加入菜单中...');
    			$.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    success: function(result){
                    	//$.vv.log(result);
                    	if(result.status != 0){ $.vv.tip({content:result.msg, icon:'error'});
                    	} else { 
                    		$.vv.tip({content:result.msg, icon:'success'});
                    		var nb = $.query(s.joinRmenuBtn + ' .J_n'); n = parseInt(nb.text()), nb.text(n+1);
                    	}
                    	jpop.hide();
                    },
                    dataType: "json"
               });
            });
        },
        
        //select an rmenu
        selectRmenu: function(ctx) {
            var s = $.recipeDtl.cfg;
            var creating = false;
            $(ctx).on('click', '.J_qcreate_btn', function(e) {
            	e.stopPropagation();e.preventDefault();
                $(this).hide();
                $('textarea[name=title], select[name=rmenu_id], #J_join_subbtn').hide();
                $(s.selectRmenuBtn).find('.J_qcreate').show();
            });
            //click to create an rmenu
            $(ctx).on('click', '.J_qc_submit', function(e){
            	e.stopPropagation();e.preventDefault();
            	if(creating) return;
            	creating = true;
                var title = $(s.selectRmenuBtn).find('.J_qc_title').val(),
                    cate_id = $(s.selectRmenuBtn).find('.J_qc_cate').val(),
                	intro 	= $(s.selectRmenuBtn).find('.J_qc_intro').val();
                if(!title) {$.vv.tip({content:"求菜单标题哦~", icon:'error', ctx:'#join_rmenu'}); return false;}
                $.vv.tip({icon:'loading'});
                $.ajax({
                    url: $.ckj.cfg.mapi + '/?m=rmenu&a=add',
                    type: 'POST',
                    data: {
                        title: title,
                        cate_id: cate_id,
                        intro:intro
                    },
                    dataType: 'json',
                    success: function(result){
                        if(result.status == 0){
                            $.vv.tip({close:true});
                            $(s.selectRmenuBtn).find('.J_qcreate_btn').show();
                            $('textarea[name=title], select[name=rmenu_id], #J_join_subbtn').show();
                            $('<option value="'+result.data+'">'+title+'</option>').appendTo($(s.selectRmenuBtn).find('.J_rmenu_id'));
                            setTimeout(function(){
                                $(s.selectRmenuBtn).find('.J_rmenu_id').find('option[value="'+result.data+'"]').attr("selected", true);
                                $(s.selectRmenuBtn).find('.J_rmenu_id').find('option[value="0"]').remove();
                            }, 1);
                            $(s.selectRmenuBtn).find('.J_df_cate').hide();
                            $(s.selectRmenuBtn).find('.J_qcreate').hide();
                        }else{
                            $.vv.tip({content:result.msg, time:3000, icon:'error'});
                        }
                        
                        creating = false;
                    },
                    error:function(xhr, err) {
                    	creating = false;
                    	$.ckj.ajaxError(xhr, err);
                    }
                });
            });
        }
    };
    $.recipeDtl.init();
})(af);

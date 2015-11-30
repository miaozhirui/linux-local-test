(function($) {
    $.topicDtl = {
        cfg: {
            panelInited:false,
            tid:0
        },
        
        init: function(options) {
            $("#topic_detail").bind("loadpanel",function(e){
                $.topicDtl.panelInit();
                var params   = $.query("#topic_detail").data('params'),
                    tid      = params[0];
                    
                if($.topicDtl.cfg.tid == tid && $.topicDtl.loaded) {
                    $('#topic_detail').css('opacity', '1');
                    return;
                }
                $.topicDtl.loaded = false;
                
                $.topicDtl.cfg.tid = tid;
                $.topicDtl.loadTopic(tid);
            });
            
            $("#topic_detail").bind("unloadpanel",function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_sp_feed_wall', true);
                    $.topicDtl.wCache = {};
                    $.query('#J_sp_feed_tabs a').removeClass('cur');
                    $.query('#J_sp_feed_tabs a[t=pub]').addClass('cur');
                }
                if($.topicDtl.cfg.uid == $.ckj.user.id) {
                    $.query('#topic_detail').off('click', '.J_delTpc');
                    $.query('#J_sp_feed_tabs').off('click', 'a');
                }
            });
        },
        
        panelInit: function(){
            if( $.topicDtl.cfg.panelInited === true ) return;
            
            var wallWrap = $.query("#J_topic_dtl_wrap"),
                scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, useJsScroll:false});

            $.topicDtl.bindFwdTopic();
            $.topicDtl.bindDelTopic();
            $.vv.ui.onPressed('#J_topic_ops');
            
            $.topicDtl.cfg.panelInited = true;
        },
        
        loadTopic: function(tid) {
            if($.topicDtl.loading == true) return;
            $.vv.tip({icon:'loading'});
            $.ajax({
                url: $.ckj.cfg.mapi + '/?m=space&a=topic&id='+tid,
                type: 'post',
                dataType: "json",
                success: function(r) {
                    $.vv.tip({close:true});
                    if(r.status == 0) {
                        $('#J_topic_dtl_wrap .topic_cnt').html(r.data.html);
                        
                        //sum_cmts
                        var html='', cmts = r.data.cmts, topicUid = r.data.topicUid, tEl = $($('#J_topic_dtl_wrap .topic_cnt li').get(0));
                        if(cmts.length > 0) {
                                $.each(cmts, function(idx, c){
                                html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                                '+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                            });
                            $.query('#J_topic_dt_cmts').html(html).show();
                        } else {
                            $.query('#J_topic_dt_cmts').html(html).hide();
                        }

                        if(topicUid == $.ckj.user.id) html = '<a class="JdelTpc f-al vv-pressed"><i class="fa fa-times"></i><span>删除</span></a>';
                        else html = '';
                        html += '<a class="JfwdTpc f-al vv-pressed"><i class="fa fa-share"></i><span>转发</span></a>\
                                 <a class="J_tocmt f-al vv-pressed" data-transition="slide"><i class="fa fa-comments1"><e class="J_n">'+r.data.cmtCount+'</e></i><span>评论</span></a>\
                                 <a href="'+tEl.attr('data-uri')+'" class="J_topic_ops f-al vv-pressed" data-transition="slide"><i class="fa fa-eye"></i><span>查看引用</span></a>';
                                 
                        $.query('#J_topic_ops').html(html);
                        
                        $.query('#topic_detail .J_tocmt').attr({'href': '#comment_book/topic/'+$.topicDtl.cfg.tid}).find('.J_n').text(r.data.cmtCount);
                        
                        $('#topic_detail').css('opacity', '1');
                        $.topicDtl.loaded = true;
                    } else if(r.status == 3) {
                        $.vv.tip({content:r.msg, icon:'error'});
                        window.setTimeout(function(){$.ui.goBack();}, 2000);
                    } else {
                        $.vv.tip({content:r.msg, icon:'error'});
                    }
                }
           });
        },
        
        bindDelTopic: function(){
            $.query('#topic_detail').on('click', '.JdelTpc', function(e){
                e.preventDefault(); e.stopPropagation();
                if(!$.user.isLogin({
                    okFunc:function($this){
                        var tid = $.topicDtl.cfg.tid;                        
                        $.ui.popup( {
                            title:"删除动态",
                            message:"确定要删除该动态吗?",
                            cancelText:"取消",
                            cancelCallback: null,
                            doneText:"删除",
                            supressFooter:false,
                            cancelClass:'button',
                            doneClass:'button',
                            doneCallback: function () {
                                $.vv.tip({icon:'loading'});
                                $.getJSON($.ckj.cfg.mapi + '/?m=topic&a=delete&tid='+tid, function(r){
                                    if(r.status == 0){ 
                                        $.vv.tip({content:'删除成功', icon:'success'});
                                        $.topicDtl.cfg.tid = 0;
                                        window.setTimeout( function(){$.ui.goBack();} ,2000);
                                    }else{
                                        $.vv.tip({content:r.msg, icon:'error'});
                                    }
                                });
                            },
                            cancelOnly:false,
                            blockUI:true
                        });
                    },
                    okData:$(this)
                })) return false;
            });
        },
        
        //forward
        bindFwdTopic: function(){
            $('#topic_detail').on('click', '.JfwdTpc', function(e){
                e.preventDefault(); e.stopPropagation();
                if(!$.user.isLogin({
                    okFunc:function($this){
                        var tid =  $.topicDtl.cfg.tid;
                        var jpop = $.query('#topic_detail').popup({ id:"J_tpcFwd", title:'<i class="fa fa-share"></i>转发给我的粉丝',blockUI:false, addCssClass:'popBottom'});
                        $.getJSON($.ckj.cfg.mapi + '/?m=topic&a=forward', {tid:tid}, function(r){
                            if(r.status == 0){
                                jpop.setCnt(r.data);
                                $.topicDtl.fwdTpcFrm($('#J_fwdTpcFrm'), jpop);
                            }else{
                                $.vv.tip({content:r.msg, icon:'error'});
                            }
                        });
                    },
                    okData:$(this)
                })) return false;
            });
        },
        
        fwdTpcFrm: function(form, jpop){
            form.submit(function(e){
                e.preventDefault(); e.stopPropagation();
                
                var content = form.find('.J_content').val();
                if(content == ''){
                    $.vv.tip({content:'请输入转发内容', icon:'error'});
                    return false;
                }
                jpop.setTitle('<i class="fa fa-spinner fa-spin"></i>转发中...');
                $.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    success: function(r){
                           if(r.status == 0){
                               $.vv.tip({content:r.msg, icon:'success'});
                           } else {
                               $.vv.tip({content:r.msg, icon:'error'});
                           }
                           jpop.hide();
                    },
                    dataType: "json"
               });
            });
        }
    };
    $.topicDtl.init();
})(af);
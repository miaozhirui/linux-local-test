//JS loaded after panel view
(function($) {
    $.ckjIndex = {
        cfg: {
        	panelInited:false
        },
        
        //executed after JS loaded which is loaded after related panel view loaded 
        init: function(options){
        	$("#ckj_index").bind("loadpanel", function(e) {
        	    //$.vv.tip({content:'错误发生了啊，哈哈哈, 这可怎么办啊', icon:'success', time:5000});
                $.ckjIndex.panelInit();
            });
    		$("#ckj_index").bind("unloadpanel", function(e) {
                if($('#JckjIndexPubTypes').hasClass('showed'))
                    $('#JckjIndexPubTypes_tri').trigger('click');
            });
            
            if(!$.ckj.cfg.hasNET) {
                $.vv.tip({content:'当前没有网络哦', time:2000});
            }
        },

        //called by init function
        panelInit: function(){
            //alert(window.devicePixelRatio);
        	if( $.ckjIndex.cfg.panelInited === true ) return;
        	var dpr = Math.ceil(window.devicePixelRatio),
        	    time = (new Date()).getTime() / 1000 /1800,
        	    src = $.ckj.cfg.siteUrl + '/static/images/app/index_top_rec@'+dpr+'x.jpg?'+($.vv.debug ? Math.rand() : time),
        	    w = ($.vv.cfg.cWidth - 40)/3, 
        	    h = w,
        	    bpt = h * 0.09,
        	    faW = w * 0.56,
        	    faH = faW,
        	    faSize = parseInt(0.46 * faH);
        	$('#ckj_index .top_hot_rec').css('height', $.vv.cfg.cWidth*0.5+'px');        	
        	$('#ckj_index .JtopHotRec img').attr('src', src);
            $('#ckj_index .big_blks .blk').css({'width': w+'px', 'height': h+'px', 'padding-top':bpt+'px'}); //>>> main buz block size adjust
            $('#ckj_index .big_blks .blk .fa').css({'width': faW+'px', 'height': faH+'px', 'line-height': faH+'px', 'font-size':faSize+'px'});
            $('#ckj_index .big_blks .blk .fa-food').css('font-size', faSize+4+'px');
            $('#ckj_index .big_blks .blk .fa-question-circle').css('font-size', faSize+4+'px');
            $('#ckj_index').css('visibility', 'visible');
            $('#JckjIndexScroll').scroller({scrollBars: false, vScrollCSS: "afScrollbar"});
            $.vv.ui.toggleNavOrder('#ckj_index');
        	$.ckjIndex.cfg.panelInited = true;
        }
    };
    
    $.ckjIndex.init();
})(af);

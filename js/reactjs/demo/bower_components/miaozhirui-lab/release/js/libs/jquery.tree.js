$.fn.tree=function(a){var b=this;a=a||{};var c='<div class="table-header">                        <div class="table-header-name">Company Name</div>                        <div class="table-header-count">Patent Count</div>                        <div class="table-header-action">Action</div>                    </div>',d='<div class="row-content">                    <div class="main-row row">                    $${arrow}                    <div class="name"><a class="name-btn">${name}</a></div>                    <div class="num"><span>${num}</span></div>                    <div class="child" style="display: none"><span>${childNum}</span></div>                    <div class="add"><a class="btn-26 add-btn" data-id=${id}>${action}</a></div></div></div>',e='<div class="child-row row">                    $${arrow}                    <div class="name"><a class="name-btn">${name}</a></div>                    <div class="num"><span>${num}</span></div>                    <div class="child" style="display: none"><span>${childNum}</span></div>                    <div class="add"><a class="btn-26 add-btn" data-id=${id}>${action}</a></div></div>',f='<div class="arrow arrowUp"></div>',g='<div class="no-arrow"></div>',h=function(b,c){var h="company"==a.type?"select":"Add";if(!c)return console.log("no company found"),"no company found";if("main"==b){var i="";return $(c.company).each(function(a,b){var c=d,e=juicer(c,{name:b.name,num:b.patentNum,childNum:b.childCount,arrow:b.childCount&&b.childCount>0?f:g,id:b.id,action:h});e="<div>"+e+"</div>",i+=e}),i}if("child"==b){var i="";return $(c.company).each(function(a,b){var c=e,d=juicer(c,{name:b.name,num:b.patentNum,childNum:b.childCount,arrow:b.childCount&&b.childCount>0?f:g,id:b.id,action:h});d='<div class="child-section"><div class="row-content">'+d+"</div></div>",i+=d}),i}},i=function(){$("body").on("click",".name-btn",".arrow",function(a){var b=$(a.target).closest(".row").find(".arrow"),c=$(".add [data-id = "+$(a.target).closest(".row").find(".add-btn").data("id")+"]").closest(".row");c.closest(".row-content").next(".child-section").length<=0?j($(a.target).closest(".row").find(".add-btn").data("id")).done(function(d){var e=h("child",d.data);$(e).insertAfter(c.closest(".row-content")),$(a.target).closest(".row-content").siblings(".child-section").toggle(),b.toggleClass("arrowUp"),b.toggleClass("arrowDown")}):(b.toggleClass("arrowUp"),b.toggleClass("arrowDown"),$(a.target).closest(".row-content").siblings(".child-section").toggle())}),$("body").on("click",".add-btn",function(b){if("company"==a.type){var c={assigneeName:$(b.target).closest(".row").find(".name-btn").text(),subNum:$(b.target).closest(".row").find(".child span").text(),patentNum:$(b.target).closest(".row").find(".num span").text(),assigneeId:$(b.target).data("id")};a.callback(c)}else if(a.type="compare"){var c={competitorName:$(b.target).closest(".row").find(".name-btn").text(),patentNum:$(b.target).closest(".row").find(".num span").text(),competitorId:$(b.target).data("id"),subNum:$(b.target).closest(".row").find(".child span").text()};a.callback(c)}})},j=function(b){return $.ajax({type:"get",url:"http://127.0.0.1:3000/searchCompany/"+a.query+"/"+b})},k=h("main",a.data.data);return i(),$(b).empty(),$(b).append(c+k),$(b).show(),this};
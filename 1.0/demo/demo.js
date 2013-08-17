var S = KISSY;
if (S.Config.debug) {
    var srcPath = "../../../";
    S.config({
        packages:[
            {
                name:"gallery",
                path:srcPath,
                charset:"utf-8",
                ignorePackageNameInUri:true
            }
        ]
    });
}

S.use('gallery/limitfixed/1.0/index, node, event', function (S, LimitFixed, Node, Event) {
    var $ = Node.all;

    var nodeLimit = $('#J_LimitBox');
    $('.fixed', nodeLimit).each(function(el, idx) {
        var align = $(el).attr("data-align"),
            offset = $(el).attr('data-offset') || "";

        var lf = LimitFixed(el, nodeLimit, {
            align: align.split(','),
            offset: offset ? offset.split(',') : []
        });

        lf.on('fixed', function(ev) {
            var isFixed = ev.isFixed;
            if(isFixed) {
                $(lf.elFixed).show();
            }else {
                $(lf.elFixed).hide();
            }
        });
    });

    $('.slide', '#J_Carousel').each(function(elSlide) {
        var elFixed = $('.caption', elSlide);

        var lf = LimitFixed(elFixed, elSlide, {
            align: ['left', 'top'],
            holderCls: "lf-holder",
            holder: true
        });
    });

    $('.floor', '#J_ShelfBox').each(function(elLimit) {
        var elFixed = $('.caption', elLimit);

        var lf = LimitFixed(elFixed, elLimit, {
            holder: true
        });
    });

    LimitFixed($('#totop'), {
        align: ['bottom right'],
        offset: [0, 0]
    });

});
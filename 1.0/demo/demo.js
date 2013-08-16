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

    var nodeLimit = $('#J_LimitBox'),
        lfs = [];
    $('.fixed', nodeLimit).each(function(el) {
        var align = $(el).attr("data-align"),
            offset = $(el).attr('data-offset') || "",
            zIndex = $(el).attr('data-offset');

        var lf = new LimitFixed(el, nodeLimit, {
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

        lfs.push(lf);
    });

    $('.slide', '#J_Carousel').each(function(elSlide) {
        var elFixed = $('.caption', elSlide);

        var lf = new LimitFixed(elFixed, elSlide, {
            align: ['left', 'top'],
            holderCls: "lf-holder",
            holder: true
        });
        lfs.push(lf);
    });

    $('.floor', '#J_ShelfBox').each(function(elLimit) {
        var elFixed = $('.caption', elLimit);

        var lf = new LimitFixed(elFixed, elLimit, {
            holder: true
        });
        lfs.push(lf);
    });

    Event.on(window, 'scroll resize', function() {
        S.each(lfs, function(lf) {
            lf.scroll();
        });
    });
});
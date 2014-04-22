/*
combined files : 

gallery/limitfixed/1.1/index
gallery/limitfixed/1.1/mini

*/
/**
 * @fileoverview
 * @author 阿克<ake.wgk@taobao.com>
 * @module limitfixed
 **/
/**
 * @usage
 * new LimitFixed($fix, cfg);
 *
 */
KISSY.add('gallery/limitfixed/1.1/index',function (S, Event, Node, undefined) {
    var $ = Node.all,
        $$ = Node.one,
        UA = S.UA;

    var $doc = $$(document),
        $win = $$(window),
        isIE6 = UA.ie === 6,
        isUndefined = S.isUndefined;

    var def = {
        type: isIE6 ? "absolute" : "fixed",
        elLimit: $doc
    };

    /**
     *
     * @param elFixed the sticky element
     * @param cfg     {
     *                      range: {
     *                          left: 0, right: 0, top:0, bottom
     *                      },
     *                      elLimit: "limit container"
     *                      holder: true/false,
     *                      cache: true/false
     *                }
     */
    function LimitFixed(elFixed, config) {
        this.$fixed = $$(elFixed);

        this.cfg = S.merge(def, config);

    }

    S.augment(LimitFixed, Event.Target, {
        render: function() {
            var cfg = this.cfg,
                $fixed = this.$fixed,
                offset = $fixed.offset();

            this._originTop = offset.top;
            this._originLeft = offset.left;

            this._originStyles = {
                position: null,
                top: null,
                bottom: null,
                left: null
            };
            for (var style in this._originStyles) {
                if (this._originStyles.hasOwnProperty(style)) {
                    this._originStyles[style] = $fixed.css(style);
                }
            }

            if(cfg.holder) {
                this._placeholder = this._buildPlaceholder();
            }

            this.adjust();
        },
        adjust: function() {
            this.restore();

            this.scroll();
        },
        restore: function() {
            this.$fixed.css(this._originStyles);
        },
        scroll: function() {
            var cfg = this.cfg;

            if(cfg.type == "fixed") {
                this._calFixedPosition();
            }
        },
        _calFixedPosition: function() {
            var cfg = this.cfg,
                points = cfg.points || {},
                $fixed = this.$fixed,
                $limit = $$(cfg.elLimit),
                offset = this._getOffset($limit),
                range = {};

            var scrollTop = $doc.scrollTop(),
                scrollLeft = $doc.scrollLeft();

            offset.bottom = offset.top + $limit.outerHeight();
            offset.right = offset.left + $limit.outerWidth();

            if(scrollTop > offset.top &&
                scrollTop < offset.bottom - $fixed.outerHeight()) {

                range.top = 0;

            }else if(scrollTop > offset.bottom - $fixed.outerHeight() && scrollTop < offset.bottom){

                range.top = - (scrollTop - offset.bottom + $fixed.outerHeight());
            }

            if(scrollLeft > offset.left &&
                scrollLeft < offset.right - $fixed.outerWidth()){

                range.left = 0;

            }else if(scrollLeft > offset.right - $fixed.outerWidth() && scrollLeft < offset.right) {

                range.left = - (scrollLeft - offset.right + $fixed.outerWidth());
            }

            if(!isUndefined(range.top) && isUndefined(range.left)) {
                range.left = this._originLeft - scrollLeft;
            }

            if(!isUndefined(range.left) && isUndefined(range.top)) {
                range.top = this._originTop - scrollTop;
            }

            if(!isUndefined(range.top) || !isUndefined(range.left)) {
                $fixed.css(S.mix({
                    position: "fixed"
                }, range));

                this._showPlaceholder();
            }else {
                $fixed.css(this._originStyles);
                this._hidePlaceholder();
            }
        },
        _getOffset: function($el) {
            var cfg = this.cfg,
                offset = isDocument($el) ? {left: 0, top: 0} : $el.offset();

            if(cfg.type == "absolute") {
                offset = {
                }
            }

            return offset;
        },
        _buildPlaceholder: function() {
            var $fixed = this.$fixed,
                _placeholder = $('<div style="visibility:hidden;margin:0;padding:0;"></div>');

            _placeholder.width($fixed.outerWidth())
                .height($fixed.outerHeight())
                .css("float", $fixed.css("float"))
                .insertAfter($fixed);

            return _placeholder;
        },
        _showPlaceholder: function() {
            this._placeholder && this._placeholder.show();
        },
        _hidePlaceholder: function() {
            this._placeholder && this._placeholder.hide();
        }
    });

    //========== helper ===========

    function isDocument(el) {
        if(!el) return false;

        var it = el.getDOMNode ? el.getDOMNode() : el;

        return it.nodeType === 9;
//        return it === $doc.getDOMNode();
    }



    //========== export API ============

    var instances = [];

    S.ready(function() {
        $win.on('scroll resize', function() {
            S.each(instances, function(instance) {
                instance.scroll();
            });
        });
    });

    return function(elFixed, cfg) {
        var instance = new LimitFixed(elFixed, cfg);

        instances.push(instance);

        return instance;
    };

}, {requires:['event', 'node']});
/**
 * @fileoverview 
 * @author 阿克<ake.wgk@taobao.com>
 * @module limitfixed
 **/
KISSY.add('gallery/limitfixed/1.1/mini',function(S, Component) {

  return Component;

}, {
  requires: ["./index"]
});

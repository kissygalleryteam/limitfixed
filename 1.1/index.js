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
KISSY.add(function (S, Event, Node, undefined) {
    var $ = Node.all,
        $$ = Node.one,
        UA = S.UA;

    var $doc = $$(document),
        $win = $$(window),
        isIE6 = UA.ie === 6,
        isUndefined = S.isUndefined;

    var def = {
        direction: "y",
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
            if(this.rendered) return;

            var cfg = this.cfg,
                $fixed = this.$fixed;

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

            this.rendered = true;

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
                direction = cfg.direction.toLowerCase(),
                $fixed = this.$fixed,
                range = this._getLimitRange(),
                originOffset = $fixed.offset(),
                position = {};

            var originLeft = originOffset.left,
                originTop = originOffset.top;

            var scrollTop = $doc.scrollTop(),
                scrollLeft = $doc.scrollLeft();

            if(direction.indexOf("y") !== -1) {
                if(scrollTop > range.top &&
                    scrollTop < range.bottom - $fixed.outerHeight()) {

                    position.top = 0;

                }else if(scrollTop > range.bottom - $fixed.outerHeight() && scrollTop < range.bottom){

                    position.top = - (scrollTop - range.bottom + $fixed.outerHeight());
                }
            }

            if(direction.indexOf("x") !== -1) {
                if(scrollLeft > range.left &&
                    scrollLeft < range.right - $fixed.outerWidth()){

                    position.left = 0;

                }else if(scrollLeft > range.right - $fixed.outerWidth() && scrollLeft < range.right) {

                    position.left = - (scrollLeft - range.right + $fixed.outerWidth());
                }
            }

            if(direction.indexOf("y") !== -1) {
                if(!isUndefined(position.top) && isUndefined(position.left)) {
                    position.left = originLeft - scrollLeft;
                }
            }

            if(direction.indexOf("x") !== -1) {
                if(!isUndefined(position.left) && isUndefined(position.top)) {
                    position.top = originTop - scrollTop;
                }
            }

            if(!isUndefined(position.top) || !isUndefined(position.left)) {
                $fixed.css(S.mix({
                    position: "fixed"
                }, position));

                this._showPlaceholder();
            }else {
                $fixed.css(this._originStyles);
                this._hidePlaceholder();
            }
        },
        // 获取限制的range。
        _getLimitRange: function() {
            var cfg = this.cfg,
                range = cfg.range,
                $limit = $$(cfg.elLimit);

            if(!range && $limit) {
                range = isDocument($limit) ? {left: 0, top: 0} : $limit.offset();
                range.bottom = range.top + $limit.outerHeight();
                range.right = range.left + $limit.outerWidth();
            }

            return range;
        },
        _buildPlaceholder: function() {
            var cfg = this.cfg,
                _placeholder = cfg.placeholder;

            if(!_placeholder) {
                var $fixed = this.$fixed;
                _placeholder = $('<div style="visibility:hidden;margin:0;padding:0;"></div>');

                _placeholder.width($fixed.outerWidth())
                    .height($fixed.outerHeight())
                    .css("float", $fixed.css("float"))
                    .insertAfter($fixed);
            }

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
                if(instance.rendered) {
                    instance.adjust();
                }
            });
        });
    });

    return function(elFixed, cfg) {
        var instance = new LimitFixed(elFixed, cfg);

        instances.push(instance);

        return instance;
    };

}, {requires:['event', 'node']});
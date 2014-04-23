/*
combined files : 

gallery/limitfixed/1.1/index

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

    var DATA_STATE_STICKY = 'limitfixed-sticky',
        def = {
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

            this._originOffset = $fixed.offset();

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
            this._originOffset = this.$fixed.offset();
        },
        scroll: function() {
            var cfg = this.cfg,
                $fixed = this.$fixed,
                isSticky = $fixed.data(DATA_STATE_STICKY),
                isFixed;

            isFixed = this._calPosition();

            if(isFixed) {

                this._showPlaceholder();

                if(!isSticky) {
                    $fixed.data(DATA_STATE_STICKY, true);
                    this.fire('fixed', {
                        fixed: true
                    });
                }

            }else {

                this._hidePlaceholder();

                if(isSticky) {
                    $fixed.data(DATA_STATE_STICKY, false);
                    this.fire('fixed', {
                        fixed: false
                    });
                }

            }
        },
        _calPosition: function() {
            var cfg = this.cfg,
                direction = cfg.direction.toLowerCase(),
                $fixed = this.$fixed,
                range = this._getLimitRange(),
                originOffset = this._originOffset,
                position = {};

            var originLeft = originOffset.left,
                originTop = originOffset.top;

            var scrollTop = $doc.scrollTop(),
                scrollLeft = $doc.scrollLeft();

            // 根据配置，计算指定方向上的坐标
            if(direction.indexOf("y") !== -1) {
                if(scrollTop > range.top &&
                    scrollTop < range.bottom - $fixed.outerHeight()) {

                    position.top = scrollTop;

                }else if(scrollTop > range.bottom - $fixed.outerHeight() && scrollTop < range.bottom){
                    position.top = range.bottom - $fixed.outerHeight()
                }
            }

            if(direction.indexOf("x") !== -1) {
                if(scrollLeft > range.left &&
                    scrollLeft < range.right - $fixed.outerWidth()){

                    position.left = scrollLeft;

                }else if(scrollLeft > range.right - $fixed.outerWidth() && scrollLeft < range.right) {

                    position.left = range.right - $fixed.outerWidth()
                }
            }

            // 补全另一个方向的坐标。
            if(direction.indexOf("y") !== -1) {
                if(!isUndefined(position.top) && isUndefined(position.left)) {
                    position.left = originLeft;
                }
            }

            if(direction.indexOf("x") !== -1) {
                if(!isUndefined(position.left) && isUndefined(position.top)) {
                    position.top = originTop;
                }
            }

            // absolute和fixed都会上面的基础上减去一个相对值。
            // 最终的position才是fixed元素的left、top值。
            var relate = this._getRelateOffset();

            if(!isUndefined(relate.top) && !isUndefined(position.top)) {
                position.top -= relate.top;
            }

            if(!isUndefined(relate.left) && !isUndefined(position.left)) {
                position.left -= relate.left;
            }


            // 根据position，设置fixed元素的样式。
            if(!isUndefined(position.top) || !isUndefined(position.left)) {
                $fixed.css(S.mix({
                    position: cfg.type
                }, position));

                return true;
            }else {
                $fixed.css(this._originStyles);
                return false;
            }
        },
        _getRelateOffset: function() {
            var cfg = this.cfg,
                offset = {};

            var scrollTop = $doc.scrollTop(),
                scrollLeft = $doc.scrollLeft();

            if(cfg.type == "fixed") {

                offset = {
                    left: scrollLeft,
                    top: scrollTop
                };

            }else if(cfg.type == "absolute") {
                var $relativeParent = this._getRelateElement();
                if ($relativeParent) {
                    offset = this._getOffset($relativeParent);
                }
            }

            return offset;
        },
        _getRelateElement: function() {

            return this.$fixed.parent(function(el) {
                return S.inArray($(el).css('position'), ['relative', 'absolute']);
            });
        },
        // 获取限制的range。
        _getLimitRange: function() {
            var cfg = this.cfg,
                range = cfg.range,
                $limit = $$(cfg.elLimit);

            if(!range && $limit) {
                range = this._getOffset($limit);
                range.bottom = range.top + $limit.outerHeight();
                range.right = range.left + $limit.outerWidth();
            }

            return range;
        },
        _getOffset: function($el) {
            return isDocument($el) ? {left: 0, top: 0} : $el.offset();
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
        $win.on('scroll resize', function(ev) {
            var type = ev.type,
                methodName = type === "scroll" ? "scroll" : "adjust";
            S.each(instances, function(instance) {
                if(instance.rendered) {
                    instance[methodName]();
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

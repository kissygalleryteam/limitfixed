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
        $$ = Node.one;

    var $doc = $$(document),
        $win = $$(window),
        IE = S.UA.ie,
        isUndefined = S.isUndefined;

    var def = {
            direction: "y",
            // IE版本小于10，采用低精度模式。
            // TODO 后续可以检测一下fps来判断。
            accuracy: IE < 10,
            type: IE === 6 ? "absolute" : "fixed",
            limit: $doc,
            holder: false,
            clsFixed: 'fixed-sticky'
        };

    /**
     *
     * @param elFixed the sticky element
     * @param config
     */
    function LimitFixed(elFixed, config) {
        this.$fixed = $$(elFixed);

        this.cfg = S.merge(def, config);

        this.$limit = $$(this.cfg.limit);

        this.isSticky = false;
    }

    S.augment(LimitFixed, Event.Target, {
        render: function() {
            var self = this,
                cfg = self.cfg;
            if(self.rendered) return;

            self._saveOriginStyle();

            if(cfg.holder) {
                self._placeholder = self._buildPlaceholder();
            }

            // 默认设置，在浮动时添加className。
            self.on('fixed', function(ev) {
                var method = ev.fixed ? "addClass" : "removeClass";
                self.$fixed[method](cfg.clsFixed);
            });

            self.rendered = true;

            self.resize();
        },
        resize: function() {

            this._restore();

            this.scroll();
        },
        scroll: function() {
            var cfg = this.cfg,
                $fixed = this.$fixed,
                isSticky = this.isSticky,
                position = this._calPosition();

            if(position) {

                $fixed.css(S.mix({
                    position: cfg.type
                }, position));

                this._showPlaceholder();

                if(!isSticky) {
                    this.isSticky = true;

                    this.fire('fixed', {
                        fixed: true
                    });
                }

            }else {

                this._restore();

                this._hidePlaceholder();

                if(isSticky) {
                    this.isSticky = false;

                    this.fire('fixed', {
                        fixed: false
                    });
                }

            }
        },
        _saveOriginStyle: function() {
            var $fixed = this.$fixed;

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
        },
        _restore: function() {
            this.$fixed.css(this._originStyles);
            this._originFixedOffset = this._getFixedRange();
        },
        _buildPlaceholder: function() {
            var cfg = this.cfg,
                _placeholder = cfg.placeholder;

            if(!_placeholder) {
                var $fixed = this.$fixed;

                _placeholder = $('<div style="visibility:hidden;margin:0;padding:0;"></div>');

                _placeholder.width($fixed.outerWidth(true))
                    .height($fixed.outerHeight(true))
                    .css("float", $fixed.css("float"))
                    .insertAfter($fixed);
            }

            return _placeholder;
        },
        _calPosition: function() {
            var cfg = this.cfg,
                direction = cfg.direction.toLowerCase(),
                range = this._getLimitRange(),
                originOffset = this._originFixedOffset,
                position = {};

            var scrollTop = $doc.scrollTop(),
                scrollLeft = $doc.scrollLeft();

            // 根据配置，计算指定方向上的坐标
            if(direction.indexOf("y") !== -1) {
                if(scrollTop > range.top &&
                    scrollTop < range.bottom - originOffset.outerHeight) {

                    position.top = scrollTop;

                }else if(scrollTop > range.bottom - originOffset.outerHeight && scrollTop < range.bottom){
                    position.top = range.bottom - originOffset.outerHeight;
                }
            }

            if(direction.indexOf("x") !== -1) {
                if(scrollLeft > range.left &&
                    scrollLeft < range.right - originOffset.outerWidth){

                    position.left = scrollLeft;

                }else if(scrollLeft > range.right - originOffset.outerWidth && scrollLeft < range.right) {

                    position.left = range.right - originOffset.outerWidth;
                }
            }

            // 补全另一个方向的坐标。
            if(direction.indexOf("y") !== -1) {
                if(!isUndefined(position.top) && isUndefined(position.left)) {
                    position.left = originOffset.left;
                }
            }

            if(direction.indexOf("x") !== -1) {
                if(!isUndefined(position.left) && isUndefined(position.top)) {
                    position.top = originOffset.top;
                }
            }

            // absolute和fixed都会上面的基础上减去一个相对偏移量值。
            // 最终的position才是$fixed元素的left、top值。
            var relate = this._getRelateOffset();

            if(relate && !isUndefined(position.top)) {
                position.top -= relate.top;
            }

            if(relate && !isUndefined(position.left)) {
                position.left -= relate.left;
            }

            // 根据position，设置fixed元素的样式。
            if(!isUndefined(position.top) || !isUndefined(position.left)) {

                return position;
            }else {

                return null;
            }
        },
        // 获取相对的偏移量。
        // 计算得到的位置信息需要减去这些偏移量，再设置$fixed元素的位置。
        _getRelateOffset: function() {
            var cfg = this.cfg,
                offset;

            if(cfg.type == "fixed") {

                offset = {
                    left: $doc.scrollLeft(),
                    top: $doc.scrollTop()
                };

            }else if(cfg.type == "absolute") {
                var $relativeParent = getRelatePositionParent(this.$fixed);
                if ($relativeParent) {
                    offset = this._getOffset($relativeParent);
                }
            }

            return offset;
        },
        _getFixedRange: function() {
            var $fixed = this.$fixed,
                offset = $fixed.offset();

            offset.outerHeight = $fixed.outerHeight();
            offset.outerWidth = $fixed.outerWidth();

            return offset;
        },
        // 获取限制的range。包含left/right/top/bottom
        _getLimitRange: function() {
            var cfg = this.cfg,
                range = cfg.range,
                $limit = this.$limit;

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

    function getRelatePositionParent($el) {
        return $el.parent(function(el) {
            return S.inArray($(el).css('position'), ['relative', 'absolute']);
        });
    }


    //========== export API ============

    var highs = [],
        lows = [];

    S.ready(function() {

        function getScrollFunc(instances) {

            return function(ev) {
                var type = ev.type;

                S.each(instances, function(instance) {
                    if(instance.rendered) {
                        instance[type]();
                    }
                });
            }
        }

        $win.on('scroll resize', S.throttle(getScrollFunc(lows), 150));
        $win.on('scroll resize', getScrollFunc(highs));
    });

    return function(elFixed, cfg) {
        var instance = new LimitFixed(elFixed, cfg);

        if(instance.cfg.accuracy) {
            highs.push(instance);
        }else {
            lows.push(instance);
        }

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

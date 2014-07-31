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
        IE = UA.ie,
        isUndefined = S.isUndefined;

    // 测试，非static的元素。获取的bottom值是否为auto。
    // firefox的兼容问题。
    function testRelativeElementBottom() {
        var $target = $('<div style="position:relative;"></div>').appendTo(document.body);

        return $target.css('bottom') !== "auto";
    }

    var needFixRelativeElementBottom = UA.firefox && testRelativeElementBottom();

    var def = {
        direction: "y",
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
                oldPosition = this._oldPosition,
                position = this._calPosition();

            if(position) {

                if(!isSticky ||
                    (position.top != oldPosition.top || position.left != oldPosition.left)
                    ) {
                    $fixed.css(S.mix({
                        position: cfg.type
                    }, position));

                    this._oldPosition = position;

                    this._showPlaceholder();
                    this.isSticky = true;
                    this.fire('fixed', {
                        fixed: true
                    });
                }

            }else {

                if(isSticky) {
                    this._restore();

                    this._hidePlaceholder();

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

            // 目前发现，firefox下。若position为非static时。即时没有设置bottom，用kissy获取bottom值时，bottom为"0px"。这会导致做样式还原处理时出现一些意外。[issues](https://github.com/kissyteam/kissy/issues/620)
            // 故，这里记录下原始的position并设置为static，以便获取位置信息。最后再还原position。
            var needfix = false,
                oldPosition = $fixed.css('position');
            if(needFixRelativeElementBottom && oldPosition !== "static") {
                needfix = true;
            }

            if(needfix) {
                $fixed.css('position', "static");
            }

            for (var style in this._originStyles) {
                if (this._originStyles.hasOwnProperty(style)) {
                    this._originStyles[style] = $fixed.css(style);
                }
            }

            if(needfix) {
                $fixed.css('position', oldPosition);
            }
        },
        _restore: function() {
            this.isSticky = false;
            this.$fixed.css(this._originStyles);
            this._originFixedOffset = this._getFixedRange();
        },
        _buildPlaceholder: function() {
            var cfg = this.cfg,
                _placeholder = cfg.placeholder;

            if(!_placeholder) {
                var $fixed = this.$fixed;

                _placeholder = $('<div style="visibility:hidden;margin:0;padding:0;display:none;"></div>');

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

    var instances = [];

    S.ready(function() {

        function getScrollFn(type) {

            return function() {
                S.each(instances, function(instance) {
                    if(instance.rendered) {
                        instance[type]();
                    }
                });
            };
        }

        $win.on('scroll', getScrollFn('scroll'));

        $win.on('resize', S.throttle(getScrollFn('resize'), 120));

    });

    return function(elFixed, cfg) {
        var instance = new LimitFixed(elFixed, cfg);

        instances.push(instance);

        return instance;
    };

}, {requires:['event', 'node']});
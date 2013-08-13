###
 * @fileoverview
 * @author wuake<wgk1987@gmail.com>
 * @module limitfixed
###
KISSY.add (S, D, E) ->
  ###
    new LimitFixed(fixedElement, limitElement, {
      align: [],
      offset: []
      holder: true
    });

    TODO 缓存range结果
    TODO 不实时计算。在某些范围内，fixed模式下，可以不设置style。
    TODO 兼容ios？ -webkit-transform: translate3d(0px, -22px, 0px)
    TODO 文档注释？@lends Limitfixed
  ###
  doc = document
  UA = S.UA
  isIE6 = (UA.ie == 6)

  def =
    # 第一项表示，fixed的位置；后一项表示static的位置
    align: ['top', 'left']
    offset: [0, 0]
    shim: false
    holder: false
    holderCls: "limitfixed-holder"
    forceAbs: false

  ###
    @class Limitfixed
    @constructor
  ###
  LimitFixed = () ->
    this.init.apply this, arguments

  S.augment LimitFixed, S.EventTarget,
    init: (elFixed, elLimit, cfg) ->
      @cfg = S.merge def, cfg
      @elFixed = D.get(elFixed)
      @elLimit = D.get(elLimit)

      @isFixed = false

      # position: fixed 还是 absolute
      @_fixedType = if isIE6 then false else !@cfg.forceAbs

      @_bindEvent()

      if @cfg.holder
        @_buildHolder()

      @scroll()

    _bindEvent: () ->
      # 超出显示范围的时候，直接隐藏掉。确保不依赖结构。
      @on 'fixed', (ev) =>
        fixed = ev.isFixed
        if fixed
          D.show @elFixed
        else
          D.hide @elFixed

    _buildHolder: () ->
      cls = @cfg.holderCls || ""
      holder = D.create("<div class='#{cls}'></div>");

      D.height holder, D.outerHeight(@elFixed)
      D.width holder, D.outerWidth(@elFixed)

      D.insertBefore(holder, @elFixed)

    setFixed: (fixed) ->
      @isFixed = fixed

      @fire 'fixed',
        isFixed: fixed

    # 滚动时触发的处理函数
    scroll: () ->
      viewRange = @_getRange()
      limitRange = @_getRange @elLimit
      range = @_getCrossRange viewRange, limitRange

      @setPosition range, limitRange, viewRange

    # 获取传入元素的配置的矩形数据。若没传入，默认是当前视图。（而不是document/body）
    _getRange: (elem) ->
      if elem
        offset = D.offset(elem)

        left = offset.left
        top = offset.top
        width = D.outerWidth elem
        height = D.outerHeight elem

      else
        # 当前视图
        left = D.scrollLeft doc
        top = D.scrollTop doc
        width = D.viewportWidth()
        height = D.viewportHeight()

      return {
        top: top
        height: height
        left: left
        width: width
      }

    # 获取两个矩形数据的交集矩形数据。
    # 有交集，则返回top/left/width/height数据
    # 否则返回 null
    _getCrossRange: (range1, range2) ->
      # 两个矩形相交产生的矩形坐标计算。
      x1 = Math.max(range1.left, range2.left)
      y1 = Math.max(range1.top, range2.top)
      x2 = Math.min(range1.left + range1.width, range2.left + range2.width)
      y2 = Math.min(range1.top + range1.height, range2.top + range2.height)

      if x1 > x2 or y1> y2
        rt = null
      else
        rt =
          left: x1
          top: y1
          width: x2 - x1
          height: y2 - y1

      return rt

    # 设置元素的位置
    setPosition: (range, limitRange, viewRange) ->
      if range == null
        @setFixed false
        style =
          position: "static"
          zIndex: ""
      else
        @setFixed true
        style = @_calPosition(range, limitRange, viewRange)

      D.css @elFixed, style

    _calPosition: (range, limitRange, viewRange) ->
      style =
        "zIndex": @_getZIndex()

      if @_fixedType
        align = @_calFixPosition range, limitRange, viewRange
        style.position = 'fixed'
      else
        align = @_calAbsPosition range, limitRange, viewRange
        style.position = 'absolute'

      offset = @_getOffset()

      if offset
        align.left = align.left + (offset.left || 0)
        align.top = align.top + (offset.top || 0)

      return S.mix style, align

    _getZIndex: () ->
      zindex = D.css(@elFixed, 'z-index');

      return @cfg.zIndex || parseInt(zindex, 10) || 999

    _getOffset: () ->
      cfg = @cfg.offset

      offset = {
        left: 1*cfg[0] || 0
        top: 1*cfg[1] || 0
      }

      return offset

    _getAlign: () ->
      cfg = S.makeArray @cfg.align

      stati = (cfg[1] || "").split(" ")
      fixed = cfg[0]

      align = {}

      # TODO 待处理

      if fixed.indexOf('left') != -1
        align.leftFixed = true

      if fixed.indexOf('right') != -1
        align.rightFixed = true

      if fixed.indexOf('top') != -1
        align.topFixed = true

      if fixed.indexOf('bottom') != -1
        align.bottomFixed = true

      if stati.indexOf('left') != -1
        align.leftStatic = true

      if stati.indexOf('right') != -1
        align.rightStatic = true

      if stati.indexOf('top') != -1
        align.topStatic = true

      if stati.indexOf('bottom') != -1
        align.bottomStatic = true

#      console && console.log(align);
      return align

# 按position:fixed的方式来计算当前位置
    _calFixPosition: (range, limitRange, viewRange) ->
      align = @_getAlign()
      fixedHeight = D.outerHeight @elFixed
      fixedWidth = D.outerWidth @elFixed

      # 纵向操作
      if align.topFixed
  #      靠上
        top = Math.min(range.top - viewRange.top,
          limitRange.top + limitRange.height - fixedHeight - viewRange.top)

      else if align.bottomFixed
  #      靠下
        top = Math.max(range.top + range.height - fixedHeight - viewRange.top,
          limitRange.top - viewRange.top)

      else if align.topStatic
  #      靠上
        top = Math.min(range.top - viewRange.top, limitRange.top - viewRange.top)

      else if align.bottomStatic
  #      靠下
        top = Math.max(range.top + range.height - fixedHeight - viewRange.top,
          limitRange.top + limitRange.height - fixedHeight - viewRange.top)

      if align.leftFixed
  #      靠左
        left = Math.min(range.left - viewRange.left,
          limitRange.left + limitRange.width - fixedWidth - viewRange.left)

      else if align.rightFixed
  #      靠右
        left = Math.max(range.left + range.width - fixedWidth - viewRange.left,
          limitRange.left - viewRange.left)

      else if align.leftStatic
  #      靠左
        left = Math.min(range.left - viewRange.left, limitRange.left - viewRange.left)

      else if align.rightStatic
  #      靠右
        left = Math.max(range.left + range.width - fixedWidth - viewRange.left,
          limitRange.left + limitRange.width - fixedWidth - viewRange.left)

      return {
        left: left
        top: top
      }

    # 按position: absolute的方式来计算当前位置
    _calAbsPosition: (range, limitRange, viewRange) ->
      # 相对位移获取
      relativeParentContainer = D.parent @elLimit, (el) ->
        return S.inArray(D.css(el, 'position'), ['relative', 'absolute'])

      offset =
        left: 0
        top: 0

      if relativeParentContainer
        offset = D.offset(relativeParentContainer)
      else if D.contains(@elLimit, @elFixed) and S.inArray D.css(@elLimit, 'position'), ['relative', 'absolute']
        offset = D.offset @elLimit

      fixedHeight = D.outerHeight @elFixed
      fixedWidth = D.outerWidth @elFixed

      align = @_getAlign()

      if align.topFixed
      # 靠上
        top = Math.min(range.top, limitRange.top + limitRange.height - fixedHeight) - offset.top
      else if align.bottomFixed
      # 靠下
        top = Math.max(range.top + range.height - fixedHeight, limitRange.top) - offset.top

      else if align.topStatic
      #      靠上
        top = Math.min(limitRange.top + viewRange.top, limitRange.top) - offset.top
      else if align.bottomStatic
      #      靠下
        top = Math.max(range.top + range.height - fixedHeight, limitRange.top + limitRange.height - fixedHeight) - offset.top


      if align.leftFixed
      #      靠左
        left = Math.min(range.left, limitRange.left + limitRange.width - fixedWidth) - offset.left
      else if align.rightFixed
      #      靠右
        left = Math.max(range.left + range.width - fixedWidth, limitRange.left) - offset.left
      else if align.leftStatic
      #      靠左
        console && console.log(Math.min(limitRange.left + viewRange.left, limitRange.left), limitRange.left, offset.left);
        left = Math.min(limitRange.left + viewRange.left, limitRange.left) - offset.left
      else if align.rightStatic
        #      靠右
        left = Math.max(range.left + range.width - fixedWidth, limitRange.left + limitRange.width - fixedWidth) - offset.left


      return {
        left: left
        top: top
      }

    # ie6的遮罩层
    _buildIEShim: () ->



  return LimitFixed
,
  requires: ['dom', 'event']

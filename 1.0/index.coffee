###
 * @fileoverview
 * @author wuake<wgk1987@gmail.com>
 * @module limitfixed
###

###
  usage

  new LimitFixed(fixedElement, limitElement, {
    align: [],
    offset: []
    holder: true
  });

  TODO 文档注释？@lends Limitfixed
  TODO 内部进行事件注册
###

KISSY.add (S, D, E) ->
  doc = document
  UA = S.UA
  isIE6 = (UA.ie == 6)

  def =
    # 第一项表示，fixed的位置；后一项表示static的位置
    align: ['top', 'left']
    # 固定元素设置位置偏移
    offset: [0, 0]
    # TODO 是否设置shim层（ie6）
#    shim: false
    # 是否在elFixed位置创建占位元素。
    holder: false
    # 自定义占位元素的className
    holderCls: "limitfixed-holder"
    # 是否强制使用绝对定位计算（ie6不支持fixed样式定义，使用absolute模拟。需要计算相对父容器的位置。）
    forceAbs: false
    # TODO 是否针对移动设备优化（ios，-webkit-transform: translate3d(0px, -22px, 0px)）
#    mobile: false
    # 是否缓存elLimit的位置信息。
    cache: false
#    TODO 预判的偏移量
#    points: [0, 0]

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

      # position: fixed or absolute
      @_fixedType = if isIE6 then false else !@cfg.forceAbs

      @_limitRange
#      @_bindEvent()

      if @cfg.holder
        @_buildHolder()

      @scroll()

#    _bindEvent: () ->
#      E.on()

    _buildHolder: () ->
      cls = @cfg.holderCls || ""
      holder = @elHolder = D.create("<div class='#{cls}'></div>");

      D.height holder, D.outerHeight(@elFixed)
      D.width holder, D.outerWidth(@elFixed)

      D.insertBefore(holder, @elFixed)

      @on 'fixed', (ev) =>
        fixed = ev.isFixed
        if fixed
          D.show holder
        else
          D.hide holder

    # 滚动时触发的处理函数
    scroll: () ->
      viewRange = @getViewRange()
      limitRange = @getLimitRange()
      range = @_getCrossRange viewRange, limitRange

      # 设置元素的位置
      if range == null
        @_setFixed false
      else
        offset = @_getAbsPosition(range, limitRange)
        # 横向和纵向，在position:fixed模式下，如果处于fixed状态且“置顶”时，这个时候坐标是不变化的。不需要另外去计算和设置，避免无谓的dom操作
        if @_fixedType and (offset.top > limitRange.top and parseInt(range.top) == parseInt(offset.top)) and (offset.left > limitRange.left and parseInt(range.left) == parseInt(offset.left)) and @isFixed and @fixedRange
          offset = null
        else
          @fixedRange = offset = @_calPosition offset, range, limitRange, viewRange
        @_setFixed true

      @_applyStyle offset

    # 获取当前视图的矩形数据。
    getViewRange: () ->
      left = D.scrollLeft doc
      top = D.scrollTop doc
      width = D.viewportWidth()
      height = D.viewportHeight()

      return {
        left: left
        top: top
        width: width
        height: height
      }

    # 获取传入元素的矩形数据。
    getLimitRange: (force) ->
      if not @_limitRange or force or not @cfg.cache
        @_limitRange = @_getRange @elLimit

      return @_limitRange

    _getRange: (elem) ->
      offset = D.offset(elem)

      return {
        left: offset.left
        top: offset.top
        width: D.outerWidth elem
        height: D.outerHeight elem
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

    # 获取两个矩形的并集的最小矩形
    _getUnionRange: (range1, range2) ->
      x1 = Math.min(range1.left, range2.left)
      y1 = Math.min(range1.top, range2.top)
      x2 = Math.max(range1.left + range1.width, range2.left + range2.width)
      y2 = Math.max(range1.top + range1.height, range2.top + range2.height)

      return {
        left: x1
        top: y1,
        width: x2 - x1
        height: y2 - y1
      }

    # 设置当前elFixed元素是否fixed状态，并触发事件
    _setFixed: (fixed) ->
      if fixed == @isFixed
        return

      @isFixed = fixed

      @fire 'fixed',
        isFixed: fixed

    # 获取fixed元素的相对页面左上角的位置信息（left/top）。
    _getAbsPosition: (range, limitRange) ->
      align = @_getAlign()
      fixedHeight = D.outerHeight @elFixed
      fixedWidth = D.outerWidth @elFixed

      limitRight = limitRange.left + limitRange.width
      limitBottom = limitRange.top + limitRange.height
      rangeRight = range.left + range.width
      rangeBottom = range.top + range.height

      # 纵向操作
      if align.topFixed
        #      靠上
        top = Math.min(range.top, limitBottom - fixedHeight)

      else if align.bottomFixed
        #      靠下
        top = Math.max(rangeBottom - fixedHeight, limitRange.top)

      else if align.topStatic
        #      靠上
        top = Math.min(range.top, limitRange.top)

      else if align.bottomStatic
        #      靠下
        top = Math.max(rangeBottom - fixedHeight, limitBottom - fixedHeight)

      if align.leftFixed
        #      靠左
        left = Math.min(range.left, limitRight - fixedWidth)

      else if align.rightFixed
        #      靠右
        left = Math.max(rangeRight - fixedWidth, limitRange.left)

      else if align.leftStatic
        #      靠左
        left = Math.min(range.left, limitRange.left)

      else if align.rightStatic
        #      靠右
        left = Math.max(rangeRight - fixedWidth, limitRight - fixedWidth)

      return {
        left: left
        top: top
      }

    _calPosition: (align, range, limitRange, viewRange) ->
      if @_fixedType
        # 按position:fixed的方式来计算偏移量
        offset =
          left: viewRange.left
          top: viewRange.top
      else
        # 按position: absolute的方式来计算偏移量
        relativeParentContainer = D.parent @elLimit, (el) ->
          return S.inArray(D.css(el, 'position'), ['relative', 'absolute'])

        offset =
          left: 0
          top: 0
        # 相对位移获取
        if relativeParentContainer
          offset = D.offset(relativeParentContainer)
        else if D.contains(@elLimit, @elFixed) and S.inArray D.css(@elLimit, 'position'), ['relative', 'absolute']
          offset = D.offset @elLimit

      # 内部计算的偏移量
      align.left -= offset.left
      align.top -= offset.top

      # 传入的偏移量
      custom = @_getOffset()
      align.left += (custom.left || 0)
      align.top += (custom.top || 0)

      return align

    _getOffset: () ->
      cfg = @cfg.offset

      offset = {
        left: 1*cfg[0] || 0
        top: 1*cfg[1] || 0
      }

      return offset

    _getAlign: () ->
      cfg = S.makeArray @cfg.align

      stati = cfg[1] || ""
      fixed = cfg[0] || ""

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

      return align

    _applyStyle: (offset) ->

      if not @isFixed
        style =
          position: "static"
      else
        style =
          position: if @_fixedType then 'fixed' else 'absolute'

      D.css @elFixed, S.mix(style, offset)

    # ie6的遮罩层
#    _buildIEShim: () ->


  ###
    管理对象
  ###

  Manager = (@def) ->
    @collection = []

    E.on window, 'scroll resize', () =>
      S.each @collection, (it) ->
        it.scroll()

    return

  S.augment Manager,
    add: (elFixed, elLimit, cfg) ->
      if not cfg and S.isPlainObject(elLimit)
        cfg = elLimit

        elLimit = if S.UA.chrome then doc.body else doc.documentElement

      if not elFixed or not elLimit
        return

      cfg = S.merge @def, cfg

      instance = new LimitFixed(elFixed, elLimit, cfg)
      @collection.push instance

      return instance


  manager = new Manager()
  exports = (elFixed, elLimit, cfg) ->
    return manager.add elFixed, elLimit, cfg

#  exports.Manager = Manager

  return exports
,
  requires: ['dom', 'event']

## limitfixed

* 版本：1.1
* 教程：[http://gallery.kissyui.com/limitfixed/1.1/guide/index.html](http://gallery.kissyui.com/limitfixed/1.1/guide/index.html)
* demo：[http://gallery.kissyui.com/limitfixed/1.1/demo/index.html](http://gallery.kissyui.com/limitfixed/1.1/demo/index.html)

## changelog

### V1.2
* 针对`V1.1`版本的性能优化。只在位置需要更新时设置样式
* 针对resize事件，减少触发的次数。
* 缓存节点的坐标信息。
* 针对firefox下，非static的浮动元素获取初始坐标有误的bugfix

### V1.1

* 重构代码和API
* 在指定容器内部fixed浮动效果
* 支持构建占位元素
* 支持absolute形式模拟fixed效果

### V1.0

* 在指定容器中设置元素fixed浮动显示。
* 支持横向和纵向的组合浮动
* 支持相对父容器的偏移显示
* 支持构建占位元素和自定义样式
* 支持IE6下fixed浮动。
* 支持事件触发

### 环信web-sdk开发
 环信连接[)]

define(["jquery"],function(){ //不会执行jquery文件里的define函数 会执行define外数据

})

define("jquery||./jquery",function(){ //不会请求 jquery文件

})

define(function(){ //先执行define文件外数据 在执行define函数并且返回值
  var $ = require('jquery) 
})

appkey = 1136170928178979#jiagousi;
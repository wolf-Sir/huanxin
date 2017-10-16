define(function(require,exports,module){
  var $ = require("jquery");
          require("flyer");
  var   Vue =    require("vue"),
        layui = require("layui"),
        carousel = require('carousel'),
        myDate =   require("laydate"),
        element = require('element'),
         layer =  require('layer');

var vm = new Vue({
   el:"#app",
   data:{
           msg:{test:'你好世界'} 
       },
   methods:{
     close_iframe(){
     var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
      parent.layer.close(index); //再执行关闭   
      parent.show_login(); //返回登录页面
     }
   }
 })
});
//define 内
// 谁先加载
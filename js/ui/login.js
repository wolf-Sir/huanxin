define(function(require,exports,module){
  //引入依赖
  var $ = require("jquery");
          require("flyer");
  var   Vue =    require("vue"),
        layui = require("layui"),
        carousel = require('carousel'),
        myDate =   require("laydate"),
        element = require('element'),
        layer =  require('layer');
        form = require('form');
//创建连接 
 var conn = parent.window.createdConn();
//创建 vue 实例
  var vm = new Vue({
        el:"#app",
        data:{
                isLogin:true,
            },
        methods:{
        //  提交注册信息
         commit_register(){
           var that = this;
            form.on('submit(register)', function(data){

              var options = { 
              appKey: WebIM.config.appkey,
              success: function () {
                 parent.window.layer.msg('注册成功',{icon: 1,offset: 'rt'});
                 that.isLogin=true;
               },  
              error: function (err) { 
                var msg = '注册失败';
                if(err.type=17){
                     msg += ",账号已经存在"
                }
                 parent.window.layer.msg('msg',{icon:2,offset:'rt'});
               
              }, 
              apiUrl: WebIM.config.apiURL
            };
            //连接
            conn.registerUser(Object.assign({},options,data.field) );
              });
         },
         //提交登录信息
         commit_login(){
              var that = this;
              //验证 表单
               form.on('submit(login)', function(data){
                  var options = { 
                    apiUrl: WebIM.config.apiURL,
                    appKey: WebIM.config.appkey,
                    success: function () {
                      parent.window.layer.msg('登录成功',{icon: 1,offset:"t"});
                      var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                       parent.layer.close(index); //再执行关闭   
                      parent.window.show_friends();
                    },  
                    error: function (err) { 
                      var msg = '登录失败';
                      parent.window.layer.msg('msg',{icon:2,offset:'rt'});
                   }, 
                  };
                  //conn.open(Object.assign({},options,{user:"webchenhan163com",pwd:123456}));
                 conn.open(Object.assign({},options,data.field));
               });
           },
          }
        
      });
});
//define 内
// 谁先加载
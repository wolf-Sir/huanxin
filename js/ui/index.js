define(function(require,exports,module){
  var $ = require("jquery");
         layui = require("layui"),
         layer =  require('layer');
          var   Vue =    require("vue"),
        layui = require("layui"),
        carousel = require('carousel'),
        myDate =   require("laydate"),
        element = require('element'),
         layer =  require('layer');

//建立vue实例
var vm = new Vue({
    el:"#app",
    methods:{},
        mounted(){},
});
//创建连接方法
window.createdConn = function(){
        var conn = new WebIM.connection({
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        url: WebIM.config.xmppURL,
        heartBeatWait: WebIM.config.heartBeatWait,
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        autoReconnectInterval: WebIM.config.autoReconnectInterval,
        apiUrl: WebIM.config.apiURL,
        isAutoLogin: true
    });
    return conn;
}
//弹出好友管理窗口
window.show_friends = function(){
    layer.open({
                    type: 2,
                    title: ' ', 
                    shadeClose: false, //点击遮罩层 关闭
                    closeBtn:0,
                    offset:'rt',
                    anim: 2,
                    shade: 0, //不显示 遮罩层
                    area: ['272px', '600px'],
                    fixed:false,
                    moveOut:false, //是否可以出窗口外
                    content: ['templates/liaotian.html','no'] //iframe的url
        })
};
//弹出登录 注册框
window.show_login = function(){
     layer.open({
            type: 2,
            title: ' ', 
            shadeClose: false, //点击遮罩层 关闭
            closeBtn:0,
            shade: 0, //不显示 遮罩层
            area: ['500px', '400px'],
            fixed:false,
            skin:'login_box',
            moveOut:true, //是否可以出窗口外
            content: ['templates/login.html','no'] //iframe的url
      })
};
show_login();
/*复制 管理
   //监听消息
conn.listen({
    onOpened: function ( message ) {          //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();             
    console.log("连接成功");
   },  
    onClosed: function ( message ) {//连接关闭回调
      console.log("连接关闭回调");
    },         
     onMutedMessage: function(message){}        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});
 */
    
})
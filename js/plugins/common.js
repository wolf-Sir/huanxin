/**
 * Created by wuxie on 2017/4/25.
 * ajax请求封装
 * 此ajax中做了拦截请求错误的统一提示，
 * 推荐使用done代替success写法
 * var request = tools.ajax({
 *     url: 'xxx/xxx',
 *     data: JSON.stringify(data),
 *     type: 'get', //默认post请求
 * });
 * request.done(function(res){
 *     //只需考虑code==200的情况，200以外做了统一拦截处理
 *     if (res.code == 200){
 *         //业务代码
 *     }
 * });
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    var tools = {
        ajax: function (options) {
            options = options || {};
            var defaultOptions = {
                beforeSend: function () {
                    flyer.loadding();   //请求进度条
                },
                complete: function () {
                    $('.flyer-shade-loadding,.flyer-shade').remove();
                },
                type: 'post',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.readyState == 0) {
                        location.reload();
                    }
                    if (XMLHttpRequest.readyState == 4) { //请求已完成，且响应已就绪
                        parent.flyer.msg('请求出错，请重试！'); //统一处错误请求提示
                    }
                }
            };
            var _options = jQuery.extend(defaultOptions, options);
            //重写success 业务代码只需处理code==200的情况，200以外的请求统一拦截错误提示
            _options.success = function (obj, textStatus, jqXHR) {
                if (obj.code != 200 && !obj.succeed) {
                    var msg = {
                            500: obj.message || '服务器内部错误！',
                            501: obj.message || '请求方法不支持！',
                            502: obj.message || '请求超时！',
                            400: obj.message || '请求参数错误！'
                        }[obj.code] || obj.message || '发生未知错误，请联系管理员！';
                    parent.flyer.msg(msg); //统一处理后台返回错误提示
                }
            }
            return $.ajax(_options);
        },
        //时间戳转换日期
        getDate: function (time) {
            var _time = new Date(parseInt(time));
            var y = _time.getFullYear();
            var m = _time.getMonth() + 1;
            var d = _time.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            return y + '-' + m + '-' + d;
        },
        //参数校正
        dataCorrecting: function (data) {
            var _data = JSON.stringify(data);
            _data = _data.replace(/"N\/A"/g, null);
            return JSON.parse(_data);
        },
        //判断两个对象是否相等 相等返回true
        isObjectValueEqual: function (a, b) {
            var t = this;
            if (typeof a == 'number' && typeof b == 'number') {
                return a == b
            }
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (Object.prototype.toString(a[propName]) == '[Object Object]' || Object.prototype.toString(b[propName]) == '[Object Object]') {
                    t.isObjectValueEqual(a[propName], b[propName])
                }
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        }
    }
    module.exports = tools;

});
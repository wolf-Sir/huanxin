/*
 *@Name : flyer v0.01 类库
 *@Author : Ken (郑鹏飞)
 */
define(function(require, exports, module) {
    "use strick";
   // require("flyer-ui");
    var flyer = window.flyer || (window.flyer = {});
    flyer.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            return decodeURI(r[2]);
        }else{
            return null;
        }
    }
    flyer.getHashValues = function(hash) {
        var t = this;
        var urlHash = hash || location.hash;
        var str = urlHash.substring(1, urlHash.length);
        var hashArr = str.split('&');
        var hashObj = {};
        if (!hashArr) {
            return null;
        }
        for (var i = 0; i < hashArr.length; i++) {
            var key = hashArr[i].split('=')[0];
            var value = hashArr[i].split('=')[1];
            if (value === "undefined") {
                value = undefined;
            }
            if (value === "null") {
                value = null;
            }
            hashObj[key] = value;
        }
        return hashObj;
    }
    flyer.getRootUrl = function() {
        return location.origin + '/';
    }
        //对字符串进行占位符格式化,例如 format("{1},{2}","a","b");
    flyer.format = function() {
            var args = arguments,
                str, len = args.length;
            if (len > 0) {
                for (var i = 1, str = args[0]; i < len; i++) {
                    str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
                }
                return str;
            } else {
                return this;
            }
        }
        // flyer.prototype = {

    //     //判断对象是否是 String
    //     isString: function () {

    //     },

    //     //对字符串进行占位符格式化,例如 format("{1},{2}","a","b");
    //     format: function () {
    //         var args = arguments,
    //             str, len = args.length;
    //         if (len > 0) {
    //             for (var i = 1, str = args[0]; i < len; i++) {
    //                 str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
    //             }
    //             return str;
    //         } else {
    //             return this;
    //         }
    //     },
    //     formatDate: function () {

    //     },
    //     //得到指定的参数值
    //     getQueryString: function (name) {
    //         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //         var r = window.location.search.substr(1).match(reg);
    //         if (r != null) return unescape(r[2]);
    //         return null;
    //     }
    // }
});
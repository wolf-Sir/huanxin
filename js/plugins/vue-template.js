define(function(require, exports, module) {
    require("vue");
    var tools = require('tools');
    var rootUrl = flyer.getRootUrl();
    var $ = require("jquery");
    
    //定义一个header模板
    Vue.component('v-header', {
        template: '<div id="header"></div>'
    })

    //定义一个footer模板
    Vue.component("v-footer", {
        template: '<div id="footer"></div>'
    })

    Vue.component("v-tab-details", {
        template: '<div class="head_nav"><div class="head_histroy"><button class="btns btns-gray" @click="histroy">返回</button></div><ul class="head_tabs clearfix">' +
            '<li :class="tabName == \'baseInfo\'?\'active\':\'\'"><a :href="\'/supplier/supplyChain.html#\'+urlParams">基础资料</a></li>' +
            '<li :class="tabName == \'contacts\'?\'active\':\'\'"><a :href="\'/supplier/communicate.html#\'+urlParams">往来/通讯</a></li>' +
            '<li :class="tabName == \'approval\'?\'active\':\'\'"><a href="javascript:void(0);" @click="getLocaltion">税务审批</a></li></ul></div>',
        data: function() {

            var oData = {
                    tabName: "",
                    urlParams: "",
                    show: true,
                },
                pathName = location.pathname,
                pageName = pathName.substring(pathName.lastIndexOf('/') + 1),
                pageName = pageName.toLowerCase(),
                hashValues = flyer.getHashValues();
             var supplierId = flyer.getQueryString("supplierId");
            oData.show = supplierId ? true : false;
            switch (pageName) {
                case "supplychain.html":
                    oData.tabName = 'baseInfo';
                    break;
                case "history.html":
                    oData.tabName = "history";
                    break;
                case "communicate.html":
                    oData.tabName = "contacts";
                    break;
                case "basicmsg.html":
                case "drawback.html":
                case "waiting.html":
                case "through.html":
                    oData.tabName = "approval";
                    break;
            }
            var paramIndex = location.href.indexOf("#");
            if (location.href.indexOf("?") > -1){
                paramIndex = location.href.indexOf("?");
            }
            if (paramIndex > -1) {
                oData.urlParams = location.href.substring(paramIndex + 1);
            }
            return oData;
        },
        methods: {
            getLocaltion: function(){
                var t = this;
                var request = tools.ajax({
                    url: rootUrl + 'supplier/booleanIntariff',
                    type: 'get'
                });
                request.done(function(res){
                    if (res.code == 200){
                        if (res.res == '0'){
                            location.assign('basicMsg.html?' + t.urlParams);
                        }else{
                            location.assign('getWaiting.html?' + t.urlParams);
                        }
                    }
                });
            },
            histroy: function(){
                sessionStorage.setItem('supplierListHistoryBack','true');
                history.go(-1);
            }
        }
    });
    Vue.component("v-tab-approval", {
        template: '<div class="smart-widget-inner margin_b_n"><ul class="nav  tab-style2 nav-tabs-small">' +
            '<li id="baseInfo" :class="tabName == \'baseInfo\'?\'active\':\'\'"><a><span class="text-wrapper">基础信息</span></a></li>' +
            '<li id="drawback" :class="tabName == \'drawback\'?\'active\':\'\'"><a><span class="text-wrapper">退税信息</span></a></li>' +
            '<li id="waiting" :class="tabName == \'waiting\'?\'active\':\'\'"><a><span class="text-wrapper">等待审核</span></a></li>' +
            '<li id="through" :class="tabName == \'through\'?\'active\':\'\'"><a><span class="text-wrapper">审核通过</span></a></li></ul></div>',
        data: function() {
            var oData = {
                    tabName: "",
                    urlParams: ""
                },
                pathName = location.pathname,
                pageName = pathName.substring(pathName.lastIndexOf('/') + 1),
                pageName = pageName.toLowerCase();
            switch (pageName) {
                case "basicmsg.html":
                    oData.tabName = 'baseInfo';
                    break;
                case "drawback.html":
                    oData.tabName = "drawback";
                    break;
                case "waiting.html":
                    oData.tabName = "waiting";
                    break;
                case "through.html":
                    oData.tabName = "through";
                    break;
            }

            var paramIndex = location.href.indexOf("?");
            if (paramIndex > -1) {
                oData.urlParams = location.href.substring(paramIndex);
            }
            return oData;
        }

    });
  
});
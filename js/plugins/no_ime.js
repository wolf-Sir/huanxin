/**
 * Created by wuxie on 2017/4/7.
 */
/*
输入框插件，由div模拟。针对只能输入英文字符的输入框，不会改变当前输入法
使用方法:
引入该文件后创建一个div后class设置’no_ime‘即可。 如：<div class="no_ime"></div>
需注意，要给该div设置width和height以及border,否则该输入框不能正常显示。


 该组件使用div模拟，除了光标以外，完全模拟input输入功能
 1、左右移动光标位置
 2、点击改变光标位置
 3、backspace和del键分别删除光标前后位置一个字符
 4、像当前光标位置后面输入字符，输入字符包含shift + code组合键，以及shift + 字母在Caps Lock关闭转换大写，反之则小写
 5、支持鼠标选择已输入的字符，选中的字符可以替换，删除
 6、支持Tab转换焦点，使焦点转换到下一个输入框
 7、只能输入英文
 8、全称记录了光标实时位置，用于后期优化光标显示
 9、如需再添加组合键或者按键code可直接在keyCode对象里添加需要的按键code的key和value
 */

;(function($,window,document,undefined){

    var NoImeFun = function(){
        this.init.apply(this,arguments);
    };
    NoImeFun.prototype = {
        constructor: NoImeFun,
        options: {
            toUpValue: false    // 默认小写
        },
        selectObj: {},  //输入框被选中文字对象，默认空
        cursorIndex: 0, //默认光标位置
        init: function(options){
            var t = this;
            t.options = $.extend({},t.options,options);//   合并参数
            var proxy = $('.no_ime'); //所有只能输入英文的输入框，由div模拟输入
            proxy.each(function(){
                var thisObjParent = $(this);
                t.initDom(thisObjParent);
                var thisObj = thisObjParent.find('.no_ime_proxy');
                //当鼠标移除输入框 则禁止选中文本，鼠标移入则恢复选中
                thisObjParent.on('mouseenter',function(){
                    thisObjParent.css('cursor', 'text');
                }).on('mouseleave',function(){
                    thisObjParent.css('cursor', 'auto');
                });
                t.thisFocus(thisObj,thisObjParent);
            });
        },
        initDom: function(thisObjParent){
            var t = this;
            thisObjParent.css({
                'display': 'inline-block',
                'overflow': 'hidden',
                'line-height': thisObjParent.height() + 'px'
            });
            thisObjParent.append('<div class="no_ime_proxy"></div>');
            thisObjParent.find('.no_ime_proxy').css({
                'width': '100%',
                'display': 'inline-block',
                'white-space': 'nowrap',
                'overFlow-x': 'scroll',
                'overFlow-y': 'hidden',
                'height': (parseInt(thisObjParent.height()) + 80) + 'px'
            });
        },
        //点击文本框输入
        thisFocus: function(thisObj,thisObjParent){
            var t = this;
            thisObjParent.off('click').on('click',function() {
                /**
                 * div默认是得不到焦点的，可以为其设置tabindex属性使其可以获得焦点。也就可以绑定键盘事件。
                 * 如果是负数，用户不可以通过连续的焦点导航获取焦点，但可以用其他方式获取焦点。
                 * 如果是零，则可以通过连续的焦点导航获取焦点，按照惯例确定顺序。
                 * 如果是正数，则可以通过连续的焦点导航获取焦点，按照该值确定顺序。
                 */
                thisObjParent.attr("tabindex",0);
                thisObjParent.focus();
                thisObjParent.off('keydown').on('keydown', function (event) {
                    //使滚动条始终靠右
                    thisObj.scrollLeft(thisObj.scrollLeft()+10);
                    var ev = event || window.event;
                    var code = ev.keyCode || ev.which;
                    var txtValue = '';
                    var value = thisObj.text();

                    //获取当前输入框选中文本
                    thisObjParent.off('mouseup').on('mouseup',function(){
                        var txt = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
                        var start = window.getSelection().anchorOffset;
                        var end = window.getSelection().focusOffset;
                        t.selectObj = {
                            txt: txt,
                            start: start <= end ? start : end,
                            end: start >= end ? start : end
                        }
                        //点击改变光标位置
                        if (t.selectObj.start == t.selectObj.end){
                            t.cursorIndex = t.selectObj.start;
                        }
                        console.log(t.selectObj);
                    });
                    switch (code){
                        case 20:    //转换大小写
                            t.options.toUpValue = !t.options.toUpValue;
                            break;
                        case 8:     //删除选中字符或最后一个字符
                            if (t.selectObj.txt){     //如有选中字符则调用selecttion
                                t.delCharacter(thisObj,'delSelect');
                            }else{
                                t.delCharacter(thisObj,'delBefore');//删除光标前面一个字符
                            }
                            break;
                        case 46:     //Del键删除光标后面一个字符
                            if (t.cursorIndex <　value.length){
                                t.delCharacter(thisObj,'delafter');//删除光标前面一个字符
                            }
                            break;
                        case 37:    //左移动光标位置
                            if (t.cursorIndex > 0){
                                t.cursorIndex--;
                            }
                            break;
                        case 39:    //右移动光标位置
                            if (t.cursorIndex < thisObj.text().length){
                                t.cursorIndex++;
                            }
                            break;
                    }

                    if (t.options[code]) {
                        var valueCode = t.options[code];
                        //组合键的使用  shift + code
                        if (ev.shiftKey && t.options['shift' + code]){
                            valueCode = t.options['shift' + code];
                        }
                        //区分大小写，在开启Caps Lock下 按shift变成小写，反之大写
                        if (ev.shiftKey && t.options[code]){
                            txtValue = !t.options.toUpValue ? valueCode.toUpperCase() : valueCode;
                        }else{
                            txtValue = t.options.toUpValue ? valueCode.toUpperCase() : valueCode;
                        }
                        //判断是否有选中字符
                        if (t.selectObj.txt){
                            t.delCharacter(thisObj,'replace',txtValue);//替换选中的字符
                        }else {
                            //向光标位置添加一个字符
                            t.delCharacter(thisObj,'add',txtValue);
                        }
                    }
                    console.log('keyCOde = ' + code);
                    console.log('光标index: ' + t.cursorIndex);
                });
            });
        },
        //删除字符,添加字符
        delCharacter: function(thisObj,action,code){
            var t = this;
            var _code = code || '';
            var value = thisObj.text();
            var startStr = '';
            var endStr = '';
            switch (action){
                case 'delSelect':  //删除选中的字符
                    startStr = value.substring(0,t.selectObj.start);
                    endStr = value.substring(t.selectObj.end,value.length);
                    t.cursorIndex = t.selectObj.start;
                    t.selectObj = {};
                    break;
                case 'replace':  //替换选中的字符
                    startStr = value.substring(0,t.selectObj.start);
                    endStr = value.substring(t.selectObj.end,value.length);
                    t.cursorIndex = ++t.selectObj.start;
                    t.selectObj = {};
                    break;
                case 'delBefore':  //删除光标前面一个字符
                    startStr = value.substring(0,t.cursorIndex-1);
                    endStr = value.substring(t.cursorIndex,value.length);
                    if (t.cursorIndex > 0){
                        t.cursorIndex--;
                    }
                    break;
                case 'delafter':    //删除光标后面一个字符
                    startStr = value.substring(0,t.cursorIndex);
                    endStr = value.substring(t.cursorIndex+1,value.length);
                    break;
                case 'add': //在光标后面添加字符
                    startStr = value.substring(0,t.cursorIndex);
                    endStr = value.substring(t.cursorIndex,value.length);
                    t.cursorIndex++;
                    break;
            }
            thisObj.text(startStr + _code +  endStr);
        }
    }
    var keyCode = {
        '48': '0',
        '49': '1',
        '50': '2',
        '51': '3',
        '52': '4',
        '53': '5',
        '54': '6',
        '55': '7',
        '56': '8',
        '57': '9',
        '65': 'a',
        '66': 'b',
        '67': 'c',
        '68': 'd',
        '69': 'e',
        '70': 'f',
        '71': 'g',
        '72': 'h',
        '73': 'i',
        '74': 'j',
        '75': 'k',
        '76': 'l',
        '77': 'm',
        '78': 'n',
        '79': 'o',
        '80': 'p',
        '81': 'q',
        '82': 'r',
        '83': 's',
        '84': 't',
        '85': 'u',
        '86': 'v',
        '87': 'w',
        '88': 'x',
        '89': 'y',
        '90': 'z',
        '96': '0',
        '97': '1',
        '98': '2',
        '99': '3',
        '100': '4',
        '101': '5',
        '102': '6',
        '103': '7',
        '104': '8',
        '104': '9',
        '111': '/',
        '191': '/',
        '106': '*',
        '109': '-',
        '107': '+',
        '110': '.',
        '190': '.',
        '118': ',',
        '186': ';',
        '188': ',',
        '189': '-',
        '187': '=',
        '192': '`',
        '32': ' ',
        'shift48': ')',
        'shift49': '!',
        'shift50': '@',
        'shift51': '#',
        'shift52': '$',
        'shift53': '%',
        'shift54': '^',
        'shift55': '&',
        'shift56': '*',
        'shift57': '(',
        'shift189': '_',
        'shift187': '+',
        'shift192': '~',
        'shift219': '{',
        'shift221': '}',
        'shift186': ':',
        'shift222': '"',
        'shift220': '|',
        'shift188': '<',
        'shift190': '>',
        'shift191': '?'

    }
    new NoImeFun(keyCode);

})(jQuery,window,document);
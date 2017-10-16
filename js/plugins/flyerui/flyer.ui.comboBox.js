/***
 *@Name: fiyer v1.0 下拉组件
 *@Author: Ken (郑鹏飞)
 *创建于日期：2016/03/30
 *@Site : http://www.flyerui.com
 *@License：LGPL
 ***/
define(function(require, exports, module) {
    var $ =  require('jquery'),
      //  flyer = require("flyer-ui");

    var flyer = window.flyer || (window.flyer = {});

    var utility = function() {
        return {
            addEventListener: function(elm, type, fn) {
                if (typeof flyer.browser != "undefined") {
                    if (flyer.browser.msie && parseInt(flyer.browser.version) < 9) {
                        elm.attachEvent(type, fn);
                    } else {
                        elm.addEventListener(type, fn);
                    }
                } else {
                    elm.addEventListener(type, fn);
                }
            },
            stopPropagation: function(e) {
                if (typeof flyer.browser != "undefined") {
                    if (flyer.browser.msie && parseInt(flyer.browser.version) < 9) {
                        e.cancelBubble = false;
                        e.preventDefault();
                    } else {
                        e.stopPropagation();
                    }
                } else {
                    e.stopPropagation();
                }
            }
        }
    }();

    flyer.comboBox = function(options) {
        var defaults = {
            allowSearch: true, //是否允许索引内容
            disabled: false, //是否禁用
            bindId: '', //与UI控件要绑定的ID
            fieldKey: "id", //要绑定的键
            fieldValue: "value", //要绑定的值
            isMulti: false, //是否多选
            wrapper: null, //容器
            parts: null, //骨架
            selected: null, //内容更改时的事件
            placeholder: 'placeholder'
        };
        var classNames = {
            wrapper: "flyer-combobox-wrapper",
            ibox: "flyer-combobox-ibox",
            icontent: "flyer-combobox-icontent",
            btn: "flyer-combobox-btn",
            items: "flyer-combobox-items",
            search: "flyer-combobox-search",
            btn_arrows: "flyer-combobox-btn-arrows",
            show_items: "show",
            keep_show: "keep",
            disabled: "disabled"
        };
        var settings = $.extend(defaults, options);

        /*
         部件类，生成ComboBox所有运用到的组件归类
         */
        function parts(options) {

            var li = function(data) {
                var elm = document.createElement("li");
                elm.innerHTML = '<div id="' + data[settings.fieldKey] + '">' + data[settings.fieldValue] + '</div>';
                utility.addEventListener(elm, "click", function(e) {
                    events.selected(this);
                });
                return elm;
            }

            this.assemble = function() {
                settings.wrapper = this.wrapper();
                settings.wrapper.appendChild(this.ibox());
                settings.wrapper.appendChild(this.hidden());
                return settings.wrapper;
            }

            this.wrapper = function() {
                var elm = document.createElement("div");
                elm.className = classNames.wrapper;
                return elm;
            };
            this.ibox = function() {
                var elm = document.createElement("div");
                elm.className = classNames.ibox + (options.disabled ? " disabled" : "");
                elm.appendChild(this.icontent());
                elm.appendChild(this.btn());
                elm.appendChild(this.items());
                return elm;
            };
            this.icontent = function() {

                var elm = document.createElement("div");
                elm.className = classNames.icontent;
                if (!settings.disabled) {
                    utility.addEventListener(elm, "click", function(e) {
                        events.isShowItems($(elm.parentNode));
                        utility.stopPropagation(e);
                    })
                }
                elm.innerHTML = "<span class='placeholder'>" + settings.placeholder + "</span>";
                elm.setAttribute("placeholder", settings.placeholder);
                return elm;
            };
            this.btn = function() {
                var elm = document.createElement("label");
                elm.className = classNames.btn;
                elm.className = classNames.btn;

                var arrows = document.createElement("span");
                arrows.className = classNames.btn_arrows;
                elm.appendChild(arrows);
                if (!settings.disabled) {
                    utility.addEventListener(elm, "click", function(e) {
                        events.isShowItems($(elm.parentNode));
                        utility.stopPropagation(e);
                    });
                }
                return elm;
            };
            this.items = function() {
                var elm = document.createElement("div");
                elm.className = classNames.items;
                return elm;
            }
            this.ul = function() {
                var elm = document.createElement("ul");
                var li_search = this.search();
                if (settings.allowSearch)
                    elm.appendChild(li_search);
                return elm;
            }
            this.search = function() {
                var oli = document.createElement("li");
                var elm = document.createElement("input");
                elm.type = "text";
                elm.className = classNames.search;
                oli.appendChild(elm);
                utility.addEventListener(elm, "click", function(e) {
                    utility.stopPropagation(e);
                });
                utility.addEventListener(elm, "keyup", function(e) {
                    var cacheData = initData.getCache(),
                        filterData = [],
                        that = this,
                        ul = $(settings.wrapper).find("ul")[0];
                    initData.clearItems(ul);
                    $(cacheData).each(function() {
                        if (this[settings.fieldValue].indexOf(that.value) >= 0) {
                            filterData.push(this);
                        }
                    });
                    if (filterData.length > 0) {
                        $(filterData).each(function(i) {
                            ul.appendChild(li(this));
                        });
                    } else {
                        var dontfind = document.createElement("li");
                        dontfind.innerHTML = "<div>未找到相关联的'" + this.value + "'</div>";
                        ul.appendChild(dontfind);
                    }
                });
                return oli;
            }

            this.hidden = function() {
                var elm = document.createElement("input");
                elm.type = "hidden";
                return elm;
            }
            this.fullItems = function(data) {
                var vData = data || initData.requestData(options);
                if (typeof(vData) == "undefined") return false;
                var ul = this.ul();
                $(vData).each(function(i) {
                    ul.appendChild(li(this));
                });
                $(settings.wrapper).find("." + classNames.items).append(ul);
            }
        }

        /*
         事件归类，用于ComboBox所有动用到的事件
         */
        var events = {
            isShowItems: function(wrapper) {
                if (wrapper.hasClass(classNames.show_items)) {
                    wrapper.removeClass(classNames.show_items);
                } else {
                    events.hideAllItems();
                    wrapper.addClass(classNames.show_items);
                }
            },
            hideAllItems: function() {
                $("." + classNames.ibox).removeClass(classNames.show_items);
            },
            selected: function(item) {
                var value = item.childNodes[0].innerHTML;
                value = value.length === 0 ? ("<span class='placeholder'>" + settings.placeholder + "</span>") : value;
                var key = item.childNodes[0].id;
                if (settings.isMulti) {
                    var content = $(settings.wrapper).find("." + classNames.icontent).html();
                    $(settings.wrapper).find("." + classNames.icontent).html(content + ("<span>" + value + "</span>"));
                } else {
                    $(settings.wrapper).find("." + classNames.icontent).html("<span>" + value + "</span>");
                }
                $("#" + settings.bindId).attr("key", key);
                $("#" + settings.bindId).val(value);
                if (settings.selected != null && typeof settings.selected == "function") {
                    settings.selected({
                        fieldKey: key,
                        fieldValue: value
                    });
                }
            }
        };

        var initData = {
            setCache: function(data) {
                var hideControl = $(settings.wrapper).find('input[type="hidden"]')[0];
                if (hideControl) {
                    $(hideControl).val(JSON.stringify(data));
                }
            },
            getCache: function() {
                var hideControl = $(settings.wrapper).find('input[type="hidden"]')[0];
                return JSON.parse($(hideControl).val());
            },
            requestData: function(options) {
                var cur_data = options.data;
                if (!options.data) {
                    $.getJSON(options.url, function(data) {
                        cur_data = data;
                        initData.setCache(cur_data);
                        settings.parts.fullItems(data);
                    });
                } else {
                    initData.setCache(cur_data);
                    return cur_data;
                }
            },
            clearItems: function(container) {
                if (container.childNodes.length == 0) return false;
                for (var i = 1; i < container.childNodes.length; i++) {
                    container.removeChild(container.childNodes[i]);
                    i--;
                }
            }
        }

        var init = function() {
            var container = $("#" + options.bindId).parent();
            $(container).css("position", "relative");
            settings.parts = new parts(settings);
            $(container).append(settings.parts.assemble());
            settings.parts.fullItems();

            $(container).find("#" + options.bindId).css("visibility", "hidden");
            $(container).find("#" + options.bindId).css("width", $(container).find("." + classNames.ibox).width());
            $(container).find("#" + options.bindId).css("height", $(container).find("." + classNames.ibox).height());

            $(document).bind("click", function(e) {
                events.hideAllItems();
                utility.stopPropagation(e);
            });
        }
        init();
    }
    flyer.comboBoxManager = function(id) {
        var input = document.getElementById(id);
        return {
            getValue: function() {
                return input.value;
            },
            getText: function() {
                return input.getAttribute("key");
            },
            setValue: function(obj) {
                var $input = $(input);
                $input.attr("key", obj.fieldKey);
                $input.val(obj.fieldValue);
                var $icontent = $(input).parent().find(".flyer-combobox-icontent");
                $icontent.html("<span>" + obj.fieldValue + "</span>");
            },
            empty: function() {
                input.removeAttribute("key");
                input.value = "";
                var $icontent = $(input).parent().find(".flyer-combobox-icontent");
                $icontent.empty();
                $icontent.html("<span class='placeholder'>" + $icontent.attr("placeholder") + "</span>");
            }
        }
    }

});
/***
 *@Name: fiyer v1.0 下拉组件
 *@Author: Ken (郑鹏飞)
 *创建于日期：2016/03/30
 *@Site : http://www.flyerui.com
 *@License：LGPL
 ***/
define(function(require, exports, module) {
    var $ = require('jquery'),
    var flyer = window.flyer || (window.flyer = {});
    	// <div class="flyer-combobox">
        //     <div class="flyer-combobox-contents"><span class="filter-options"></span><i class="fa fa-angle-down"></i></div>
        //     <div class="flyer-combobox-items" style="display:block;">
        //         <div class="flyer-combobox-search">
        //             <input placeholder="在这里可以输入" type="text"><i class="fa fa-search"></i>
        //         </div>
        //         <ul>
        //             <li>
        //                 <div>唐四少1</div>
        //             </li>
        //             <li>
        //                 <div>唐四少2</div>
        //             </li>
        //             <li>
        //                 <div>唐四少3</div>
        //             </li>
        //             <li>
        //                 <div>唐四少4</div>
        //             </li>
        //         </ul>
        //     </div>
        // </div>
        //定义一个样式数组集合
        var styles = ["flyer-combobox", "flyer-combobox-contents", "filter-options", "fa-angle-down", "flyer-combobox-items", "flyer-combobox-search", "fa-search", "selected", "open"],
            body = document.body,
            doc = document,
            loca = location,
            win = window;



        //声明一个下拉框构造函数 
        var ComboBox = function(selector, options) {
            return this.init(selector, options);
        }

        ComboBox.DEFAULTS = {

            //是否支持多选，默认值为true
            isMulti: true,

            //是否禁用,默认值为false
            disabled: false,

            //是否允许索引内容
            allowSearch: false,

            //显示值分隔的符号
            multipleSeparator: ";",

            //要绑定的键
            fieldKey: "id",

            //要绑定的值
            fieldValue: "value",

            //placeholder
            placeholder: "placeholder",

            //搜索的框里的placeholder
            searchPlaceholder: "在这里可以快捷搜索到你想找的..",

            //请求服务数据源地址
            url: "",

            //JSON数据Data，优先于请求的服务数据源地址
            data: [],

            //是否可以选中全部
            selectAll: true,

            //点击全选是否选中所有的值
            allowSelectAll: false,

            //开放一个数据结构处理的方法
            fnDataProcessing: function() {
                this.data = this.data.rows;
            },

            //选中事件
            fnSelected: function() {
                return false;
            },

            //选中之前事件
            fnBeforeSelected: function() {
                //废弃后的事件...
            },

            //先中之后事件
            fnAfterSelected: function() {
                //废弃后的事件...
            }

        }
        var onj_this = null;
        ComboBox.prototype = {

            //页面加载的实例化入口
            init: function(selector, options) {
                this.options = $.extend(ComboBox.DEFAULTS, options);
                this.selector = selector;
                this[0] = $(selector);
                this._data = {};
                this.requestData();
                onj_this = this.options;
            },

            //加载模板
            template: function() {
                var opts = this.options,
                    _this = this;

                var arryHtmls = [
                    '<div class="flyer-combobox">',
                    '<div class="flyer-combobox-contents">',
                    '<input type="text" class="filter-options" placeholder=' +
                    opts.placeholder +
                    ' readonly="readonly" /><label class="flyer-combobox-btn"><span class="flyer-combobox-btn-arrows"></span></label>',
                    '</div>',
                    '<div class="flyer-combobox-items">',
                    opts.allowSearch ? '<div class="flyer-combobox-search"><input placeholder="' + opts.searchPlaceholder + '" type="text"><i class="fa fa-search"></i></div>' : "",
                    '<ul>',
                    opts.selectAll ? "<li data-index='-1' data-key='-1' data-value='全部'><div>全部</div></li>" : "",
                    _this.readerItems(),
                    '</ul>',
                    '</div>',
                    '</div>'
                ]

                this[0].html(arryHtmls.join(""));

                this.$itemContainer = this[0].find("." + styles[4]);
                this.$contents = this[0].find("." + styles[1]);
                this.$items = this.$itemContainer.find("li");
                this.$filterOptions = this.$contents.find("." + styles[2]).eq(0);

            },

            //渲染下拉数据
            readerItems: function() {
                var arryHtmls = [],
                    _this = this,
                    opts = this.options,
                    data = opts.data;

                for (var i = 0, len = data.length; i < len; i++) {
                    arryHtmls.push('<li data-index=' + i + ' data-key=' + data[i][opts.fieldKey] + ' data-value=' + data[i][opts.fieldValue] + '><div>' + data[i][opts.fieldValue] + '</div></li>');
                }

                return arryHtmls.join("");
            },

            //拼装数据
            requestData: function() {
                var _this = this,
                    opts = this.options,
                    data = opts.data;

                if (data.length == 0 && opts.url.length > 0) {
                    $.post(this.options.url, function(data) {
                        opts.data = data;
                        opts.fnDataProcessing();
                        _this.template();
                        _this.initEvents();
                    });
                } else {
                    _this.template();
                    _this.initEvents();
                }
            },

            //添加事件
            initEvents: function() {

                var _this = this,
                    opts = _this.options;

                _this.$contents.on("click", function(e) {
                    $("." + styles[4]).removeClass(styles[8]);
                    $(_this).addClass(styles[8]);
                    if (_this.$itemContainer.hasClass(styles[8])) {
                        _this.hideItems.call(_this);
                    } else {
                        _this.$itemContainer.addClass(styles[8]);
                    }
                    _this.stop(e);
                });
                _this.$items.each(function() {
                    $(this).on("click", function(e) {

                        var $this = $(this),
                            del = $this.hasClass(styles[7]) ? true : false;

                        var item = {
                            fieldKey: $this.data("key"),
                            fieldValue: $this.data("value")
                        }
                        if (item.fieldKey == "-1" && item.fieldValue == "全部" && _this.$items.filter('.'+styles[7]).length != 0) {
                            if (opts.allowSelectAll) {
                            	$(this).attr('all','unselect');
                            	_this.empty();
                                _this.selectAllItems(this);//选中全部
                                return false;
                            }

                            _this.$items.removeClass(styles[7]);
                            _this.empty();
                        }
                        if (item.fieldKey == "-1" && item.fieldValue == "全部" && _this.$items.filter('.'+styles[7]).length == 0) {//少了一种情况
                            if (opts.allowSelectAll) {
                            	$(this).attr('all','unselect');
                                _this.selectAllItems(this);//选中全部
                                return false;
                            }
                        }
//                        _this.unselectAll();//逻辑有错误yb
                        _this.showSelectedItem(item, del);
                        var inputValue = _this.$filterOptions.val();
                        if(_this.$filterOptions.val()=='全部,') _this.$filterOptions.val(inputValue.replace(/,/,''));
                        opts.fnSelected.call(_this, item, this, _this._data);

                        if (!opts.isMulti) {
                            _this.hideItems.call(_this);
                            _this.$items.removeClass(styles[7]);
                        }
                        if (del) {
                            $this.removeClass(styles[7]);
                            //全部都不选中的时候默认选中'全部'
                            if(_this.$items.first()[0].innerText.trim() == '全部' && $this.index()!=0 && _this.$items.filter('.'+styles[7]).length == 0){
                            	_this.empty();
                            	_this.$items.first().click();
                            }else if(_this.$items.first()[0].innerText.trim() == '全部' && $this.index()==0 && _this.$items.filter('.'+styles[7]).length == 0){
                            	_this.empty();
                            	_this.$items.first().click();
                            }
                        } else {
                            $this.addClass(styles[7]);
                            //全部不允许选中全部的时候 所有项都选中
                            if($this.siblings().filter('.'+styles[7]).length == (_this.$items.length-2) && _this.$items.first()[0].innerText.trim() == '全部' && $this.index()!=0 && _this.$items.length != 3){
                            	//选中全部其他项全部消掉
                            	_this.empty();
                            	_this.$items.first().click();
                            }else if($this.siblings().filter('.'+styles[7]).length != (_this.$items.length-2) && _this.$items.first()[0].innerText.trim() == '全部' && $this.index()!=0 &&_this.$items.eq(0).hasClass(styles[7])&& _this.$items.length != 3){
                            	_this.empty();
                            	$this.addClass(styles[7]);
                            	_this.showSelectedItem(item, del);
                            }else if(_this.$items.length == 3){
                            	if($this.siblings().filter('.'+styles[7]).length == 1 && _this.$items.first()[0].innerText.trim() == '全部' && $this.index()!=0&&_this.$items.eq(0).hasClass(styles[7])){
                            		_this.empty();
                            		$this.addClass(styles[7]);
                            		_this.$items.first().removeClass(styles[7]);
                            		_this.showSelectedItem(item, del);
                            	}else if($this.siblings().filter('.'+styles[7]).length == 1 && _this.$items.first()[0].innerText.trim() == '全部' && $this.index()!=0&&!_this.$items.eq(0).hasClass(styles[7])){
                            		_this.empty();
                                	_this.$items.first().click();
                            	}
                            }
                        }
                        _this.stop(e);
                        //下面项除了全部的选项全部选中的时候
                        if(_this.$items.filter('.'+styles[7]).length == _this.$items.length-1 && !$(_this.$items[0]).hasClass(styles[7]) && opts.selectAll){
                        	if(opts.allowSelectAll){//允许全部选中的时候
	                        	_this.empty();
	                        	$(this).attr('all','unselect');
	                        	_this.selectAllItems(this);
	                        	return
                        	}else{
                        		//'全部'选中其他项不选中
                        		_this.$items.removeClass(styles[7]);
                                _this.empty();
                                _this.showSelectedItem(item, del);
                        	}
                        }
                        //当包括全选在内的选项全部被选中的时候反选
                        if(_this.$items.filter('.'+styles[7]).length == _this.$items.length-1 && $(_this.$items[0]).hasClass(styles[7]) && opts.selectAll && $this.index() != 0 && opts.allowSelectAll){
                        	$(_this.$items[0]).removeClass(styles[7]);
                        }
                        if(_this.$items.filter('.'+styles[7]).length == 0 && opts.selectAll && opts.allowSelectAll){
                        	_this.unselectAll();
                        }
                    });
                });
                //默认选择全部
                if(!this.options.allowSelectAll) _this.$items[0].click();
                $(document).on("click", function(e) {
                    $("." + styles[4]).removeClass(styles[8]);
                    _this.stop(e);
                });

            },

            //阻止冒炮事件
            stop: function(e) {
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            },

            //将选中的值显示在内容区域
            showSelectedItem: function(item, del) {

                var opts = this.options,
                    keys = this.$filterOptions.data("key") || "",
                    values = this.$filterOptions.val() || "";

                if (opts.isMulti) {

                    //如果是删除
                    if (del) {
                        keys = String(keys).replace((item.fieldKey + opts.multipleSeparator), "");
                        values = values.replace((item.fieldValue + opts.multipleSeparator), "");
                    } else {
                        keys = String(keys) + item.fieldKey + opts.multipleSeparator;
                        values = values + item.fieldValue + opts.multipleSeparator;
                    }
                } else {
                    keys = item.fieldKey;
                    values = item.fieldValue;
                }

                this.$filterOptions.val(values);
                this.$filterOptions.data("key", keys);

                //声明一个内部选中的数据
                this._data = {
                    fieldKey: keys,
                    fieldValue: values
                }
            },

            //全部选中
            selectAllItems: function(elm) {
                var _this = this,
                    opts = this.options,
                    $elm = $(elm);

                if ($elm.attr("all") == "select") {
                    this.$items.removeClass(styles[7]);
                    $elm.attr("all", "unselect");
                    _this.empty();
                } else {

                    this.$items.each(function() {
                        var $this = $(this),
                            item = {
                                fieldKey: $this.data("key"),
                                fieldValue: $this.data("value")
                            };
                        $this.addClass(styles[7]);
                        if (item.fieldKey != "-1") {
                            _this.showSelectedItem(item);
                        }
                    });

                    $elm.attr("all", "select");
                }
            },

            //移除选中的all项
            unselectAll: function() {
                var $all = this.$itemContainer.find("[data-index='-1']");
                if ($all.hasClass(styles[7])) {
                    $all.removeClass(styles[7]);
                    $all.attr("all", "select");
                    this.empty();
                }
            },

            //隐藏下拉框
            hideItems: function() {
                this.$itemContainer.removeClass(styles[8]);
            },

            //快捷检索出需要的数据
            filterData: function() {

            },

            //得到选中的值对象
            getSelectedData: function() {
                return this._data;
            },

            //得到选中的值
            getSelectedValue: function() {
                return this._data.fieldKey;
            },

            //得到选中的文本
            getSelectedText: function() {
                return this._data.fieldValue;
            },

            //给对象赋值
            setValue: function(data) {

                var $selectedItem = this.$itemContainer.find("[data-key='" + data.fieldKey + "']");
                this._data = {
                    fieldKey: data.fieldKey,
                    fieldValue: data.fieldValue || $selectedItem.data("value")
                }
                this.$filterOptions.val(this._data.fieldValue);
                this.$filterOptions.data("key", this._data.fieldKey);
                $selectedItem.addClass(styles[7]);
           
            },
            
          //给对象赋值
            setValues: function(data) {
            	var keys="",values="",opts = this.options;
            	for(var i=0,len=data.length;i<len;i++){
            		var $selectedItem = this.$itemContainer.find("[data-key='" + data[i].fieldKey + "']");
            		  keys = String(keys) + data[i].fieldKey + opts.multipleSeparator;
                      values = values + (data[i].fieldValue || $selectedItem.data("value")) + opts.multipleSeparator;
                    $selectedItem.addClass(styles[7]);
            	}
            	
            	 this._data = {
                         fieldKey: keys,
                         fieldValue: values
                     }
                     this.$filterOptions.val(this._data.fieldValue);
                     this.$filterOptions.data("key", this._data.fieldKey);
            },

            //清空选中的值
            empty: function() {
                this._data = {
                    fieldKey: "",
                    fieldValue: ""
                }
                this.$filterOptions.val(this._data.fieldValue);
                this.$filterOptions.data("key", this._data.fieldKey);
                this.$items.removeClass(styles[7]);
                return this
            }
        }
        
        flyer.combobox = function(selector, options) {
            return new ComboBox(selector, options);
        }
});

(function($) {

    var instCount = 0, // 下拉框 id 值拼接
    	allOptions = {}, 
        $cur_selecter,  // 存储当前点击的 selecter 对象
        clickEvent,  // 存放 原select绑定的点击事件，给 生成的下拉框的 .selecter元素（输入框）绑定
        isShow = 0, // 是否有下拉选项框显示。在没有下拉框显示时，控制点击 document 不去进行多余 dom 操作
        initOnce = {
            fired: false,
            fire: function() {
                $(document).on("mousedown", ".selecter", function() {
                    var _id,
                        $optionBox;
        
                    $cur_selecter = $(this);
                    
                    _id = $(this).parent(".select").attr("id").split("-")[1];
                    $(".optionBox.showOptions").removeClass("showOptions").addClass("hideOptions");
                    isShow > 0 && isShow--;
                    
                    // 如果选项为空，不显示下拉框
                    $optionBox = $("#ul-" + _id);
        
                    if($optionBox.children(".option").length == 0) {
                        return false;
                    }
                    
                    $optionBox.toggleClass("hideOptions showOptions");
                    
                    setOptionboxPosition($cur_selecter.parent(".select"));
        
                    setScrollPos($optionBox.children(".option[selected]").eq(0));
                    
                    isShow++;

                    stopEvent(event);
                    return false;
                });
                
                $(document).on("mousedown", function() {
                    isShow > 0 && $(".optionBox").removeClass("showOptions").addClass("hideOptions") && isShow--;
                });

                $(document).on("mousedown", ".optionBox", function() {
                	stopEvent(event);
                })
        
                $(document).on("mousedown", ".option", function(event) {
                    var _id = $(this).parent("ul").attr("id").split("-")[1];
                    var isSingleSelect = $("#fancy-" + _id).hasClass("singleSelect");
                    
                    // 单选下拉框
                    if(isSingleSelect) {
                        toggleSelect($(this));

                        $(".optionBox").removeClass("showOptions").addClass("hideOptions");
                        isShow--;
                    } 
            
                    // 多选下拉框
                    if(!isSingleSelect) {
                        var $checkbox = $(this).find(":checkbox");
                        $checkbox.prop("checked", !$checkbox.prop("checked"));  // 这边要使用 prop()，使用 attr() 没效果
            
                        // 设置复选框图片
                        var isChecked =  $checkbox.prop("checked");
                        var $checkboxWraper = $(this).children(".checkbx");
                        toggleChecked($checkboxWraper, isChecked, _id);
                        var $valueBox = $cur_selecter;
                        handleValue($valueBox, $checkboxWraper, isChecked);
                        
                        stopEvent(event);  // 阻止事件冒泡隐藏下拉列表
                    }
                });
        
                // 复选框 checked值 切换是在鼠标 click事件 下执行的，mousedown事件 执行在 click事件前，所以如果将 获取复选框 checked值 放在 mousedown事件
                // 下写的话，获取到的值是 click事件 前的值，click事件之后 checked值 才会被切换
                // 也就是 mousedown 和 click 事件下 checked值 是不一样的
                $(document).on("mousedown", ".optionBox input[type='checkbox']", function(event) {
                    stopEvent(event);
                });

                $(document).on("click", ".optionBox input[type='checkbox']", function(event) {
                    var isChecked =  $(this).prop("checked");
                    var $checkboxWraper = $(this).parent(".checkbx");
                    toggleChecked($checkboxWraper, isChecked);
                    
                    var _id = $(this).parents(".optionBox").attr("id").split("-")[1];
                    var $valueBox = $cur_selecter;
                    handleValue($valueBox, $checkboxWraper, isChecked);
            
                    stopEvent(event);
                });


            }
        };

    /**
     * 判断数组中是否存在某个值
     * @param {Array} arr 
     * @param {String} val 
     */ 
    function indexOf(arr, val) {
        for(var i=0; i < arr.length; i++) {
            if(arr[i] == val) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 删除数组中的某个值
     * @param {Array} arr 
     * @param {String} val 
     */ 
    function remove(arr, val) {
        var index = indexOf(arr, val);

        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    //阻止冒泡事件
    function stopEvent(event){ 
        var e = arguments.callee.caller.arguments[0]||event; // 若省略此句，下面的 e 改为 event，IE运行可以，但是其他浏览器就不兼容

        if (e && e.stopPropagation) {

            // Mozilla , Opera
            e.stopPropagation();

        } else if (window.event) {

            // ie
            window.event.cancelBubble = true;

        }
    }

    /**
     * 切换 单选下拉框 选项
     * @param {jquery object} $el 当前选项
     */ 
    function toggleSelect($el) {
        var selectedVal = $el.html(),
            $inputBox = $cur_selecter,
            $oldSelect = $cur_selecter.parent().prev("select"), // 原始 <select>
            value = $el.attr("data-value");

        if(typeof $el.attr("selected") !== "undefined") {
            return false;
        } 

        $el.parent().children(".option[selected]").removeAttr("selected");
        $el.attr("selected", "selected");
        $inputBox.val(selectedVal);

        // 原始 <select>
        $oldSelect.val(value);
        $oldSelect.trigger("change"); // js 改变 <select> 的值，不会触发 onChange 事件，需要手动触发

        showTitle($inputBox, selectedVal);
    }

    /**
     * 切换复选框选中样式
     * @param {dom object} el checkbox框
     * @param {Boolean} isChecked 
     * @param {String} _id 原 <select> 的 id
     */ 
    function toggleChecked(el, isChecked, _id) {
        var $option = $(el).parent(".option"),
            _value,
            $select = $("#" + _id),
            $selectOption;
            
        _value = $option.attr("data-value");
        $selectOption = $select.find("option[value=" + _value + "]");

        if (isChecked) {
            $option.attr("selected","selected");  
            $option.attr("data-selected","selected"); 
            $(el).children("img").attr("src", allOptions.checkboxImg.selected);
            $selectOption.attr("selected", "selected");
            $selectOption.attr("data-selected", "selected");
        } else {
            $(el).children("img").attr("src", allOptions.checkboxImg.defaut);
            $option.removeAttr("selected data-selected");
            $selectOption.removeAttr("selected data-selected");
        }
    }

    /**
     * 处理选中的内容
     * @param {dom object} selecter 输入框
     * @param {*} checkbox  dom元素,checkbox框
     * @param {Boolean} isChecked 选择框是否选中
     */ 
    function handleValue(selecter, checkbox, isChecked) {
        var oldValue,
            newValue,
            valueArr;

        oldValue = $(selecter).val().replace(/[\r\n\ ]+/g,"");
        newValue = $(checkbox).parent(".option").text().replace(/[\r\n\ ]+/g,"");
        valueArr = oldValue != "" ? oldValue.split(";"): [];

        if(isChecked) {
            valueArr.push(newValue);
            lastValue = valueArr.join(";").replace(/[\r\n\ ]+/g,"");
        } else {
            remove(valueArr, newValue);
            lastValue = valueArr.join(";").replace(/[\r\n\ ]+/g,"");
        }
        $(selecter).val(lastValue);

        showTitle($(selecter), lastValue);
        
        triggerMultiChange(selecter);
        
    }

    /**
     * 是否设置 input 的 title 属性
     * @param {jQuery Object} $input 内容显示输入框
     * @param {String} 选中的值
     **/  
    function showTitle($input, selectedVal) {
        allOptions.showTitle ? $input.attr("title",selectedVal) : $input.removeAttr("title");
    }

    /**
     * 触发 multiChange 事件
     * @param {dom object} selecter 输入框
     */
    function triggerMultiChange(selecter) {
        var _id,
            $EventObj,
            newValArr;

        _id = $(selecter).parent().attr("id").split("-")[1];
        $EventObj = $("#" + _id);
        newValArr = $.uniq.call($EventObj);

        $EventObj.trigger("multiChange", [newValArr]);
    }
    
    /**
     * 设置下拉选项框的位置
     * @param {*} $newSelect 下拉框最外层标签的jquery对象
     */
    function setOptionboxPosition($newSelect) {
        var _id,
            $optionBox,
            top,
            left,
            h,
            w;

        _id = $newSelect.attr("id").split("-")[1];
        $optionBox = $("#ul-" + _id);
        top = $newSelect.offset().top;
        left = $newSelect.offset().left; 
        h = $newSelect.outerHeight();
        w = $newSelect.outerWidth();

        $optionBox.css({
            "top": top + h + "px",
            "left": left + "px",
            "width": w + "px"
        });
    }

    /**
     * 设置 选中选项 显示在可见区域内
     * 向下滚动 选中选项 消失，选中选项 在容器中的 位置高度 < 滚动高度
     * 向上滚动 选中选项 消失，选中选项 在容器中的 位置高度 > 滚动高度 + 容器高度 - 选项高度（存在没有完成显示及隐藏的选项）
     * @param {jquery object} $curOption 选中选项
     */ 
    function setScrollPos($curOption) {
        var height,
            scrollHeight,
            minHeight,
            maxHeight,
            $optionBox;

        $optionBox = $curOption.parent(".optionBox");
        height = $curOption.prevAll(".option",".optionBox").length * $curOption.outerHeight(true);
        scrollHeight = $optionBox.scrollTop();
        minHeight = scrollHeight; 
        maxHeight = scrollHeight + $optionBox.outerHeight() - $curOption.outerHeight(true);

        (height < minHeight || height > maxHeight) && $optionBox.scrollTop(height);
    }

    $.fn.select = function(options) {

        $(this).each(function(i, select) {
            var defaultOptions = {
                checkboxImg: {
                    defaut: "../imgs/checkbox-default.png",
                    selected: "../imgs/checkbox-selected.png"
                },
                prompt: "请选择",
                showTitle: true
            };
            $.extend(true, allOptions, defaultOptions, options || {});

            // 建立新的下拉框
            $(select).newSelect();
            
            if(!initOnce.fired) {
                initOnce.fire();
                initOnce.fired = true;
            }

        });
    }

    $.uniq = function() {
        var _id,
            $options,
            selected,
            isSelected, // 选项是否选中
            uniq; // 选中选项的 key value 值

        _id = $(this).attr("id");
        $options = $("#ul-"+ _id).children(".option");
        selected = [];

        $options.each(function() {
            isSelected = $(this).attr("selected");
            
            if(typeof isSelected !== "undefined") {
                uniq = $(this).attr("data-value");
                selected.push(uniq);
            }
        });

        return selected;
    }

    /**
     * 获取选中选项的唯一标识
     */ 
    $.fn.getUniq = function() {
        var selected = $.uniq.call(this);
        return selected;
    }

    /**
     * 重置下拉框 value 值
     * @param {String} keyVal 值，多选下拉框传入数组
     */
    $.fn.resetValue = function(keyVal) {
        var $select = $(this),
            _id = null, 
            $optionBox = null, // 生成的选项列表
            $original_selected = null, // 原 <select> 选中的选项
            $setObj = null; // 需要设置的选项对象
        
        $select.each(function() {
            _id = $(this).attr("id");
            $optionBox = $("#ul-" + _id);
            $original_selected = $(this).find("option[selected]"); 

            $optionBox.remove(); // 因为之后会生成新的选项列表，需要把已存在的选项列表删除 
            // 去除选中属性
            $original_selected.each(function() {
                $(this).removeAttr("selected");
                $(this).removeAttr("data-selected");
            });

            if(typeof keyVal !== "undefined" && typeof keyVal === "string") {
                // 单选
                $setObj = $(this).find("option[value='" + keyVal + "']");
                $setObj.attr("selected", "true");
                $setObj.attr("data-selected", "true");

            } else if (typeof keyVal !== "undefined" && typeof keyVal === "object") {
                // 多选
                $setObj;
                for(var i = 0, len = keyVal.length; i < len; i++) {
                    $setObj = $(this).find("option[value='" + keyVal[i] + "']");
                    $setObj.attr("selected", "true");
                    $setObj.attr("data-selected", "true");
                }
            }

            $(this).newSelect(); // 生成新的下拉框
        });
    }

    $.fn.newSelect = function() {

        var selectType, // 下拉框类型：单选，多选
            $select = $(this),
            $newSelect,
            selectId,
            $optionBox,
            $selectOptions;

        selectId = $select.attr("id") ? $select.attr("id") : 'select' + instCount++;
        $optionBox = $select.clone().changeElementType("ul").addClass("optionBox hideOptions");
        $selectOptions = $optionBox.children("option").changeElementType("li").addClass("option");

        $select.attr("id", selectId); // 设置 <select> 的 id
        $optionBox.attr("id", "ul-" + selectId);
        $optionBox.attr("multiple") ? selectType = "multiple" : selectType = "single";

        // 将原先生成的下拉框删除
        $select.parent().find("#fancy-" + selectId).remove(); 
        $("#ul-" + selectId).remove();
        
        $newSelect = $("<div id=fancy-" + selectId + " class='select'>\
                            <input class='selecter' readonly='readonly' unselectable='on' placeholder='请选择' onclick='" + clickEvent + "'></input>\
                        </div>");
        
        selectType === "single" ? singleTemplate() : multipleTemplate();

        function multipleTemplate() {
            var $checkbox,
                isSelected;
            
            $checkbox = $("<div class='checkbx'>\
                                <input type='checkbox' />\
                                <img src='" + allOptions.checkboxImg.defaut + "' />\
                            </div>\
                        ");

            $selectOptions.append($checkbox);
            $selectOptions.each(function() {
                isSelected = $(this).attr("selected");
                if(typeof isSelected !== "undefined") {
                    $(this).find("input[type=checkbox]").prop("checked", true);
                }
                $optionBox.append($(this));
            });
            
            $newSelect.addClass("multiSelect");
            $("body").append($optionBox);
            $select.after($newSelect);

            disableInput()

            initMultiCheckbox($newSelect);
        }

        function singleTemplate() {
            $selectOptions.each(function() {
                $optionBox.append($(this));
            });
            $newSelect.addClass("singleSelect");
            $("body").append($optionBox);
            $select.after($newSelect);

            disableInput(); 

            initSingleSelect($newSelect);
        }

        /**
         * 多选下拉框初始化
         * @param {jquery object} $el 下拉框最外层对象
         */ 
        function initMultiCheckbox($el) {
            var _id,
                $checkboxs, 
                $checkboxInput, // <input> 复选框
                isChecked,
                $valueBox; // 输入框

            _id = $el.attr("id").split("-")[1];
            $checkboxs = $("#ul-" + _id).find(".checkbx");
            $valueBox = $el.children(".selecter");

            $checkboxs.each(function() {
                $checkboxInput = $(this).children("input[type='checkbox']");
                isChecked = $checkboxInput[0].checked;

                toggleChecked($(this), isChecked);
                handleValue($valueBox, $(this), isChecked)
            });
        }

        /**
         * 单选下拉框初始化
         * @param {jquery object} $el 下拉框最外层对象
         */ 
        function initSingleSelect($el) {
            var _id,
                $options,
                isSelected,
                $inputBox, // 输入框
                selectedVal;

        	_id = $el.attr("id").split("-")[1];
            $options = $("#ul-" + _id).children(".option");
            $inputBox = $el.children(".selecter");

            $options.each(function () {
                isSelected = $(this).attr("selected");

                if(typeof isSelected !== "undefined") {
                    selectedVal = $(this).html();
                    $inputBox.val(selectedVal);

                    showTitle($inputBox, selectedVal);
                }
            })
        } 

        /** 
         * 禁用下拉框
         * */ 
        function disableInput() {
            // 给 input 添加 disabled 属性
            var disable = $optionBox.attr("disabled");
            if (typeof disable !== "undefined") {
                $optionBox.prev("input").attr(disable, disable);
            }
        }
    }

    /**
     * 替换标签
     * @param {String} newType 新的标签类型
     */ 
    $.fn.changeElementType = function(newType) {
        
		for (var i = 0, j = this.length; i < j; i++) {
            var attrs = {}, 
                $new;
            
			$.each($(this[i])[0].attributes, function(idx, attr) {
                switch(attr.name) {
                    case "value":
                        attrs["data-value"] = attr.value;
                        break;
                    case "name":
                        attrs["name"] = "ul-" + attr.value;
                        break;
                    case "data-selected":
                        attrs["selected"] = attr.value;
                        break;
                    case "multiple":
                        typeof attr.value !== "undefined" && (attrs["multiple"] = attr.value !="" ? attr.value : true);
                        break;
                    case "onclick": 
                        clickEvent = attr.value;
                        break;
                    default: 
                        attrs[attr.name] = attr.value;
                        break;
                }
            });

            $new = $("<" + newType + "/>", attrs).append($(this[i]).contents());

			$(this[i]).replaceWith( $new );
			
			this[i] = $new[0];

        }
        return this;
    };
})(jQuery);
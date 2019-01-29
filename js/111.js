
(function($) {

    var instCount = 0, allOptions = {};

    /**
     * 判断数组中是否存在某个值
     * @param {Array} arr 
     * @param {String} val 
     */ 
    function indexOf(arr, val) {
        for(var i=0; i < arr.length; i++) {
            if(arr[i] == val) {
                return i
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
        var index = indexOf(arr, val)
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    //阻止冒泡事件
    function stopEvent(event){ 
        var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
        if (e && e.stopPropagation) {
        // this code is for Mozilla and Opera
        e.stopPropagation();
        } else if (window.event) {
        // this code is for IE
        window.event.cancelBubble = true;
        }
    }

    /**
     * 切换单选下拉框选中状态
     * @param {*} $options jquery对象 所有下拉选项
     * @param {*} $el jquery对象 当前选项
     */ 
    function toggleSelect($options, $el) {
        $options.each(function () {
            $(this).attr("data-selected", false);
        })
        $el.attr("data-selected", true);
        var selectedVal = $el.html();
        var $inputBox = $el.parents(".singleSelect").children(".selecter").children("span");
        $inputBox.html(selectedVal);
    }

    /**
     * 切换复选框选中样式
     * @param {*} el dom元素,checkbox框
     * @param {Boolean} isChecked 
     * @param {Object} 代替复选框样式的图片url
     */ 
    function toggleChecked(el, isChecked, imgSrc) {
        if (isChecked) {
            $(el).parent(".option").attr("data-selected",true);  // 给选中的元素进行标识
            $(el).children("img").attr("src", allOptions.checkboxImg.selected);
        } else {
            $(el).children("img").attr("src", allOptions.checkboxImg.defaut);
            $(el).parent(".option").attr("data-selected",false);
        }
    }

    /**
     * 处理选择框显示的内容
     * @param {*} selecter  选择框dom元素
     * @param {*} checkbox  dom元素,checkbox框
     * @param {Boolean} isChecked 选择框是否选中
     */ 
    function handleValue(selecter, checkbox, isChecked) {
        var oldValue = $(selecter).text().replace(/[\r\n\ ]+/g,"");
        var newValue = $(checkbox).parent(".option").text().replace(/[\r\n\ ]+/g,"");
        var valueArr = oldValue.split(",");
        var lastValue;
        if(isChecked) {
            remove(valueArr, allOptions.prompt);
            valueArr.push(newValue);
            lastValue = valueArr.join(",").replace(/[\r\n\ ]+/g,"");
        } else {
            remove(valueArr, newValue);
            if (valueArr.length == 0) {
                lastValue = allOptions.prompt
            } else {
                lastValue = valueArr.join(",").replace(/[\r\n\ ]+/g,"");
            }
        }
        $(selecter).text(lastValue);
    }

    $.fn.select = function(options) {

        $(this).each(function(i, select) {
            var defaultOptions = {
                checkboxImg: {
                    defaut: "../imgs/checkbox-default.png",
                    selected: "../imgs/checkbox-selected.png"
                },
                prompt: "请选择"
            };
            $.extend(true,allOptions, defaultOptions, options || {});
            
            // 建立新的下拉框
            $(this).newSelect();
        });

        $(document).click(function() {
            $(".select").removeClass("showOptions");
            $(".select").addClass("hideOptions");
        });

        $(".selecter").each(function() {
            $(this).click(function() {
                $(this).parent(".select").toggleClass("hideOptions showOptions");
                stopEvent(event);
            });
        });

        $(".optionBox").on("click", ".option", function(event) {
    
            // 单选下拉框
            if($(this).parents(".singleSelect").length != 0) {
    
                var $options = $(this).parent().children(".option");
                toggleSelect($options, $(this));
            } 
    
            // 多选下拉框
            if($(this).parents(".multiSelect").length != 0) {
                var $checkbox = $(this).find(":checkbox");
                $checkbox.prop("checked", !$checkbox.prop("checked"));  // 这边要使用 prop()，使用 attr() 没效果
    
                // 设置复选框图片
                var isChecked =  $checkbox.prop("checked");
                var $checkboxWraper = $(this).children(".checkbox");
                toggleChecked($checkboxWraper, isChecked);
                var $valueBox = $(this).parents(".multiSelect").find(".selecter").children("span");
                handleValue($valueBox, $checkboxWraper, isChecked)
                
                stopEvent(event);  // 阻止事件冒泡隐藏下拉列表
            }
        });

        $(".multiSelect input[type='checkbox']").click(function(event) {
            var isChecked =  $(this).prop("checked");
            var $checkboxWraper = $(this).parent(".checkbox");
            toggleChecked($checkboxWraper, isChecked);
            var $valueBox = $(this).parents(".multiSelect").find(".selecter").children("span");
            handleValue($valueBox, $checkboxWraper, isChecked);
    
            stopEvent(event);
        });
    }

    $.uniq = function() {
        var id = 'fancy-' + $(this).attr("id");
        var $options = $("#"+id).children(".optionBox").children(".option");
        var selected = [];
        $options.each(function() {
            var attrSelected = $(this).attr("data-selected");
            if(attrSelected != "undefined" && attrSelected == "true") {
                var uniq = $(this).attr("data-value");
                selected.push(uniq);
            }
        });
        return selected;
    }

    /**
     * 获取下拉框选中值的唯一标识
     * @param {String} $el 下拉选择框的jquery对象
     */ 
    $.fn.getUniq = function() {
        var selected = $.uniq.call(this);
        return selected;
    }

    /**
     * 替换标签
     * @param {String} newType 新的标签类型
     */ 
    $.fn.changeElementType = function(newType) {

		for (var i=0, j=this.length; i<j; i++) {
			var attrs = {}, $new;

            console.log(this[i].attributes)
			$.each(this[i].attributes, function(idx, attr) {
                if(attr.name === "value") {
                    attrs["data-value"] = attr.value;
                } else if(attr.name === "data-selected") {
                    attrs["data-selected"] = attr.value !="" ? attr.value : true;
                } else {
                    attrs[attr.name] = attr.value;
                }
            });
            
            // console.log(attrs)

            $new = $("<" + newType + "/>", attrs).append($(this[i]).contents());

			$(this[i]).replaceWith( $new );
			
			// // save the new element
			this[i] = $new[0];

        }
        return this;
    };

    $.fn.newSelect = function() {
        var type, 
            $newSelect,
            selectId,
            $optionBox,
            $selectOptions;

        var $select = $(this);

        selectId = $select.attr("id") ? $select.attr("id") : 'select' + instCount++;
        $select.attr("id", selectId);

        $optionBox = $select.clone().changeElementType("ul").addClass("optionBox hide").removeAttr("id"); 
        $selectOptions = $optionBox.children("option").changeElementType("li").addClass("option");

        $newSelect = $("<div id=fancy-" + selectId + " class='select hideOptions'>\
            <div class='selecter'>\
                <span>" + allOptions.prompt + "</span>\
            </div>\
        </div>")
        
        $optionBox.attr("multiple") ? type = "multiple" : type = "single";
        

        if (type == "single") {
            singleTemplate();
        } else {
            multipleTemplate()
        }

        function multipleTemplate() {
            var $checkbox = $("<div class='checkbox'>\
                <input type='checkbox' />\
                <img src='" + allOptions.checkboxImg.defaut + "' />\
            </div>\
            ");
            $selectOptions.append($checkbox);
            $selectOptions.each(function() {
                var selected = $(this).attr("data-selected");
                if(selected == "true") {
                    $(this).find("input[type=checkbox]").prop("checked", true);
                }
                $optionBox.append($(this));
            });
            $newSelect.append($optionBox).addClass("multiSelect");
            // $transSelect.after($newSelect);
            $select.after($newSelect);

            initMultiCheckbox($newSelect);
        }

        function singleTemplate() {
            $selectOptions.each(function() {
                $optionBox.append($(this));
            });
            $newSelect.append($optionBox).addClass("singleSelect");
            // $transSelect.after($newSelect);
            $select.after($newSelect);

            initSingleCheckbox($newSelect);
        }

        /**
         * 多选下拉框初始化
         * @param {*} $el 下拉框最外层标签的jquery对象
         */ 
        function initMultiCheckbox($el) {
            var $checkboxs = $el.children(".optionBox").find(".checkbox");
            $checkboxs.each(function() {
                var $input = $(this).children("input[type='checkbox']");
                var isChecked = $input[0].checked;
                toggleChecked($(this), isChecked);
                var $valueBox = $el.children(".selecter").children("span");
                handleValue($valueBox,$(this), isChecked)
            });
        }

        /**
         * 单选下拉框初始化
         * @param {*} $el 下拉框最外层标签的jquery对象
         */ 
        function initSingleCheckbox($el) {
            var $options = $el.find(".option");
            $options.each(function () {
                var selected = $(this).attr("data-selected");
                if(selected != "undefined" && selected == "true") {
                    var selectedVal = $(this).html();
                    var $inputBox = $(this).parents(".singleSelect").children(".selecter").children("span");
                    $inputBox.html(selectedVal);
                }
            })
            
        } 
    }

})(jQuery);
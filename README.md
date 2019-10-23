### 使用说明：
- `select.html、select.css、select.js`是必要文件，其余可自行调整。

- `$(".customSelect").select();`,生成下拉框，第一次生成下拉框时调用。

- `getUniq()`，获取下拉框所选项的唯一标识，方便与后台进行交互。

- 通过`selected data-selected`属性设置初始选中的选项值，单选下拉框只能设置一个选项为`selected data-selected`。
因为我是通过复制`<select>`来生成新的选项列表，ie低版本获取不到`selected`属性，所以增加一个`data-selected`。<br>

- 重新生成（刷新）下拉框，调用`newSelect()`。注意：调用该方法的前提是该对象已调用过`select()`。

- 设置或新增属性，改变多选下拉框复选框的图标，在调用`select()`时，传入`checkboxImg`对象。
```
// 设置选项属性
$(".customSelect").select({
    checkboxImg: {
        "default": "../imgs/blackdown.png",
        "selected": "../imgs/checkbox-selected.png"
    }
});
```
- 多选下拉框值改变时触发的方法`multiChange`，使用方法如下：
```
$("#select1").bind("multiChange",function(event, newVal) {
    alert(newVal);
    // newVal为改变后的值
    // 在该函数体进行操作
})
```
- 当需要重置`select`选中的值时，调用`resetValue()`即可，使用方法如下：
```
$(".customSelect").resetValue(); /* 置空*/
$("#select1").resetValue([2,4]); /* 重置多选下拉框 */
$("#select2").resetValue('4'); /* 重置单选下拉框 */
```
参数为下拉选项`option`的`value`值。

- `showTitle`,设置移入下拉框显示选中的值，默认为：true。

- `select`的`id`必须设置，如果没有设置会自动生成`id`。

- `onclick`事件，实际上是获取`原select`上的点击事件，给`生成的下拉框`进行绑定。


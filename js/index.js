$(function() {
    $(".customSelect").select({

    });

    $("#select").get()

    $("#select1").bind("multiChange",function(event, newVal) {
        // alert(newVal);
    });
})

function getFirst() {
    var uniqVal = $("#select1").getUniq().join(",");
    $("#first").html(uniqVal);
}

function getSecond() {
    var uniqVal = $("#select2").getUniq().join(",");
    $("#second").html(uniqVal);
}

function testChange(_this) {
    var val = $(_this).val();
}

function changeOptions() {
    $("#select2").find("option").each(function(i) {
        $(this).attr("value", i);
        $(this).html("aha" + i);
    });

    $("#select2").newSelect();
}

// 重置验证
function empty() {
    $("select.customSelect").resetValue();  // 不传参数，将下拉框的值置空
}
function resetFirst() {
    $("#select1").resetValue([2,4]);  // 参数为数组，重置多选下拉框的值，参数为 option 的 value 值
}
function resetSecond() {
    $("#select2").resetValue('4');  // 参数为字符串，重置单选下拉框的值，参数为 option 的 value 值
}


// 点击事件验证
function testClick(_this) {
    // alert($(_this).closest("div").attr("id"));
}
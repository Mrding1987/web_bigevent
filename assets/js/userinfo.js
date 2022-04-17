//通过定义一个全局对象obj，在获取用户信息时，将响应结果赋值给obj，从而拿到id值，用于更新数据
var obj = {}
$(function() {
    initUserinfo()

    $('#btnReset').on('click', (e) => {
        e.preventDefault();
        initUserinfo()
    })

    $('.layui-form').on('submit', (e) => {
        console.log(obj);
        console.log(obj.data.id);
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: {
                id: obj.data.id,
                nickname: $('#nickname').val(),
                email: $('#email').val()
            },
            success: res => {
                if (res.status !== 0) return layui.layer.msg('修改用户资料失败！')
                layui.layer.msg('用户资料已修改！')

                //以下代码可以调用index页面的getUserInfo方法，重新渲染头像
                window.parent.getUserInfo()
            }
        })
    })
})

function initUserinfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: res => {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
            $('#username').val(res.data.username)
            $('#nickname').val(res.data.nickname)
            $('#email').val(res.data.email)
            obj = res
        }
    })
}
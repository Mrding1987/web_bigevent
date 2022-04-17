$(function() {



    $('.layui-form').on('submit', (e) => {
        e.preventDefault();

        if ($('#newPwd').val() === $('#oldPwd').val()) return layui.layer.msg('新密码与原密码相同，请修改')
        else if ($('#cfmPwd').val() !== $('#newPwd').val()) return layui.layer.msg('新密码两次输入不一致，请修改')
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('#oldPwd').val(),
                newPwd: $('#newPwd').val()
            },
            success: res => {
                console.log($(this).serialize());
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('更新密码失败')
                layui.layer.msg('更新密码成功')
                    //重置表单
                $('.layui-form')[0].reset()
            }

        })
    })
})
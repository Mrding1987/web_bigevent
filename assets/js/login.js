$(function() {
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    // 以下是layui中提供的表单验证方法，从官方文档上可以看到使用说明
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: value => {
            var pwd = $('.reg-box [name=password]').val()
                // console.log(value);
                // console.log(pwd);
            if (pwd !== value) { return '两次输入的密码不一致，请检查！' }
        }
    });

    $('#form_reg').submit(e => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val().trim(),
                password: $('.reg-box [name=password]').val().trim()
            },
            success: res => {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功！');

                $('#link_login').click()
            }

        })
    })

    $('#form_login').submit(e => {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $('#form_login').serialize(),
            success: res => {
                if (res.status !== 0) { return layer.msg('登录失败！') }
                layer.msg('登录成功！')

                //将token保存在本地存储中
                localStorage.setItem('token', res.token);
                location.href = '/index.html'
            }
        })
    })

})
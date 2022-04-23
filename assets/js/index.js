$(function() {
    getUserInfo()

    $('#btn_logout').on('click', () => {
        layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, index => {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layui.layer.close(index)
        })
    })

})

function getUserInfo() {
    // if (!localStorage.getItem('token')) {
    //     layui.layer.msg('必须先登录系统！')
    //     location.href = '/login.html'
    // }

    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: res => {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
            renderAavatar(res.data)
        },

        //不论ajax的结果是成功还是失败，都会执行这个complete函数,以下函数可以让用户在无权限的i情况下无法访问主页，必须先登录
        //以下这个complete回调函数可以放在baseAPI.js中，后续不需要每次在这里写，直接从baseAPI中调用
        /* complete: res => {

            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        } */

    })
}

function renderAavatar(user) {
    let name = user.nickname || user.username

    // console.log(name);
    $('.welcome').html('欢迎&nbsp;' + name)
    if (user.user_pic === null) {
        $('.layui-nav-img').hide()
        $('.text_avatar').html(name[0].toUpperCase()).show()
    } else {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text_avatar').hide()
    }
}
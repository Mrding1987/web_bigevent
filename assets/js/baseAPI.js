//每次调用ajax请求的时候，会先调用下面这个函数
//options是我们给ajax提供的配置对象
$.ajaxPrefilter((options) => {
    options.url = 'http://192.168.1.11' + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }

    options.complete = res => {

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})